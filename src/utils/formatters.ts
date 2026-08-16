/**
 * Strip HTML tags from a string
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export const stripHtml = (html: string): string => html?.replace(/<[^>]*>/g, '') || '';

/**
 * Format an ISO date string as a human-readable date
 * @param isoDate - Date in ISO format (YYYY-MM-DD)
 * @returns Formatted date (e.g., "January 17, 2025"), or '' when empty
 */
export const formatEventDate = (isoDate: string): string => {
  if (!isoDate) return '';

  const date = new Date(`${isoDate}T00:00:00`); // Local midnight, avoids timezone drift
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
