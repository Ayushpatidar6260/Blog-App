const { error } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes.js");
require("dotenv").config();
const app = express();
const port = 5000;

app.use(express.json());
app.use("/user", userRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/BloggApp")
  .then(() => {
    console.log("mongoDb connected");
  })
  .catch((error) => {
    console.log("connection failed", error);
  });

process.env.BASEURL = "http://localhost:5000";
app.listen(port, () => {
  console.log(`server is started on http://localhost:${port}`);
});
