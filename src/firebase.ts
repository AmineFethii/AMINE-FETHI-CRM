/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCKseEPMgt5Ds5cZyxZmAFwWWnyDLqwm3Y",
  authDomain: "amine-fethi-business-crm.firebaseapp.com",
  projectId: "amine-fethi-business-crm",
  storageBucket: "amine-fethi-business-crm.firebasestorage.app",
  messagingSenderId: "165254151660",
  appId: "1:165254151660:web:92bce16b3893db0d0cd4c9",
  measurementId: "G-QH604EHNWD"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);

