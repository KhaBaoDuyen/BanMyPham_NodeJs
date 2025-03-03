const UserModel = require('../../models/UserModel');


class UserController {

   static async get(req, res) {
      try {
         let page = parseInt(req.query.page) || 1;
         let limit = 10;
         let offset = (page - 1) * limit;

         const { count, rows } = await UserModel.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]],
         });

         let totalPages = Math.ceil(count / limit);

         res.status(200).render("Admin/page/Users/users", {
            layout: "Admin/layout",
            title: "Quản lý người dùng",
            users: rows,
            currentPage: page,
            totalPages: totalPages,
         });

      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }
   // ------------------------[ UPDATE ]---------------------------
   static async updateFrom(req, res) {
      try {
         const { id } = req.params;
         const user = await UserModel.findByPk(id);

         if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
         }

         res.render("Admin/page/Users/Edit", {
            layout: "Admin/layout",
            title: "Cập nhật tài khoản",
            u: user
         });
      } catch (error) {
         console.error("Lỗi:", error.message);
         res.status(500).json({ error: error.message });
      }
   }

   static async update(req, res) {
      try {
         const { id } = req.params;
         const user = await UserModel.findByPk(id);

         if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
         }

         const {
            name,
            image_old,
            password,
            phone,
            status,
            email,
            role
         } = req.body;
         const image = req.file ? req.file.filename : image_old;

         await user.update({
            name,
            image,
            password,
            phone,
            status,
            email,
            role
         });
         req.flash("success", "Cập nhật người dùng thành công!");
         return res.redirect("/admin/user/list");
      } catch (err) {
         console.error("Loii:", err.message);
      }
   }
   // ------------------------[ DELETE ]---------------------------
   static async delete(req, res) {
      try {
         const {
            id
         } = req.params
         const user = await UserModel.findByPk(id);

         if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
         }
         await user.destroy();

         req.flash("success", "Xóa người dùng thành công!");
         return res.status(200).redirect("/admin/user/list");
      } catch (error) {
         req.flash("error", "Xóa người dùng thất bại!");
         return res.status(500).redirect("/admin/user/list");
      }
   }

}

module.exports = UserController;