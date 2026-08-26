// Local midnight, so an ISO date parses as a calendar day without timezone drift.
const parseLocalDate = (isoDate: string): Date => new Date(`${isoDate}T00:00:00`);

export const formatEventDate = (isoDate: string): string => {
  if (!isoDate) return '';

  const date = parseLocalDate(isoDate);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatEventDateRange = (isoStart: string, isoEnd?: string): string => {
  if (!isoEnd || isoEnd === isoStart) return formatEventDate(isoStart);

  const start = parseLocalDate(isoStart);
  const end = parseLocalDate(isoEnd);

  if (start.getFullYear() !== end.getFullYear()) {
    return `${formatEventDate(isoStart)} – ${formatEventDate(isoEnd)}`;
  }

  if (start.getMonth() !== end.getMonth()) {
    const dayAndMonth: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', dayAndMonth)} – ${end.toLocaleDateString('en-US', dayAndMonth)}, ${start.getFullYear()}`;
  }

  const month = start.toLocaleDateString('en-US', { month: 'long' });
  return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
};
