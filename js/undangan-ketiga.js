
// ==========================================
// 1. MENGAMBIL ELEMEN HTML
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
// 2. PENGATURAN PERUBAHAN WARNA FOTO
// ==========================================

// Detik ke-49 foto mulai berubah warna
const COLOR_START = 49;

// Durasi transisi perubahan warna
const COLOR_DURATION = 4;


// ==========================================
// 3. KATA-KATA ROMANTIS
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
// 4. MEMBUAT ANIMASI ALIRAN KATA
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
// 5. FORMAT WAKTU MUSIK
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
// 6. EFEK FOTO HITAM PUTIH MENJADI BERWARNA
// ==========================================

function updatePhoto() {

    const time = audio.currentTime;

    let progress = (time - COLOR_START) / COLOR_DURATION;

    progress = Math.max(0, Math.min(1, progress));

    const saturation = progress * 100;

    const brightness = 0.65 + (progress * 0.35);

    // Mengubah foto hitam putih menjadi berwarna
    photo.style.filter =
        `grayscale(${100 - saturation}%) brightness(${brightness})`;

    // Kata-kata menghilang secara perlahan
    if (lyricRain) {
        lyricRain.style.opacity = 1 - progress;
    }

    // Nama Amar dan Mariam mulai muncul
    if (coupleNames) {
        coupleNames.style.opacity = progress;
    }
}


// ==========================================
// 7. MEMBACA DURASI MUSIK
// ==========================================

audio.addEventListener("loadedmetadata", () => {

    timeline.max = audio.duration;

    durationText.textContent = formatTime(audio.duration);

});


// ==========================================
// 8. TOMBOL PLAY DAN PAUSE
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
// 9. MEMPERBARUI TIMELINE SAAT MUSIK BERJALAN
// ==========================================

audio.addEventListener("timeupdate", () => {

    timeline.value = audio.currentTime;

    currentTimeText.textContent =
        formatTime(audio.currentTime);

    updatePhoto();

});


// ==========================================
// 10. MENGGESER MUSIK MAJU ATAU MUNDUR
// ==========================================

timeline.addEventListener("input", () => {

    audio.currentTime = Number(timeline.value);

    currentTimeText.textContent =
        formatTime(audio.currentTime);

    updatePhoto();

});


// ==========================================
// 11. PENGATURAN VOLUME
// ==========================================

volume.addEventListener("input", () => {

    audio.volume = Number(volume.value);

});


// ==========================================
// 12. KONDISI AWAL
// ==========================================

audio.volume = 0.7;

updatePhoto();


// ==========================================
// 13. SAAT MUSIK SELESAI
// ==========================================

audio.addEventListener("ended", () => {

    playButton.textContent = "▶";

});
