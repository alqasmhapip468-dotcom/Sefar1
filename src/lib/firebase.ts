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
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  collection, 
  deleteDoc, 
  getDocFromServer,
  updateDoc,
  query,
  limit
} from 'firebase/firestore';
import { UserRecord, UserRole, UserStatus } from '../types';

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

/**
 * Helper to ensure user document exists in `users/{uid}`
 */
export async function ensureUserDocInFirestore(user: User, customName?: string, customPhone?: string): Promise<UserRecord> {
  const userEmail = (user.email || '').toLowerCase();
  const isSuperAdminEmail = userEmail === 'alqasmhapip468@gmail.com';
  const userDocRef = doc(db, 'users', user.uid);

  try {
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data() as UserRecord;

      // Check if suspended
      if (data.status === 'suspended') {
        await signOut(auth);
        throw new Error('حسابك معطل حالياً من قبل الإدارة. يرجى التواصل مع الدعم الفني.');
      }

      // Automatically upgrade primary admin email or single first user to admin
      if (isSuperAdminEmail && (data.role !== 'admin' && data.role !== 'super_admin')) {
        const updated = { ...data, role: 'admin' as UserRole };
        await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        return updated;
      }

      return data;
    }
  } catch (err: any) {
    if (err.message && err.message.includes('معطل')) {
      throw err;
    }
    console.warn("Notice checking user doc:", err);
  }

  // Determine user role (If user collection is empty or email matches, make admin)
  let assignedRole: UserRole = isSuperAdminEmail ? 'admin' : 'customer';

  if (!isSuperAdminEmail) {
    try {
      const usersSnap = await getDocs(query(collection(db, 'users'), limit(1)));
      if (usersSnap.empty) {
        assignedRole = 'admin';
      }
    } catch (err) {
      console.warn("Notice checking if users collection is empty:", err);
    }
  }

  // Auto-create missing user document in Firestore with UID as Document ID
  const newRecord: UserRecord = {
    uid: user.uid,
    name: assignedRole === 'admin' 
      ? (customName || user.displayName || 'المشرف العام (Admin)')
      : (customName || user.displayName || 'مستخدم جديد'),
    phone: customPhone || user.phoneNumber || '+222 2779 8492',
    email: userEmail || 'user@safar.mr',
    role: assignedRole,
    status: 'active',
    companyId: null,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(userDocRef, newRecord);
  } catch (err) {
    console.warn("Firestore setDoc user record error:", err);
  }

  return newRecord;
}

export async function loginWithGoogle(): Promise<UserRecord> {
  const result = await signInWithPopup(auth, googleProvider);
  return await ensureUserDocInFirestore(result.user);
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

  // 3. Create document in Firestore `users/{user.uid}`
  return await ensureUserDocInFirestore(user, cleanName, cleanPhone);
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

  const userCred = await signInWithEmailAndPassword(auth, emailToUse, pass);
  return await ensureUserDocInFirestore(userCred.user, identifier.split('@')[0], identifier);
}

export async function fetchUserProfileFromFirestore(uid: string): Promise<UserRecord | null> {
  try {
    if (auth.currentUser && auth.currentUser.uid === uid) {
      return await ensureUserDocInFirestore(auth.currentUser);
    }
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data() as UserRecord;
      if (data.status === 'suspended') {
        await signOut(auth);
        throw new Error('حسابك معطل حالياً من قبل الإدارة. يرجى التواصل مع الدعم الفني.');
      }
      const userEmail = (data.email || '').toLowerCase();
      if (userEmail === 'alqasmhapip468@gmail.com' && data.role !== 'admin' && data.role !== 'super_admin') {
        const updated = { ...data, role: 'admin' as UserRole };
        await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        return updated;
      }
      return data;
    }
  } catch (err: any) {
    if (err.message && err.message.includes('معطل')) {
      throw err;
    }
    console.warn("Error fetching user profile from Firestore:", err);
  }
  return null;
}

/**
 * User Management APIs for Admin Panel
 */
export async function fetchAllUsersFromFirestore(): Promise<UserRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const usersList: UserRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as UserRecord;
      usersList.push({
        ...data,
        uid: docSnap.id
      });
    });
    return usersList;
  } catch (err) {
    console.warn("Error fetching users collection from Firestore:", err);
    return [];
  }
}

export async function updateUserRoleAndStatusInFirestore(
  uid: string, 
  role: UserRole, 
  status: UserStatus,
  companyId?: string | null
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const updateData: any = { role, status };
  if (companyId !== undefined) {
    updateData.companyId = companyId;
  }
  await updateDoc(userRef, updateData);
}

export async function approveCompanyPartnerRequest(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    role: 'company',
    status: 'active',
    companyId: uid
  });
}

export async function rejectCompanyPartnerRequest(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    role: 'customer',
    status: 'active'
  });
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
