const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  location: String,

  description: String
}, { timestamps: true });

export default mongoose.model("Warehouse", warehouseSchema);