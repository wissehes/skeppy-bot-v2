const mongoose = require("mongoose");

const braincellSchema = mongoose.Schema({
  userId: String,
  braincells: Number,
});

module.exports = mongoose.model("Braincell", braincellSchema);
