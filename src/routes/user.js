import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";
import { protect, manager } from "../middleware/auth.js";
const router = express.Router();
router.get("/", protect, manager, getUsers);
router.get("/:id", protect, manager, getUser);
router.put("/:id", protect, manager, updateUser);
router.delete("/:id", protect, manager, deleteUser);
export default router;
