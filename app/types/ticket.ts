import type { Timestamp } from 'firebase/firestore';

// Define the structure for a SAP Ticket document based on Firestore screenshot
export interface TicketSap {
  id: string; // Firestore document ID
  numeroSAP: string; // Actual field name for Ticket number
  raisonSociale: string; // Actual field name for Client name
  demandeSAP: string; // Actual field name for Description/request
  statut: string; // Raw status from Firestore (e.g., "A Clôturée")
  date: string; // Raw date string from Firestore (e.g., "mardi 8 avril 2025")

  // --- Fields derived/added by our application ---
  mappedStatut: 'Ouvert' | 'En cours' | 'Résolu' | 'Fermé' | 'En attente' | 'Inconnu'; // Standardized status
  dateCreation: Timestamp | null; // Parsed and converted date as Timestamp for sorting/consistency
  secteur?: string; // Source collection/sector name (Kezia, HACCP, etc.)

  // --- Optional fields from Firestore (based on screenshot) ---
  adresse?: string;
  codeClient?: string;
  messageId?: string;
  secret?: string;
  solution?: string;

  // --- Optional fields previously assumed, potentially not present ---
  priorite?: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  dateModification?: Timestamp;
  technicienAssigne?: string | null;
}

// Type for the data returned by the loader (after serialization)
export interface SerializableTicketSap extends Omit<TicketSap, 'dateCreation' | 'dateModification'> {
    dateCreation: string | null; // ISO string format for serialization
    dateModification?: string; // ISO string format for serialization
}
