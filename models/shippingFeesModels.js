const mongoose = require("mongoose");

const shippingSFeesSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  governorate: {
    type: String,
  },
  fees: {
    type: Number,
  },
  active: {
    type: Boolean,
  },
  shippingTime: {
    type: Date,
  },
});
