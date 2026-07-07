// ==========================================
// Levin Cross - script.js
// Part 1A.1
// Imports + Global Variables + Initialization
// ==========================================

// Firebase Config
import { auth, db } from "./firebase.js";

// Firebase Authentication
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firestore
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Cloud Messaging
import {
  getMessaging,
  getToken
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

// ==========================================
// Firebase Objects
// ==========================================

const provider = new GoogleAuthProvider();
const messaging = getMessaging();

// ==========================================
// Admin Email
// ==========================================

const ADMIN_EMAIL = "crosslevin@gmail.com";

// ==========================================
// DOM Elements
// ==========================================

const themeBtn = document.getElementById("themeBtn");
const searchBox = document.getElementById("searchBox");
const filter = document.getElementById("filter");

const blogContainer = document.getElementById("blogContainer");

const adminPanel = document.getElementById("adminPanel");

const userSection = document.getElementById("userSection");
const userName = document.getElementById("userName");

// ==========================================
// Firestore Collection
// ==========================================

const blogCollection = collection(db, "blogs");

// ==========================================
// Global Variables
// ==========================================

let currentUser = null;
let allBlogs = [];

// ==========================================
// App Start
// ==========================================

console.log("🚀 Levin Cross Started");
console.log("✅ Firebase Connected");
// ==========================================
// Levin Cross - script.js
// Part 1A.2
// Theme System
// ==========================================

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
}

updateThemeButton();

// Theme Toggle
if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light");

        const currentTheme =
            document.body.classList.contains("light")
                ? "light"
                : "dark";

        localStorage.setItem("theme", currentTheme);

        updateThemeButton();

    });

}

// Update Button Text
function updateThemeButton() {

    if (!themeBtn) return;

    if (document.body.classList.contains("light")) {

        themeBtn.innerHTML = "☀️ Light Mode";

    } else {

        themeBtn.innerHTML = "🌙 Dark Mode";

    }

}

// Optional Theme Helper
window.setTheme = function (theme) {

    if (theme === "light") {

        document.body.classList.add("light");

    } else {

        document.body.classList.remove("light");

    }

    localStorage.setItem("theme", theme);

    updateThemeButton();

};

console.log("🎨 Theme System Loaded");
// ==========================================
// Levin Cross - script.js
// Part 1A.3
// Google Login & Logout
// ==========================================

// Google Login
window.googleLogin = async function () {

    try {

        const result = await signInWithPopup(auth, provider);

        currentUser = result.user;

        console.log("✅ Login Success");

        console.log(currentUser);

        alert(`Welcome ${currentUser.displayName}`);

    } catch (error) {

        console.error(error);

        alert("Google Login Failed");

    }

};

// Logout
window.logout = async function () {

    try {

        await signOut(auth);

        currentUser = null;

        console.log("✅ Logout Success");

    } catch (error) {

        console.error(error);

        alert("Logout Failed");

    }

};

// ==========================================
// Google User Info
// ==========================================

window.getCurrentUser = function () {

    return currentUser;

};

// ==========================================
// User Avatar
// ==========================================

window.getUserPhoto = function () {

    if (!currentUser) return "";

    return currentUser.photoURL || "";

};

// ==========================================
// User Name
// ==========================================

window.getUserName = function () {

    if (!currentUser) return "Guest";

    return currentUser.displayName || "Guest";

};

console.log("🔐 Google Authentication Ready");
// ==========================================
// Levin Cross - script.js
// Part 1A.4
// Authentication State Manager
// ==========================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (user) {

        console.log("✅ User Logged In");

        // User Section
        if (userSection) {
            userSection.style.display = "block";
        }

        // User Name
        if (userName) {
            userName.textContent =
                user.displayName || "User";
        }

        // Google Login Button
        const loginBtn =
            document.getElementById("googleLoginBtn");

        if (loginBtn) {
            loginBtn.style.display = "none";
        }

        // Admin Panel
        if (adminPanel) {

            if (user.email === ADMIN_EMAIL) {

                adminPanel.style.display = "block";

                console.log("👑 Admin Login");

            } else {

                adminPanel.style.display = "none";

                console.log("🙋 Normal User");

            }

        }

    } else {

        console.log("❌ User Logged Out");

        currentUser = null;

        if (userSection) {
            userSection.style.display = "none";
        }

        if (adminPanel) {
            adminPanel.style.display = "none";
        }

        const loginBtn =
            document.getElementById("googleLoginBtn");

        if (loginBtn) {
            loginBtn.style.display = "inline-block";
        }

    }

});

// ==========================================
// Check Admin
// ==========================================

window.isAdmin = function () {

    return (
        currentUser &&
        currentUser.email === ADMIN_EMAIL
    );

};

// ==========================================
// Check Login
// ==========================================

window.isLoggedIn = function () {

    return currentUser !== null;

};

console.log("🔐 Authentication State Manager Loaded");
// ==========================================
// Levin Cross - script.js
// Part 1B.1
// Publish Blog System
// ==========================================

