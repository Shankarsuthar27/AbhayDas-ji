// Firebase Configuration & Initialization
// Shree Abhaydas Portal Admin & Content Management
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Read configuration from environment variables (.env)
// Direct static access ensures full Vite and Next.js bundler compatibility
const getEnv = (viteVal, nextVal) => {
  if (typeof viteVal !== 'undefined' && viteVal) return viteVal;
  if (typeof nextVal !== 'undefined' && nextVal) return nextVal;
  return '';
};

const firebaseConfig = {
  apiKey: getEnv(
    import.meta.env.VITE_FIREBASE_API_KEY,
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_FIREBASE_API_KEY : undefined
  ),
  authDomain: getEnv(
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : undefined
  ),
  projectId: getEnv(
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID : undefined
  ),
  storageBucket: getEnv(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : undefined
  ),
  messagingSenderId: getEnv(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : undefined
  ),
  appId: getEnv(
    import.meta.env.VITE_FIREBASE_APP_ID,
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_FIREBASE_APP_ID : undefined
  ),
  measurementId: getEnv(
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID : undefined
  )
};

// Helpful developer diagnostic if environment variables are missing
if (!firebaseConfig.apiKey) {
  console.warn(
    '[Firebase] API key is missing. Ensure that your .env file is created in the project root with VITE_FIREBASE_* variables, and restart the dev server.'
  );
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
