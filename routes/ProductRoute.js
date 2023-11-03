import express from "express";

// mengimport kebutuhan data dari controller
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/Products.js";

// mengimport kebutuhan data dari AuthUser
import { verifyUser } from "../middleware/AuthUser.js";

//mendeklarasikan express router
const router = express.Router();

// membuat endpoint
router.get("/products", verifyUser, getProducts);
router.get("/products/:id", verifyUser, getProductById);
router.post("/products", verifyUser, createProduct);
router.patch("/products/:id", verifyUser, updateProduct);
router.delete("/products/:id", verifyUser, deleteProduct);

// mengeksport variabe supaya bisa digunakan di file lain
export default router;
