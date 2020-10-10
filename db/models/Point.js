const mongoose = require("mongoose");

const PointSchema = mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Point", PointSchema);
