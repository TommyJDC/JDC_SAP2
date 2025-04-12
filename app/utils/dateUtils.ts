import { Timestamp } from 'firebase/firestore';

/**
 * Parses a French date string like "jour J mois AAAA" into a Date object.
 * Example: "mardi 8 avril 2025"
 * Note: This is a basic parser and might need adjustments for edge cases or different formats.
 * It ignores the day of the week.
 * @param dateString The French date string.
 * @returns A Date object or null if parsing fails.
 */
export const parseFrenchDateString = (dateString: string | undefined | null): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const parts = dateString.trim().split(' ');
  if (parts.length < 3) {
    // Basic check, expecting at least "DayNumber Month Year" after removing day name potentially
    return null;
  }

  // Attempt to find Day, Month, Year parts, ignoring the day name (e.g., "mardi")
  let day: number | null = null;
  let monthIndex: number | null = null;
  let year: number | null = null;

  const frenchMonths: { [key: string]: number } = {
    'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
    'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
  };

  for (const part of parts) {
    const lowerPart = part.toLowerCase();
    if (!isNaN(parseInt(part)) && parseInt(part) > 0 && parseInt(part) <= 31 && day === null) {
      day = parseInt(part);
    } else if (frenchMonths.hasOwnProperty(lowerPart) && monthIndex === null) {
      monthIndex = frenchMonths[lowerPart];
    } else if (!isNaN(parseInt(part)) && parseInt(part) >= 1900 && parseInt(part) < 3000 && year === null) {
      year = parseInt(part);
    }
  }

  if (day !== null && monthIndex !== null && year !== null) {
    try {
      // Construct date - Note: JS month is 0-indexed
      const date = new Date(Date.UTC(year, monthIndex, day));
       // Check if the constructed date is valid (e.g., handles Feb 30th)
       if (date.getUTCFullYear() === year && date.getUTCMonth() === monthIndex && date.getUTCDate() === day) {
           return date;
       }
    } catch (e) {
      console.error(`Error parsing date string "${dateString}":`, e);
      return null;
    }
  }

  console.warn(`Could not parse French date string: "${dateString}"`);
  return null; // Return null if parsing fails
};

/**
 * Converts a Date object or null into a Firestore Timestamp or null.
 * @param date The Date object or null.
 * @returns A Firestore Timestamp or null.
 */
export const dateToTimestamp = (date: Date | null): Timestamp | null => {
    if (date instanceof Date && !isNaN(date.getTime())) {
        return Timestamp.fromDate(date);
    }
    return null;
}
