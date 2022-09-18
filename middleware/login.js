const token = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");
function validation(req, res, next) {
  try {
    var validation_token = req.cookies.Token;
    const verify = token.verify(validation_token, "jwtkey");
    console.log("verify");
  } catch (error) {
    res.redirect("/login");
  }
  next();
}

module.exports = { validation };
