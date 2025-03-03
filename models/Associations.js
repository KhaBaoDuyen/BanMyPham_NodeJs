const CategoryModel = require('./CategoryModel'); 
const ProductModel = require('./ProductModel'); 
const UserModel = require('./UserModel'); 
const OrderModel = require('./OrderModel'); 
const DetailOrderModel = require('./DetailOrderModel');  
const CartModel = require("./CartModel");


CategoryModel.hasMany(ProductModel, { foreignKey: 'category_id', as: 'products' });
ProductModel.belongsTo(CategoryModel, { foreignKey: 'category_id', as: 'category' });

OrderModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });
UserModel.hasMany(OrderModel, { foreignKey: "user_id", as: "orders" });

OrderModel.belongsToMany(ProductModel, { through: 'order_products', foreignKey: 'order_id', as: 'products' });
ProductModel.belongsToMany(OrderModel, { through: 'order_products', foreignKey: 'product_id', as: 'orders' });

DetailOrderModel.belongsTo(ProductModel, { foreignKey: "productId", as: "product" });
ProductModel.hasMany(DetailOrderModel, { foreignKey: "productId", as: "details" });

OrderModel.hasMany(DetailOrderModel, { foreignKey: "orderId", as: "details" });
DetailOrderModel.belongsTo(OrderModel, { foreignKey: "orderId", as: "order" });

UserModel.hasMany(CartModel, { foreignKey: 'user_id', as: 'carts' });
CartModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

ProductModel.hasMany(CartModel, { foreignKey: 'product_id', as: 'carts' });
CartModel.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product' });

module.exports = { ProductModel, CategoryModel, UserModel, OrderModel, DetailOrderModel, CartModel };
