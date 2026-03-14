import mongoose from "mongoose";
const receiptSchema = new mongoose.Schema(
  {
    supplier: String,

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: Number,
      },
    ],

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },

    status: {
      type: String,
      enum: ["draft", "waiting", "ready", "done", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Receipt", receiptSchema);
