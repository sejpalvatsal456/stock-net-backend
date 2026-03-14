import mongoose from "mongoose";
const transferSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    fromLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },

    toLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },

    quantity: Number,

    status: {
      type: String,
      enum: ["draft", "ready", "done", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Transfer", transferSchema);
