import { gql } from './utils';

export default gql`
  query DependencyMergedPullRequestsQuery($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 100, after: $after, labels: ["dependabot", "dependencies"], states: [MERGED]) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          number
          url
          mergedAt
          mergeCommit {
            oid
          }
        }
      }
    }
  }
`;
