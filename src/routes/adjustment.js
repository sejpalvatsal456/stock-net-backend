import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  validate,
} from "../controllers/adjustment.js";
import { protect, manager } from "../middleware/auth.js";
const router = express.Router();

router.post("/", protect, create);
router.get("/", protect, getAll);
router.get("/:id", protect, getOne);
router.put("/:id", protect, manager, update);

router.post("/:id/validate", protect, manager, validate);

export default router;
