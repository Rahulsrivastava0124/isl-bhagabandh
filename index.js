const express = require("express");
const bodyParser = require("body-parser");
const json_parser = bodyParser.json();
const encoded = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const Crypto = require("crypto");
const cookie_parser = require("cookie-parser");

var key = "password";
var algo = "aes256";
const Token = require("jsonwebtoken");
jwtkey = "islbhagabandh";
const middleware = require("./middleware/login");
const Contact = require("./Schema/Contact");
const Register = require("./Schema/Register");
const app = express();
const port = 3000;
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

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Public"));
app.use(cookie_parser());

app.get("/", (req, res) => res.render("Home"));
app.get("/Register", (req, res) => {
  res.render("Register");
});
app.post("/Register", encoded, (req, res) => {
  var cipher = Crypto.createCipher(algo, key);
  var password_encoded =
    cipher.update(req.body.Password, "utf-8", "hex") + cipher.final("hex");
  const register = new Register({
    _id: mongoose.Types.ObjectId(),
    Email: req.body.Email,
    Password: password_encoded,
  });
  if (req.body.Password == req.body.Confirm_Password) {
    register
      .save()
      .then((data) => {
        console.log(data);
      })
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
app.get("/Admission_info", async (req, res) => {
  res.render("Admission_info");
});
app.get("/Login", async (req, res) => {
  res.render("Login_Desk");
});
app.post("/Login", encoded, async (req, res) => {
  await Register.findOne({ Email: req.body.Email }).then((data) => {
    var dechiper = Crypto.createDecipher(algo, key);
    var password_encoded =
      dechiper.update(`${data.Password}`, "hex", "utf-8") +
      dechiper.final("utf-8");
    const Login_Token = Token.sign({ data }, "jwtkey");
    res.cookie("Token", Login_Token, { expire: 400000 + Date.now() });
  });

  res.redirect("/ISL");
});
app.get("/ISL", encoded, middleware.validation, async (req, res) => {
  await Contact.find().then((data) => {
    res.render("ISL", { data: data });
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
