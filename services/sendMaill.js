const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'duyenktbpc08750@gmail.com',
      pass: 'qwch ajvp bymm hqcc'
   }
});

async function sendOrderEmail(email, name, phone, address, totalPrice, totalWeight) {
   const subject = 'Thông báo đơn hàng thành công';
   const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Xác nhận đơn hàng</title>
   <style>
      body {
         font-family: Arial, sans-serif;
         background-color: #f5f5f5;
         padding: 20px;
      }
      .container {
         max-width: 600px;
         margin: auto;
         background: white;
         padding: 20px;
         border-radius: 10px;
         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
         color: #07503d;
         text-align: center;
      }
      .info-table {
         width: 100%;
         border-collapse: collapse;
         margin-top: 10px;
      }
      .info-table th, .info-table td {
         padding: 10px;
         border: 1px solid #ddd;
         text-align: left;
      }
      .info-table th {
         background-color: #07503d;
         color: white;
      }
      .info-table tr:nth-child(even) {
         background-color: #f9f9f9;
      }
      .footer {
         margin-top: 20px;
         text-align: center;
         font-size: 14px;
         color: #555;
      }
   </style>
</head>
<body>

<div class="container">
   <h2>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</h2>
   <p>Đơn hàng của bạn đã được xác nhận thành công với thông tin chi tiết như sau:</p>

   <table class="info-table">
      <tr>
         <th>Ngày, giờ đặt hàng</th>
         <td>${new Date().toLocaleString()}</td>
      </tr>
      <tr>
         <th>Tên khách hàng</th>
         <td>${name}</td>
      </tr>
      <tr>
         <th>Số điện thoại</th>
         <td>${phone}</td>
      </tr>
      <tr>
         <th>Địa chỉ</th>
         <td>${address}</td>
      </tr>
      <tr>
         <th>Tổng trọng lượng</th>
         <td>${totalWeight} kg</td>
      </tr>
      <tr>
         <th>Tình trạng đơn hàng</th>
         <td><strong style="color: #07503d;">Đã xác nhận</strong></td>
      </tr>
   </table>

   <p class="footer">Xin chân thành cảm ơn và mong bạn sẽ tiếp tục ủng hộ cửa hàng của chúng tôi!</p>
</div>

</body>
</html>
`;


   const mailOptions = {
      from: '"BOOLM" <duyenktbpc08750@gmail.com>',
      to: email,
      subject: subject,
      html: html,
   };

   try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email xác nhận đơn hàng đã được gửi thành công!", info);
   } catch (error) {
      console.error("Lỗi khi gửi email xác nhận đơn hàng:", error);
   }
}

async function sendMailStock(email, productName, stock) {
   const subject = 'Cảnh báo: Sản phẩm sắp hết hàng';
   const html = `
      <p>Xin chào,</p>
      <p>Sản phẩm <strong>${productName}</strong> trong kho của bạn hiện chỉ còn <strong>${stock}</strong> sản phẩm.</p>
      <p>Vui lòng kiểm tra và nhập thêm hàng để đảm bảo không bị gián đoạn kinh doanh.</p>
      <p>Trân trọng,</p>
      <p><strong>BOOLM</strong></p>
   `;

   const mailOptions = {
      from: '"BLOOM" <duyenktbpc08750@gmail.com>',
      to: email,
      subject: subject,
      html: html,
   };

   try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email cảnh báo stock đã được gửi thành công!", info);
   } catch (error) {
      console.error("Lỗi khi gửi email cảnh báo stock:", error);
   }
}

module.exports = { sendOrderEmail, sendMailStock };
