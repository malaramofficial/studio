// This configuration is now loaded via environment variables in production
// and is only used for local development if initializeApp() fails.
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-2288106784-e0583",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:910474312216:web:87acb72078bb35265ae16d",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-2288106784-e0583.firebaseapp.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "910474312216",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
