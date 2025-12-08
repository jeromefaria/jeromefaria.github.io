/**
 * Strip HTML tags from a string
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
export const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') || ''

/**
 * Parse a venue string into structured address components
 * @param {string} venue - Venue string (e.g., "Venue Name, City, Country")
 * @returns {Object} Parsed venue with name, addressLocality, addressCountry
 */
export const parseVenue = (venue) => {
  const text = stripHtml(venue)
  const parts = text.split(',').map(s => s.trim())
  return {
    name: parts[0] || '',
    addressLocality: parts[1] || '',
    addressCountry: parts[2] || 'Portugal'
  }
}

/**
 * Extract a year (1900-2099) from a string
 * @param {string} text - Text containing a year (e.g., "Digital — BRØQN, 2024")
 * @returns {string|null} The extracted year or null
 */
export const extractYear = (text) => {
  const match = text?.match(/\b(19|20)\d{2}\b/)
  return match ? match[0] : null
}
