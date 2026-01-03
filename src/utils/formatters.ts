/**
 * Strip HTML tags from a string
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export const stripHtml = (html: string): string => html?.replace(/<[^>]*>/g, '') || '';

export interface ParsedVenue {
  name: string;
  addressLocality: string;
  addressCountry: string;
}

/**
 * Parse a venue string into structured address components
 * @param venue - Venue string (e.g., "Venue Name, City, Country")
 * @returns Parsed venue with name, addressLocality, addressCountry
 */
export const parseVenue = (venue: string): ParsedVenue => {
  const text = stripHtml(venue);
  const parts = text.split(',').map(s => s.trim());
  return {
    name: parts[0] || '',
    addressLocality: parts[1] || '',
    addressCountry: parts[2] || '',
  };
};

/**
 * Extract a year (1900-2099) from a string
 * @param text - Text containing a year (e.g., "Digital — BRØQN, 2024")
 * @returns The extracted year or null
 */
export const extractYear = (text: string): string | null => {
  const match = text?.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
};
