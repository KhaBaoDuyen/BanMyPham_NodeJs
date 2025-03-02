const { check } = require("express-validator");

const validateCheck = [
  check("name").notEmpty().withMessage("Tên không được để trống!"),
  check("phone")
    .notEmpty().withMessage("Số điện thoại không được để trống!")
    .bail()
    .isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ!"),
  check("email")
    .notEmpty().withMessage("Email không được để trống!")
    .bail()
    .isEmail().withMessage("Email không hợp lệ!"),
  check("province").notEmpty().withMessage("Vui lòng chọn Tỉnh!"),
  check("district").notEmpty().withMessage("Vui lòng chọn Quận/Huyện!"),
  check("ward").notEmpty().withMessage("Vui lòng chọn Phường/Xã!"),
  check("addressDetail").notEmpty().withMessage("Vui lòng nhập địa chỉ cụ thể!"),
];

module.exports = { validateCheck };
