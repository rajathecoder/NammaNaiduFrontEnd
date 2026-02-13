import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import type { ConfirmationResult, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDBJgZO200L2KrfS4tKtE5VyTKKUZrULvk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nammamatrimonyapp.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nammamatrimonyapp',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:171195418276:web:b31ecb170ecfa29c4b4831',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '171195418276',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nammamatrimonyapp.firebasestorage.app',
};

// VAPID key for web push - get this from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

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

// ─── Firebase Cloud Messaging (Push Notifications) ───

let messagingInstance: Messaging | null = null;

/**
 * Get Firebase Messaging instance (only if browser supports it)
 */
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (messagingInstance) return messagingInstance;

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }
    ensureFirebaseApp();
    messagingInstance = getMessaging(getApp());
    return messagingInstance;
  } catch (e) {
    console.error('Error initializing Firebase Messaging:', e);
    return null;
  }
};

/**
 * Request notification permission and get FCM token
 * Returns the FCM token string or null if not available
 */
export const requestFcmToken = async (): Promise<string | null> => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('Notifications are not supported in this browser');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    // Register service worker
    let registration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration.scope);
    }

    // Get messaging instance
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    // Get token
    const tokenOptions: { vapidKey?: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {};
    if (VAPID_KEY) {
      tokenOptions.vapidKey = VAPID_KEY;
    }
    if (registration) {
      tokenOptions.serviceWorkerRegistration = registration;
    }

    const token = await getToken(messaging, tokenOptions);

    if (token) {
      console.log('FCM Token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('No FCM token available');
      return null;
    }
  } catch (e) {
    console.error('Error getting FCM token:', e);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onForegroundMessage = (callback: (payload: any) => void) => {
  getFirebaseMessaging().then((messaging) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        callback(payload);
      });
    }
  });
};
