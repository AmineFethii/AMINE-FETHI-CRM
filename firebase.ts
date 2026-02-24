import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// This is your actual Digital ID Card for Google Cloud
const firebaseConfig = {
  apiKey: "AIzaSyCkseEPMgt5Ds5cZyxZmAFwWWnyDLqwm3Y", 
  authDomain: "amine-fethi-business-crm.firebaseapp.com",
  projectId: "amine-fethi-business-crm",
  storageBucket: "amine-fethi-business-crm.firebasestorage.app",
  messagingSenderId: "165254151660",
  appId: "1:165254151660:web:92bce16b3893db0d0cd4c9",
  measurementId: "G-QH604EHNWD"
};

// Initialize the connection
const app = initializeApp(firebaseConfig);

// Export the database so we can use it in Step 3
export const db = getFirestore(app);
