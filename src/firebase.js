// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAz32A7HTq4lhiaKTZFtQMJB5NgNriEh4",
  authDomain: "huddle-chat-6dfb7.firebaseapp.com",
  projectId: "huddle-chat-6dfb7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);