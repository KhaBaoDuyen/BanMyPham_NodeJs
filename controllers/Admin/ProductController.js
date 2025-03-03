const ProductModel = require('../../models/ProductModel');
const CategoryModel = require('../../models/CategoryModel');
const validatorProduct = require("../../validator/validateProducts")

const fs = require("fs");
const path = require("path");

class ProductController {
   static async getAdmin(req, res) {
      try {
         res.status(200).render("Admin/page/index", {
            layout: "Admin/layout",
            title: "Quản lý "
         });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }
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

         const productsWithImages = products.map(product => ({
            ...product.toJSON(),
            images: Array.isArray(product.images) ? product.images : []
         }));

         let totalPages = Math.ceil(count / limit);

         res.render("Admin/page/Products/product", {
            layout: "Admin/layout",
            title: "Danh sách sản phẩm",
            products: productsWithImages,
            currentPage: page,
            totalPages: totalPages
         });
      } catch (error) {
         console.error("Lỗi truy vấn sản phẩm:", error);
         res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm!" });
      }
   }
   //-------------------------[ CREATE ]-------------------------
   static async createForm(req, res) {
      try {
         const category = await CategoryModel.findAll();

         res.render("Admin/page/Products/Create", {
            layout: "Admin/layout",
            title: "Tạo sản phẩm",
            category: category,
            errors: {},
            product: {
               name: "",
               price: "",
               category_id: "",
               discount_price: "",
               weight: "",
               description: "",
               short_description: "",
               status: 1,
               images: [],
               stock
            }
         });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }
   static async create(req, res) {
      try {
         const {
            name,
            price,
            category_id,
            discount_price,
            weight,
            description,
            short_description,
            status,
            stock
         } = req.body;

         let images = [];
         if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.filename);
         }

         // Kiểm tra dữ liệu đầu vào
         const { errors, isValid } = validatorProduct({
            name,
            price,
            category_id,
            discount_price,
            weight,
            description,
            short_description,
            images,
            stock
         });

         if (!isValid) {
            const category = await CategoryModel.findAll();
            return res.render("Admin/page/Products/Create", {
               layout: "Admin/layout",
               title: "Tạo sản phẩm",
               category: category,
               errors,
               product: { // Giữ lại dữ liệu đã nhập
                  name,
                  price,
                  category_id,
                  discount_price,
                  weight,
                  description,
                  short_description,
                  status,
                  stock,
                  images
               }
            });
         }

         // Tạo sản phẩm mới
         const product = await ProductModel.create({
            name,
            price,
            category_id,
            discount_price: discount_price || null,
            weight: weight || null,
            description: description || "",
            short_description: short_description || "",
            status: status || 1,
            stock: stock || 0,
            images
         });

         req.flash("success", "Sản phẩm thêm thành công!");
         return res.redirect("/admin/product/list");

      } catch (error) {
         console.error("Lỗi:", error.message);
         req.flash("error", "Lỗi server. Vui lòng thử lại sau!");
         const category = await CategoryModel.findAll();
         return res.render("Admin/page/Products/Create", {
            layout: "Admin/layout",
            title: "Tạo sản phẩm",
            category: category,
            errors: { server: "Lỗi server. Vui lòng thử lại sau!" },
            product: { // Giữ lại dữ liệu đã nhập
               name: req.body.name,
               price: req.body.price,
               category_id: req.body.category_id,
               discount_price: req.body.discount_price,
               weight: req.body.weight,
               description: req.body.description,
               short_description: req.body.short_description,
               status: req.body.status || 1,
               stock: req.body.stock || 0,
               images: req.files ? req.files.map(file => file.filename) : []
            }
         });
      }
   }
   //-------------------------[ UPDATE ]-------------------------

   static async editForm(req, res) {
      try {
         const productDetail = await ProductModel.findByPk(req.params.id, {
            include: [{
               model: CategoryModel,
               as: "category",
               attributes: ["name"]
            }],
         });

         if (!productDetail) {
            return res.status(404).json({
               error: "Sản phẩm không tồn tại",
            });
         }

         const categoryList = await CategoryModel.findAll({
            attributes: ["id", "name"],
         });

         productDetail.images = Array.isArray(productDetail.images) ? productDetail.images : [];

         res.status(200).render("Admin/page/Products/Edit", {
            layout: "Admin/layout",
            title: "Sửa sản phẩm",
            productDetail,
            categoryList,
            categoryName: productDetail.category ? productDetail.category.name : "Không có danh mục",
            errors: {}
         });

      } catch (error) {
         console.error(" Lỗi khi lấy sản phẩm:", error);
         res.status(500).json({
            error: error.message,
         });
      }
   }


   static async edit(req, res) {
      try {
         console.log("🔍 Body request:", req.body);
         console.log("🔍 Method request:", req.method);
         console.log("🔍 Files uploaded:", req.files);

         const productId = req.params.id;
         const product = await ProductModel.findByPk(productId);

         const {
            name,
            price,
            category_id,
            discount_price,
            weight,
            description,
            short_description,
            status,
            image_old,
            stock,
            is_deleted
         } = req.body;

         if (!product) {
            req.flash("error", "Sản phẩm không tồn tại!");
            return res.status(404).redirect("/admin/product/list");
         }

         let images = Array.isArray(product.images) ? product.images : [];
         let images_old = Array.isArray(image_old) ? image_old : images;

         if (req.files && req.files.length > 0) {
            const imagesNew = req.files.map(file => file.filename);
            images_old = [...images_old, ...imagesNew];
         }

         const { errors, isValid } = validatorProduct({
            name,
            price,
            category_id,
            discount_price,
            weight,
            description,
            short_description,
            images: images_old,
            stock
         });

         if (!isValid) {
            const category = await CategoryModel.findAll();
            return res.render("Admin/page/Products/Edit", {
               layout: "Admin/layout",
               title: "Sửa sản phẩm",
               categoryList: category,
               errors,
               productDetail: {
                  id: productId,
                  name,
                  price,
                  category_id,
                  discount_price,
                  weight,
                  description,
                  short_description,
                  status,
                  stock,
                  is_deleted,
                  images: images_old
               }
            });
         }

         await product.update({
            name,
            price,
            category_id,
            discount_price,
            weight,
            description,
            short_description,
            status,
            stock,
            images: images_old
         });

         req.flash("success", "Sản phẩm cập nhật thành công!");
         return res.redirect("/admin/product/list");

      } catch (error) {
         console.error(" Lỗi cập nhật sản phẩm:", error);
         req.flash("error", "Có lỗi xảy ra khi cập nhật sản phẩm!");
         return res.redirect("/admin/product/list");
      }
   }

