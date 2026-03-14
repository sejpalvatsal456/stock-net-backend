import express from "express";

import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import categoryRoutes from "./category.js";
import productRoutes from "./product.js";
import warehouseRoutes from "./warehouse.js";
import locationRoutes from "./location.js";
import inventoryRoutes from "./inventory.js";
import receiptRoutes from "./receipt.js";
import deliveryRoutes from "./delivery.js";
import transferRoutes from "./transfer.js";
import adjustmentRoutes from "./adjustment.js";
import movementRoutes from "./movement.js";
import dashboardRoutes from "./dashboard.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/locations", locationRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/receipts", receiptRoutes);
router.use("/deliveries", deliveryRoutes);
router.use("/transfers", transferRoutes);
router.use("/adjustments", adjustmentRoutes);
router.use("/movements", movementRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
