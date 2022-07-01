/**
 * Type guard to filter undefined and null values.
 */
export const notUndefined = <T>(x: T | undefined | null): x is T => x !== undefined && x !== null;