// Publish Blog
window.publishBlog = async function () {

    // Only admin can publish
    if (!window.isAdmin()) {
        alert("Only admin can publish blogs.");
        return;
    }

    const title =
        document.getElementById("blogTitle")?.value.trim();

    const desc =
        document.getElementById("blogDesc")?.value.trim();

    const image =
        document.getElementById("blogImage")?.value.trim() || "";
const category =
    document.getElementById("blogCategory").value;
    // Validation
    if (!title) {
        alert("Please enter blog title.");
        return;
    }

    if (!desc) {
        alert("Please enter blog description.");
        return;
    }

    try {

        await addDoc(blogCollection, {

            title,
            desc,
            image,

            likes: 0,

            author: currentUser?.displayName || "Admin",
            authorEmail: currentUser?.email || "",

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()

        });

        // Clear Form
        document.getElementById("blogTitle").value = "";
        document.getElementById("blogDesc").value = "";
        document.getElementById("blogImage").value = "";

        alert("✅ Blog Published Successfully");

    } catch (error) {

        console.error(error);

        alert("❌ Failed to publish blog.");

    }

};

// ==========================================
// Draft Helper
// ==========================================

window.clearBlogForm = function () {

    document.getElementById("blogTitle").value = "";
    document.getElementById("blogDesc").value = "";
    document.getElementById("blogImage").value = "";

};

console.log("📝 Publish Blog System Ready");
// ==========================================
// Levin Cross - script.js
// Part 1B.2
// Real-Time Blog Display
// ==========================================

const blogsQuery = query(
    blogCollection,
    orderBy("createdAt", "desc")
);

// Live Listener
onSnapshot(blogsQuery, (snapshot) => {

    if (!blogContainer) return;

    blogContainer.innerHTML = "";

    allBlogs = [];

    snapshot.forEach((blog) => {

        const data = blog.data();

        allBlogs.push({
            id: blog.id,
            ...data
        });

        const image = data.image
            ? `<img src="${data.image}" alt="${data.title}" class="blog-image">`
            : "";

        blogContainer.innerHTML += `

        <div class="card">

            ${image}

            <h3>${data.title}</h3>

            <p>${data.desc}</p>

            <small>
                ✍️ ${data.author || "Admin"}
            </small>

            <br><br>

            <button
                onclick="likeBlog('${blog.id}', ${data.likes || 0})">

                ❤️ ${data.likes || 0}

            </button>

            <a href="post.html?id=${blog.id}">
                Read Full →
            </a>

            ${
                window.isAdmin()
                    ? `
                    <br><br>

                    <button onclick="editBlog('${blog.id}')">
                        ✏️ Edit
                    </button>

                    <button onclick="deleteBlog('${blog.id}')">
                        🗑️ Delete
                    </button>
                    `
                    : ""
            }

        </div>

        `;

    });

    console.log("📚 Blogs Loaded:", allBlogs.length);

}, (error) => {

    console.error(error);

    blogContainer.innerHTML =
        "<p>❌ Failed to load blogs.</p>";

});
// ==========================================
// Levin Cross - Part 1B.3
// Like System + Search + Filter
// ==========================================

// Like Blog
window.likeBlog = async function (id, currentLikes = 0) {

    try {

        await updateDoc(doc(db, "blogs", id), {
            likes: currentLikes + 1
        });

    } catch (error) {

        console.error("Like Error:", error);

    }

};

// ==============================
// Search + Category Filter
// ==============================

let searchText = "";
let selectedCategory = "all";

// Search
if (searchBox) {

    searchBox.addEventListener("input", (e) => {

        searchText = e.target.value.toLowerCase();

        renderBlogs();

    });

}

// Category Filter
window.filterBlogs = function () {

    if (!filter) return;

    selectedCategory = filter.value;

    renderBlogs();

};

// Render Filtered Blogs
function renderBlogs() {

    if (!blogContainer) return;

    blogContainer.innerHTML = "";

    const filtered = allBlogs.filter((blog) => {

        const matchSearch =
            blog.title.toLowerCase().includes(searchText) ||
            blog.desc.toLowerCase().includes(searchText);

        const matchCategory =
            selectedCategory === "all" ||
            blog.category === selectedCategory;

        return matchSearch && matchCategory;

    });

    if (filtered.length === 0) {

        blogContainer.innerHTML =
            "<p>No blogs found.</p>";

        return;

    }

    filtered.forEach((blog) => {

        const image = blog.image
            ? `<img src="${blog.image}" class="blog-image" alt="${blog.title}">`
            : "";

        blogContainer.innerHTML += `

        <div class="card">

            ${image}

            <h3>${blog.title}</h3>

            <p>${blog.desc}</p>

            <small>
                📂 ${blog.category || "General"}
            </small>

            <br><br>

            <button onclick="likeBlog('${blog.id}', ${blog.likes || 0})">
                ❤️ ${blog.likes || 0}
            </button>

            <a href="post.html?id=${blog.id}">
                Read Full →
            </a>

        </div>

        `;

    });

}

console.log("🔎 Search & Filter Ready");
// ==========================================
// Levin Cross - Part 1B.4
// Edit & Delete Blog System
// ==========================================

