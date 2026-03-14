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
  try {
    res.json(await Adjustment.find().populate("product").populate("location"));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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

export const validate = async (req, res) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id);
    if (!adjustment || adjustment.status === "done")
      return res.status(400).json({ message: "Invalid or already applied" });

    let stock = await Stock.findOne({
      product: adjustment.product,
      location: adjustment.location,
    });
    let difference = parseFloat(adjustment.newQuantity);

    if (stock) {
      difference = adjustment.newQuantity - stock.quantity;
      stock.quantity = adjustment.newQuantity;
      await stock.save();
    } else {
      await Stock.create({
        product: adjustment.product,
        location: adjustment.location,
        quantity: adjustment.newQuantity,
      });
    }

    await Movement.create({
      product: adjustment.product,
      type: "adjustment",
      quantity: difference,
      toLocation: adjustment.location,
      fromLocation: adjustment.location,
      referenceId: adjustment._id,
    });

    adjustment.status = "done";
    await adjustment.save();

    res.json({ message: "Adjustment validated and applied", adjustment });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
