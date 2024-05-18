const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayushpatidar062@gmail.com",
    pass: "swqvdxmjfsgufnrj",
  },
});
  
module.exports=transporter