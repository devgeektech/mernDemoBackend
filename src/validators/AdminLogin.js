/** @format */

const Yup = require("yup");
import { Messages } from "../common";

const schema = {
  email: Yup.string()
    .trim()
    .required(Messages.Required.replace(":item", "Email address"))
    .email(Messages.InvalidEmail),
  password: Yup.string()
    .trim()
    .required(Messages.Required.replace(":item", "Password")),
};

module.exports = {
  schema,
};
