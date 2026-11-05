import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check stored auth session or Firebase auth state on mount
  useEffect(() => {
    // 1. Check persistent local session
    const storedUser = localStorage.getItem('shreeabhaydas_admin_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('shreeabhaydas_admin_user');
      }
    }

    // 2. Sync with Firebase Auth state
    let unsubscribe = () => {};
    try {
      if (auth) {
        unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            if (user) {
              const adminData = {
                uid: user.uid,
                email: user.email,
                username: 'admin2233',
                role: 'administrator'
              };
              setCurrentUser(adminData);
              localStorage.setItem('shreeabhaydas_admin_user', JSON.stringify(adminData));
            }
            setLoading(false);
          },
          (authErr) => {
            console.warn('Firebase Auth state error:', authErr?.message);
            setLoading(false);
          }
        );
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.warn('Firebase Auth listener note:', e?.message);
      setLoading(false);
    }

    return () => {
      try {
        if (typeof unsubscribe === 'function') unsubscribe();
      } catch (e) {
        // Ignored
      }
    };
  }, []);

  /**
   * Secure Login handler
   * Strict credentials:
   * Username: admin2233
   * Password: admin@2233
   */
  const login = async (username, password) => {
    const trimmedUser = (username || '').trim();
    const trimmedPass = (password || '').trim();

    // Verify username format: accept "admin2233" or "admin2233@shreeabhaydas.com"
    const isValidUser =
      trimmedUser === 'admin2233' ||
      trimmedUser.toLowerCase() === 'admin2233@shreeabhaydas.com';

    const isValidPass = trimmedPass === 'admin@2233';

    if (!isValidUser || !isValidPass) {
      throw new Error('Invalid username or password. Access is restricted to authorized administrators.');
    }

    const email = 'admin2233@shreeabhaydas.com';

    // Attempt Firebase Authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, trimmedPass);
      const adminData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: 'admin2233',
        role: 'administrator',
        isCloudAuth: true
      };
      setCurrentUser(adminData);
      localStorage.setItem('shreeabhaydas_admin_user', JSON.stringify(adminData));
      return adminData;
    } catch (fbError) {
      console.warn('Firebase Auth sign-in note:', fbError.code, fbError.message);

      // If user does not exist in Firebase yet, attempt to create it automatically
      if (
        fbError.code === 'auth/user-not-found' ||
        fbError.code === 'auth/invalid-credential' ||
        fbError.code === 'auth/invalid-login-credentials'
      ) {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, email, trimmedPass);
          const adminData = {
            uid: newCredential.user.uid,
            email: newCredential.user.email,
            username: 'admin2233',
            role: 'administrator',
            isCloudAuth: true
          };
          setCurrentUser(adminData);
          localStorage.setItem('shreeabhaydas_admin_user', JSON.stringify(adminData));
          return adminData;
        } catch (createErr) {
          console.warn('Firebase createUser note:', createErr.code, createErr.message);
        }
      }

      if (fbError.code === 'auth/configuration-not-found') {
        console.warn(
          '[Firebase Auth Action Required] "auth/configuration-not-found":\n' +
          '1. Enable Email/Password in Firebase Console -> Authentication -> Sign-in method.\n' +
          '2. Add your Hostinger domain to Firebase Console -> Authentication -> Settings -> Authorized domains.'
        );
      }

      // Validated Credentials Fallback:
      // Even if Firebase Auth project has not enabled Email/Password provider in Console,
      // the verified credentials grant authorized admin access locally!
      const fallbackAdmin = {
        uid: 'admin_local_2233',
        email,
        username: 'admin2233',
        role: 'administrator',
        isCloudAuth: false,
        authWarning: fbError.code === 'auth/configuration-not-found'
          ? 'Firebase Authentication is not enabled or Hostinger domain is not authorized in Firebase Console.'
          : fbError.message
      };
      setCurrentUser(fallbackAdmin);
      localStorage.setItem('shreeabhaydas_admin_user', JSON.stringify(fallbackAdmin));
      return fallbackAdmin;
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignored
    }
    setCurrentUser(null);
    localStorage.removeItem('shreeabhaydas_admin_user');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
