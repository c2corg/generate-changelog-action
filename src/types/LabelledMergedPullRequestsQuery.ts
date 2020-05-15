/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LabelledMergedPullRequestsQuery
// ====================================================

export interface LabelledMergedPullRequestsQuery_repository_pullRequests_pageInfo {
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

export interface LabelledMergedPullRequestsQuery_repository_pullRequests_nodes_mergeCommit {
  readonly __typename: "Commit";
  /**
   * The Git object ID
   */
  readonly oid: any;
}

export interface LabelledMergedPullRequestsQuery_repository_pullRequests_nodes_labels_nodes {
  readonly __typename: "Label";
  /**
   * Identifies the label name.
   */
  readonly name: string;
}

export interface LabelledMergedPullRequestsQuery_repository_pullRequests_nodes_labels {
  readonly __typename: "LabelConnection";
  /**
   * A list of nodes.
   */
  readonly nodes: ReadonlyArray<(LabelledMergedPullRequestsQuery_repository_pullRequests_nodes_labels_nodes | null)> | null;
}

export interface LabelledMergedPullRequestsQuery_repository_pullRequests_nodes {
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
   * The commit that was created when this pull request was merged.
   */
  readonly mergeCommit: LabelledMergedPullRequestsQuery_repository_pullRequests_nodes_mergeCommit | null;
  /**
   * A list of labels associated with the object.
   */
  readonly labels: LabelledMergedPullRequestsQuery_repository_pullRequests_nodes_labels | null;
}

export interface LabelledMergedPullRequestsQuery_repository_pullRequests {
  readonly __typename: "PullRequestConnection";
  /**
   * Information to aid in pagination.
   */
  readonly pageInfo: LabelledMergedPullRequestsQuery_repository_pullRequests_pageInfo;
  /**
   * A list of nodes.
   */
  readonly nodes: ReadonlyArray<(LabelledMergedPullRequestsQuery_repository_pullRequests_nodes | null)> | null;
}

export interface LabelledMergedPullRequestsQuery_repository {
  readonly __typename: "Repository";
  /**
   * A list of pull requests that have been opened in the repository.
   */
  readonly pullRequests: LabelledMergedPullRequestsQuery_repository_pullRequests;
}

export interface LabelledMergedPullRequestsQuery {
  /**
   * Lookup a given repository by the owner and repository name.
   */
  readonly repository: LabelledMergedPullRequestsQuery_repository | null;
}

export interface LabelledMergedPullRequestsQueryVariables {
  readonly owner: string;
  readonly name: string;
  readonly labels: ReadonlyArray<string>;
  readonly after?: string | null;
}
