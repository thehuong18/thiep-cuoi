// ========================================
// FIREBASE (Sử dụng phiên bản 10.12.2 ổn định)
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ========================================
// FIREBASE CONFIG
// ========================================
const firebaseConfig = {
    apiKey: "AIzaSyCsKyM4oVminz8NVSuWhxklF8R7a20oD0o",
    authDomain: "thiep-cuoi-d5d37.firebaseapp.com",
    projectId: "thiep-cuoi-d5d37",
    storageBucket: "thiep-cuoi-d5d37.firebasestorage.app",
    messagingSenderId: "549776281872",
    appId: "1:549776281872:web:f57f21cb8e3be5d4355595",
    measurementId: "G-HZ6S51ME78"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================================
// GỬI LỜI CHÚC
// ========================================
const btnGuiLoiChuc = document.getElementById("btnGuiLoiChuc");

if (btnGuiLoiChuc) {
    btnGuiLoiChuc.addEventListener("click", async function () {
        const tenInput = document.getElementById("ten");
        const loiChucInput = document.getElementById("loiChuc");
        const ten = tenInput.value.trim();
        const loiChuc = loiChucInput.value.trim();

        if (ten === "") {
            alert("Bạn vui lòng nhập tên nhé ❤️");
            tenInput.focus();
            return;
        }

        if (loiChuc === "") {
            alert("Bạn vui lòng viết lời chúc nhé 💌");
            loiChucInput.focus();
            return;
        }

        btnGuiLoiChuc.disabled = true;
        btnGuiLoiChuc.textContent = "Đang gửi...";

        try {
            await addDoc(collection(db, "loi_chuc"), {
                ten: ten,
                loiChuc: loiChuc,
                thoiGian: serverTimestamp()
            });

            alert("💕 Cảm ơn bạn! Lời chúc đã được gửi.");
            tenInput.value = "";
            loiChucInput.value = "";
        } catch (error) {
            console.error("Lỗi Firebase:", error);
            alert("Không thể gửi lời chúc.\n\n" + error.message);
        } finally {
            btnGuiLoiChuc.disabled = false;
            btnGuiLoiChuc.textContent = "💕 Gửi lời chúc";
        }
    });
}

// ========================================
// HIỂN THỊ LỜI CHÚC
// ========================================
const danhSachLoiChuc = document.getElementById("danhSachLoiChuc");

if (danhSachLoiChuc) {
    const q = query(collection(db, "loi_chuc"), orderBy("thoiGian", "desc"));

    onSnapshot(q, function (snapshot) {
        danhSachLoiChuc.innerHTML = "";
        snapshot.forEach(function (doc) {
            const data = doc.data();
            const item = document.createElement("div");
            item.className = "loi-chuc-item";
            
            const ten = document.createElement("h4");
            ten.textContent = "♡ " + (data.ten || "Một người bạn");
            
            const loiChuc = document.createElement("p");
            loiChuc.textContent = data.loiChuc || "";
            
            item.appendChild(ten);
            item.appendChild(loiChuc);
            danhSachLoiChuc.appendChild(item);
        });
    }, function (error) {
        console.error("Lỗi đọc lời chúc:", error);
    });
}