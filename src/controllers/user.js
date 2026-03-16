import User from "../models/User.js";

export const getUsers = async (req, res) =>
  res.json(await User.find().select("-password"));

export const getUser = async (req, res) =>
  res.json(await User.findById(req.params.id).select("-password"));

export const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  res.json(
    await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true },
    ).select("-password"),
  );
};

export const deleteUser = async (req, res) =>
  res.json(await User.findByIdAndDelete(req.params.id));
