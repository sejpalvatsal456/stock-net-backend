import mongoose from "mongoose";
const stockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },

    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

stockSchema.index({ product: 1, location: 1 }, { unique: true });

export default mongoose.model("Stock", stockSchema);
