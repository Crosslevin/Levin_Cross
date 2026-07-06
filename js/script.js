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
import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

/* ======================
   GOOGLE LOGIN
====================== */
window.googleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log(user);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

/* ======================
   LOGOUT
====================== */
window.logout = async function () {
  await signOut(auth);
};

/* ======================
   AUTH STATE (IMPORTANT)
====================== */
onAuthStateChanged(auth, (user) => {
  const userSection = document.getElementById("userSection");
  const userName = document.getElementById("userName");

  if (user) {
    userSection.style.display = "block";
    userName.textContent = user.displayName;
  } else {
    userSection.style.display = "none";
  }
});
