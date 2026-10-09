// Firebase Configuration & Initialization
// Shree Abhaydas Portal Admin & Content Management
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Production configuration values for the Shree Abhaydas project
// Firebase web client config contains public client identifiers.
// Reliable fallbacks guarantee that production deployment on Vercel or any CDN
// works immediately even if build-time environment variables are not yet configured in dashboard.
const PROD_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBBA9We3KqL64uvaejKBQ9DEp5-qp_Rg6w',
  authDomain: 'shreeabhaydas-41b39.firebaseapp.com',
  projectId: 'shreeabhaydas-41b39',
  storageBucket: 'shreeabhaydas-41b39.firebasestorage.app',
  messagingSenderId: '402320706730',
  appId: '1:402320706730:web:7e23e24aa4d5ab4d2dd4d3',
  measurementId: 'G-57ZYX53YW6'
};

const getEnv = (viteVal, nextVal, fallback) => {
  if (typeof viteVal !== 'undefined' && viteVal && typeof viteVal === 'string' && viteVal.trim() !== '') {
    return viteVal.trim();
  }
  if (typeof nextVal !== 'undefined' && nextVal && typeof nextVal === 'string' && nextVal.trim() !== '') {
    return nextVal.trim();
  }
  return fallback;
};

const processEnv =
  typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env
    ? globalThis.process.env
    : {};

const firebaseConfig = {
  apiKey: getEnv(
    import.meta.env.VITE_FIREBASE_API_KEY,
    processEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    PROD_FIREBASE_CONFIG.apiKey
  ),
  authDomain: getEnv(
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    processEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    PROD_FIREBASE_CONFIG.authDomain
  ),
  projectId: getEnv(
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    processEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    PROD_FIREBASE_CONFIG.projectId
  ),
  storageBucket: getEnv(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    processEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    PROD_FIREBASE_CONFIG.storageBucket
  ),
  messagingSenderId: getEnv(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    processEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PROD_FIREBASE_CONFIG.messagingSenderId
  ),
  appId: getEnv(
    import.meta.env.VITE_FIREBASE_APP_ID,
    processEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
    PROD_FIREBASE_CONFIG.appId
  ),
  measurementId: getEnv(
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    processEnv.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    PROD_FIREBASE_CONFIG.measurementId
  )
};

// Safe initialization of Firebase App
let app = null;
try {
  const existingApps = getApps();
  if (existingApps && existingApps.length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
} catch (appErr) {
  console.warn('[Firebase] Primary initialization note:', appErr.message);
  try {
    app = initializeApp(PROD_FIREBASE_CONFIG);
  } catch (fallbackErr) {
    console.error('[Firebase] Fallback initialization failed:', fallbackErr);
  }
}

// Safe initialization of Firebase Services (guards against invalid API keys / offline)
let auth = null;
try {
  if (app) {
    auth = getAuth(app);
  }
} catch (authErr) {
  console.warn('[Firebase] Auth initialization note:', authErr.message);
}

let db = null;
try {
  if (app) {
    db = getFirestore(app);
  }
} catch (dbErr) {
  console.warn('[Firebase] Firestore initialization note:', dbErr.message);
}

let storage = null;
try {
  if (app) {
    storage = getStorage(app);
  }
} catch (storageErr) {
  console.warn('[Firebase] Storage initialization note:', storageErr.message);
}

export { auth, db, storage };
export default app;
