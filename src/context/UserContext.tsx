import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { db, auth, loginWithGoogle, logout } from '../lib/firebase';
import { getOrCreateUserProfile } from '../services/firebaseService';

interface UserContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (authenticatedUser) {
        try {
          // Ensure profile exists
          await getOrCreateUserProfile(authenticatedUser);
          
          // Subscribe to profile for real-time updates
          unsubscribeProfile = onSnapshot(doc(db, 'users', authenticatedUser.uid), (snapshot) => {
            if (snapshot.exists()) {
              setProfile(snapshot.data());
            }
          });
        } catch (err) {
          console.error("Profile sync error:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signIn = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to sign in");
      // If internal error, it might be due to popup blockage or cross-origin issues
      if (err.code === 'auth/internal-error') {
        alert("Authentication encountered an internal error. This can happen due to popup blockers or browser settings. Please try again or check your browser settings.");
      }
    }
  };

  const signOutAction = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, signIn, signOut: signOutAction }}>
      {children}
      {error && (
        <div className="fixed bottom-4 right-4 bg-error text-on-error px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          {error}
        </div>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
