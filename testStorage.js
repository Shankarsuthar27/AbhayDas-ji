import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || '').trim();
  }
});

console.log('Project ID:', env.VITE_FIREBASE_PROJECT_ID);
console.log('Storage Bucket:', env.VITE_FIREBASE_STORAGE_BUCKET);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const testBuffer = Buffer.from('test image content');
const storageRef = ref(storage, 'test_uploads/test.txt');

try {
  console.log('Attempting upload to bucket:', storage.app.options.storageBucket);
  const snapshot = await uploadBytes(storageRef, testBuffer);
  console.log('Upload successful! Snapshot:', snapshot.metadata.fullPath);
  const url = await getDownloadURL(storageRef);
  console.log('Download URL:', url);
} catch (err) {
  console.error('Upload error code:', err.code);
  console.error('Upload error message:', err.message);
  console.error('Upload error server response:', err.customData?.serverResponse);
}
