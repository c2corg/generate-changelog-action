import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';
import { exec } from '@actions/exec';
import { RequestParameters } from '@octokit/graphql/dist-types/types';
import { rcompare } from 'semver';
import Handlebars from 'handlebars';

import { ReleasesAndMilestonesQueryVariables, ReleasesAndMilestonesQuery } from './types/ReleasesAndMilestonesQuery';
import releasesAndMilestonesQuery from './releases-and-milestones.query';
import {
  DependencyMergedPullRequestsQuery,
  DependencyMergedPullRequestsQueryVariables,
} from './types/DependencyMergedPullRequestsQuery';
import dependencyMergedPullRequestsQuery from './dependency-merged-pull-requests.query';
import { notUndefined } from './utils';
import changelogTemplate from './changelog.template';

type PullRequest = { title: string; number: number; url: string; mergedAt: Date; commit: string };
type Issue = { title: string; number: number; url: string; labels: string[] };
type Category = 'breaking' | 'enhancement' | 'bug' | 'deprecated' | 'removed' | 'documentation' | 'chore' | 'other';
type ChangelogItem = {
  title: string;
  number: number;
  url: string;
};
type ChangelogCategory = {
  name: Category;
  title: string;
  items: ChangelogItem[];
};
type ChangelogContext = {
  releases: {
    release: string;
    categories: ChangelogCategory[];
  }[];
};

const githubToken = core.getInput('github_token');
const repositoryOwner = context.repo.owner;
const repositoryName = context.repo.repo;

const octokit = new GitHub(githubToken);

// helper function to make apollo generated types work with octokit graphql queries
const graphql = <Q, V>(query: string, variables: V): Promise<Q | null> => {
  return octokit.graphql(query, (variables as unknown) as RequestParameters) as Promise<Q | null>;
};

const categoriesConfiguration: { [category in Exclude<Category, 'other'>]: { title: string; labels: string[] } } = {
  breaking: {
    title: '🚨 Breaking changes',
    labels: ['backwards-incompatible', 'breaking'],
  },
  enhancement: {
    title: '✨ New features and enhancements',
    labels: ['enhancement'],
  },
  bug: {
    title: '🐞 Fixed bugs',
    labels: ['bug'],
  },
  deprecated: {
    title: '⚠️ Deprecated',
    labels: ['deprecated'],
  },
  removed: {
    title: '⛔ Removed',
    labels: ['removed'],
  },
  documentation: {
    title: '📚 Documentation',
    labels: ['doc'],
  },
  chore: {
    title: ' 🏗 Chores',
    labels: ['chore', 'dependency', 'security'],
  },
};
const otherTitle = 'Other';
const excludedLabels = ['duplicate', 'question', 'invalid', 'wontfix'];

