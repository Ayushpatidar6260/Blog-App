const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  discription: {
    type: String,
    require: true,
  },
  blog_Pic: {
    type: String,
    require: true,
  },
  like: {
    type: Number,
    require: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "user",
  },
});
blogSchema.set("timestamps", true);
module.exports = mongoose.model("blog", blogSchema);
