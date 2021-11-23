const mongoose = require("mongoose");

const User = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  //when did he join
  date: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    // required: true,
    default: "",
  },
  country: {
    type: String,
    // required: true,
    default: "",
  },
  language: {
    type: String,
    // required: true,
    default: "",
  },
  industry: {
    type: String,
    // required: true,
    default: "",
  },
  facebookLink: {
    type: String,
    // required: true,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("User", User);
