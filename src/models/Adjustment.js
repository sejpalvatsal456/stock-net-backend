import mongoose from "mongoose";
const adjustmentSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },

    newQuantity: Number,

    reason: String,

    status: {
      type: String,
      enum: ["draft", "done"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Adjustment", adjustmentSchema);
