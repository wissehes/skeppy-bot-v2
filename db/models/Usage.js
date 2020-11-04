const mongoose = require("mongoose");

const Usage = new mongoose.Schema({
  command: {
    type: String,
    required: true,
  },
  usages: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("usage", Usage);
