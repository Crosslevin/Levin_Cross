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
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

/* ================= THEME ================= */
const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    themeBtn.textContent = document.body.classList.contains("light")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  });
}

/* ================= SEARCH ================= */
const search = document.getElementById("searchBox");

if (search) {
  search.addEventListener("keyup", () => {
    console.log("Searching:", search.value);
  });
}

/* ================= LOGIN ================= */
window.googleLogin = async function () {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    alert(err.message);
  }
};

/* ================= LOGOUT ================= */
window.logout = async function () {
  await signOut(auth);
};

/* ================= AUTH STATE ================= */
const ADMIN_EMAIL = "yourmail@gmail.com";

onAuthStateChanged(auth, (user) => {
  const userSection = document.getElementById("userSection");
  const userName = document.getElementById("userName");
  const adminPanel = document.getElementById("adminPanel");

  if (user) {
    if (userSection) userSection.style.display = "block";
    if (userName) userName.textContent = user.displayName;

    if (user && user.email === ADMIN_EMAIL) {
      if (adminPanel) adminPanel.style.display = "block";
    }

  } else {
    if (userSection) userSection.style.display = "none";
    if (adminPanel) adminPanel.style.display = "none";
  }
});

/* ================= BLOG PUBLISH ================= */
window.generateAI = async function () {
  const title = "AI Generated Blog Title " + Date.now();
  const desc = "This is AI generated content for Levin Cross blog system.";

  await addDoc(collection(db, "blogs"), {
    title,
    desc,
    time: Date.now(),
    likes: 0
  });

  alert("AI Blog Created!");
};

  document.getElementById("blogTitle").value = "";
  document.getElementById("blogDesc").value = "";
  if (document.getElementById("blogImage"))
    document.getElementById("blogImage").value = "";
};

/* ================= BLOG DISPLAY ================= */
const blogContainer = document.getElementById("blogContainer");

if (blogContainer) {
  onSnapshot(collection(db, "blogs"), (snapshot) => {
    blogContainer.innerHTML = "";

    snapshot.forEach((item) => {
      const data = item.data();
      const id = item.id;

      blogContainer.innerHTML += `
        <div class="card">
          ${data.image ? `<img src="${data.image}" style="width:100%;border-radius:10px;">` : ""}

          <h3>${data.title}</h3>
          <p>${data.desc}</p>

          <a href="post.html?id=${id}">Read Full →</a>

          <button onclick="deleteBlog('${id}')">🗑️ Delete</button>
          <button onclick="editBlog('${id}','${data.title}','${data.desc}')">✏️ Edit</button>
        </div>
      `;
    });
  });
}

/* ================= DELETE ================= */
window.deleteBlog = async function (id) {
  if (confirm("Delete this blog?")) {
    await deleteDoc(doc(db, "blogs", id));
  }
};

/* ================= EDIT ================= */
window.editBlog = async function (id, oldTitle, oldDesc) {
  const newTitle = prompt("Edit Title", oldTitle);
  const newDesc = prompt("Edit Description", oldDesc);

  if (!newTitle || !newDesc) return;

  await updateDoc(doc(db, "blogs", id), {
    title: newTitle,
    desc: newDesc
  });

  alert("Updated!");
};

/* ================= NOTIFICATIONS ================= */
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const messaging = getMessaging();

async function requestNotification() {
  try {
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY"
    });

    console.log("Notification Token:", token);
  } catch (err) {
    console.log(err);
  }
}

requestNotification();
