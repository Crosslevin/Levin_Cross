import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Dashboard Elements
const adminInfo = document.getElementById("adminInfo");
const totalBlogs = document.getElementById("totalBlogs");
const totalUsers = document.getElementById("totalUsers");
const status = document.getElementById("status");

// Dashboard Init
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        adminInfo.innerHTML = "<h3>❌ Admin Not Logged In</h3>";
        status.innerHTML = "Please login first.";
        return;
    }

    adminInfo.innerHTML = `
        <h3>👋 Welcome Admin</h3>
        <p><strong>Name:</strong> ${user.displayName || "Admin"}</p>
        <p><strong>Email:</strong> ${user.email}</p>
    `;

    status.innerHTML = "Loading dashboard...";

    try {

        // Blogs
        const blogSnap = await getDocs(collection(db, "blogs"));
        totalBlogs.innerText = blogSnap.size;

        // Users
        const userSnap = await getDocs(collection(db, "users"));
        totalUsers.innerText = userSnap.size;

        status.innerHTML = "✅ Dashboard Loaded Successfully";

    } catch (error) {

        console.error(error);

        status.innerHTML = "❌ Failed to load dashboard.";
    }

});
