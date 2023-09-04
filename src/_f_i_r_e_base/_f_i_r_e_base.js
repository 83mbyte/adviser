// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: "adviserai",
    storageBucket: process.env.NEXT_PUBLIC_FIREBAS_STORAGE_BUCKET,
    messagingSenderId: "562034705604",
    appId: "1:562034705604:web:54f1ef9961bb22b96ab591"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

