document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GET MUSIC SWITCHER MENU ELEMENTS
    // ==========================================

    const musicSwitcher = document.querySelector(".music-switcher");
    const musicSwitcherToggle = document.getElementById("musicSwitcherToggle");

    if (!musicSwitcher || !musicSwitcherToggle) {
        console.error("Music Switcher menu not found!");
        return;
    }


    // ==========================================
    // 2. OPEN AND CLOSE THE MENU
    // ==========================================

    musicSwitcherToggle.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();

        musicSwitcher.classList.toggle("is-open");

        const isOpen = musicSwitcher.classList.contains("is-open");

        musicSwitcherToggle.setAttribute("aria-expanded", isOpen);

        console.log("Menu status:", isOpen);
    };


    // ==========================================
    // 3. CLOSE THE MENU WHEN CLICKING OUTSIDE
    // ==========================================

    document.addEventListener("click", function (event) {
        if (!musicSwitcher.contains(event.target)) {
            musicSwitcher.classList.remove("is-open");
            musicSwitcherToggle.setAttribute("aria-expanded", "false");
        }
    });


    // ==========================================
    // 4. CLOSE THE MENU USING THE ESCAPE KEY
    // ==========================================

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            musicSwitcher.classList.remove("is-open");
            musicSwitcherToggle.setAttribute("aria-expanded", "false");
        }
    });


    // ==========================================
    // 5. PREPARE NAVIGATION TO PAGE 3
    // ==========================================

    const pageThreeLink = musicSwitcher.querySelector(".page-three");

    if (pageThreeLink) {

        pageThreeLink.addEventListener("click", function () {

            sessionStorage.setItem("masukHalamanTiga", "true");

            console.log("Navigating to page 3.");

        });

    }


    // ==========================================
    // 6. SYNCHRONIZE MENU STATE
    // ==========================================

    musicSwitcherToggle.setAttribute("aria-expanded", "false");

});


// ==========================================
// 14. AUTOPLAY MUSIC ON PAGE 3
// ==========================================

audio.volume = 0.7;

async function mulaiMusikOtomatis() {
    try {
        await audio.play();
        playButton.textContent = "Ⅱ";

        console.log("Music started playing automatically.");

    } catch (error) {
        playButton.textContent = "▶";

        console.warn("Autoplay was blocked by the browser:", error);

        // Music can still be played using the Play button
    }
}

// Attempt to play music after the page is ready
if (document.readyState === "complete") {
    mulaiMusikOtomatis();
} else {
    window.addEventListener("load", mulaiMusikOtomatis, {
        once: true
    });
}

// Synchronize the Play/Pause button
audio.addEventListener("play", function () {
    playButton.textContent = "Ⅱ";
});

audio.addEventListener("pause", function () {
    playButton.textContent = "▶";
});