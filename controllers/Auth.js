import User from "../models/UserModel.js";
import argon2 from "argon2";

// mengeksport variabel login supaya bisa diakses oleh file lain
export const Login = async (req, res) => {

  // membuat variabel user yang berisi data dari database sesuai dengan email
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  // jika tidak ditemukan user
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  // mencocokan password yang dikirim
  const match = await argon2.verify(user.password, req.body.password);

  // jika tidak cocok
  if (!match) return res.status(400).json({ message: "Password Salah" });

  //menyiapkan data yang diperlukan
  req.session.userId = user.uuid;

  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;

  //mengirim data yang sudah disiapkan
  res.status(200).json({ uuid, name, email, role });
};

// mengeksport variabel me supaya bisa digunakan file lain
export const Me = async (req, res) => {
  // mengecek jika tidak ditemukan session login
  if (!req.session.userId) {
    return res.status(401).json({ message: "Mohon login ke akun Anda" });
  }

  // mencocokan data user sesuai dengan user uuid
  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  // jika user tidak sesuai
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  
  // mengirim data sesuai dengan yang didapatkan
  res.status(200).json(user);
};

// mengeksport variabel logout supaya bisa digunakan file lain
export const logOut = (req, res) => {

  // mengambil variabel session dan menghapusnya
  req.session.destroy((err) => {

    // jika gagal menghapus variabel session
    if (err) return res.status(400).json({ message: "Tidak dapat logout" });
    
    // jika berhasil menghapus
    res.status(200).json({ message: "Anda telah logout" });
  });
};
