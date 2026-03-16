import Transfer from "../models/Transfer.js";
import Stock from "../models/Stock.js";
import Movement from "../models/Movement.js";

export const create = async (req, res) => {
  try {
    res.status(201).json(await Transfer.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Transfer.find()
      .populate("products.product")
      .populate("fromLocation")
      .populate("toLocation")
      .skip(skip)
      .limit(limit),
    Transfer.countDocuments(),
  ]);

  res.json({ data, total, page, limit });
};
export const getOne = async (req, res) => {
  try {
    res.json(
      await Transfer.findById(req.params.id)
        .populate("products.product")
        .populate("fromLocation")
        .populate("toLocation"),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const update = async (req, res) => {
  try {
    res.json(
      await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const remove = async (req, res) => {
  try {
    res.json(await Transfer.findByIdAndDelete(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

import mongoose from "mongoose";

export const validate = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transfer = await Transfer.findById(req.params.id).session(session);
    if (!transfer) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Transfer not found" });
    }
    if (transfer.status === "done") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Already validated" });
    }

    for (let item of transfer.products) {
      // Atomic source decrement
      const sourceResult = await Stock.updateOne(
        { 
          product: item.product, 
          location: transfer.fromLocation,
          quantity: { $gte: item.quantity }
        },
        { $inc: { quantity: -item.quantity } },
        { session }
      );
      
      if (sourceResult.modifiedCount === 0) {
        await session.abortTransaction();
        return res.status(400).json({
          message:
            "Insufficient stock in source location or concurrency conflict for product " + item.product,
        });
      }

      // Atomic dest increment with upsert
      await Stock.updateOne(
        { product: item.product, location: transfer.toLocation },
        { $inc: { quantity: item.quantity } },
        { session, upsert: true }
      );

      await Movement.create(
        [
          {
            product: item.product,
            type: "transfer",
            quantity: item.quantity,
            fromLocation: transfer.fromLocation,
            toLocation: transfer.toLocation,
            referenceId: transfer._id,
          },
        ],
        { session },
      );
    }
    transfer.status = "done";
    await transfer.save({ session });
    
    await session.commitTransaction();
    res.json({ message: "Transfer successful", transfer });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};
