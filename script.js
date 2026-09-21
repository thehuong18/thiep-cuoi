// ========================================
// FIREBASE
// ========================================

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


// Khởi tạo Firebase

const app = initializeApp(firebaseConfig);


// Kết nối Firestore

const db = getFirestore(app);


// ========================================
// MỞ THIỆP
// ========================================

const btnMoThiep =
    document.getElementById("btnMoThiep");


btnMoThiep.addEventListener("click", function () {

    document
        .getElementById("noiDung")
        .scrollIntoView({
            behavior: "smooth"
        });

});


// ========================================
// GỬI LỜI CHÚC
// ========================================

const btnGuiLoiChuc =
    document.getElementById("btnGuiLoiChuc");


btnGuiLoiChuc.addEventListener(
    "click",
    async function () {

        const tenInput =
            document.getElementById("ten");

        const loiChucInput =
            document.getElementById("loiChuc");


        const ten =
            tenInput.value.trim();

        const loiChuc =
            loiChucInput.value.trim();


        // ----------------------------
        // Kiểm tra tên
        // ----------------------------

        if (ten === "") {

            alert(
                "Bạn vui lòng nhập tên nhé ❤️"
            );

            tenInput.focus();

            return;
        }


        // ----------------------------
        // Kiểm tra lời chúc
        // ----------------------------

        if (loiChuc === "") {

            alert(
                "Bạn vui lòng viết lời chúc nhé 💌"
            );

            loiChucInput.focus();

            return;
        }


        // ----------------------------
        // Khóa nút trong lúc gửi
        // ----------------------------

        btnGuiLoiChuc.disabled = true;

        btnGuiLoiChuc.textContent =
            "Đang gửi...";


        try {

            // ----------------------------
            // Lưu vào Firestore
            // ----------------------------

            await addDoc(
                collection(db, "loi_chuc"),
                {

                    ten: ten,

                    loiChuc: loiChuc,

                    thoiGian:
                        serverTimestamp()

                }
            );


            // ----------------------------
            // Thành công
            // ----------------------------

            alert(
                "💕 Cảm ơn bạn! Lời chúc đã được gửi."
            );


            // Xóa form

            tenInput.value = "";

            loiChucInput.value = "";


        } catch (error) {

            console.error(
                "Lỗi Firebase:",
                error
            );


            alert(
                "Không thể gửi lời chúc.\n\n" +
                error.message
            );


        } finally {

            btnGuiLoiChuc.disabled = false;

            btnGuiLoiChuc.textContent =
                "💕 Gửi lời chúc";

        }

    }
);


// ========================================
// HIỂN THỊ LỜI CHÚC
// ========================================

const danhSachLoiChuc =
    document.getElementById(
        "danhSachLoiChuc"
    );


const q = query(
    collection(db, "loi_chuc"),
    orderBy("thoiGian", "desc")
);


onSnapshot(

    q,

    function (snapshot) {

        danhSachLoiChuc.innerHTML = "";


        snapshot.forEach(
            function (doc) {

                const data =
                    doc.data();


                // Tạo khung

                const item =
                    document.createElement("div");

                item.className =
                    "loi-chuc-item";


                // Tên

                const ten =
                    document.createElement("h4");

                ten.textContent =
                    "♡ " +
                    (data.ten || "Một người bạn");


                // Lời chúc

                const loiChuc =
                    document.createElement("p");

                loiChuc.textContent =
                    data.loiChuc || "";


                item.appendChild(ten);

                item.appendChild(loiChuc);


                danhSachLoiChuc
                    .appendChild(item);

            }
        );

    },

    function (error) {

        console.error(
            "Lỗi đọc lời chúc:",
            error
        );

    }

);