const ProductModel = require('../../../models/ProductModel');
const CategoryModel = require('../../../models/CategoryModel');


const fs = require("fs");
const path = require("path");
const { Sequelize, Op } = require('sequelize');

class ProductController {


   //-------------------------[ PRODUCT ]-------------------------

   static async get(req, res) {
      try {
         let page = parseInt(req.query.page) || 1;
         let limit = 10;
         let offset = (page - 1) * limit;

         const { count, rows: products } = await ProductModel.findAndCountAll({
            include: [{
               model: CategoryModel,
               as: 'category',
               attributes: ['id', 'name']
            }],
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
         });

         const categories = await CategoryModel.findAll({
            attributes: [
               'id',
               'name',
               [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'productsCount']
            ],
            include: [{
               model: ProductModel,
               as: 'products',
               attributes: []
            }],
            group: ['Category.id'],
            raw: true
         });

         const productsWithImages = products.map(product => ({
            ...product.toJSON(),
            images: Array.isArray(product.images) ? product.images : []
         }));
         console.log(productsWithImages);

         let totalPages = Math.ceil(count / limit);

         return res.status(200).render("Client/Page/Product/product", {
            layout: "Client/layout",
            title: "Sản phẩm",
            products: productsWithImages,
            categories: categories,
            currentPage: page,
            totalPages: totalPages
         });

      } catch (error) {
         console.error("Lỗi truy vấn sản phẩm:", error);
         res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm!" });
      }
   }

   static async getProductDetail(req, res) {
      try {
         const { id } = req.params;
         const productDetail = await ProductModel.findByPk(id, {
            include: {
               model: CategoryModel,
               as: "category"
            }
         });

         if (!productDetail) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
         }

         productDetail.images = Array.isArray(productDetail.images) ? productDetail.images : [];

         return res.status(200).render("Client/Page/Product/productDetail", {
            layout: "Client/layout",
            title: "Chi tiết sản phẩm",
            productDetail,
            categoryName: productDetail.category ? productDetail.category.name : "Không có danh mục",
         });
      } catch (error) {
         console.error("Lỗi khi lấy sản phẩm:", error);
         res.status(500).json({ error: error.message });
      }
   }

//---------------[ SEARCH ]-----------------

 async searchProductsByName(searchTerm) {
      try {
         const products = await ProductModel.findAll({
            where: {
               name: {
                  [Op.like]: `%${searchTerm}%`, 
               },
            },
            order: [
               [Sequelize.literal('LENGTH(name)'), 'ASC'],
            ],
            limit: 10,
         });

         return products;
      } catch (error) {
         console.error('Lỗi khi tìm kiếm sản phẩm:', error);
         throw error;
      }
   }

}
module.exports = ProductController;