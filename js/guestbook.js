
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

// Perlindungan pengiriman berulang
const SUBMIT_COOLDOWN = 10_000;
let lastSubmitTime = 0;

// Penanda bahwa Anda sudah mengirim ucapan
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

    showNotice("Anda sudah mengirim ucapan. Terima kasih!");
}
function renderMessages(messages) {
    list.replaceChildren();

    count.textContent = messages.length
        ? `${messages.length} ucapan`
        : "Belum ada ucapan.";

    messages.forEach((item) => {
        const card = document.createElement("article");
        card.className = "guestbook-card";

        const name = document.createElement("h4");
        name.textContent = item.name || "Tamu";

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
        console.error("Gagal memuat ucapan:", error);
        showNotice("Ucapan belum dapat dimuat. Silakan coba lagi.");
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
            showNotice("Mohon lengkapi semua kolom.");
            return;
        }

        if (
            name.length > 60 ||
            message.length > 500 ||
            !["Hadir", "Tidak dapat hadir", "Masih belum pasti"].includes(attendance)
        ) {
            showNotice("Data yang dimasukkan tidak sesuai batas yang diizinkan.");
            return;
        }

        // Cegah pengiriman berulang dalam tab yang sama
        const now = Date.now();
        const remaining = SUBMIT_COOLDOWN - (now - lastSubmitTime);

        if (remaining > 0) {
            showNotice(
                `Mohon tunggu ${Math.ceil(remaining / 1000)} detik sebelum mengirim lagi.`
            );
            return;
        }

        const submitButton = form.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
        }

        // Catat waktu sebelum mengirim agar klik berulang tidak lolos
        lastSubmitTime = Date.now();

        try {
            await addDoc(guestbookCollection, {
                name,
                attendance,
                message,
                createdAt: serverTimestamp()
            });
form.reset();

// Tandai anda sudah berhasil mengirim ucapan
try {
    localStorage.setItem(SUBMITTED_KEY, "true");
} catch (error) {
    console.error("Gagal menyimpan penanda browser:", error);
}

lockGuestbookForm();
await loadMessages();

        } catch (error) {
            console.error("Gagal menyimpan ucapan:", error);
            showNotice("Ucapan gagal disimpan. Silakan coba lagi.");

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
   BUKA / TUTUP UCAPAN SAAT SCROLL MANUAL
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

            // Abaikan scroll otomatis saat membuka
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

  
    // Tutup buku tamu saat halaman utama berpindah dari bagian ini.
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

// Tutup Digital Gift setelah berpindah ke section berikutnya
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

    // Tutup kartu hanya setelah section Terima Kasih
    // mulai masuk ke area layar
    if (closingRect.top < window.innerHeight) {
        digitalCard.hidden = true;
        toggleButton.setAttribute("aria-expanded", "false");

        if (toggleText) {
            toggleText.textContent = "BUKA KARTU DIGITAL";
        }

        if (toggleArrow) {
            toggleArrow.textContent = "↓";
        }
    }
}, { passive: true });