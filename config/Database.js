import { Sequelize } from "sequelize";

// membuat koneksi ke database
const db = new Sequelize("crud_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//mengeksport variabel db supaya bisa digunakan di file lain
export default db;
