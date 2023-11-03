import User from "../models/UserModel.js";

// mengeksport variabe supaya bisa digunakan di file lain
export const verifyUser = async (req, res, next) => {

  // jika user belum login
  if (!req.session.userId) return res.status(401).json({ message: "Mohon login terlebih dahulu" });

  // jika user sudah login
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  // jika data user tidak ditemukan
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  req.userId = user.id;
  req.role = user.role;

  // mengizinkan untuk melanjutkan
  next();
};

// mengeksport variabe supaya bisa digunakan di file lain
export const adminOnly = async (req, res, next) => {

  // mencari user sesuai dengan id
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  
  // jika user bukan admin
  if (user.role !== "admin") return res.status(403).json({ message: "Akses terlarang" });
  
  //mengizinkan untuk melanjutkan
  next();
};
