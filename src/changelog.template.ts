export default `
# Changelog
{{#each releases}}

## [{{release}}](https://github.com/c2corg/c2c_ui/releases/tag/{{release}})
{{#each categories}}

### {{title}}

{{#each items}}
- {{title}} [#{{number}}]({{url}})
{{/each}}
{{/each}}
{{/each}}
`;
