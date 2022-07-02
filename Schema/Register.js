const mongoose = require("mongoose");

let RegisterSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
      Email: String,
      Password:String,
    
});

module.exports= mongoose.model("Register",RegisterSchema);