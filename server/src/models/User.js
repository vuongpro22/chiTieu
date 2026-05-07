const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    fullname: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, index: true },
    pass: { type: String, required: true }
  },
  { collection: "user", timestamps: false }
);

module.exports = mongoose.model("User", UserSchema);

