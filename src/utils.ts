/**
 * A simple tagged template function that just copies the raw template string content.
 *
 * Used to help identify graphql types generation.
 */
export const gql = (strings: TemplateStringsArray): string => strings.raw[0];

/**
 * Type guard to filter undefined and null values.
 */
export const notUndefined = <T>(x: T | undefined | null): x is T => x !== undefined && x !== null;
