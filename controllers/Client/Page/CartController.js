const ProductModel = require('../../../models/ProductModel');
const CategoryModel = require('../../../models/CategoryModel');
const CartModel = require('../../../models/CartModel');
const UserModel = require('../../../models/UserModel');
const fs = require("fs");
const path = require("path");
const {
   Sequelize
} = require('sequelize');

class CartController {

static async getCart(req, res) {
   try {
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
                  attributes: ['id', 'name', 'price', 'images', 'discount_price', 'weight', 'stock'],
               },
            ],
         });

         cart = cart.filter(item => item.product && item.product.stock > 0);
      }

      cart.forEach(item => {
         if (item.product && item.product.images) {
            item.product.images = Array.isArray(item.product.images) ? item.product.images : [item.product.images];
         }
      });

      res.status(200).render("Client/Page/Cart/cart", {
         layout: "Client/layout",
         title: "Giỏ hàng",
         cart,
         userId
      });
   } catch (error) {
      console.error("Lỗi:", error.message);
      res.status(500).json({ error: error.message });
   }
}

   //------------------[ CREATE ]-------------------------
   static async create(req, res) {
      try {
         const { name, product_id, quantity } = req.body;
         const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
         const user_id = user ? user.id : null;

         const CartItem = await CartModel.findOne({
            where: {
               user_id: user_id,
               product_id: product_id,
            },
         });

         if (CartItem) {
            CartItem.quantity += parseInt(quantity, 10);
            await CartItem.save();
         } else {
            await CartModel.create({
               name,
               user_id,
               product_id,
               quantity,
            });
         }

         req.flash("success", "Thêm thành công!");
         return res.redirect("/cart");

      } catch (error) {
         console.error("Lỗi:", error.message);
         res.status(500).json({
            error: error.message,
         });
      }
   }

   //------------------[ UPDATE ]-------------------------

   static async updateCart(req, res) {
      try {
         const cartData = req.body.cart;

         if (!cartData) {
            req.flash("error", "Dữ liệu giỏ hàng không hợp lệ!");
            return res.redirect("/cart");
         }

         for (const productId in cartData) {
            const newQuantity = parseInt(cartData[productId]);

            if (newQuantity < 1) continue;

            await Cart.update(
               { quantity: newQuantity },
               { where: { product_id: productId, user_id: req.user.id } }
            );
         }

         req.flash("success", "Cập nhật giỏ hàng thành công!");
         return res.redirect("/cart");
      } catch (error) {
         console.error("Lỗi khi cập nhật giỏ hàng:", error.message);
         res.status(500).json({ error: "Lỗi máy chủ" });
      }
   }

   //------------------[ DELETE ]-------------------------

   static async delete(req, res) {
      try {
         const {
            id
         } = req.params
         const cart = await CartModel.findByPk(id);

         if (!cart) {
            return res.status(404).json({ error: "Cart không tồn tại" });
         }
         await cart.destroy();

         req.flash("success", "Xóa cart thành công!");
         return res.status(200).redirect("/cart");
      } catch (error) {
         req.flash("error", "Xóa cart thất bại!");
         return res.status(500).redirect("/cart");
      }
   }



}
module.exports = CartController;