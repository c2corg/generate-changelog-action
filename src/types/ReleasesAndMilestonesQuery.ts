/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReleasesAndMilestonesQuery
// ====================================================

export interface ReleasesAndMilestonesQuery_repository_releases_nodes {
  readonly __typename: "Release";
  /**
   * The title of the release.
   */
  readonly name: string | null;
}

export interface ReleasesAndMilestonesQuery_repository_releases {
  readonly __typename: "ReleaseConnection";
  /**
   * Identifies the total count of items in the connection.
   */
  readonly totalCount: number;
  /**
   * A list of nodes.
   */
  readonly nodes: ReadonlyArray<(ReleasesAndMilestonesQuery_repository_releases_nodes | null)> | null;
}

export interface ReleasesAndMilestonesQuery_repository_milestones_nodes_issues_nodes_labels_nodes {
  readonly __typename: "Label";
  /**
   * Identifies the label name.
   */
  readonly name: string;
}

export interface ReleasesAndMilestonesQuery_repository_milestones_nodes_issues_nodes_labels {
  readonly __typename: "LabelConnection";
  /**
   * A list of nodes.
   */
  readonly nodes: ReadonlyArray<(ReleasesAndMilestonesQuery_repository_milestones_nodes_issues_nodes_labels_nodes | null)> | null;
}

export interface ReleasesAndMilestonesQuery_repository_milestones_nodes_issues_nodes {
  readonly __typename: "Issue";
  /**
   * Identifies the issue title.
   */
  readonly title: string;
  /**
   * Identifies the issue number.
   */
  readonly number: number;
  /**
   * The HTTP URL for this issue
   */
  readonly url: any;
  /**
   * A list of labels associated with the object.
   */
  readonly labels: ReleasesAndMilestonesQuery_repository_milestones_nodes_issues_nodes_labels | null;
}

export interface ReleasesAndMilestonesQuery_repository_milestones_nodes_issues {
  readonly __typename: "IssueConnection";
  /**
   * A list of nodes.
   */
  readonly nodes: ReadonlyArray<(ReleasesAndMilestonesQuery_repository_milestones_nodes_issues_nodes | null)> | null;
}

export interface ReleasesAndMilestonesQuery_repository_milestones_nodes {
  readonly __typename: "Milestone";
  /**
   * Identifies the title of the milestone.
   */
  readonly title: string;
  /**
   * `true` if the object is closed (definition of closed may depend on type)
   */
  readonly closed: boolean;
  /**
   * A list of issues associated with the milestone.
   */
  readonly issues: ReleasesAndMilestonesQuery_repository_milestones_nodes_issues;
}

export interface ReleasesAndMilestonesQuery_repository_milestones {
  readonly __typename: "MilestoneConnection";
  /**
   * Identifies the total count of items in the connection.
   */
  readonly totalCount: number;
  /**
   * A list of nodes.
   */
  readonly nodes: ReadonlyArray<(ReleasesAndMilestonesQuery_repository_milestones_nodes | null)> | null;
}

export interface ReleasesAndMilestonesQuery_repository {
  readonly __typename: "Repository";
  /**
   * List of releases which are dependent on this repository.
   */
  readonly releases: ReleasesAndMilestonesQuery_repository_releases;
  /**
   * A list of milestones associated with the repository.
   */
  readonly milestones: ReleasesAndMilestonesQuery_repository_milestones | null;
}

export interface ReleasesAndMilestonesQuery {
  /**
   * Lookup a given repository by the owner and repository name.
   */
  readonly repository: ReleasesAndMilestonesQuery_repository | null;
}

export interface ReleasesAndMilestonesQueryVariables {
  readonly owner: string;
  readonly name: string;
}