async function run(): Promise<void> {
  try {
    core.info('Request releases and corresponding milestones and issues');
    const releasesAndMilestones = await graphql<ReleasesAndMilestonesQuery, ReleasesAndMilestonesQueryVariables>(
      releasesAndMilestonesQuery,
      {
        owner: repositoryOwner,
        name: repositoryName,
      },
    );

    const releases =
      releasesAndMilestones?.repository?.releases?.nodes
        ?.map((release) => release?.name)
        .filter(notUndefined)
        .sort(rcompare) ?? [];
    const milestoneAndIssuesForRelease =
      releasesAndMilestones?.repository?.milestones?.nodes
        ?.filter((milestone) => !!milestone?.title)
        .reduce((map, milestone) => {
          if (!milestone?.title) {
            return map;
          }
          map.set(milestone?.title, {
            closed: milestone?.closed ?? false,
            issues:
              milestone?.issues.nodes?.filter(notUndefined).map((issue) => ({
                title: issue.title ?? '',
                number: issue.number,
                url: issue.url,
                labels: issue.labels?.nodes?.filter(notUndefined).map((label) => label.name) ?? [],
              })) ?? [],
          });
          return map;
        }, new Map<string, { closed: boolean; issues: Issue[] }>()) ??
      new Map<string, { closed: boolean; issues: Issue[] }>();

    core.info('Request merged pull requests with dependency label');
    const pullRequestsForRelease = new Map<string, PullRequest[]>();
    const prMap = new Map<string, PullRequest>();
    let cursor: string | null = null;
    do {
      const dependencyMergedPullRequests: DependencyMergedPullRequestsQuery | null = await graphql<
        DependencyMergedPullRequestsQuery,
        DependencyMergedPullRequestsQueryVariables
      >(dependencyMergedPullRequestsQuery, { owner: repositoryOwner, name: repositoryName, after: cursor });

      dependencyMergedPullRequests?.repository?.pullRequests.nodes?.filter(notUndefined).forEach((pr) => {
        const commit = pr.mergeCommit?.oid as string;
        prMap.set(commit, {
          title: pr.title,
          number: pr.number,
          url: pr.url,
          mergedAt: pr.mergedAt,
          commit,
        });
      });

      if (dependencyMergedPullRequests?.repository?.pullRequests.pageInfo.hasNextPage) {
        cursor = dependencyMergedPullRequests.repository.pullRequests.pageInfo.endCursor;
      } else {
        cursor = null;
      }
    } while (!!cursor);

    core.info('Compute changelog');
    // associate each pull request to it's corresponding release, based on merge commit id
    for (let i = 0; i < releases.length - 1; i++) {
      let log = '';
      await exec('git', ['log', '--pretty=format:"%H"', `${releases[i]}...${releases[i + 1]}`], {
        listeners: {
          stdout: (data: Buffer): void => {
            log += data.toString().trim();
          },
        },
        silent: true,
      });
      const commits = log.split(/\W+/).filter((commit) => !!commit);
      for (const commit of commits) {
        const pullRequest: PullRequest | undefined = prMap.get(commit);
        if (!!pullRequest) {
          if (!pullRequestsForRelease.has(releases[i])) {
            pullRequestsForRelease.set(releases[i], []);
          }
          pullRequestsForRelease.get(releases[i])?.push(pullRequest);
        }
      }
    }

    const context: ChangelogContext = { releases: [] };
    for (const release of releases) {
      const categories: ChangelogCategory[] = [];
      const milestone = milestoneAndIssuesForRelease.get(release);
      if (milestone) {
        for (const issue of milestone.issues) {
          if (issue.labels.filter((label) => excludedLabels.includes(label)).length) {
            continue;
          }
          let hasCategory = false;
          for (const category of Object.keys(categoriesConfiguration) as Exclude<Category, 'other'>[]) {
            if (issue.labels.filter((label) => categoriesConfiguration[category].labels.includes(label)).length) {
              hasCategory = true;
              let carr = categories.find((c) => c.name === category);
              if (!carr) {
                carr = {
                  name: category,
                  title: categoriesConfiguration[category].title,
                  items: [],
                };
                categories.push(carr);
              }
              carr.items.push({ title: issue.title, number: issue.number, url: issue.url });
            }
          }
          if (!hasCategory) {
            let carr = categories.find((c) => c.name === 'other');
            if (!carr) {
              carr = {
                name: 'other',
                title: otherTitle,
                items: [],
              };
              categories.push(carr);
            }
            carr.items.push({ title: issue.title, number: issue.number, url: issue.url });
          }
        }
      }
      for (const pullRequest of pullRequestsForRelease.get(release) ?? []) {
        let carr = categories.find((c) => c.name === 'chore');
        if (!carr) {
          carr = {
            name: 'chore',
            title: categoriesConfiguration['chore'].title,
            items: [],
          };
          categories.push(carr);
        }
        carr.items.push({ title: pullRequest.title, number: pullRequest.number, url: pullRequest.url });
      }
      context.releases.push({ release, categories });
    }

    const changelog = Handlebars.compile<ChangelogContext>(changelogTemplate, { noEscape: true, preventIndent: true })(
      context,
    );
    core.setOutput('changelog', changelog);
  } catch (error) {
    core.error(error.message);
    core.setFailed(error.message);
  }
}

run();
