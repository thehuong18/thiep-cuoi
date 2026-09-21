// ================================
// FIREBASE
// ================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ================================
// CẤU HÌNH FIREBASE
// ================================

const firebaseConfig = {
    apiKey: "AIzaSyCsKyM4oVminz8NVSuWhxklF8R7a20oD0o",
    authDomain: "thiep-cuoi-d5d37.firebaseapp.com",
    projectId: "thiep-cuoi-d5d37",
    storageBucket: "thiep-cuoi-d5d37.firebasestorage.app",
    messagingSenderId: "549776281872",
    appId: "1:549776281872:web:f57f21cb8e3be5d4355595",
    measurementId: "G-HZ6S51ME78"
};


// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Kết nối Firestore
const db = getFirestore(app);


// ================================
// MỞ THIỆP
// ================================

window.moThiep = function () {

    document.getElementById("noiDung")
        .scrollIntoView({
            behavior: "smooth"
        });

};


// ================================
// GỬI LỜI CHÚC
// ================================

window.guiLoiChuc = async function () {

    const tenInput = document.getElementById("ten");
    const loiChucInput = document.getElementById("loiChuc");

    const ten = tenInput.value.trim();
    const loiChuc = loiChucInput.value.trim();


    // Kiểm tra tên
    if (ten === "") {

        alert("Bạn vui lòng nhập tên nhé ❤️");

        tenInput.focus();

        return;
    }


    // Kiểm tra lời chúc
    if (loiChuc === "") {

        alert("Bạn chưa viết lời chúc 💌");

        loiChucInput.focus();

        return;
    }


    try {

        // Lưu vào Firestore
        await addDoc(
            collection(db, "loi_chuc"),
            {
                ten: ten,
                loiChuc: loiChuc,
                thoiGian: serverTimestamp()
            }
        );


        // Thông báo
        alert("Đã gửi lời chúc thành công! ❤️");


        // Xóa nội dung đã nhập
        tenInput.value = "";
        loiChucInput.value = "";


    } catch (error) {

        console.error("Lỗi gửi lời chúc:", error);

        alert(
            "Không thể gửi lời chúc. Bạn kiểm tra lại kết nối Firebase nhé!"
        );

    }

};


// ================================
// HIỂN THỊ LỜI CHÚC
// ================================

const danhSachLoiChuc =
    document.getElementById("danhSachLoiChuc");


const q = query(
    collection(db, "loi_chuc"),
    orderBy("thoiGian", "desc")
);


onSnapshot(q, (snapshot) => {

    danhSachLoiChuc.innerHTML = "";


    snapshot.forEach((doc) => {

        const data = doc.data();


        // Khối lời chúc
        const item = document.createElement("div");

        item.className = "loi-chuc-item";


        // Tên
        const ten = document.createElement("h4");

        ten.textContent = "♡ " + data.ten;


        // Nội dung
        const noiDung = document.createElement("p");

        noiDung.textContent = data.loiChuc;


        // Đưa vào giao diện
        item.appendChild(ten);

        item.appendChild(noiDung);

        danhSachLoiChuc.appendChild(item);

    });

});