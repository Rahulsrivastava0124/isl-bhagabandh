const express = require("express");
const bodyParser = require("body-parser");
const json_parser = bodyParser.json();
const encoded = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const Crypto = require("crypto");
const Multer = require("multer");
const User_Data = require("./Schema/New_admission");
const cookie_parser = require("cookie-parser");
var key = "password";
var algo = "aes256";
const Token = require("jsonwebtoken");
jwtkey = "islbhagabandh";
const middleware = require("./middleware/login");
const Contact = require("./Schema/Contact");
const Register = require("./Schema/Register");
const { render } = require("express/lib/response");
const internal = require("stream");

const app = express();
const port = 3005;
// connect mongoose
mongoose
  .connect("mongodb://localhost:27017/contacts", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
const uniqe = Date.now();
const Storage = Multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + uniqe + ".jpg");
  },
});
const upload = Multer({
  storage: Storage,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "image1", maxCount: 1 },
]);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Public"));
app.use(express.static(__dirname + "/uploads"));
app.use(cookie_parser());

app.get("/", (req, res) => res.render("Home"));
app.get("/Register", (req, res) => {
  res.render("Register");
});
app.post("/Register", encoded, (req, res) => {
  var cipher = Crypto.createCipher(algo, key);
  var password_encoded =
    cipher.update(req.body.Password, "utf-8", "hex") + cipher.final("hex");
  register_id = Math.floor(Math.random() * 1000000000);
  const Login_Token = Token.sign(
    { _id: register_id, Email: req.body.Email, password: password_encoded },
    "jwtkey"
  );

  const register = new Register({
    _id: mongoose.Types.ObjectId(register_id),
    Email: req.body.Email,
    Password: password_encoded,
    Token: Login_Token,
  });
  if (req.body.Password == req.body.Confirm_Password) {
    register
      .save()
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      });
  }
  res.render("Login_Desk");
});
app.post("/", json_parser, encoded, (req, res) => {
  const ContactUs = new Contact({
    _id: mongoose.Types.ObjectId(),
    Contact: [
      {
        Email: req.body.Email,
        Username: req.body.Username,
        Address: req.body.Address,
        PhoneNumber: req.body.PhoneNumber,
        City: req.body.City,
        Description: req.body.Description,
      },
    ],
  });
  ContactUs.save();
  res.render("Home");
});
app.post("/ISL/Query/:_id", encoded, (req, res) => {
  console.log(req.params._id);
  Contact.deleteOne({ _id: req.params._id }).then((data) => {
    console.log(data.acknowledged);
    if (data.acknowledged == true) {
      res.cookie("states", "true", { maxAge: 2000 });
    } else {
      res.cookie("states", "false");
    }
    res.redirect("/ISL");
  });
});
app.get("/Admission_info", async (req, res) => {
  res.render("Admission_info");
});
app.get("/Login", encoded, async (req, res, next) => {
  if (req.cookies.Token == undefined) {
    res.render("Login_Desk",{Err_handling:false});
  } else {
    res.redirect("/ISL");
  }
});
app.get("/logout", (req, res) => {
  res.clearCookie("Token");
  res.redirect("/");
});

app.post("/Login", encoded, async (req, res) => {
  await Register.findOne({ Email: req.body.Email })
    .then((data) => {
      if (data === null) {
        res.render("Login_Desk",{Err_handling:true});
      } else {
        let dechiper = Crypto.createDecipher(algo, key);
        let password_encoded =
          dechiper.update(`${data.Password}`, "hex", "utf-8") +
          dechiper.final("utf-8");
        console.log(password_encoded);
        if (password_encoded == req.body.Password) {
          const Login_Token = Token.sign({ data }, "jwtkey");
          res.cookie("Token", Login_Token, { expire: 400 + Date.now() });
          res.redirect("/ISL");
        }
      }
    })
    .catch((err) => {
    res.render('Login_Desk',{Err_handling:false});
    });
});
app.get("/ISL", encoded, middleware.validation, async (req, res, next) => {
  await Contact.find().then((data) => {
    res.render("ISL", { data: data, states: req.cookies.states });
  });
});
app.get("/About", async (req, res) => {
  res.render("About-Us");
});
app.get("/Gallary", async (req, res) => {
  res.render("Gallary");
});
app.get("/Student", async (req, res) => {
  res.render("Student");
});
app.get("/Facilities", async (req, res) => {
  res.render("Facilities");
});
app.get("/new_admission", (req, res) => {
  res.render("new_admission");
});
app.post("/new_admission", encoded, upload, (req, res) => {
  var n = Math.floor(Math.random() * 1000000000);
  var Form_number = Math.floor(Math.random() * 1234);
  var User = new User_Data({
    user_data: [
      {
        First_name: req.body.First_name,
        Lastname: req.body.Last_name,
        Gender: {
          male: req.body.Check,
          Female: req.body.Check1,
        },
        class: req.body.class,
        date: req.body.date,
        Age: req.body.Age,
        Adhaar_number: req.body.Adhaar_number,
        //Adhaar_image:`Adhaar-${uniqe}`,
        Father_name: req.body.Father_name,
        Mother_name: req.body.Mother_name,
        Guardian_name: req.body.Guardian_name,
        Address: req.body.Address,
        Address2: req.body.Address2,
        City: req.body.City,
        State: req.body.State,
        Zip_code: req.body.Zip_code,
        Phone: req.body.Phone,
        email: req.body.email,
        image: `image-${uniqe}`,
        image1: `image1-${uniqe}`,
        Application_no: n,
        Form: Form_number,
        Previes_School_Name: req.body.previes_School,
        Previes_School_Class: req.body.previes_Class,
        Previes_value: {
          Previes_yes: req.body.flexRadioDefault,
          Previes_no: req.body.flexRadioDefault,
        },
      },
    ],
  });
  User.save()
    .then((data) => {
      console.log(data);
      res.render("submitNewadmission", { data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

// delete item
app.get("/submitNewadmission", (req, res) => {
  var n = Math.floor(Math.random() * 1000000000);
  res.render("submitNewadmission");
});

//Edit submit new application data
app.get("/Edit_submit_new_addmission", (req, res) => {
  res.render("Edit_submit_new_admission");
});

//define port and app listen
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
