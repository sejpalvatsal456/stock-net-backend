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

    countedQuantity: Number,
    newQuantity: Number,

    status: {
      type: String,
      enum: ["draft", "done"],
      default: "draft",
    },

    reason: String,
  },
  { timestamps: true },
);

export default mongoose.model("Adjustment", adjustmentSchema);
