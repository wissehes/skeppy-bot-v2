const mongoose = require("mongoose");

const braincellSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  braincells: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Braincell", braincellSchema);
