const express = require("express");
const {
  userLogin,
  userBlog,
  userSignup,
  updateBlog,
  sendResetPasswordEmail,
  resetPassword,
} = require("../controller/userControlers.js");

const {
  registerBlog,
  blogList,
  blogDetail,
  likeBlog,
  blogDelet,
  searchBlog,
} = require("../controller/blogControlers.js");

const authorization = require("../middleware/userAuthentication.js");
const upload = require("../middleware/imageStorage.js");
const registerComment = require("../controller/commentControlers.js");

const router = express.Router();

//User Routes--->//
router.post("/signup", upload.single("profile_pic"), userSignup);
router.put("/updateblog/:id", updateBlog);
router.post("/searchBlog/", searchBlog);
router.get("/blog", userBlog);
router.post("/login", userLogin);
router.post("/sendEmail", sendResetPasswordEmail);
router.post("/resetpassword/:id/:token", resetPassword);

//Blog Routes--->//
router.post("/create", upload.any(), registerBlog);
router.get("/list", blogList);
router.get("/detail/:id", blogDetail);
router.get("/like/:id/:likes", likeBlog);
router.delete("/blogDelete/:id", blogDelet);

router.post("/addcomment", registerComment);

module.exports = router;
