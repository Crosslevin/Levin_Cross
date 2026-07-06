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
const ADMIN_EMAIL = "yourmail@gmail.com";

onAuthStateChanged(auth, (user) => {
  const adminPanel = document.getElementById("adminPanel");

  if (user && user.email === ADMIN_EMAIL) {
    if (adminPanel) adminPanel.style.display = "block";
  } else {
    if (adminPanel) adminPanel.style.display = "none";
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
window.publishBlog = async function () {
  const title = document.getElementById("blogTitle").value;
  const desc = document.getElementById("blogDesc").value;
  const image = document.getElementById("blogImage").value;

  if (!title || !desc) {
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db, "blogs"), {
    title,
    desc,
    image: image || "",
    time: Date.now()
  });

  alert("Blog Published!");

  document.getElementById("blogTitle").value = "";
  document.getElementById("blogDesc").value = "";
  document.getElementById("blogImage").value = "";
};
// Show Blogs
const blogContainer = document.getElementById("blogContainer");

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

      blogContainer.innerHTML += `
        <div class="card">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>

          <button onclick="deleteBlog('${id}')">🗑️ Delete</button>
          <button onclick="editBlog('${id}', '${data.title}', '${data.desc}')">✏️ Edit</button>
        </div>
      `;
    });
  });
}
import { deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

window.deleteBlog = async function (id) {
  if (confirm("Delete this blog?")) {
    await deleteDoc(doc(db, "blogs", id));
    alert("Deleted!");
  }window.editBlog = async function (id, oldTitle, oldDesc) {
  const newTitle = prompt("Edit Title", oldTitle);
  const newDesc = prompt("Edit Description", oldDesc);

  if (!newTitle || !newDesc) return;

  await updateDoc(doc(db, "blogs", id), {
    title: newTitle,
    desc: newDesc
  });

  alert("Updated!");
};onAuthStateChanged(auth, (user) => {
  const adminPanel = document.getElementById("adminPanel");

  if (user) {
    if (adminPanel) adminPanel.style.display = "block";
  } else {
    if (adminPanel) adminPanel.style.display = "none";
  }
});
};
  try {
    await addDoc(collection(db, "blogs"), {
      title: title,
      desc: desc,
      time: Date.now()
    });

    alert("Blog Published Successfully!");

    document.getElementById("blogTitle").value = "";
    document.getElementById("blogDesc").value = "";

  } catch (error) {
    console.error(error);
    alert("Error publishing blog");
  }
};
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
// Show admin panel only when logged in
onAuthStateChanged(auth, (user) => {
  const userSection = document.getElementById("userSection");
  const userName = document.getElementById("userName");
  const adminPanel = document.getElementById("adminPanel");

  if (user) {
    if (userSection) userSection.style.display = "block";
    if (userName) userName.textContent = user.displayName;

    // Admin panel show
    if (adminPanel) adminPanel.style.display = "block";

  } else {
    if (userSection) userSection.style.display = "none";
    if (adminPanel) adminPanel.style.display = "none";
  }
});
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const messaging = getMessaging();
async function requestNotification() {
  try {
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY"
    });

    console.log("Notification Token:", token);
  } catch (err) {
    console.log("Notification error", err);
  }
}

requestNotification();
