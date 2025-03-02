const { DataTypes } = require("sequelize");
const connection = require("../db");

const DetailOrderModel = connection.define(
  "DetailOrder",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    }
  },
  {
    tableName: "detailorder",
    timestamps: false,
  }
);

module.exports = DetailOrderModel;
