

const openInvitation = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");
const weddingMusic = document.getElementById("weddingMusic");
const scrollHint = document.getElementById("scrollHint");

/* ========================================
   DATA DARI CONFIG
======================================== */

const config = weddingConfig;


/* ========================================
   HALAMAN AKTIF
======================================== */

let currentPage = 0;
/* ========================================
   DATA MEMPELAI
======================================== */

// Nama di cover
document.getElementById("coverGroom").textContent =
    config.pria.panggilan;

document.getElementById("coverBride").textContent =
    config.wanita.panggilan;


// Nama di halaman utama
document.getElementById("heroGroom").textContent =
    config.pria.panggilan;

document.getElementById("heroBride").textContent =
    config.wanita.panggilan;


// Nama lengkap
document.getElementById("groomName").textContent =
    config.pria.nama;

document.getElementById("brideName").textContent =
    config.wanita.nama;


// Orang tua
document.getElementById("groomParents").innerHTML =
    "Putra dari<br>" +
    config.pria.orangTua;

document.getElementById("brideParents").innerHTML =
    "Putri dari<br>" +
    config.wanita.orangTua;
    

    /* ========================================
   DATA AKAD NIKAH
======================================== */

document.getElementById("akadTanggal").textContent =
    config.akad.tanggal;

document.getElementById("akadWaktu").textContent =
    config.akad.waktu;

document.getElementById("akadTempat").textContent =
    config.akad.tempat;

document.getElementById("akadAlamat").textContent =
    config.akad.alamat;


/* ========================================
   DATA RESEPSI
======================================== */

document.getElementById("resepsiTanggal").textContent =
    config.resepsi.tanggal;

document.getElementById("resepsiWaktu").textContent =
    config.resepsi.waktu;

document.getElementById("resepsiTempat").textContent =
    config.resepsi.tempat;

document.getElementById("resepsiAlamat").textContent =
    config.resepsi.alamat;


    
/* ========================================
   MENGISI DATA MEMPELAI
======================================== */

const coupleNames = document.querySelectorAll(
    ".hero h2, .closing h2"
);



/* ========================================
   BUKA UNDANGAN + MUSIK
======================================== */

function bukaHalamanUndangan() {
    if (cover) {
        cover.style.display = "none";
    }
const cdSwitch = document.getElementById("cdSwitch");

if (cdSwitch) {
    cdSwitch.style.display = "flex";
}
    if (mainContent) {
        mainContent.style.display = "block";
    }

    if (scrollHint) {
        scrollHint.style.display = "flex";
    }

    currentPage = 0;
    updateSlideAnimation();

    window.scrollTo({
        top: 0,
        behavior: "auto"
    });

    if (weddingMusic) {
        weddingMusic.volume = 0.5;

        weddingMusic.play().catch(function(error) {
            console.log("Musik tidak dapat diputar:", error);
        });
    }
}
// Memulai musik saat pengguna berinteraksi dengan halaman
function mulaiMusik() {
    if (weddingMusic && weddingMusic.paused) {
        weddingMusic.volume = 0.5;

        weddingMusic.play().catch(function(error) {
            console.log("Musik belum dapat diputar:", error);
        });
    }
}

/* Coba putar musik otomatis saat pindah ke halaman kedua */
const paramsMusik = new URLSearchParams(window.location.search);

if (paramsMusik.get("buka") === "1" && weddingMusic) {
    weddingMusic.volume = 0.5;

    weddingMusic.play().catch(function(error) {
        console.log("Autoplay dibatasi browser:", error);
    });
}
//tanda//
document.addEventListener("click", mulaiMusik, { once: true });
document.addEventListener("touchstart", mulaiMusik, { once: true });
// Tombol Buka Undangan tetap berfungsi
if (openInvitation) {
    openInvitation.addEventListener("click", function() {
        bukaHalamanUndangan();
    });
}



/* ========================================
   COUNTDOWN
======================================== */

const weddingDate =
    new Date(
        config.acara.tanggalCountdown
    ).getTime();


