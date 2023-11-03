import User from "../models/UserModel.js";
import argon2 from "argon2";

// mengeksport variabe supaya bisa digunakan di file lain
export const getUsers = async (req, res) => {

  // mencari data semua user
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });

    // mengirim data
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengeksport variabe supaya bisa digunakan di file lain
export const getUserById = async (req, res) => {

  // mencoba mencari user sesuai dengan uuid
  try {
    const response = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });

    // mengirim data user yang ditemukan
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengeksport variabe supaya bisa digunakan di file lain
export const createUser = async (req, res) => {
  
  // mengambil data sesuai dengan inputan
  const { name, email, password, confPassword, role } = req.body;
  
  // jika password tidak sama dengan confirm password
  if (password !== confPassword) return res.status(400).json({ message: "Password dan Confirm Password tidak cocok" });
  
  // biarkan argon 2 menghash password terlebih dahulu
  const hashPassword = await argon2.hash(password);
  
  // mencoba menjalankan perintah
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });

    // jika register berhasil
    res.status(201).json({ message: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// mengeksport variabe supaya bisa digunakan di file lain
export const updateUser = async (req, res) => {

  // mencari data user sesuai dengan uuid
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  // mengambil data sesuai dengan inputan
  const { name, email, password, confPassword, role } = req.body;

  //mendeklarasikan variabel hashPassword
  let hashPassword;

  // jika password nya kosong maka biarkan password lama
  if (password === "" || password === null) {
    hashPassword = user.password;

  // jika password baru maka biarkan argon 2 meng hash terlebih dahulu
  } else {
    hashPassword = await argon2.hash(password);
  }

  // jika password tidak sesuai dengan confirm password
  if (password !== confPassword) return res.status(400).json({ message: "Password dan Confirm Password tidak cocok" });

// mencoba menjalankan proses
  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    // jika berhasil update user
    res.status(200).json({ message: "Berhasil Update User" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// mengeksport variabe supaya bisa digunakan di file lain
export const deleteUser = async (req, res) => {

  // mencari user sesuai dengan uuid
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  // jika user tidak sesuai
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  // mencoba menjalankan proses
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });

    // jika berhasil delete users
    res.status(200).json({ message: "Berhasil Hapus User" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
