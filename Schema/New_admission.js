const mongoose = require("mongoose");
const new_admissionSchema = new mongoose.Schema({
  user_data: [
    {
      First_name: String,
      Lastname: String,
      Gender: {
        male:String,
        Female:String
      },
      class: Number,
      date: Date,
      Father_name: String,
      Mother_name: String,
      Guardian_name: String,
      Address: String,
      Address2: String,
      City: String,
      State: String,
      Zip_code: Number,
      Phone: Number,
      email: String,
      image: String,
      Application_no:Number,
    },
  ],
});
module.exports = ImageModel = mongoose.model("User_Data", new_admissionSchema);
