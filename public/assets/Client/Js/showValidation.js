// document.querySelectorAll("form").forEach(form => {
//     form.addEventListener("submit", async function (event) {
//         event.preventDefault(); // Ngăn chặn submit mặc định

//         const formData = new FormData(this);
//         const data = Object.fromEntries(formData.entries());

//         // Xóa thông báo lỗi cũ
//         this.querySelectorAll(".error-message").forEach(el => el.textContent = "");

//         try {
//             const response = await fetch(this.action, { 
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data)
//             });

//             const result = await response.json();
//             console.log("Server Response:", result); // 🛠 Debug log

//             if (!response.ok && result.errors) {
//                 Object.entries(result.errors).forEach(([field, message]) => {
//                     const errorElement = this.querySelector(`#error-${field}`);
//                     if (errorElement) {
//                         errorElement.textContent = message; // Hiển thị lỗi dưới input
//                     }
//                 });
//             } else {
//                 alert("Form hợp lệ! Gửi đơn hàng...");
//                 this.submit();
//             }
//         } catch (error) {
//             console.error("Lỗi khi gửi form:", error);
//         }
//     });
// });
