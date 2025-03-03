const ProductModel = require('../../models/ProductModel');
const UserModel = require('../../models/UserModel');
const OrderModel = require('../../models/OrderModel');
const DetailOrderModel = require('../../models/DetailOrderModel');

class OrderController {

   static async get(req, res) {
      try {
         let page = parseInt(req.query.page) || 1;
         let limit = 10;
         let offset = (page - 1) * limit;

         let activeTab = parseInt(req.query.tab) || 1;

         let statusMap = {
            1: 1, // Chờ xác nhận
            2: 2, // Đang giao
            3: 3, // Đã giao
            4: 0  // Đã hủy
         };

         let whereCondition = {};
         if (statusMap[activeTab] !== undefined) {
            whereCondition.status = statusMap[activeTab];
         }

         //  đơn hàng theo tab
         const { count, rows: orders } = await OrderModel.findAndCountAll({
            where: whereCondition,
            include: [{
               model: UserModel,
               as: 'user',
               attributes: ['id', 'name', 'email']
            }],
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
         });

         let totalPages = Math.ceil(count / limit);

         res.render("Admin/page/Order/order", {
            layout: "Admin/layout",
            title: "Danh sách đơn hàng",
            orders: orders,
            currentPage: page,
            totalPages: totalPages,
            activeTab: activeTab
         });

      } catch (error) {
         console.error("Lỗi truy vấn đơn hàng:", error);
         res.status(500).json({ error: "Lỗi khi lấy danh sách đơn hàng!" });
      }
   }

   // ------------------------[ UPDATE ]---------------------------
   static async updateFrom(req, res) {
      try {
         const { id } = req.params;
         const order = await OrderModel.findByPk(id);

         if (!order) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại" });
         }

         const products = await DetailOrderModel.findAll({
            where: { orderId: id },
            include: [
               {
                  model: ProductModel,
                  as: "product",
               },
            ],
         });

         const orderByUser = await OrderModel.findOne({
            where: { id: id },
            include: [
               {
                  model: UserModel,
                  as: "user",
               },
            ],
         });

         res.render("Admin/page/Order/Edit", {
            layout: "Admin/layout",
            title: "Cập nhật đơn hàng",
            orders: order,
            products: products.map(detail => ({
               id: detail.product.id,
               name: detail.product.name,
               quantity: detail.quantity,
               price: detail.price,
            })),

            user: orderByUser ? orderByUser.user : null,
         });

      } catch (error) {
         console.error("Lỗi:", error.message);
         res.status(500).json({ error: error.message });
      }
   }

   static async update(req, res) {
      try {
         const { id } = req.params;
         const order = await OrderModel.findByPk(id);
         const {
            status,
            note } = req.body;

         if (!order) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại" });
         }

         await order.update({
            status: status ? Number(status) : order.status,
            note: note || order.note
         });
         // res.status(200)
         req.flash("success", "Cập nhật đơn hàng thành công!");
         return res.redirect("/admin/order/list");
      } catch (error) {
         console.error("Lỗi:", error.message);
         res.status(500).json({ error: error.message });
      }
   }

}

module.exports = OrderController;