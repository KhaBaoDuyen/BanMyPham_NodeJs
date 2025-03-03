const validator = require("validator");

function validatorProduct(data) {
   let errors = {};

   if (validator.isEmpty(data.name || "")) {
      errors.name = "Tên sản phẩm không được để trống!";
   }

   if (!data.price || isNaN(data.price) || data.price <= 0) {
      errors.price = "Giá sản phẩm phải là số dương!";
   }

   if (!data.stock || isNaN(data.stock) || data.stock < 0) {
      errors.stock = "Số lượng kho phải là số dương!";
   }

   if (!data.image_old) {
      if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
         errors.images = "Vui lòng tải lên ít nhất một hình ảnh!";
      }
   }

   if (!data.category_id || !validator.isInt(data.category_id.toString())) {
      errors.category_id = "Vui lòng chọn danh mục!";
   }

   if (data.discount_price && (isNaN(data.discount_price) || parseFloat(data.discount_price) <= 0 || parseFloat(data.discount_price) >= parseFloat(data.price))) {
      errors.discount_price = "Giá khuyến mãi phải là số dương và nhỏ hơn giá sản phẩm!";
   }

   if (data.weight && (isNaN(data.weight) || data.weight <= 0)) {
      errors.weight = "Cân nặng phải là số dương!";
   }
   if (validator.isEmpty(data.stock || "")) {
      errors.stock = "Số lượng kho không được để trống!";
   }
   if (validator.isEmpty(data.weight || "")) {
      errors.weight = "Cân nặng không được để trống!";
   }
   if (validator.isEmpty(data.description || "")) {
      errors.description = "Mô tả sản phẩm không được để trống!";
   }

   if (validator.isEmpty(data.short_description || "")) {
      errors.short_description = "Mô tả ngắn không được để trống!";
   }

   return {
      errors,
      isValid: Object.keys(errors).length === 0
   };
}

module.exports = validatorProduct;