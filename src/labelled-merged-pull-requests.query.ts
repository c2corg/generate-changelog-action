import { gql } from './utils';

export default gql`
  query LabelledMergedPullRequestsQuery($owner: String!, $name: String!, $labels: [String!]!, $after: String) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 100, after: $after, labels: $labels, states: [MERGED]) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          number
          url
          mergeCommit {
            oid
          }
          labels(first: 5) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;
