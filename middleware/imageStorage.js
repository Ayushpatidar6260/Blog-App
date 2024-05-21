var multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, path.join(__dirname, "..", "/uploads/"));
  },
  filename: function (request, file, callback) {
    var ext = file.originalname.split(".");
    callback(
      null,
      Date.now() +
        (Math.random() + 1).toString(36).substring(7) +
        "." +
        ext[ext.length - 1]
    );
  },  
});
var upload = multer({ storage });
module.exports = upload;
