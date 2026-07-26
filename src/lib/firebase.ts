import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxmAAyA3mADDDIUldLjlPQLTw7jix-Rho",
  authDomain: "safar-55ad0.firebaseapp.com",
  projectId: "safar-55ad0",
  storageBucket: "safar-55ad0.firebasestorage.app",
  messagingSenderId: "315326378335",
  appId: "1:315326378335:web:bd4ad48b2609fd9ebd06ea"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

export async function logoutFirebase() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase logout error:", error);
  }
}

// Connectivity Test Helper according to firebase-skill guidelines
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'health'));
    return true;
  } catch (err) {
    console.warn("Firebase connectivity check (offline/fallback mode active):", err);
    return false;
  }
}
