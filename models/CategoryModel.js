const { DataTypes } = require('sequelize');
const connection = require('../db');

const CategoryModel = connection.define('Category', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
   },
   name: {
      type: DataTypes.STRING(255),
      allowNull: false,
   },
   image: {
      type: DataTypes.STRING(255),
      allowNull: true,
   },
   status: {
      type: DataTypes.TINYINT,
      allowNull: true,
   }
}, {
   tableName: 'categories',
   timestamps: false,
});

module.exports = CategoryModel;

