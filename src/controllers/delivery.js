import Delivery from "../models/Delivery.js";
import Stock from "../models/Stock.js";
import Movement from "../models/Movement.js";
import Location from "../models/Location.js";

export const create = async (req, res) => {
  try {
    res.status(201).json(await Delivery.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Delivery.find()
      .populate("products.product")
      .populate("warehouse")
      .skip(skip)
      .limit(limit),
    Delivery.countDocuments(),
  ]);

  res.json({ data, total, page, limit });
};
export const getOne = async (req, res) => {
  try {
    res.json(
      await Delivery.findById(req.params.id)
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
      await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const remove = async (req, res) => {
  try {
    res.json(await Delivery.findByIdAndDelete(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

import mongoose from "mongoose";

export const validate = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const delivery = await Delivery.findById(req.params.id).session(session);
    if (!delivery) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Delivery not found" });
    }
    if (delivery.status === "done") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Already validated" });
    }

    let locationId;
    const loc = await Location.findOne({
      warehouse: delivery.warehouse,
    }).session(session);
    if (!loc) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "No location defined for this warehouse" });
    }
    locationId = loc._id;

    for (let item of delivery.products) {
      // Atomic check and decrement pattern avoids read-modify-write conflicts
      const result = await Stock.updateOne(
        { 
          product: item.product, 
          location: locationId,
          quantity: { $gte: item.quantity } 
        },
        { $inc: { quantity: -item.quantity } },
        { session }
      );

      if (result.modifiedCount === 0) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "Insufficient stock or concurrency conflict for product " + item.product });
      }

      await Movement.create(
        [
          {
            product: item.product,
            type: "delivery",
            quantity: item.quantity,
            fromLocation: locationId,
            referenceId: delivery._id,
          },
        ],
        { session },
      );
    }
    delivery.status = "done";
    await delivery.save({ session });
    
    await session.commitTransaction();
    res.json({
      message: "Delivery validated, stock reduced successfully",
      delivery,
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};
