import { auth, db } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

// Theme Button
const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    themeBtn.textContent = document.body.classList.contains("light")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  });
}

// Search
const search = document.getElementById("searchBox");

if (search) {
  search.addEventListener("keyup", () => {
    console.log("Searching:", search.value);
  });
}

// Google Login
window.googleLogin = async function () {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert(error.message);
  }
};

// Logout
window.logout = async function () {
  await signOut(auth);
};

// Login State
onAuthStateChanged(auth, (user) => {
  const userSection = document.getElementById("userSection");
  const userName = document.getElementById("userName");

  if (user) {
    if (userSection) userSection.style.display = "block";
    if (userName) userName.textContent = user.displayName;
  } else {
    if (userSection) userSection.style.display = "none";
  }
});

// Add Blog
window.addBlog = async function () {
  const title = prompt("Blog Title");
  const desc = prompt("Blog Description");

  if (!title || !desc) return;

  await addDoc(collection(db, "blogs"), {
    title,
    desc,
    time: Date.now()
  });

  alert("Blog Published!");
};

// Show Blogs
const blogContainer = document.getElementById("blogContainer");

if (blogContainer) {
  onSnapshot(collection(db, "blogs"), (snapshot) => {
    blogContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      blogContainer.innerHTML += `
        <div class="card">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
        </div>
      `;
    });
  });
}
