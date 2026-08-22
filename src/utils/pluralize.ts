/**
 * Pick the singular or plural noun for a count.
 * @param count - How many items
 * @param singular - The singular noun
 * @param plural - The plural noun (defaults to `${singular}s`)
 */
export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  (count === 1 ? singular : plural);
