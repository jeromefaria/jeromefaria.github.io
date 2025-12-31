/**
 * Format ISO date string to human-readable format
 * @param {string} isoDate - Date in ISO format (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "January 17, 2025")
 */
export const formatEventDate = isoDate => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate + 'T00:00:00'); // Prevent timezone issues
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format ISO date string for JSON-LD schema
 * @param {string} isoDate - Date in ISO format (YYYY-MM-DD)
 * @returns {string} ISO 8601 date string
 */
export const formatSchemaDate = isoDate => {
  if (!isoDate) return '';
  return isoDate; // Already in ISO format
};
