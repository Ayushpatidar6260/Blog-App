const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  profile_pic: { type: String, require: true },
  password: { type: String, require: true },
  city: { type: String, require: true },
  state: { type: String, require: true },
  role: { type: String, default: "user", require: true },
  isActive: { type: Boolean, require: true },
});
userSchema.set("timestamps", true);
module.exports = mongoose.model("user", userSchema);
