
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. MENGAMBIL ELEMEN MENU GANTI MUSIK
    // ==========================================

    const musicSwitcher = document.querySelector(".music-switcher");
    const musicSwitcherToggle = document.getElementById("musicSwitcherToggle");

    if (!musicSwitcher || !musicSwitcherToggle) {
        console.error("Menu Ganti Musik tidak ditemukan!");
        return;
    }


    // ==========================================
    // 2. MEMBUKA DAN MENUTUP MENU
    // ==========================================

    musicSwitcherToggle.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();

        musicSwitcher.classList.toggle("is-open");

        const isOpen = musicSwitcher.classList.contains("is-open");

        musicSwitcherToggle.setAttribute("aria-expanded", isOpen);

        console.log("Status menu:", isOpen);
    };


    // ==========================================
    // 3. MENUTUP MENU JIKA KLIK DI LUAR
    // ==========================================

    document.addEventListener("click", function (event) {
        if (!musicSwitcher.contains(event.target)) {
            musicSwitcher.classList.remove("is-open");
            musicSwitcherToggle.setAttribute("aria-expanded", "false");
        }
    });


    // ==========================================
    // 4. MENUTUP MENU DENGAN TOMBOL ESCAPE
    // ==========================================

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            musicSwitcher.classList.remove("is-open");
            musicSwitcherToggle.setAttribute("aria-expanded", "false");
        }
    });


    // ==========================================
    // 5. PERSIAPAN PERPINDAHAN KE HALAMAN 3
    // ==========================================

    const pageThreeLink = musicSwitcher.querySelector(".page-three");

    if (pageThreeLink) {

        pageThreeLink.addEventListener("click", function () {

            sessionStorage.setItem("masukHalamanTiga", "true");

            console.log("Berpindah menuju halaman 3.");

        });

    }


    // ==========================================
    // 6. SINKRONISASI STATUS MENU
    // ==========================================

    musicSwitcherToggle.setAttribute("aria-expanded", "false");

});// ==========================================
// 14. AUTOPLAY MUSIK HALAMAN 3
// ==========================================

audio.volume = 0.7;

async function mulaiMusikOtomatis() {
    try {
        await audio.play();
        playButton.textContent = "Ⅱ";

        console.log("Musik berhasil diputar otomatis.");

    } catch (error) {
        playButton.textContent = "▶";

        console.warn("Autoplay ditolak browser:", error);

        // Musik tetap bisa diputar melalui tombol Play
    }
}

// Coba putar setelah halaman siap
if (document.readyState === "complete") {
    mulaiMusikOtomatis();
} else {
    window.addEventListener("load", mulaiMusikOtomatis, {
        once: true
    });
}

// Sinkronisasi tombol Play/Pause
audio.addEventListener("play", function () {
    playButton.textContent = "Ⅱ";
});

audio.addEventListener("pause", function () {
    playButton.textContent = "▶";
});