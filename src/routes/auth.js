import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  createManager,
} from "../controllers/auth.js";
import { protect, manager } from "../middleware/auth.js";
const router = express.Router();
router.post("/register", register);
router.post("/manager", protect, manager, createManager);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
export default router;
