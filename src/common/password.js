/** @format */

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * Generate Password
 */
const generatePassword = (length = 8) => {
  var text = "";
  var possible =
    "abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

/**
 * Encrypt the password using bcrypt algo
 */
const encryptPassword = (password) => {
  let salt = generateSalt(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Compare the password using bcrypt algo
 */
const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
/**
 * Generates Salt for the password
 */
const generateSalt = (length = 10) => {
  return bcrypt.genSaltSync(length);
};

var algorithm = "aes-256-cbc";
var password = "password";

const encrypt = (text) => {
  const cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text.toString(), "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};

const decrypt = (text) => {
  const decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};

const verifyToken = async (req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.headers["authorization"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

export {
  encryptPassword,
  comparePassword,
  generateSalt,
  encrypt,
  decrypt,
  generatePassword,
  verifyToken,
};
