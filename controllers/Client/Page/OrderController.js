const ProductModel = require('../../../models/ProductModel');
const CategoryModel = require('../../../models/CategoryModel');
const CartModel = require('../../../models/CartModel');
const UserModel = require('../../../models/UserModel');
const OrderModel = require('../../../models/OrderModel');
const DetailOrderModel = require('../../../models/DetailOrderModel');
const TelegramBot = require('node-telegram-bot-api');
const token = '7559969433:AAGAFp6AQSCcFm1Dmp9SsAJQDXCHlu6p84M';
const { sendOrderEmail } = require('../../../services/sendMaill');
const querystring = require('querystring');
const fs = require("fs");
const path = require("path");
const VnPay = require('../../../services/VnPay');
const { Sequelize } = require('sequelize');

const { v4: uuidv4 } = require('uuid');
class OrderController {
   static async getCheckout(req, res) {
      const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
      const userId = user ? user.id : null;
      let cart = [];
      if (userId) {
         cart = await CartModel.findAll({
            where: { user_id: userId },
            include: [
               {
                  model: UserModel,
                  as: 'user',
                  attributes: ['id'],
               },
               {
                  model: ProductModel,
                  as: 'product',
                  attributes: ['id', 'name', 'price', 'images', 'discount_price', 'weight'],
               },
            ],
         });
      } else {
         cart = req.session.cart || [];
         if (cart.length > 0) {
            cart = await Promise.all(cart.map(async (item) => {
               const product = await ProductModel.findByPk(item.productId, {
                  attributes: ['id', 'name', 'price', 'images', 'discount_price', 'weight'],
               });
               return {
                  ...item,
                  product: product ? product.toJSON() : null,
               };
            }));
         }
      }
      console.log(req.body);
      cart.forEach(item => {
         if (item.product && item.product.images) {
            item.product.images = Array.isArray(item.product.images)
               ? item.product.images
               : [item.product.images];
         }
      });

      res.status(200).render("Client/Page/Cart/checkout", {
         layout: "Client/layout",
         title: "Thanh toán",
         cart,
         userId
      });
   }

   static async create(req, res) {
      try {
         const userId = req.cookies.user ? JSON.parse(req.cookies.user).id : null;
         if (!userId) {
            return res.status(400).json({ message: "Bạn cần đăng nhập để đặt hàng!" });
         }

         const cart = await CartModel.findAll({
            where: { user_id: userId },
            include: [{ model: ProductModel, as: "product", attributes: ["id", "name", "price", "discount_price", "weight"] }],
         });

         if (cart.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng của bạn đang trống!" });
         }

         let totalWeight = 0;
         // let totalPrice = cart.reduce((sum, item) => {
         //    let productPrice = item.product ? (item.product.discount_price || item.product.price) : 0;
         //    return sum + productPrice * item.quantity;
         // }, 0);

         const txnRef = `${uuidv4().substr(0, 8)}${Date.now().toString().slice(-2)}`;
         const finalTotal = parseInt(req.body.finalTotal, 10) * 1000;
         const newOrder = await OrderModel.create({
            user_id: userId,
            name: req.body.name,
            phone: req.body.phone,
            status: req.body.iCheck === '2' ? 0 : 1,
            total: finalTotal,
            address: req.body.address,
            pay: req.body.iCheck || 1,
            note: req.body.note,
            txnRef: txnRef,
         });

         for (const item of cart) {
            let productPrice = item.product ? (item.product.discount_price || item.product.price) : 0;
            await DetailOrderModel.create({
               orderId: newOrder.id,
               productId: item.product.id,
               quantity: item.quantity,
               price: productPrice,
            });
         }

         console.log("finalTotal trước khi gửi VNPay:", finalTotal);
         console.log("finalTotal * 100:", Math.round(finalTotal * 100));

         if (req.body.iCheck === '2') {
            const returnUrl = 'http://localhost:3030/thank';
            const paymentUrl = VnPay.createPaymentUrl(txnRef, finalTotal, returnUrl, req);
            return res.redirect(paymentUrl);
         }

         await CartModel.destroy({ where: { user_id: userId } });

         const email = req.body.email;
         await sendOrderEmail(email, req.body.name, req.body.phone, req.body.address, finalTotal, totalWeight);

         req.session.orderData = {
            order: newOrder.dataValues,
            cart: cart.map(item => ({
               product: item.product.dataValues,
               quantity: item.quantity
            })),
            totalPrice: finalTotal,
            totalWeight: totalWeight
         };

         return res.redirect("/thank");

      } catch (error) {
         console.error("Error in create:", error.message);
         return res.status(500).json({ error: error.message });
      }
   }
   static async paymentVnpay(req, res) {
      try {
         const vnpParams = req.query;
         if (!VnPay.validateReturnUrl(vnpParams)) {
            return res.status(400).send('Chữ ký không hợp lệ!');
         }

         const txnRef = vnpParams['vnp_TxnRef'];
         const paymentStatus = vnpParams['vnp_ResponseCode'];

         const order = await OrderModel.findOne({ where: { txnRef: txnRef } });
         if (!order) {
            return res.status(404).send('Không tìm thấy đơn hàng với mã giao dịch này!');
         }

         if (paymentStatus === '00') {
            await OrderModel.update({ status: 3 }, { where: { txnRef: txnRef } });
            res.redirect('/thank');
         } else {
            res.redirect('/payment-failed');
         }
      } catch (error) {
         console.error("Error in paymentVnpay:", error.message);
         res.status(500).send('Lỗi server');
      }
   }

}

module.exports = OrderController;