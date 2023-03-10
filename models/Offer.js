const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  product_name: { type: String, required: true },
  product_description: String,
  product_price: { type: Number, min: 0, required: true },
  product_image: { type: mongoose.Schema.Types.Mixed, default: {} },
  product_category: { type: String, required: true },
  product_pictures: Array,
  product_details: Array,
  product_date: { type: Date, default: Date.now },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Offer;
