import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { ConfirmationResult, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? undefined,
};

let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

const ensureFirebaseApp = () => {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
};

const getFirebaseAuth = () => {
  ensureFirebaseApp();
  return getAuth();
};

export const getDb = (): Firestore => {
  ensureFirebaseApp();
  return getFirestore();
};

export const getRecaptchaVerifier = (containerId = 'recaptcha-container') => {
  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  const auth = getFirebaseAuth();
  recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    { size: 'invisible' },
  );
  return recaptchaVerifier;
};

export const sendOtp = async (phoneNumber: string) => {
  const auth = getFirebaseAuth();
  const verifier = getRecaptchaVerifier();
  await verifier.render();
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  return confirmationResult;
};

export const confirmOtp = async (otp: string): Promise<User> => {
  if (!confirmationResult) {
    throw new Error('OTP confirmation is not initialized');
  }
  const result = await confirmationResult.confirm(otp);
  return result.user;
};

export const clearOtpSession = () => {
  confirmationResult = null;
};

export const resetRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
};

