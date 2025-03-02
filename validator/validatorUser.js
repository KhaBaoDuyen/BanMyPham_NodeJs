const validator = require("validator");

function validatorUser(data) {
   let errors = {};

   if (validator.isEmpty(data.name || "")) {
      errors.name = "Tên không được để trống!";
   }

   if (validator.isEmpty(data.email || "")) {
      errors.email = "Email không được để trống!";
   } else if (!validator.isEmail(data.email)) {
      errors.email = "Email không đúng định dạng!";
   }

   if (validator.isEmpty(data.password || "")) {
      errors.password = "Mật khẩu không được để trống!";
   } else if (!validator.isLength(data.password, { min: 6 })) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
   }
   return {
      errors,
      isValid: Object.keys(errors).length === 0
   };
}

module.exports = validatorUser;