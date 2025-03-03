const validator = require("validator");

function validateCheck(data) {
  let errors = {};

  if (validator.isEmpty(data.name || "")) {
    errors.name = "Tên không được để trống!";
  }

  if (validator.isEmpty(data.phone || "")) {
    errors.phone = "Số điện thoại không được để trống!";
  } else if (!validator.isMobilePhone(data.phone, "vi-VN")) {
    errors.phone = "Số điện thoại không hợp lệ!";
  }

  if (data.email && !validator.isEmpty(data.email)) {
    if (!validator.isEmail(data.email)) {
      errors.email = "Email không hợp lệ!";
    }
  }

  if (validator.isEmpty(data.province || "")) {
    errors.province = "Vui lòng chọn Tỉnh!";
  }

  if (validator.isEmpty(data.district || "")) {
    errors.district = "Vui lòng chọn Quận/Huyện!";
  }

  if (validator.isEmpty(data.ward || "")) {
    errors.ward = "Vui lòng chọn Phường/Xã!";
  }

  if (validator.isEmpty(data.addressDetail || "")) {
    errors.addressDetail = "Vui lòng nhập địa chỉ cụ thể!";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

module.exports = { validateCheck };