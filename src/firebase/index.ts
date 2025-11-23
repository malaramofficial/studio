'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  // In a production Firebase App Hosting environment, the config is automatically
  // provided. In other environments (like local development), we fall back to
  // our hardcoded config object.
  try {
    // This will succeed in a real App Hosting environment.
    const app = initializeApp();
    return getSdks(app);
  } catch (e) {
    // This will likely fail in local development or other environments.
    // We fall back to the config file.
    console.warn('Automatic Firebase initialization failed, falling back to firebaseConfig. This is normal for local development.', e);
    const app = initializeApp(firebaseConfig);
    return getSdks(app);
  }
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';