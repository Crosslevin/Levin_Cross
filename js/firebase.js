// Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// Firebase Services
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAP-Ts_3DtOKjEyAJMhL4uzkzjfE6vGEMg",
  authDomain: "levin-cross.firebaseapp.com",
  projectId: "levin-cross",
  storageBucket: "levin-cross.firebasestorage.app",
  messagingSenderId: "973580087814",
  appId: "1:973580087814:web:dca38c26b8fbbbff198987",
  measurementId: "G-SC5GY5HLY9"
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
category: category,
// Messaging (optional)
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (e) {
  console.log("Firebase Messaging not available in this browser.");
}

// Analytics (only if supported)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Export
export {
  app,
  auth,
  db,
  storage,
  messaging,
  analytics
};

console.log("✅ Firebase Connected Successfully");
