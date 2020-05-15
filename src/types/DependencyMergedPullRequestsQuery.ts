/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DependencyMergedPullRequestsQuery
// ====================================================

export interface DependencyMergedPullRequestsQuery_repository_pullRequests_pageInfo {
  readonly __typename: "PageInfo";
  /**
   * When paginating forwards, are there more items?
   */
  readonly hasNextPage: boolean;
  /**
   * When paginating forwards, the cursor to continue.
   */
  readonly endCursor: string | null;
}

export interface DependencyMergedPullRequestsQuery_repository_pullRequests_nodes_mergeCommit {
  readonly __typename: "Commit";
  /**
   * The Git object ID
   */
  readonly oid: any;
}

export interface DependencyMergedPullRequestsQuery_repository_pullRequests_nodes {
  readonly __typename: "PullRequest";
  /**
   * Identifies the pull request title.
   */
  readonly title: string;
  /**
   * Identifies the pull request number.
   */
  readonly number: number;
  /**
   * The HTTP URL for this pull request.
   */
  readonly url: any;
  /**
   * The date and time that the pull request was merged.
   */
  readonly mergedAt: any | null;
  /**
   * The commit that was created when this pull request was merged.
   */
  readonly mergeCommit: DependencyMergedPullRequestsQuery_repository_pullRequests_nodes_mergeCommit | null;
}

export interface DependencyMergedPullRequestsQuery_repository_pullRequests {
  readonly __typename: "PullRequestConnection";
  /**
   * Information to aid in pagination.
   */
  readonly pageInfo: DependencyMergedPullRequestsQuery_repository_pullRequests_pageInfo;
  /**
   * A list of nodes.
   */
  readonly nodes: ReadonlyArray<(DependencyMergedPullRequestsQuery_repository_pullRequests_nodes | null)> | null;
}

export interface DependencyMergedPullRequestsQuery_repository {
  readonly __typename: "Repository";
  /**
   * A list of pull requests that have been opened in the repository.
   */
  readonly pullRequests: DependencyMergedPullRequestsQuery_repository_pullRequests;
}

export interface DependencyMergedPullRequestsQuery {
  /**
   * Lookup a given repository by the owner and repository name.
   */
  readonly repository: DependencyMergedPullRequestsQuery_repository | null;
}

export interface DependencyMergedPullRequestsQueryVariables {
  readonly owner: string;
  readonly name: string;
  readonly after?: string | null;
}
