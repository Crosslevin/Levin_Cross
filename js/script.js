document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to Levin Cross");

    const button = document.querySelector("button");

    if (button) {
        button.addEventListener("click", () => {
            alert("Welcome to Levin Cross! More features coming soon.");
        });
    }
});
