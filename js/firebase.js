// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP-Ts_3DtOKjEyAJMhL4uzkzjfE6vGEMg",
  authDomain: "levin-cross.firebaseapp.com",
  projectId: "levin-cross",
  storageBucket: "levin-cross.firebasestorage.app",
  messagingSenderId: "973580087814",
  appId: "1:973580087814:web:dca38c26b8fbbbff198987",
  measurementId: "G-SC5GY5HLY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (optional but ok)
const analytics = getAnalytics(app);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export EVERYTHING (clean)
export { auth, db };

// Debug
console.log("✅ Firebase Connected");
