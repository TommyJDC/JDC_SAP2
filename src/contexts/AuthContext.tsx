import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path as needed

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  // Add user role/profile info if needed later
  // userProfile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // For role/profile data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // if (user) {
      //   // Fetch user profile/role from Firestore based on user.uid
      //   // Example: fetchUserProfile(user.uid).then(setUserProfile);
      // } else {
      //   setUserProfile(null);
      // }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // User state will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login errors (e.g., show message to user)
      throw error; // Re-throw to allow component-level handling
    } finally {
      // setLoading(false); // Listener handles loading state change
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // User state will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout errors
    } finally {
      // setLoading(false); // Listener handles loading state change
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    // userProfile,
  };

  // Don't render children until authentication state is determined
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
