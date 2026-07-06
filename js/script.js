document.addEventListener("DOMContentLoaded", () => {

const button=document.querySelector("button");

if(button){
button.addEventListener("click",()=>{
window.location.href="blog.html";
});
}

const search=document.getElementById("searchBox");

if(search){

search.addEventListener("keyup",()=>{

const value=search.value.toLowerCase();

console.log("Searching:",value);

});

}

});
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
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

// Google Login function
function googleLogin() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Login Success:", user.displayName);
      alert("Welcome " + user.displayName);
    })
    .catch((error) => {
      console.error(error);
    });
}
