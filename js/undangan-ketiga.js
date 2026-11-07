// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

const audio = document.getElementById("weddingAudio");
const photo = document.getElementById("couplePhoto");

const playButton = document.getElementById("playButton");
const timeline = document.getElementById("musicTimeline");
const volume = document.getElementById("volumeControl");

const currentTimeText = document.getElementById("currentTime");
const durationText = document.getElementById("duration");

const lyricRain = document.getElementById("lyricRain");
const coupleNames = document.getElementById("coupleNames");


// ==========================================
// 2. PHOTO COLOR TRANSITION SETTINGS
// ==========================================

// The photo starts changing color at second 49
const COLOR_START = 49;

// Duration of the color transition
const COLOR_DURATION = 4;


// ==========================================
// 3. ROMANTIC WORDS
// ==========================================

const romanticWords = [
     "Mungkin aku telah menanti lama",
    "Tapi ternyata tak sia-sia",
    "Tuhan berikan malaikat surga",
    "Izinkan ku berjalan bersamamu",
    "Mimpi yang telah lama kudambakan",
    "Kau adalah semua jawaban",
    "Dari doa yang kupanjatkan",
    "Dengan hadirmu di hidupku",
    "Sudah ku merasa cukup",
    "Izinkan ku berjalan bersamamu",
    "Mimpi yang telah lama kudambahkan",
    "Kini semua terasa indah",
    "Hitam putih pun mulai berwarna",
    "Dari doa yang kupanjatkan",
    "Dengan hadirmu di hidupku",
    "Sudah ku merasa cukup",
    "Engkaulah jawaban untuk hatiku",
    "Hati ini telah menetapkan",
    "Engkau sosok yang 'kan temani",
    "Di masa ini, di masa nanti",
    "Dan masa indah lainnya",
    "Semua kata yang terucap",
    "Semua tertuju padamu, oh",
    "Semua arah yang kutempuh",
    "Semua tertuju padamu",
    "Kau adalah semua jawaban",
    "Dari doa yang kupanjatkan",
    "Dengan hadirmu di hidupku",
    "Sudah ku merasa cukup",
    "Engkaulah jawaban untuk hatiku",
    "Hati ini telah menetapkan",
    "Engkau sosok yang 'kan menemaniku",
    "Di masa ini, di masa nanti",
    "dan masa indah lainnya",
    "Di masa ini, masa nanti",
    "Dan masa indah lainnya"
];

// ==========================================
// 4. CREATE THE WORD FLOW ANIMATION
// ==========================================

if (lyricRain) {

    for (let i = 0; i < 9; i++) {

        const column = document.createElement("div");

        column.className = "lyric-column";

        column.textContent = Array(5)
            .fill(romanticWords)
            .flat()
            .sort(() => Math.random() - 0.5)
            .join("  ");

        column.style.animationDelay = `${-i * 2}s`;

        lyricRain.appendChild(column);
    }
}


// ==========================================
// 5. FORMAT MUSIC TIME
// ==========================================

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "00:00";
    }

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return (
        String(min).padStart(2, "0") +
        ":" +
        String(sec).padStart(2, "0")
    );
}


// ==========================================
// 6. BLACK AND WHITE TO COLOR PHOTO EFFECT
// ==========================================

function updatePhoto() {

    const time = audio.currentTime;

    let progress = (time - COLOR_START) / COLOR_DURATION;

    progress = Math.max(0, Math.min(1, progress));

    const saturation = progress * 100;

    const brightness = 0.65 + (progress * 0.35);

    // Transform the black and white photo into color
    photo.style.filter =
        `grayscale(${100 - saturation}%) brightness(${brightness})`;

    // Gradually fade out the words
    if (lyricRain) {
        lyricRain.style.opacity = 1 - progress;
    }

    // Start displaying Amar and Mariam's names
    if (coupleNames) {
        coupleNames.style.opacity = progress;
    }
}


// ==========================================
// 7. READ MUSIC DURATION
// ==========================================

audio.addEventListener("loadedmetadata", () => {

    timeline.max = audio.duration;

    durationText.textContent = formatTime(audio.duration);

});


// ==========================================
// 8. PLAY AND PAUSE BUTTON
// ==========================================

playButton.addEventListener("click", async () => {

    if (audio.paused) {

        try {

            await audio.play();

            playButton.textContent = "Ⅱ";

        } catch (error) {

            console.error("Musik gagal diputar:", error);

            alert("Musik gagal diputar. Periksa file MP3.");

        }

    } else {

        audio.pause();

        playButton.textContent = "▶";

    }

});


// ==========================================
// 9. UPDATE TIMELINE WHILE MUSIC IS PLAYING
// ==========================================

audio.addEventListener("timeupdate", () => {

    timeline.value = audio.currentTime;

    currentTimeText.textContent =
        formatTime(audio.currentTime);

    updatePhoto();

});


// ==========================================
// 10. SEEK MUSIC FORWARD OR BACKWARD
// ==========================================

timeline.addEventListener("input", () => {

    audio.currentTime = Number(timeline.value);

    currentTimeText.textContent =
        formatTime(audio.currentTime);

    updatePhoto();

});


// ==========================================
// 11. VOLUME CONTROL
// ==========================================

volume.addEventListener("input", () => {

    audio.volume = Number(volume.value);

});


// ==========================================
// 12. INITIAL STATE
// ==========================================

audio.volume = 0.7;

updatePhoto();


// ==========================================
// 13. WHEN THE MUSIC ENDS
// ==========================================

audio.addEventListener("ended", () => {

    playButton.textContent = "▶";

});


// ==========================================
// 14. AUTOMATIC MUSIC WHEN ENTERING PAGE 3
// ==========================================

async function mulaiMusikOtomatis() {
    try {
        await audio.play();
        playButton.textContent = "Ⅱ";
        console.log("Musik halaman 3 berhasil diputar.");
    } catch (error) {
        playButton.textContent = "▶";
        console.log("Autoplay dibatasi browser. Silakan tekan tombol Play.");
    }
}

// Try to play music when the page is opened
mulaiMusikOtomatis();

// Synchronize the button with the audio state
audio.addEventListener("play", () => {
    playButton.textContent = "Ⅱ";
});

audio.addEventListener("pause", () => {
    playButton.textContent = "▶";
});