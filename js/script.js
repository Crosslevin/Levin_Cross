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
