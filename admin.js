import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Auth check
onAuthStateChanged(auth, async (user) => {
  const adminInfo = document.getElementById("adminInfo");

  if (!user) {
    adminInfo.innerHTML = "❌ Not logged in";
    return;
  }

  adminInfo.innerHTML = `
    <p>👤 Name: ${user.displayName}</p>
    <p>📧 Email: ${user.email}</p>
  `;

  // Get total blogs
  const snap = await getDocs(collection(db, "blogs"));
  document.getElementById("totalBlogs").innerText = snap.size;
});
