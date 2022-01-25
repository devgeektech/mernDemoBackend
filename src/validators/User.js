/** @format */

const Yup = require('yup');
const { Messages } = require('../common');

const schema = {
  firstName: Yup.string()
    .trim()
    .required(Messages.Required.replace(':item', 'First name')),
  lastName: Yup.string()
    .trim()
    .required(Messages.Required.replace(':item', 'Last name')),
  phoneNumber: Yup.string()
    .trim()
    .required(Messages.Required.replace(':item', 'Phone number')),
  email: Yup.string()
    .trim()
    .required(Messages.Required.replace(':item', 'Email address'))
    .email(Messages.InvalidEmail),
  
};

module.exports = {
  schema,
};
