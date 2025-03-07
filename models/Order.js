const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    items: [String],
    totalAmount: Number,
    status: { type: String, default: "Processing" }
});

module.exports = mongoose.model("Order", orderSchema);
