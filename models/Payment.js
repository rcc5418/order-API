const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: Number,
    paymentMethod: String,
    status: { type: String, default: "Paid" }
});

module.exports = mongoose.model("Payment", paymentSchema);
