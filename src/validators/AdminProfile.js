const Yup = require('yup');
const { Messages } = require('../common');

const schema = {
  email: Yup.string()
    .trim()
    .required(Messages.Required.replace(':item', 'Email address'))
    .email(Messages.InvalidEmail),
};

module.exports = {
  schema,
};
