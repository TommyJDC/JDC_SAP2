import type { Timestamp } from 'firebase/firestore';

export type Role = 'Technicien' | 'Commercial' | 'Admin' | 'Pending'; // Added 'Pending' for new users

export interface UserData {
  uid: string;
  email: string | null;
  role: Role;
  displayName?: string | null; // Optional display name
  createdAt: Timestamp; // Track when the user doc was created
  // Add other user-specific fields if needed
}
