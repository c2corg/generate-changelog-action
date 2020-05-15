import { gql } from './utils';

export default gql`
  query ReleasesAndMilestonesQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      releases(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
        totalCount
        nodes {
          name
        }
      }
      milestones(first: 100, orderBy: { field: DUE_DATE, direction: DESC }) {
        totalCount
        nodes {
          title
          closed
          issues(first: 50) {
            nodes {
              title
              number
              url
              labels(first: 5) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
