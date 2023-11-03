import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

// mendeklarasikan sequelize
const { DataTypes } = Sequelize;

const Products = db.define(

  // nama tabel
  "product",

  // data data di dalam tebel
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

// relasi yang dimiliki
Users.hasMany(Products);
Products.belongsTo(Users, { foreignKey: "userId" });

// mengeksport variabe supaya bisa digunakan di file lain
export default Products;
