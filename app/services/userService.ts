import { db } from '~/firebase.config';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserData, Role } from '~/types/user';

const USERS_COLLECTION = 'users';

/**
 * Fetches user data from Firestore based on UID.
 * @param uid - The user's Firebase Auth UID.
 * @returns The UserData object or null if not found.
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Explicitly cast to UserData after checking existence
      return userDocSnap.data() as UserData;
    } else {
      console.log(`No user document found for UID: ${uid}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data."); // Re-throw or handle as needed
  }
};

/**
 * Creates a new user document in Firestore.
 * Typically called after successful Firebase Auth signup.
 * @param user - The Firebase Auth User object.
 * @param role - The initial role to assign (defaults to 'Pending').
 * @returns The newly created UserData object.
 */
export const createUserDocument = async (user: User, role: Role = 'Pending'): Promise<UserData> => {
  const userDocRef = doc(db, USERS_COLLECTION, user.uid);

  // Check if document already exists (e.g., race condition or retry)
  const existingDoc = await getDoc(userDocRef);
  if (existingDoc.exists()) {
    console.warn(`User document already exists for UID: ${user.uid}. Returning existing data.`);
    return existingDoc.data() as UserData;
  }

  const newUser: UserData = {
    uid: user.uid,
    email: user.email,
    role: role,
    displayName: user.displayName,
    createdAt: serverTimestamp() as Timestamp, // Use server timestamp
  };

  try {
    await setDoc(userDocRef, newUser);
    // Fetch the data again to get the server-generated timestamp correctly (optional but good practice)
    // For simplicity here, we return the object with the placeholder timestamp.
    // In a real app, you might want to return the actual created data.
    // For now, we'll return the local object. We need to adjust the type of createdAt if we don't fetch again.
    // Let's adjust the return type or fetch after set. For simplicity:
    const createdUserData = { ...newUser, createdAt: Timestamp.now() }; // Use client time as approximation
    return createdUserData;

  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Failed to create user document.");
  }
};

/**
 * Updates specific fields of a user document.
 * @param uid - The user's Firebase Auth UID.
 * @param data - An object containing the fields to update.
 */
export const updateUserDocument = async (uid: string, data: Partial<UserData>): Promise<void> => {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    try {
        // Use updateDoc for partial updates, setDoc with merge:true also works
        // await updateDoc(userDocRef, data);
        await setDoc(userDocRef, data, { merge: true }); // Merge ensures we don't overwrite existing fields unintentionally
    } catch (error) {
        console.error("Error updating user document:", error);
        throw new Error("Failed to update user document.");
    }
};
