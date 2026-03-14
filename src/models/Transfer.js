import mongoose from "mongoose";
const transferSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],

    fromLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },

    toLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },

    status: {
      type: String,
      enum: ["draft", "ready", "done", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Transfer", transferSchema);
