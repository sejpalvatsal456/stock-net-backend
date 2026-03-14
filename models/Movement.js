const movementSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  type: {
    type: String,
    enum: ["receipt", "delivery", "transfer", "adjustment"]
  },

  quantity: Number,

  fromLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },

  toLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },

  referenceId: mongoose.Schema.Types.ObjectId

}, { timestamps: true });

export default mongoose.model("Movement", movementSchema);