import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  // Blog Button
  const button = document.querySelector("button");
  if (button) {
    button.addEventListener("click", () => {
      // Agar ye Google Login button hai to is code ko hata dena
      // window.location.href = "blog.html";
    });
  }

  // Search
  const search = document.getElementById("searchBox");
  if (search) {
    search.addEventListener("keyup", () => {
      const value = search.value.toLowerCase();
      console.log("Searching:", value);
    });
  }

  // Theme
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");

      if (document.body.classList.contains("light")) {
        themeBtn.textContent = "☀️ Light Mode";
      } else {
        themeBtn.textContent = "🌙 Dark Mode";
      }
    });
  }
});

// Google Login
const provider = new GoogleAuthProvider();

window.googleLogin = function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert("Welcome " + user.displayName);
      console.log(user);
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
};
