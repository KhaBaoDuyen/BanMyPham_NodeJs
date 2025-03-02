const TelegramBot = require('node-telegram-bot-api');
const UserModel = require('../models/UserModel');

// Token bot từ BotFather
const token = '7559969433:AAGAFp6AQSCcFm1Dmp9SsAJQDXCHlu6p84M';
const bot = new TelegramBot(token, { polling: true });  // Đảm bảo polling: true

// Hàm gửi tin nhắn xác nhận đơn hàng
// Sau khi bot đã gửi tin nhắn xác nhận
async function sendOrderConfirmation(chatId, orderDetails) {
   try {
      const message = `Đơn hàng của bạn đã được xác nhận thành công!\n\nChi tiết đơn hàng:\n${orderDetails}`;
      console.log("Gửi tin nhắn tới chatId:", chatId);  // Debug log
      await bot.sendMessage(chatId, message);

      // Dừng polling sau khi gửi tin nhắn xác nhận
      bot.stopPolling();  // Dừng polling khi không cần nhận thêm tin nhắn nữa
   } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error.message);
   }
}


// Lắng nghe tin nhắn khi người dùng gửi /start
bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   
   try {
      const user = await UserModel.findOne({ where: { chatId: chatId } });
      
      if (user) {
         return bot.sendMessage(chatId, 'Chào bạn! Cảm ơn đã sử dụng dịch vụ của chúng tôi.');
      }
      
      await UserModel.update({ chatId: chatId }, { where: { id: msg.from.id } });
      bot.sendMessage(chatId, 'Chào bạn! Cảm ơn đã sử dụng dịch vụ của chúng tôi.');
   } catch (error) {
      console.error("Lỗi khi lưu chatId:", error.message);
      bot.sendMessage(chatId, 'Có lỗi xảy ra khi lưu thông tin của bạn.');
   }
});

// Đừng gọi stopPolling() ngay lập tức, chỉ dừng polling khi cần thiết
// bot.stopPolling(); // Chỉ gọi khi muốn dừng polling

module.exports = { sendOrderConfirmation };  // Export bot để dùng trong server.js 
