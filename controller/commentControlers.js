const commentSchema = require("../model/commentSchema.js");

const registerComment = async (req, res) => {
  const comment = new commentSchema(req.body);
  try {
    const commentData = await comment.save();
    res.status(201).json({
      msg: "Comment Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = registerComment;
