import Adjustment from "../models/Adjustment.js";
import Stock from "../models/Stock.js";
import Movement from "../models/Movement.js";

export const create = async (req, res) => {
  try {
    res.status(201).json(await Adjustment.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Adjustment.find()
      .populate("product")
      .populate("location")
      .skip(skip)
      .limit(limit),
    Adjustment.countDocuments(),
  ]);

  res.json({ data, total, page, limit });
};
export const getOne = async (req, res) => {
  try {
    res.json(
      await Adjustment.findById(req.params.id)
        .populate("product")
        .populate("location"),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const update = async (req, res) => {
  try {
    res.json(
      await Adjustment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

import mongoose from "mongoose";

export const validate = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const adjustment = await Adjustment.findById(req.params.id).session(
      session,
    );
    if (!adjustment || adjustment.status === "done") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid or already applied" });
    }

    let stock = await Stock.findOne({
      product: adjustment.product,
      location: adjustment.location,
    }).session(session);
    let difference = parseFloat(adjustment.newQuantity);

    if (stock) {
      difference = adjustment.newQuantity - stock.quantity;
    }

    // Atomic update or insert
    await Stock.updateOne(
      { product: adjustment.product, location: adjustment.location },
      { $set: { quantity: adjustment.newQuantity } },
      { session, upsert: true }
    );

    await Movement.create(
      [
        {
          product: adjustment.product,
          type: "adjustment",
          quantity: difference,
          toLocation: adjustment.location,
          fromLocation: adjustment.location,
          referenceId: adjustment._id,
        },
      ],
      { session },
    );

    adjustment.status = "done";
    await adjustment.save({ session });

    await session.commitTransaction();
    res.json({ message: "Adjustment validated and applied", adjustment });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};
