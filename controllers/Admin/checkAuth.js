const UserModel = require('../../models/UserModel');

const checkRole = (role) => {
  return async (req, res, next) => {
    console.log("Cookies:", req.cookies);

    // Kiểm tra xem cookie user có tồn tại không
    if (!req.cookies.user) {
      req.flash("error", "Bạn cần đăng nhập!");
      return res.status(403).redirect('/');
    }

    let userCookie;
    try {
      userCookie = JSON.parse(req.cookies.user);
    } catch (error) {
      req.flash("error", "Lỗi xác thực!");
      return res.status(403).redirect('/');
    }

    console.log("User từ cookie (sau khi parse):", userCookie);

    if (!userCookie.id) {
      console.log("Không tìm thấy ID trong cookie!");
      req.flash("error", "Bạn cần đăng nhập!");
      return res.status(403).redirect('/');
    }

    try {
      const userId = userCookie.id;
      console.log("User  Cookie:", userId);

      const user = await UserModel.findByPk(userId);
      if (!user) {
        req.flash("error", "Tài khoản không được phép truy cập!");
        return res.status(403).redirect('/');
      }

      console.log("Role từ database:", user.role, " | Role cần kiểm tra:", role);
      if (user.role != role) {
        req.flash("error", "Bạn không có quyền truy cập!");
        return res.status(403).redirect('/');
      }
      // trùng role cho phép truy cập
      req.user = user;
      next();
    } catch (error) {
      console.error(" Lỗi :", error);
      res.status(500).json({ error: "Lỗi server!" });
    }
  };
};


module.exports = checkRole;
