const userSchema = require("../model/userSchema.js");
const blogSchema = require("../model/blogSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../service/mailService.js");
const JWT_SECRET_KEY = "Hddjdej32pwdijde";

const userSignup = async (req, res) => {
  const { name, email, profile_pic, password, city, state } = req.body;
  try {
    if (!name) {
      return res.json({ msg: "Please provide a name" });
    }
    if (!email) {
      return res.json({ msg: "Plase provide a email" });
    }

    if (!password) {
      return res.json({ msg: "Plase provide a password" });
    }
    if (!city) {
      return res.json({ msg: "Plase provide a city" });
    }
    if (!state) {
      return res.json({ msg: "Plase provide a state" });
    }

    const exists = await userSchema.findOne({ email: req.body.email });
    if (exists) {
      return res
        .status(403)
        .json({ success: false, msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const data = await userSchema.create({
      name: name,
      email: email,
      profile_pic: `${process.env.BASEURL}${req.file.filename}`,
      password: hashPassword,
      city: city,
      state: state,
    });
    console.log(data);
    return res.json({ msg: "User Registration Successfully", data });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Password" });
    }

    // If credentials are correct, generate a JWT token
    const payload = {
      user: {
        id: user._id,
      },
    };
    const jwtsecret = process.env.JWT_SECRET || "yourFallbackSecretHere";
    console.log("login Successfull", jwtsecret);
    jwt.sign(
      payload,
      jwtsecret,
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("errorrrr", err);
    return res.status(500).send({ success: false, message: err.message });
  }
};

const userBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const findData = await blogSchema.find({ user_id: id });
    res.status(200).json({
      success: true,
      message: "Successfully",
      blog: findData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const update = await blogSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Blog Update Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userSchema.findOne({ email });
    if (user) {
      const secret = user.id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "30d",
      });
      const link = `http://localhost:5000/user/reset-password/${user._id}/${token}`;
      let info = await transporter.sendMail({
        from: "ayushpatidar062@gmail.com",
        to: email,
        subject: "Email sent for reset password",
        html: `<a href="${link}">Reset Password</a>`,
      });
      res.status(200).send({
        success: true,
        message: "Email sent successfully",
        token,
        user_ID: user.id,
      });
    } else {
      res.status(550).send({
        success: false,
        message: "Email is required",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { userID, token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Validate the token
    const user = await userSchema.findOne(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const secret = user.id + process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secret);

    // Check if the token is valid
    if (!decoded || decoded.userID !== user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userBlog,
  updateBlog,
  sendResetPasswordEmail,
  resetPassword,
};
