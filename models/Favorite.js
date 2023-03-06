const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  product_name: String,
  token: String,
  offer_id: String,
});

module.exports = Favorite;
