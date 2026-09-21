// ========================================
// NHẠC NỀN
// ========================================
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

document.body.addEventListener('click', () => {
    if (!isPlaying) {
        music.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = '🔊';
        }).catch(e => console.log('Autoplay blocked'));
    }
}, { once: true });

if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            music.pause();
            musicBtn.textContent = '🔇';
        } else {
            music.play();
            musicBtn.textContent = '🔊';
        }
        isPlaying = !isPlaying;
    });
}

// ========================================
// FIREBASE
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
// GỬI LỜI CHÚC & XÁC NHẬN (RSVP)
// CHỈ BẮT BUỘC TÊN VÀ LỜI CHÚC
// ========================================
const rsvpForm = document.getElementById("rsvpForm");
const btnGuiLoiChuc = document.getElementById("btnGuiLoiChuc");

if (rsvpForm) {
    rsvpForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const tenInput = document.getElementById("ten");
        const loiChucInput = document.getElementById("loiChuc");
        const xacNhanInput = document.getElementById("xacNhan");
        const soLuongKhachInput = document.getElementById("soLuongKhach");
        const khachCuaAiInput = document.getElementById("khachCuaAi");

        const ten = tenInput.value.trim();
        const loiChuc = loiChucInput.value.trim();
        const xacNhan = xacNhanInput.value;
        const soLuongKhach = soLuongKhachInput.value;
        const khachCuaAi = khachCuaAiInput.value;

        // Chỉ bắt buộc Tên và Lời chúc
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
                xacNhan: xacNhan || "Chưa xác nhận",      // Mặc định nếu bỏ trống
                soLuongKhach: soLuongKhach || "Chưa rõ",  // Mặc định nếu bỏ trống
                khachCuaAi: khachCuaAi || "Chưa rõ",      // Mặc định nếu bỏ trống
                thoiGian: serverTimestamp()
            });

            alert("💕 Cảm ơn bạn! Thông tin xác nhận đã được gửi.");
            rsvpForm.reset();
            
        } catch (error) {
            console.error("Lỗi Firebase:", error);
            alert("Không thể gửi thông tin.\n\n" + error.message);
        } finally {
            btnGuiLoiChuc.disabled = false;
            btnGuiLoiChuc.textContent = "XÁC NHẬN";
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