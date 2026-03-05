
/**
 * Authentication Context
 * Manages the global authentication state for the admin panel using PocketBase.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the application to provide authentication state and methods.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  // State to hold the current authenticated admin user
  const [admin, setAdmin] = useState(pb.authStore.isValid ? pb.authStore.model : null);
  // State to track initial loading of auth status
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state on mount
    setAdmin(pb.authStore.isValid ? pb.authStore.model : null);
    setIsLoading(false);

    // Subscribe to PocketBase auth store changes (e.g., token expiration, manual logout)
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setAdmin(pb.authStore.isValid ? model : null);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Authenticates an admin user with email and password.
   * 
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Auth data from PocketBase
   */
  const login = async (email, password) => {
    try {
      const authData = await pb.collection('admins').authWithPassword(email, password, {
        $autoCancel: false
      });
      setAdmin(authData.record);
      return authData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logs out the current admin user and clears the auth store.
   */
  const logout = () => {
    pb.authStore.clear();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the authentication context.
 * 
 * @returns {Object} Auth context value containing admin state and methods
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
