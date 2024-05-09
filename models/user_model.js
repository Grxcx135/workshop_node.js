const mongoose = require("mongoose");
const { Schema } = mongoose;

const users = new Schema(
  {
    username: { type: String, unique: true, require: true },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    role: { type: String },
    status: { type: Boolean, default: "false" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("users", users);
