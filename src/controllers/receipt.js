import Receipt from "../models/Receipt.js";
import Stock from "../models/Stock.js";
import Movement from "../models/Movement.js";
import Location from "../models/Location.js";

export const create = async (req, res) => {
  try {
    res.status(201).json(await Receipt.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Receipt.find()
      .populate("products.product")
      .populate("warehouse")
      .skip(skip)
      .limit(limit),
    Receipt.countDocuments(),
  ]);

  res.json({ data, total, page, limit });
};
export const getOne = async (req, res) => {
  try {
    res.json(
      await Receipt.findById(req.params.id)
        .populate("products.product")
        .populate("warehouse"),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const update = async (req, res) => {
  try {
    res.json(
      await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const remove = async (req, res) => {
  try {
    res.json(await Receipt.findByIdAndDelete(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

import mongoose from "mongoose";

export const validate = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const receipt = await Receipt.findById(req.params.id).session(session);
    if (!receipt) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Receipt not found" });
    }
    if (receipt.status === "done") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Already validated" });
    }

    let locationId;
    if (receipt.products.length > 0 && req.body.locationId) {
      locationId = req.body.locationId;
    } else {
      const loc = await Location.findOne({
        warehouse: receipt.warehouse,
      }).session(session);
      if (!loc) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "No location defined for this warehouse" });
      }
      locationId = loc._id;
    }

    for (let item of receipt.products) {
      // Atomic increment with upsert
      await Stock.updateOne(
        { product: item.product, location: locationId },
        { $inc: { quantity: item.quantity } },
        { session, upsert: true }
      );

      await Movement.create(
        [
          {
            product: item.product,
            type: "receipt",
            quantity: item.quantity,
            toLocation: locationId,
            referenceId: receipt._id,
          },
        ],
        { session },
      );
    }
    receipt.status = "done";
    await receipt.save({ session });
    
    await session.commitTransaction();
    res.json({
      message: "Receipt validated, stock updated successfully",
      receipt,
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};
