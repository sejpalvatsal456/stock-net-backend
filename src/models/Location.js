import mongoose from "mongoose";
const locationSchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },

    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Location", locationSchema);
