

const openInvitation = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");
const weddingMusic = document.getElementById("weddingMusic");
/* ========================================
   DATA DARI CONFIG
======================================== */

const config = weddingConfig;

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
   TOMBOL BUKA UNDANGAN + MUSIK
======================================== */

openInvitation.addEventListener("click", function () {

    cover.style.display = "none";

    mainContent.style.display = "block";

    currentPage = 0;
    updateSlideAnimation();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    /* MUSIK */

    if (weddingMusic) {

        weddingMusic.volume = 0.5;

        weddingMusic.play().catch(function(error) {
            console.log("Musik tidak dapat diputar:", error);
        });

    }

});
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


    guestElement.innerHTML =
        "Kepada Yth.<br>" +
        "Bapak/Ibu/Saudara/i<br>" +
        "<strong>" +
        decodeURIComponent(guestName) +
        "</strong>";

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


/* ========================================
   HALAMAN AKTIF
======================================== */

let currentPage = 0;


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

        updateSlideAnimation();

    }
}


/* ========================================
   SCROLL NORMAL
======================================== */

window.addEventListener(
    "scroll",
    cekHalamanAktif
);


/* ========================================
   POSISI AWAL
======================================== */

updateSlideAnimation();
