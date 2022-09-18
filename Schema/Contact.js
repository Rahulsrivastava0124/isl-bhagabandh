const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

let ContactUsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
      Email: String,
      Username: String,
      Address: String,
      PhoneNumber: Number,
      City: String,
      Description: String,
     Date:{
       type:Date ,
       default:Date,
     },
});

module.exports= mongoose.model("Contact",ContactUsSchema);