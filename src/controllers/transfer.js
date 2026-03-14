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
  try {
    res.json(
      await Transfer.find()
        .populate("products.product")
        .populate("fromLocation")
        .populate("toLocation"),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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

export const validate = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer)
      return res.status(404).json({ message: "Transfer not found" });
    if (transfer.status === "done")
      return res.status(400).json({ message: "Already validated" });

    for (let item of transfer.products) {
      let stock = await Stock.findOne({
        product: item.product,
        location: transfer.fromLocation,
      });
      if (!stock || stock.quantity < item.quantity) {
        return res
          .status(400)
          .json({
            message:
              "Insufficient stock in source location for product " +
              item.product,
          });
      }
    }

    for (let item of transfer.products) {
      let sourceStock = await Stock.findOne({
        product: item.product,
        location: transfer.fromLocation,
      });
      sourceStock.quantity -= item.quantity;
      await sourceStock.save();

      let destStock = await Stock.findOne({
        product: item.product,
        location: transfer.toLocation,
      });
      if (destStock) {
        destStock.quantity += item.quantity;
        await destStock.save();
      } else {
        await Stock.create({
          product: item.product,
          location: transfer.toLocation,
          quantity: item.quantity,
        });
      }

      await Movement.create({
        product: item.product,
        type: "transfer",
        quantity: item.quantity,
        fromLocation: transfer.fromLocation,
        toLocation: transfer.toLocation,
        referenceId: transfer._id,
      });
    }
    transfer.status = "done";
    await transfer.save();
    res.json({ message: "Transfer successful", transfer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
