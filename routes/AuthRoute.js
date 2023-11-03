import express from "express";
import {Login, logOut, Me} from "../controllers/Auth.js";

//mendeklarasikan express router
const router = express.Router();

// membuat endpoint
router.get('/me', Me);
router.post('/login', Login);
router.delete('/logout', logOut);

// mengeksport variabe supaya bisa digunakan di file lain
export default router;