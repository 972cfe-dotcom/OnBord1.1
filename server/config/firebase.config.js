/**
 * Firebase Admin SDK Configuration
 * Initialize Firebase for server-side operations
 */

const admin = require('firebase-admin');

let firebaseApp;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Check if running in production with service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      
      console.log('✅ Firebase initialized with service account');
    } 
    // Development mode - use default credentials
    else if (process.env.FIREBASE_PROJECT_ID) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      
      console.log('✅ Firebase initialized with default credentials');
    }
    // Mock mode for testing without Firebase
    else {
      console.warn('⚠️  Firebase not configured. Running in MOCK mode.');
      console.warn('   Set FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT to enable Firebase.');
      return null;
    }

    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.warn('⚠️  Running without Firebase. Some features may be limited.');
    return null;
  }
}

/**
 * Get Firestore database instance
 */
function getFirestore() {
  const app = initializeFirebase();
  if (!app) {
    return null;
  }
  return admin.firestore();
}

/**
 * Get Firebase Auth instance
 */
function getAuth() {
  const app = initializeFirebase();
  if (!app) {
    return null;
  }
  return admin.auth();
}

/**
 * Get Realtime Database instance
 */
function getDatabase() {
  const app = initializeFirebase();
  if (!app) {
    return null;
  }
  return admin.database();
}

/**
 * Check if Firebase is initialized
 */
function isFirebaseEnabled() {
  return firebaseApp !== null && firebaseApp !== undefined;
}

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  getDatabase,
  isFirebaseEnabled,
  admin
};