const countdown =
    setInterval(function () {

        const now =
            new Date().getTime();

        const distance =
            weddingDate - now;


        const days =
            Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (distance %
                    (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (distance %
                    (1000 * 60 * 60)) /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (distance %
                    (1000 * 60)) /
                1000
            );


        document.getElementById("days").innerText =
            days >= 0 ? days : 0;

        document.getElementById("hours").innerText =
            hours >= 0 ? hours : 0;

        document.getElementById("minutes").innerText =
            minutes >= 0 ? minutes : 0;

        document.getElementById("seconds").innerText =
            seconds >= 0 ? seconds : 0;


        if (distance < 0) {

            clearInterval(countdown);

            document.getElementById("days").innerText = "00";

            document.getElementById("hours").innerText = "00";

            document.getElementById("minutes").innerText = "00";

            document.getElementById("seconds").innerText = "00";

        }

    }, 1000);


/* ========================================
   NAMA TAMU DARI URL
======================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const guestName =
    urlParams.get("to");


if (guestName) {

    const guestElement =
        document.querySelector(".guest");
}

    if (guestName) {
    const guestElement = document.querySelector(".guest");

    if (guestElement) {
        guestElement.innerHTML =
            "Kepada Yth.<br>" +
            "Bapak/Ibu/Saudara/i<br>" +
            "<strong></strong>";

        guestElement.querySelector("strong").textContent =
            guestName.replace(/\+/g, " ");
    }
}
/* ========================================
   SISTEM SLIDE MENYAMBUNG
======================================== */

const slidePages = document.querySelectorAll(
    "#mainContent .hero, #mainContent .section"
);


/* ========================================
   TAMBAHKAN CLASS SLIDE
======================================== */

slidePages.forEach(function(page) {

    page.classList.add("slide-page");

});

// Jika dibuka melalui tombol CD, langsung tampilkan halaman utama
const paramsBuka = new URLSearchParams(window.location.search);

if (paramsBuka.get("buka") === "1") {
    bukaHalamanUndangan();
}


/* ========================================
   UPDATE EFEK SECTION
======================================== */

function updateSlideAnimation() {

    slidePages.forEach(function(page, index) {

        page.classList.remove(
            "active",
            "before",
            "after"
        );


        if (index === currentPage) {

            page.classList.add("active");

        }


        else if (index < currentPage) {

            page.classList.add("before");

        }


        else {

            page.classList.add("after");

        }

    });

}


/* ========================================
   DETEKSI SECTION YANG TERLIHAT
======================================== */

function cekHalamanAktif() {

    const posisiTengah =
        window.innerHeight / 2;


    let halamanTerbaik = 0;

    let jarakTerkecil =
        Infinity;


    slidePages.forEach(function(page, index) {

        const rect =
            page.getBoundingClientRect();


        const tengahSection =
            rect.top + (rect.height / 2);


        const jarak =
            Math.abs(
                tengahSection - posisiTengah
            );


        if (jarak < jarakTerkecil) {

            jarakTerkecil = jarak;

            halamanTerbaik = index;

        }

    });


    

if (halamanTerbaik !== currentPage) {
    currentPage = halamanTerbaik;

    closeDigitalCard(); // Tutup kartu saat pindah halaman

    updateSlideAnimation();
}


}close


/* ========================================
   SCROLL NORMAL
======================================== */

window.addEventListener(
    "scroll",
    cekHalamanAktif
);
/* ========================================
   SCROLL NORMAL

======================================== */
window.addEventListener("scroll", function () {

    if (!scrollHint) return;

    if (window.scrollY <= 10 && currentPage === 0) {

        scrollHint.style.display = "flex";

    } else {

        scrollHint.style.display = "none";

    }

});

/* ========================================
   POSISI AWAL
======================================== */

updateSlideAnimation();



/* Animasi huruf digital berulang pada tombol */

const invitationButton = document.getElementById("openInvitation");

if (invitationButton) {
    const buttonText = "BUKA UNDANGAN";

    invitationButton.innerHTML = [...buttonText]
        .map((letter, index) => {
            const character = letter === " " ? "&nbsp;" : letter;

            return `<span class="digital-letter" style="animation-delay:${index * 0.12}s">${character}</span>`;
        })
        .join("");
}




/* ========================================
   
/* ========================================
   TOMBOL KARTU DIGITAL
======================================== */


const toggleDigitalCard = document.getElementById("toggleDigitalCard");
const digitalCardContent = document.getElementById("digitalCardContent");
const toggleDigitalCardText = document.getElementById("toggleDigitalCardText");
const digitalCardArrow = document.getElementById("digitalCardArrow");

// Fungsi menutup kartu digital
function closeDigitalCard() {
    if (!toggleDigitalCard || !digitalCardContent) return;

    digitalCardContent.hidden = true;
    toggleDigitalCard.classList.remove("is-open");
    toggleDigitalCard.setAttribute("aria-expanded", "false");

    if (toggleDigitalCardText) {
        toggleDigitalCardText.textContent = "BUKA KARTU DIGITAL";
    }

    if (digitalCardArrow) {
        digitalCardArrow.textContent = "↓";
    }
}

// Tombol buka dan tutup kartu digital
if (toggleDigitalCard && digitalCardContent) {
    toggleDigitalCard.addEventListener("click", function () {
        const isOpening = digitalCardContent.hidden;

        digitalCardContent.hidden = !isOpening;

        toggleDigitalCard.classList.toggle("is-open", isOpening);
        toggleDigitalCard.setAttribute(
            "aria-expanded",
            String(isOpening)
        );

        if (toggleDigitalCardText) {
            toggleDigitalCardText.textContent = isOpening
                ? "TUTUP KARTU DIGITAL"
                : "BUKA KARTU DIGITAL";
        }

        if (digitalCardArrow) {
            digitalCardArrow.textContent = isOpening ? "↑" : "↓";
        }
    });
}








/* ========================================
   TOMBOL GOOGLE MAPS
======================================== */

const mapsUrl = config.lokasi.googleMaps;

const countdownMaps = document.getElementById("countdownMaps");
const akadMaps = document.getElementById("akadMaps");
const resepsiMaps = document.getElementById("resepsiMaps");

if (countdownMaps) {
    countdownMaps.href = mapsUrl;
}

if (akadMaps) {
    akadMaps.href = mapsUrl;
}

if (resepsiMaps) {
    resepsiMaps.href = mapsUrl;
}
