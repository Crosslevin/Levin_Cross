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
