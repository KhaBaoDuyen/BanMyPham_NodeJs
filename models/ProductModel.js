const { DataTypes } = require('sequelize');
const connection = require('../db');

const ProductModel = connection.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: []
},
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discount_price: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: true,
  },
  is_deleted : {
    type: DataTypes.TINYINT,
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

module.exports = ProductModel;
