
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAjiolgPaA3Mv97Lm-2PRr41JC5zypiuL4",
    authDomain: "undangan-amariam.firebaseapp.com",
    projectId: "undangan-amariam",
    storageBucket: "undangan-amariam.firebasestorage.app",
    messagingSenderId: "993861148652",
    appId: "1:993861148652:web:dd52dca955999b6c462ac9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
