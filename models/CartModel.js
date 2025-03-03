const { DataTypes } = require('sequelize');
const connection = require('../db');

const Cart = connection.define('Cart', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
   },
   user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
   }
}, {
   tableName: 'cart', 
   timestamps: false, 
});

module.exports = Cart;