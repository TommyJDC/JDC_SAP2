import { db } from '~/firebase.config';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import type { TicketSap } from '~/types/ticket';
import { parseFrenchDateString, dateToTimestamp } from '~/utils/dateUtils'; // Import the parser

const SECTOR_COLLECTIONS = ['Kezia', 'HACCP', 'CHR', 'Tabac'];
export const ALL_SECTORS_KEY = 'Tous'; // Key representing all sectors

/**
 * Maps raw Firestore status strings to standardized status values.
 * @param rawStatus The status string from Firestore (e.g., "A Clôturée").
 * @returns A standardized status string.
 */
const mapFirestoreStatus = (rawStatus: string | undefined | null): TicketSap['mappedStatut'] => {
  const status = typeof rawStatus === 'string' ? rawStatus.trim().toLowerCase() : '';
  // Add more mappings as needed based on actual data
  if (status.includes('clôturée') || status.includes('cloturee') || status.includes('fermé') || status.includes('ferme')) {
    return 'Fermé';
  }
  if (status.includes('résolu') || status.includes('resolu')) {
      return 'Résolu';
  }
  if (status.includes('en cours')) {
      return 'En cours';
  }
  if (status.includes('ouvert')) {
      return 'Ouvert';
  }
   if (status.includes('en attente')) {
      return 'En attente';
  }
  // Default or fallback status
  return 'Inconnu'; // Or perhaps 'Ouvert' if that's a safer default
};


/**
 * Fetches SAP tickets based on a selected sector or all sectors.
 * @param count - The maximum number of tickets to fetch.
 * @param sector - Optional. The specific sector to fetch from ('Kezia', 'HACCP', 'CHR', 'Tabac').
 *                 If null, undefined, or 'Tous', fetches from all sectors.
 * @returns An array of TicketSap objects, including the 'secteur' field, mapped status, and parsed date.
 */
export const getAllSapTickets = async (count: number = 25, sector?: string | null): Promise<TicketSap[]> => {
  try {
    let collectionsToQuery: string[];

    if (sector && sector !== ALL_SECTORS_KEY && SECTOR_COLLECTIONS.includes(sector)) {
      collectionsToQuery = [sector];
    } else {
      collectionsToQuery = SECTOR_COLLECTIONS;
    }

    const promises = collectionsToQuery.map(async (sectorName) => {
      const ticketsRef = collection(db, sectorName);
      // !! Firestore cannot reliably order by a string field interpreted as a date !!
      // We fetch documents and sort them *after* parsing the date string in the application code.
      // We fetch slightly more documents initially if querying all sectors to ensure enough data for sorting.
      const queryLimit = collectionsToQuery.length > 1 ? Math.ceil(count * 1.5 / collectionsToQuery.length) : count;
      // We cannot use orderBy('date', 'desc') effectively here because 'date' is a string.
      // Consider adding a real Timestamp field (`dateCreationTimestamp`) to Firestore for efficient querying.
      // For now, we fetch and sort manually. Querying without order might be okay if we sort later.
      // Let's try ordering by numeroSAP descending as a proxy for recency if IDs are sequential, otherwise remove orderBy.
      // const q = query(ticketsRef, limit(queryLimit)); // Fetch without specific order
       const q = query(ticketsRef, orderBy('numeroSAP', 'desc'), limit(queryLimit)); // Or try ordering by numeroSAP

      const querySnapshot = await getDocs(q);

      const sectorTickets: TicketSap[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Parse the French date string
        const parsedDate = parseFrenchDateString(data.date);
        const creationTimestamp = dateToTimestamp(parsedDate);

        const ticket: TicketSap = {
          id: doc.id,
          // Use actual Firestore field names
          numeroSAP: data.numeroSAP || 'N/A',
          raisonSociale: data.raisonSociale || 'Inconnu',
          demandeSAP: data.demandeSAP || '',
          statut: data.statut || 'Inconnu', // Store raw status
          date: data.date || '', // Store raw date string

          // Add derived/mapped fields
          mappedStatut: mapFirestoreStatus(data.statut),
          dateCreation: creationTimestamp, // Store parsed date as Timestamp (or null)
          secteur: sectorName,

          // Include optional fields if they exist
          adresse: data.adresse,
          codeClient: data.codeClient,
          messageId: data.messageId,
          secret: data.secret,
          solution: data.solution,

          // Optional fields previously assumed (likely null/undefined)
          priorite: data.priorite, // Assuming it might exist sometimes
          technicienAssigne: data.technicienAssigne,
          // dateModification: data.dateModification instanceof Timestamp ? data.dateModification : undefined, // Assuming it might exist
        };
        sectorTickets.push(ticket);
      });
      return sectorTickets;
    });

    const results = await Promise.all(promises);
    const allTickets = results.flat();

    // Sort the combined list by the parsed dateCreation (descending)
    // Handle null dates (e.g., put them at the end)
    allTickets.sort((a, b) => {
        const timeA = a.dateCreation?.toMillis() ?? 0;
        const timeB = b.dateCreation?.toMillis() ?? 0;
        return timeB - timeA; // Descending order
    });

    // Return the top 'count' tickets from the sorted list
    return allTickets.slice(0, count);

  } catch (error) {
    console.error(`Error fetching SAP tickets for sector '${sector || 'All'}':`, error);
    throw new Error("Failed to fetch SAP tickets.");
  }
};
