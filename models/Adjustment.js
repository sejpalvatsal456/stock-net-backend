const adjustmentSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },

  countedQuantity: Number,

  reason: String

}, { timestamps: true });

export default mongoose.model("Adjustment", adjustmentSchema);