//--------------------[ DELETE ]-----------------------
static async isDelete(req, res) {
   try {
      const { id } = req.params; 
      const product = await ProductModel.findByPk(id);

      if (!product) {
         return res.status(404).json({
            message: "Không tìm thấy sản phẩm"
         });
      }
      await product.update({ is_deleted: 1 });

      req.flash("success", "Sản phẩm xóa thành công!");
         return res.redirect("/admin/product/list");

   } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      return res.status(500).json({
         message: "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm"
      });
   }
}

   static async delete(req, res) {
      try {
         const {
            id
         } = req.params;

         const product = await ProductModel.findByPk(id);

         if (!product) {
            return res.status(404).json({
               message: "Không tìm thấy product"
            });
         }
         await product.destroy();

         // res.status(200).json({
         //    message: "Xóa thành công",
         //    product
         // });       
         req.flash("success", "Xóa sản phẩm thành công!");
         return res.status(200).redirect("/admin/product/list");
      } catch (error) {
         req.flash("error", "Xóa sản phẩm thất bại!");
         return res.status(500).redirect("/admin/product/list");
      }
   }




   static async deleteImage(req, res) {
      try {
         const { id } = req.params;
         const { image } = req.body;

         const product = await ProductModel.findByPk(id);
         if (!product) {
            req.flash("error", "Sản phẩm không tồn tại!");
            return res.redirect("back");
         }

         let images = Array.isArray(product.images) ? product.images : [];

         const updatedImages = images.filter(img => img !== image);

         await ProductModel.update({ images: updatedImages }, { where: { id } });

         const imagePath = path.join(__dirname, "../public/assets/uploads/products", image);
         if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
         }

         req.flash("success", "Xóa ảnh thành công!");
         return res.redirect("back");

      } catch (error) {
         console.error(" Lỗi xóa ảnh:", error);
         req.flash("error", "Có lỗi xảy ra khi xóa ảnh!");
         return res.redirect("back");
      }
   }

}
module.exports = ProductController;