import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Theme Button
const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    themeBtn.textContent =
      document.body.classList.contains("light")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
  });
}

// Search Box
const search = document.getElementById("searchBox");

if (search) {
  search.addEventListener("keyup", () => {
    console.log("Searching:", search.value);
  });
}

// Google Login
const provider = new GoogleAuthProvider();

window.googleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    alert("Welcome " + user.displayName);

    console.log(user);

    // Login ke baad Blog Page
    window.location.href = "blog.html";

  } catch (error) {
    console.error(error);

    alert("Login Failed: " + error.message);
  }
};
