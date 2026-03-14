import express from "express";
import { kpis, alerts, operations } from "../controllers/dashboard.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.get("/kpis", protect, kpis);
router.get("/alerts", protect, alerts);
router.get("/operations", protect, operations);
export default router;
