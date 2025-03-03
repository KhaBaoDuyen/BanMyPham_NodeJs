const ProductModel = require('../../../models/ProductModel');
const CategoryModel = require('../../../models/CategoryModel');
const CartModel = require('../../../models/CartModel');
const UserModel = require('../../../models/UserModel');
const OrderModel = require('../../../models/OrderModel');
const DetailOrderModel = require('../../../models/DetailOrderModel');
const TelegramBot = require('node-telegram-bot-api');
const token = '7559969433:AAGAFp6AQSCcFm1Dmp9SsAJQDXCHlu6p84M';
const { sendOrderEmail, sendMailStock } = require('../../../services/sendMaill');
const querystring = require('querystring');
const fs = require("fs");
const path = require("path");
const VnPayService = require('../../../services/VnPay');
const { Sequelize, Op } = require('sequelize');

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
               const product = await ProductModel.findOne({
                  where: {
                     id: item.productId,
                     stock: { [Op.gt]: 0 }, // Chỉ lấy sản phẩm có stock > 0
                     status: 1 // Chỉ lấy sản phẩm có status == 1
                  },
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

         const user = await UserModel.findOne({
            where: { id: userId },
            attributes: ['id', 'email', 'name'],
         });

         const cart = await CartModel.findAll({
            where: { user_id: userId },
            include: [{ model: ProductModel, as: "product", attributes: ["id", "name", "price", "discount_price", "weight", "stock"] }],
         });

         if (cart.length === 0) {
            res.redirect("/");
            return req.flash("success", "Giỏ hàng trống")
         }

         for (const item of cart) {
            if (item.product.stock < item.quantity) {
               return res.status(400).send({ message: `Sản phẩm ${item.product.name} không đủ số lượng trong kho!` });
            }
         }

         let totalWeight = cart.reduce((sum, item) => sum + (item.product.weight || 0) * item.quantity, 0);
         const txnRef = `${uuidv4().substr(0, 8)}${Date.now().toString().slice(-2)}`;
         const finalTotal = parseInt(req.body.finalTotal, 10) * 1000;

         const newOrder = await OrderModel.create({
            user_id: userId,
            name: req.body.name || user.name,
            phone: req.body.phone,
            email: user.email || req.body.email,
            status: 1,
            payment_status: 0,
            total: finalTotal,
            address: req.body.address,
            pay: req.body.iCheck || 1,
            note: req.body.note,
            txnRef: txnRef,
         });

         for (const item of cart) {
            let productPrice = item.product.discount_price || item.product.price;
            await DetailOrderModel.create({
               orderId: newOrder.id,
               productId: item.product.id,
               quantity: item.quantity,
               price: productPrice,
            });
         }

         req.session.orderData = {
            order: newOrder.dataValues,
            cart: cart.map(item => ({
               product: item.product.dataValues,
               quantity: item.quantity
            })),
            totalPrice: finalTotal,
            totalWeight: totalWeight
         };

         if (req.body.iCheck === '2') {
            const returnUrl = 'https://0a5c-1-54-251-110.ngrok-free.app/vnpay_return';
            const paymentUrl = VnPayService.createPaymentUrl(txnRef, finalTotal, returnUrl, req);
            req.session.save((err) => {
               if (err) {
                  console.error("Error saving session:", err);
                  return res.status(500).json({ error: "Lỗi khi lưu session" });
               }
               return res.redirect(paymentUrl);
            });
         } else {
            // Thanh toán COD
            for (const item of cart) {
               const newStock = item.product.stock - item.quantity;
               await ProductModel.update({ stock: newStock }, { where: { id: item.product.id } });
               if (newStock < 3) {
                  await sendMailStock('duyenktbpc08750@gmail.com', item.product.name, newStock);
               }
            }

            await CartModel.destroy({ where: { user_id: userId } });

            try {
               await sendOrderEmail(user.email, req.body.name || user.name, req.body.phone, req.body.address, finalTotal, totalWeight);
            } catch (emailError) {
               console.error("Gui that bai:", emailError.message);
            }

            req.session.save((err) => {
               if (err) {
                  console.error("Error sessstion:", err);
                  return res.status(500).json({ error: "Lỗi khi lưu session" });
               }
               return res.redirect("/thank");
            });
         }
      } catch (error) {
         console.error("loi them vao csdl:", error.message);
         return res.status(500).json({ error: error.message });
      }
   }

   static async vnpayReturn(req, res) {
      try {
         const vnpParams = req.query;
         if (!VnPayService.validateReturnUrl(vnpParams)) {
            return res.status(400).send('Chữ ký không hợp lệ!');
         }

         const txnRef = vnpParams['vnp_TxnRef'];
         const paymentStatus = vnpParams['vnp_ResponseCode'];

         const order = await OrderModel.findOne({
            where: { txnRef: txnRef },
            include: [{ model: DetailOrderModel, as: 'details', include: [{ model: ProductModel, as: 'product' }] }],
         });

         if (!order) {
            return res.status(404).send('Không tìm thấy đơn hàng với mã giao dịch này!');
         }

         if (paymentStatus === '00') {
            await OrderModel.update({ payment_status: 0 }, { where: { txnRef: txnRef } });

            for (const detail of order.details) {
               const product = detail.product;
               const newStock = product.stock - detail.quantity;
               await ProductModel.update({ stock: newStock }, { where: { id: product.id } });
               if (newStock < 3) {
                  await sendMailStock('duyenktbpc08750@gmail.com', product.name, newStock);
               }
            }

            const user = await UserModel.findOne({
               where: { id: order.user_id },
               attributes: ['email'],
            });
            const emailToSend = req.body.email || user ? user.email : null;
            console.log("Sending order email to:", emailToSend);
            await sendOrderEmail(emailToSend, order.name, order.phone, order.address, order.total, 0);

            await CartModel.destroy({ where: { user_id: order.user_id } });

            const cart = order.details.map(detail => ({
               product: detail.product.dataValues,
               quantity: detail.quantity
            }));

            req.session.orderData = {
               order: order.dataValues,
               cart: cart,
               totalPrice: order.total,
               totalWeight: 0
            };

            res.redirect('/thank');
         } else {
            await OrderModel.update({ status: 0 }, { where: { txnRef: txnRef } });
            res.redirect('/payment-failed');
         }
      } catch (error) {
         console.error("Error in vnpayReturn:", error.message);
         res.status(500).send('Lỗi server');
      }
   }

//----------------[ THANK ]-------------------
   static async thank(req, res) {
      try {
         console.log("Session:", req.session);
         const orderData = req.session.orderData;
         console.log(orderData);
         if (!orderData) {
            return res.status(400).send('Không tìm thấy thông tin đơn hàng trong session!');
         }

         res.render('Client/Page/Cart/thank', {
            layout: "Client/layout",
            title: " Cảm ơn",
            orderData: orderData
         });

         req.session.orderData = null;
      } catch (error) {
         console.error("Error:", error.message);
         res.status(500).send('Lỗi server');
      }
   }

//----------------[ COUNT PRODUCT ]--------------

}

module.exports = OrderController;