const mongoose = require("mongoose");

const payment = new mongoose.Schema({
  businessName: {
    type: String,
  },
  businessWebsite: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("payment", payment);
