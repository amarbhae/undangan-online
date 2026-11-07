import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

const form = document.getElementById("guestbookForm");
const nameInput = document.getElementById("guestName");
const attendanceInput = document.getElementById("guestAttendance");
const messageInput = document.getElementById("guestMessage");
const notice = document.getElementById("guestbookNotice");
const list = document.getElementById("guestbookList");
const count = document.getElementById("guestbookCount");

const guestbookCollection = collection(db, "guestbook");

// Prevent repeated submissions
const SUBMIT_COOLDOWN = 10_000;
let lastSubmitTime = 0;

// Track whether this browser has submitted a message
const SUBMITTED_KEY = "amarMariamGuestbookSubmitted";

function showNotice(message) {
    notice.textContent = message;
}

function lockGuestbookForm() {
    const fields = form.querySelectorAll(
        'input, select, textarea, button[type="submit"]'
    );

    fields.forEach((field) => {
        field.disabled = true;
    });

    showNotice("Anda sudah mengirimkan ucapan. Terima kasih🙂");
}

function renderMessages(messages) {
    list.replaceChildren();

    count.textContent = messages.length
        ? `${messages.length} messages`
        : "No messages yet.";

    messages.forEach((item) => {
        const card = document.createElement("article");
        card.className = "guestbook-card";

        const name = document.createElement("h4");
        name.textContent = item.name || "Guest";

        const attendance = document.createElement("span");
        attendance.className = "guestbook-attendance";
        attendance.textContent = item.attendance || "";

        const message = document.createElement("p");
        message.textContent = item.message || "";

        card.append(name, attendance, message);
        list.appendChild(card);
    });
}

async function loadMessages() {
    try {
        const messagesQuery = query(
            guestbookCollection,
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(messagesQuery);

        const messages = snapshot.docs.map((document) => document.data());
        renderMessages(messages);
    } catch (error) {
        console.error("Failed to load messages:", error);
        showNotice("Messages could not be loaded. Please try again.");
    }
}

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (localStorage.getItem(SUBMITTED_KEY) === "true") {
            lockGuestbookForm();
            return;
        }

        const name = nameInput.value.trim();
        const attendance = attendanceInput.value;
        const message = messageInput.value.trim();

        if (!name || !attendance || !message) {
            showNotice("Please complete all fields.");
            return;
        }

        if (
            name.length > 60 ||
            message.length > 500 ||
            !["Hadir", "Tidak dapat hadir", "Masih belum pasti"].includes(attendance)
        ) {
            showNotice("The submitted data does not meet the allowed limits.");
            return;
        }

        // Prevent repeated submissions within the same tab
        const now = Date.now();
        const remaining = SUBMIT_COOLDOWN - (now - lastSubmitTime);

        if (remaining > 0) {
            showNotice(
                `Please wait ${Math.ceil(remaining / 1000)} seconds before submitting again.`
            );
            return;
        }

        const submitButton = form.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
        }

        // Record the submission time to prevent repeated clicks
        lastSubmitTime = Date.now();

        try {
            await addDoc(guestbookCollection, {
                name,
                attendance,
                message,
                createdAt: serverTimestamp()
            });

            form.reset();

            // Mark this browser after a successful submission
            try {
                localStorage.setItem(SUBMITTED_KEY, "true");
            } catch (error) {
                console.error("Failed to save the browser submission marker:", error);
            }

            lockGuestbookForm();
            await loadMessages();

        } catch (error) {
            console.error("Failed to save the message:", error);
            showNotice("Failed to submit the message. Please try again.");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

if (localStorage.getItem(SUBMITTED_KEY) === "true") {
    lockGuestbookForm();
}

loadMessages();


/* ========================================
   OPEN / CLOSE GUESTBOOK ON MANUAL SCROLL
======================================== */

const toggleGuestbook = document.getElementById("toggleGuestbook");
const guestbookContent = document.getElementById("guestbookContent");
const toggleGuestbookText = document.getElementById("toggleGuestbookText");

if (toggleGuestbook && guestbookContent && toggleGuestbookText) {
    let isAutoScrolling = false;
    let autoScrollTimeout;

    function closeGuestbook() {
        guestbookContent.hidden = true;

        toggleGuestbook.classList.remove("is-open");
        toggleGuestbook.setAttribute("aria-expanded", "false");
        toggleGuestbookText.textContent = "KIRIM UCAPAN & DOA";
    }

    toggleGuestbook.addEventListener("click", function () {
        const isOpening = guestbookContent.hidden;

        if (isOpening) {
            guestbookContent.hidden = false;

            toggleGuestbook.classList.add("is-open");
            toggleGuestbook.setAttribute("aria-expanded", "true");
            toggleGuestbookText.textContent = "TUTUP UCAPAN";

            // Ignore automatic scrolling when opening the guestbook
            isAutoScrolling = true;

            guestbookContent.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            clearTimeout(autoScrollTimeout);
            autoScrollTimeout = setTimeout(function () {
                isAutoScrolling = false;
            }, 1200);
        } else {
            closeGuestbook();
        }
    });

    // Close the guestbook when the page scrolls away from its section
    window.addEventListener("scroll", function () {
        if (guestbookContent.hidden || isAutoScrolling) {
            return;
        }

        const guestbookRect = guestbookContent.getBoundingClientRect();

        if (
            guestbookRect.bottom < 0 ||
            guestbookRect.top > window.innerHeight
        ) {
            closeGuestbook();
        }
    }, { passive: true });
}


// Close the Digital Gift card when scrolling to the next section
window.addEventListener("scroll", function () {
    const digitalCard = document.getElementById("digitalCardContent");
    const toggleButton = document.getElementById("toggleDigitalCard");
    const toggleText = document.getElementById("toggleDigitalCardText");
    const toggleArrow = document.getElementById("digitalCardArrow");

    const guestbookSection = document.getElementById("guestbook");
    const closingSection = document.querySelector(".closing");

    if (
        !digitalCard ||
        !toggleButton ||
        !guestbookSection ||
        !closingSection ||
        digitalCard.hidden
    ) {
        return;
    }

    const closingRect = closingSection.getBoundingClientRect();

    // Close the card only when the Thank You section starts entering the viewport
    if (closingRect.top < window.innerHeight) {
        digitalCard.hidden = true;
        toggleButton.setAttribute("aria-expanded", "false");

        if (toggleText) {
            toggleText.textContent = "OPEN DIGITAL CARD";
        }

        if (toggleArrow) {
            toggleArrow.textContent = "↓";
        }
    }
}, { passive: true });