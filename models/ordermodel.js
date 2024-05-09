const mongoose = require("mongoose");
const orders = new mongoose.Schema({
  username: { type: String },
  products_name: { type: String },
  amount: { type: Number },
});
module.exports = mongoose.model("orders", orders);
