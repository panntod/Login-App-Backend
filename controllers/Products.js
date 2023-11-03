import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

// mengeksport variabel supaya bisa digunakan di file lain
export const getProducts = async (req, res) => {

  // mencoba try untuk menjalan kan permintaan user
  try {
    // mendeklarasikan variabel response
    let response;
    
    // jika role user bukan admin
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });

      // jika role user adalah admin
    } else {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }

    // mengirim data yang didapatkan
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengeksport variabel supaya bisa digunakan di file lain
export const getProductById = async (req, res) => {

    // mencoba try untuk menjalan kan permintaan user
  try {

    // mencari product sesuai dengan uuid nya
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // jika product tidak ditemukan
    if (!product) return res.status(404).json({ message: "Data tidak ditemukan" });
    
    // mendeklarasikan variabel response
    let response;

    // jika role user bukan admin
    if (req.role === "admin") {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          id: product.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });

      // jika role user adalah admin
    } else {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }

    // mengirim data yang didapatkan
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengeksport variabe supaya bisa digunakan di file lain
export const createProduct = async (req, res) => {

  // mengambil value sesuai dengan inputan 
  const { name, price } = req.body;
  
  // mencoba membuat permintaan
  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });

    // jika produk berhasil dibuat
    res.status(201).json({ message: "Product Created Successfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengeksport variabel supaya bisa digunakan di file lain
export const updateProduct = async (req, res) => {

  // mencoba permintaan user
  try {

    // mencari product sesuai dengan permintaan
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // jika product tidak ditemukan
    if (!product) return res.status(404).json({ message: "Data tidak ditemukan" });
    
  // mengambil value sesuai dengan inputan 
    const { name, price } = req.body;
    
    // jika role user admin
    if (req.role === "admin") {
      await Product.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );

      // jika role user bukan admin
    } else {
      if (req.userId !== product.userId) return res.status(403).json({ message: "Akses terlarang" });
      
      // memproses permintaan user
      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    
    // jika update telah berhasil
    res.status(200).json({ message: "Product updated successfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengeksport variabe supaya bisa digunakan di file lain
export const deleteProduct = async (req, res) => {

  // mencoba permintaan user
  try {

    // mencari product sesuai dengan uuid
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    
    // jika product tidak ditemukan
    if (!product) return res.status(404).json({ message: "Data tidak ditemukan" });

    // mengambil data dari inputan
    const { name, price } = req.body;
    

    // jika role user adalah admin
    if (req.role === "admin") {
      
        await Product.destroy({
        where: {
          id: product.id,
        },
      });

      // jika role user bukan admin
    } else {
      if (req.userId !== product.userId) return res.status(403).json({ message: "Akses terlarang" });
      
      // menjalankan proses
      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    
    // jika delete berhasil
    res.status(200).json({ message: "Product deleted successfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
