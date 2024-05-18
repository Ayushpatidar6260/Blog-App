const blogSchema = require("../model/blogSchema.js");
const commentSchema = require("../model/commentSchema.js");

const registerBlog = async (req, res) => {
  // Create a new blog instance using the data from the request body
  const blog = new blogSchema(req.body);
  console.log(req.files);

  try {
    // Initialize the filepath variable
    let filepath;

    // Check if req.files exists
    if (req.files) {
      // Iterate over the files
      for (let i = 0; i < req.files.length; i++) {
        // Check if the fieldname is "profile"
        if (req.files[i].fieldname == "profile") {
          // Set the file path for the profile picture
          blog.profile = `${process.env.BASEURL}/${req.files[i].filename}`;
        }
      }
    }

    // If there is no profile file, set the filepath for the blog picture
    if (req.files && req.files.length > 0) {
      filepath = `/uploads/${req.files[0].filename}`;
      blog.blog_Pic = filepath;
    }

    // Save the blog to the database
    await blog.save();

    // Respond with success message
    res.status(201).json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (err) {
    // Handle any errors that occur during the blog registration process
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const blogList = async (req, res) => {
  try {
    const list = await blogSchema
      .find({})
      .sort({ createdAt: -1 })
      .populate("user_id", { name: 1, _id: 0 });
    res.status(200).send({ success: true, message: "Blog list ", list: list });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const blogDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const blogDetail = await blogSchema.findById(id, {
      title: 1,
      discription: 1,
      blog_pic: 1,
      _id: 0,
    });
    const comment = await commentSchema
      .find({ blog_id: id })
      .sort({ createdAt: -1 })
      .populate("user_id", { name: 1, profile_Pic: 1, createdAt: 1, _id: 0 });
    res.status(200).json({
      success: true,
      message: blogDetail,
      Comment: comment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const blogDelet = async (req, res) => {
  const id = req.params.id;
  try {
    const delet = await blogSchema.findByIdAndDelete(id);
    res.status(202).json({
      success: true,
      message: "Blog Delete Successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const likeBlog = async (req, res) => {
  const { id, likes } = req.params;

  try {
    const blogLike = await blogSchema.findById(id).select("like");
    if (!blogLike) {
      return res.status(404).send({
        success: false,
        message: "Blog post not found",
      });
    }

    let like = blogLike.like;

    if (likes === "true") {
      like++;
      await blogSchema.findByIdAndUpdate(
        blogLike.id,
        { $set: { like: like } },
        { new: true }
      );
      return res.status(200).send({
        success: true,
        message: "Like updated successfully",
      });
    } else if (likes === "false") {
      like--;
      await blogSchema.findByIdAndUpdate(
        blogLike.id,
        { $set: { like: like } },
        { new: true } // Ensure the document is returned after update
      );
      return res.status(200).json({
        success: true,
        message: "Dislike updated successfully",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid 'likes' parameter",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const searchBlog = async (req, res) => {
  const title = req.body.title;
  try {
    const query = { title: { $regex: title, $options: "i" } };
    const searchData = await blogSchema.find(query);
    res.status(200).json({
      success: true,
      blogDetails: searchData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  registerBlog,
  blogList,
  blogDetail,
  blogDelet,
  likeBlog,
  searchBlog,
};
