/**
 * Strip HTML tags from a string
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export const stripHtml = (html: string): string => html?.replace(/<[^>]*>/g, '') || '';

/**
 * Extract a year (1900-2099) from a string
 * @param text - Text containing a year (e.g., "Digital — BRØQN, 2024")
 * @returns The extracted year or null
 */
export const extractYear = (text: string): string | null => {
  const match = text?.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
};
