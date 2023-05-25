const mongoose = require("mongoose");

const ShippingSFeesSchema = new mongoose.Schema({
  governorate: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  shippingTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("ShippingFee", ShippingSFeesSchema);
