const ProductModel = require('../../models/ProductModel');
const CategoryModel = require('../../models/CategoryModel');


const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');

class indexController {

   static async getClient(req, res) {
      try {
         const products = await ProductModel.findAll({
            include: [{
               model: CategoryModel,
               as: 'category',
               attributes: ['id', 'name']
            }],
            order: [['id', 'DESC']]
         });
         const categories = await CategoryModel.findAll();

         if (!Array.isArray(products)) {
            console.error("Lỗi: products không phải là mảng!", products);
            return res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm!" });
         }

         const productsWithImages = products.map(product => ({
            ...product.toJSON(),
            images: Array.isArray(product.images) ? product.images : []
         }));


         res.status(200).render("Client/page/index", {
            layout: "Client/layout",
            title: "Quản lý ",
            products: productsWithImages,
            categories: categories,
         });
      } catch (error) {
         console.error("Lỗi truy vấn sản phẩm:", error);
         res.status(500).json({ error: error.message });
      }

   }

static async getAbout(req, res) {
   res.status(200).render("Client/Page/about", {
      layout: "Client/layout",
      title: "Giới thiệu",
   });
}

static async getContact(req, res) {
   res.status(200).render("Client/Page/contact", {
      layout: "Client/layout",
      title: "Liên hệ"
   });
}



}
module.exports = indexController;