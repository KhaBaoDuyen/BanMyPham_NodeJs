const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'duyenktbpc08750@gmail.com',
      pass: 'twnp yvad rhvr hepd '
   }
});

async function sendOrderEmail(email, name, phone, address, totalPrice, totalWeight) {
   const subject = 'Thông báo đơn hàng thành công';
   const html = `
Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!

Đơn hàng của bạn đã được xác nhận thành công với thông tin chi tiết như sau:

**Ngày, giờ đặt hàng**: ${new Date().toLocaleString()}

**Tên khách hàng**: ${name}

**Số điện thoại**: ${phone}

**Địa chỉ**: ${address}

**Tổng giá trị đơn hàng**: ${totalPrice} VND

**Tổng trọng lượng**: ${totalWeight} kg

**Tình trạng đơn hàng**: Đã xác nhận

Xin chân thành cảm ơn.

`;

   const mailOptions = {
      from: 'duyenktbpc08750@gmail.com',
      to: email,
      subject: subject,
      text: html,
   };

   try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email đã được gửi thành công!", info);
   } catch (error) {
      console.error("Lỗi khi gửi email:", error);
   }
}

module.exports = { sendOrderEmail };
