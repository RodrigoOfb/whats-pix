import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from '@firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCei2eJ4kPQLn5jEpKd_7EIin7weDKmTZc",
  authDomain: "whatspix-web.firebaseapp.com",
  projectId: "whatspix-web",
  storageBucket: "whatspix-web.appspot.com",
  messagingSenderId: "159681892496",
  appId: "1:159681892496:web:e6c8f6b381aaaaeb91c815"
};

const app = initializeApp(firebaseConfig);


const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const provider = new GoogleAuthProvider();
