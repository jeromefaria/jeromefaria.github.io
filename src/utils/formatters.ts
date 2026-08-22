export const formatEventDate = (isoDate: string): string => {
  if (!isoDate) return '';

  const date = new Date(`${isoDate}T00:00:00`); // Local midnight, avoids timezone drift
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
