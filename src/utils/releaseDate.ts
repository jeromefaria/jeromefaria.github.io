export const releaseYear = (released: string): number => Number(released.slice(0, 4));

export const releaseYearString = (released: string): string => String(releaseYear(released));
