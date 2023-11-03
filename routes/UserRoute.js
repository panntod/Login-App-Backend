import express from "express";

// mengimport kebutuhan data dari controller
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";

//mengimport kebutuhan data dari AuthUser
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

//mengimport express router
const router = express.Router();

// membuat endpoint
router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/users/:id", verifyUser, adminOnly, getUserById);
router.post("/users", verifyUser, adminOnly, createUser);
router.patch("/users/:id", verifyUser, adminOnly, updateUser);
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);

// mengeksport variabe supaya bisa digunakan di file lain
export default router;
