import bcrypt from 'bcrypt';
import crypto, { Hash, Decipher, Cipher } from 'crypto';

/**
 * Generate Password
 */
const generatePassword = (length = 8) => {
  var text = '';
  var possible =
    'abcdefghijkmnopqrstuvwxyz!@#$%^&*()ABCDEFGHJKLMNOPQRSTUVWXYZ023456789';
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

/**
 * Encrypt the password using bcrypt algo
 */
const encryptPassword = (password, salt) => {
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
/**
 * JWT Secret
 */
const JWTSecrete = 'qwertyuiop[]lkjhgfdazxcvbnm,./!@#$%^&*()';

/**
 * Encrypt Email and Id
 */
var algorithm = 'aes-256-cbc';
var password = 'password';
const encrypt = (text) => {
  const cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text.toString(), 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};
/**
|--------------------------------------------------
| Dycript Email and Id
|--------------------------------------------------
*/
const decrypt = (text) => {
  const decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

/**
|--------------------------------------------------
| Get IP Address
|--------------------------------------------------
*/

const getIpAddress = (req, connection) => {
  var ip = null;
  if (connection) {
    ip = connection.context.ip;
  } else {
    ip = '';
  }
  try {
    if (req) {
      const ipAddress =
        (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      const ipAdd = ipAddress.split('.');
      ip = ipAdd
        .map((ipA, index) => (index == ipAdd.length - 1 ? 'XXX' : ipA))
        .join('.');
    }
  } catch (ex) {
    ip = null;
  }
  return ip;
};

export {
  encryptPassword,
  comparePassword,
  generateSalt,
  JWTSecrete,
  generatePassword,
  encrypt,
  decrypt,
  getIpAddress,
};
