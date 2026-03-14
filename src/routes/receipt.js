import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  validate,
} from "../controllers/receipt.js";
import { protect, manager } from "../middleware/auth.js";
const router = express.Router();

router.post("/", protect, manager, create);
router.get("/", protect, getAll);
router.get("/:id", protect, getOne);
router.put("/:id", protect, manager, update);
router.delete("/:id", protect, manager, remove);
router.post("/:id/validate", protect, manager, validate);

export default router;
