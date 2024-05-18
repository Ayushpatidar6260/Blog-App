const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: { type: String, require: true },
  isActive: { type: Boolean, default: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "blog",
  },
});
commentSchema.set("timestamps", true);
module.exports = mongoose.model("comment", commentSchema);
