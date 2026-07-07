// ==========================================
// Levin Cross - Part 1D.2
// Share + Related Posts
// ==========================================

import {
    collection,
    getDocs,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Share Functions
window.shareWhatsApp = function () {

    const url = encodeURIComponent(window.location.href);

    window.open(
        `https://wa.me/?text=${url}`,
        "_blank"
    );

};

window.shareFacebook = function () {

    const url = encodeURIComponent(window.location.href);

    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank"
    );

};

window.shareTwitter = function () {

    const url = encodeURIComponent(window.location.href);

    window.open(
        `https://twitter.com/intent/tweet?url=${url}`,
        "_blank"
    );

};

window.copyLink = async function () {

    try {

        await navigator.clipboard.writeText(
            window.location.href
        );

        alert("Link copied.");

    } catch (error) {

        console.error(error);

    }

};

// ==========================================
// Related Blogs
// ==========================================

async function loadRelated(category) {

    const container =
        document.getElementById("relatedBlogs
