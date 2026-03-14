import Product from "../models/Product.js";
import Stock from "../models/Stock.js";
import Receipt from "../models/Receipt.js";
import Delivery from "../models/Delivery.js";

export const kpis = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const stocks = await Stock.find().populate("product");

    let lowStockCount = 0;
    const productStockMap = {};

    stocks.forEach((s) => {
      let pid = String(s.product._id);
      if (!productStockMap[pid]) {
        productStockMap[pid] = { qty: 0, ro: s.product.reorderLevel };
      }
      productStockMap[pid].qty += s.quantity;
    });

    for (let pid in productStockMap) {
      if (productStockMap[pid].qty <= productStockMap[pid].ro) {
        lowStockCount++;
      }
    }

    res.json({
      totalProducts,
      lowStockCount,
      totalStockLocations: stocks.length,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const alerts = async (req, res) => {
  try {
    const stocks = await Stock.find().populate("product location");
    const lowStockAlerts = stocks.filter(
      (s) => s.quantity <= (s.product.reorderLevel || 0),
    );
    res.json(lowStockAlerts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const operations = async (req, res) => {
  try {
    const pendingReceipts = await Receipt.countDocuments({
      status: { $ne: "done" },
    });
    const pendingDeliveries = await Delivery.countDocuments({
      status: { $ne: "done" },
    });
    res.json({ pendingReceipts, pendingDeliveries });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
