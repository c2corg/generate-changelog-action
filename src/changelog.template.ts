export default `
# Changelog
{{#each releases}}

## [{{release}}](https://github.com/{{repositoryOwner}}/{{repositoryName}}/releases/tag/{{release}})
{{#each categories}}

### {{title}}

{{#each items}}
- {{title}} [#{{number}}]({{url}})
{{/each}}
{{/each}}
{{/each}}
`;
