import Product from "../models/Product.js";

export const create = async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getAll = async (req, res) => {
  try {
    let query = Product.find();
    query = query.populate("category");

    res.json(await query);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getOne = async (req, res) => {
  try {
    let query = Product.findById(req.params.id);
    query = query.populate("category");

    const result = await query;
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const remove = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const search = async (req, res) => {
  try {
    const result = await Product.find({
      $or: [
        { name: new RegExp(req.query.query, "i") },
        { sku: new RegExp(req.query.query, "i") },
      ],
    }).populate("category");
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
