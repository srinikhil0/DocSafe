import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Citizen App Firebase configuration
const citizenFirebaseConfig = {
  apiKey: import.meta.env.VITE_CITIZEN_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_CITIZEN_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_CITIZEN_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_CITIZEN_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_CITIZEN_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_CITIZEN_FIREBASE_APP_ID,
};

// Government App Firebase configuration
const governmentFirebaseConfig = {
  apiKey: import.meta.env.VITE_GOV_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_GOV_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_GOV_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_GOV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_GOV_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_GOV_FIREBASE_APP_ID,
};

// Business App Firebase configuration
const businessFirebaseConfig = {
  apiKey: import.meta.env.VITE_BUSINESS_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_BUSINESS_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_BUSINESS_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_BUSINESS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_BUSINESS_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_BUSINESS_FIREBASE_APP_ID,
};

// Initialize Firebase apps
const citizenApp = initializeApp(citizenFirebaseConfig, 'citizen');
const governmentApp = initializeApp(governmentFirebaseConfig, 'government');
const businessApp = initializeApp(businessFirebaseConfig, 'business');

// Initialize services for citizen app (default)
export const auth = getAuth(citizenApp);
export const db = getFirestore(citizenApp);
export const storage = getStorage(citizenApp);
export const googleProvider = new GoogleAuthProvider();

// Initialize services for government app
export const govAuth = getAuth(governmentApp);
export const govDb = getFirestore(governmentApp);
export const govStorage = getStorage(governmentApp);

// Initialize services for business app
export const businessAuth = getAuth(businessApp);
export const businessDb = getFirestore(businessApp);
export const businessStorage = getStorage(businessApp);

export { citizenApp, governmentApp, businessApp }; 