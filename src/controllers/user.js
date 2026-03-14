import User from "../models/User.js";
export const getUsers = async (req, res) => res.json(await User.find());
export const getUser = async (req, res) =>
  res.json(await User.findById(req.params.id));
export const updateUser = async (req, res) =>
  res.json(
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  );
export const deleteUser = async (req, res) =>
  res.json(await User.findByIdAndDelete(req.params.id));
