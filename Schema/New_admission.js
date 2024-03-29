const mongoose = require("mongoose");
const new_admissionSchema = new mongoose.Schema({
  Admission_data: {
    First_name: String,
    Lastname: String,
    Gender: {
      male: String,
      Female: String,
    },
    Previes_value: {
      Previes_yes: String,
      Previes_no: String,
    },
    class: Number,
    date: Date,
    Age: Number,
    Adhaar_number: Number,
    // Adhaar_image:String,
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
    image1: String,
    Sign_image: String,
    Application_no: Number,
    Form: Number,
    Previes_School_Name: String,
    Previes_School_Class: Number,
  },
  __v: String,
});
module.exports = ImageModel = mongoose.model("User_Data", new_admissionSchema);
