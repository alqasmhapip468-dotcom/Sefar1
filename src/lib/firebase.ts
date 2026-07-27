import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  type ConfirmationResult,
  type User
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, getDocFromServer } from 'firebase/firestore';

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

export interface UserRecord {
  uid: string;
  name: string;
  phone: string;
  email: string;
  role: 'passenger' | 'company_admin' | 'independent_driver' | 'super_admin';
  createdAt: string;
}

export async function loginWithGoogle(): Promise<UserRecord> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const isSuperAdmin = user.email?.toLowerCase() === 'alqasmhapip468@gmail.com';

  const userDocRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    return snap.data() as UserRecord;
  }

  const userData: UserRecord = {
    uid: user.uid,
    name: user.displayName || 'مسافر موريتاني',
    phone: user.phoneNumber || '+222 4525 1010',
    email: user.email || 'user@safar.mr',
    role: isSuperAdmin ? 'super_admin' : 'passenger',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(userDocRef, userData);
  } catch (err) {
    console.warn("Error setting user doc on Google login:", err);
  }

  return userData;
}

export async function registerAccountInFirebase(
  name: string,
  phone: string,
  email: string,
  pass: string
): Promise<UserRecord> {
  const cleanPhone = phone.trim();
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase() || `${cleanPhone.replace(/\D/g, '')}@safar.mr`;

  // 1. Create User in Firebase Auth
  const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  const user = userCred.user;

  // 2. Update Auth Display Name
  try {
    await updateProfile(user, { displayName: cleanName });
  } catch (e) {
    console.warn("Could not set displayName:", e);
  }

  const isSuperAdmin = cleanEmail === 'alqasmhapip468@gmail.com' || cleanPhone.includes('468');

  const userData: UserRecord = {
    uid: user.uid,
    name: cleanName,
    phone: cleanPhone || '+222 4525 1010',
    email: cleanEmail,
    role: isSuperAdmin ? 'super_admin' : 'passenger',
    createdAt: new Date().toISOString()
  };

  // 3. Save User Document in Firestore `users/{uid}`
  try {
    await setDoc(doc(db, 'users', user.uid), userData);
  } catch (err) {
    console.warn("Firestore setDoc user record error:", err);
  }

  return userData;
}

export async function loginAccountInFirebase(
  identifier: string,
  pass: string
): Promise<UserRecord> {
  let emailToUse = identifier.trim().toLowerCase();

  // If input is phone number without '@'
  if (!emailToUse.includes('@')) {
    const digits = emailToUse.replace(/\D/g, '');
    emailToUse = `${digits}@safar.mr`;
  }

  // Pure login call - NEVER auto-creates user
  const userCred = await signInWithEmailAndPassword(auth, emailToUse, pass);
  const user = userCred.user;

  // Fetch Firestore Profile
  const userDocRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserRecord;
  } else {
    const isSuperAdmin = emailToUse === 'alqasmhapip468@gmail.com';
    const fallbackData: UserRecord = {
      uid: user.uid,
      name: user.displayName || (isSuperAdmin ? 'المشرف العام (Super Admin)' : identifier.split('@')[0]),
      phone: user.phoneNumber || identifier,
      email: user.email || emailToUse,
      role: isSuperAdmin ? 'super_admin' : 'passenger',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(userDocRef, fallbackData);
    } catch (e) {
      console.warn("Error creating fallback doc:", e);
    }
    return fallbackData;
  }
}

export async function fetchUserProfileFromFirestore(uid: string): Promise<UserRecord | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserRecord;
    }
  } catch (err) {
    console.warn("Error fetching user profile from Firestore:", err);
  }
  return null;
}

export async function deleteAccountInFirebase(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await deleteDoc(doc(db, 'users', user.uid));
  } catch (err) {
    console.warn("Error deleting Firestore user document:", err);
  }

  await deleteUser(user);
}

let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

export function initRecaptcha(containerId: string) {
  if (!recaptchaVerifierInstance) {
    recaptchaVerifierInstance = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log("reCAPTCHA solved");
      }
    });
  }
  return recaptchaVerifierInstance;
}

export async function sendSmsOtp(phone: string, containerId: string = 'recaptcha-container'): Promise<ConfirmationResult> {
  const verifier = initRecaptcha(containerId);
  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+222${formattedPhone.replace(/^0+/, '')}`;
  }
  const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
  return confirmationResult;
}

export async function logoutFirebase() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase logout error:", error);
  }
}

export { onAuthStateChanged, type User, type ConfirmationResult };

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