// Delete Blog
window.deleteBlog = async function (blogId) {

    if (!window.isAdmin()) {
        alert("Only admin can delete blogs.");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {

        await deleteDoc(doc(db, "blogs", blogId));

        alert("✅ Blog Deleted Successfully");

    } catch (error) {

        console.error(error);

        alert("❌ Failed to delete blog.");

    }

};

// ==========================================
// Edit Blog
// ==========================================

window.editBlog = async function (blogId) {

    if (!window.isAdmin()) {
        alert("Only admin can edit blogs.");
        return;
    }

    const blog = allBlogs.find(item => item.id === blogId);

    if (!blog) {
        alert("Blog not found.");
        return;
    }

    const newTitle = prompt("Edit Title", blog.title);

    if (newTitle === null) return;

    const newDesc = prompt("Edit Description", blog.desc);

    if (newDesc === null) return;

    const newCategory = prompt(
        "Edit Category",
        blog.category || "General"
    );

    if (newCategory === null) return;

    try {

        await updateDoc(doc(db, "blogs", blogId), {

            title: newTitle.trim(),
            desc: newDesc.trim(),
            category: newCategory.trim(),
            updatedAt: serverTimestamp()

        });

        alert("✅ Blog Updated Successfully");

    } catch (error) {

        console.error(error);

        alert("❌ Failed to update blog.");

    }

};

console.log("✏️ Edit & Delete System Ready");
// ==========================================
// Levin Cross - Part 1C.1
// AI Blog Generator (Template)
// ==========================================

const aiTitles = [
    "The Future of Artificial Intelligence",
    "Top JavaScript Tips Every Developer Should Know",
    "Best Study Techniques for Students",
    "Latest Technology Trends in 2026",
    "How to Start Learning Programming",
    "Cyber Security Basics for Beginners",
    "Top Online Earning Ideas",
    "Career Tips for Students"
];

const aiCategories = [
    "AI",
    "Programming",
    "Technology",
    "Education",
    "Career"
];

const aiDescriptions = [
    "In this article, we explore practical concepts, useful tips, and real-world applications to help you understand the topic better.",

    "This guide explains the fundamentals, common mistakes, and best practices with simple examples.",

    "Discover modern trends, useful tools, and proven techniques that can improve your skills and productivity."
];

// Generate AI Blog
window.generateAI = function () {

    const randomTitle =
        aiTitles[Math.floor(Math.random() * aiTitles.length)];

    const randomCategory =
        aiCategories[Math.floor(Math.random() * aiCategories.length)];

    const randomDescription =
        aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)];

    document.getElementById("blogTitle").value = randomTitle;

    document.getElementById("blogDesc").value = randomDescription;

    const categoryField =
        document.getElementById("blogCategory");

    if (categoryField) {
        categoryField.value = randomCategory;
    }

    alert("🤖 Blog template generated successfully!");

};

console.log("🤖 AI Blog Generator Ready");
// ==========================================
// Levin Cross - Part 1C.2
// Real-Time Comment System
// ==========================================

import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Add Comment
window.addComment = async function (blogId) {

    if (!currentUser) {
        alert("Please login first.");
        return;
    }

    const box = document.getElementById("commentBox");

    const text = box.value.trim();

    if (!text) {
        alert("Enter a comment.");
        return;
    }

    try {

        await addDoc(collection(db, "comments"), {

            blogId,

            userName:
                currentUser.displayName,

            userEmail:
                currentUser.email,

            text,

            createdAt:
                serverTimestamp()

        });

        box.value = "";

    } catch (error) {

        console.error(error);

        alert("Failed to post comment.");

    }

};

// ===============================
// Load Comments
// ===============================

window.loadComments = function (blogId) {

    const commentsDiv =
        document.getElementById("comments");

    const q = query(
        collection(db, "comments"),
        where("blogId", "==", blogId),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {

        commentsDiv.innerHTML = "";

        snapshot.forEach((item) => {

            const data = item.data();

            commentsDiv.innerHTML += `

            <div class="comment-card">

                <strong>
                    ${data.userName}
                </strong>

                <p>
                    ${data.text}
                </p>

                ${
                    window.isAdmin()
                    ? `
                    <button
                        onclick="deleteComment('${item.id}')">
                        🗑 Delete
                    </button>
                    `
                    : ""
                }

            </div>

         // ==========================================
// Levin Cross - Part 1C.3
// Firebase Push Notifications
// ==========================================

import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

import { app } from "./firebase.js";

const messaging = getMessaging(app);

// Request Notification Permission
window.enableNotifications = async function () {

    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {

            alert("Notification permission denied.");

            return;

        }

        const token = await getToken(messaging, {

            vapidKey: "YOUR_VAPID_KEY"

        });

        console.log("FCM Token:", token);

        alert("✅ Notifications Enabled");

    } catch (error) {

        console.error(error);

        alert("Failed to enable notifications.");

    }

};

// Receive Foreground Notifications
onMessage(messaging, (payload) => {

    console.log("Notification:", payload);

    if (payload.notification) {

        alert(
            payload.notification.title +
            "\n\n" +
            payload.notification.body
        );

    }

});

console.log("🔔 Notification System Ready");
`
