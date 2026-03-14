import mongoose from "mongoose";
const deliverySchema = new mongoose.Schema(
  {
    customer: String,

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
      enum: ["draft", "picking", "packed", "done", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Delivery", deliverySchema);
