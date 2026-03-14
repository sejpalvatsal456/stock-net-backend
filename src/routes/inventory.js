import express from "express";
import {
  getAll,
  getByProduct,
  getByLocation,
} from "../controllers/inventory.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.get("/", protect, getAll);
router.get("/:productId", protect, getByProduct);
router.get("/location/:locationId", protect, getByLocation);
export default router;
