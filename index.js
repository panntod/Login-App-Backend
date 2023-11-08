// mengimport semua kebutuhan data
import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

// membuat app lingkungan dot env
dotenv.config();

// mendeklarasikan variabel
const app = express();
const PORT = process.env.APP_PORT || 5000;

// mendeklarasikan session
const sessionStore = SequelizeStore(session.Store);

// mendeklarasikan tempat menyimpan session
const store = new sessionStore({
  db: db,
});

// mendeklarasikan app menggunakan session
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      // jika http maka FALSE, jika https maka TRUE
      secure: "auto",
    },
  })
);

// mendeklarasikan cors
app.use(
  cors({
    // mendeklarasikan credentials mana yang bisa menggunakan enpoint ini
    credentials: true,
    // jika banyak data maka menggunakan []
    origin: "http://localhost:3000",
  })
);

// mendeklarasikan middleware yang digunakan
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

/*
AKTIFKAN CODE INI JIKA KAMU BELUM MEMILIKI TABEL DI DATABASE
store.sync();
(async()=>{
    await db.sync();
})();
*/

// menjalankan app
app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
