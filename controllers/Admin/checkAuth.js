const UserModel = require('../../models/UserModel');

const checkRole = (role) => {
  return async (req, res, next) => {

    console.log("User ID from Cookie:", req.cookies.user.id); // Kiểm tra cookie user.id
    try {
      const user = await UserModel.findByPk(req.cookies.user.id);
      console.log("User from DB:", user); // Kiểm tra người dùng từ DB
      if (!user || user.role !== role) {
        req.flash("error", "Bạn không có quyền truy cập!");
        return res.status(403).redirect('/');
      }
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = checkRole;