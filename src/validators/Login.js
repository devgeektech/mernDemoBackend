/** @format */

import { Messages } from '../common';
import * as Yup from 'yup';

const schema = {
  email: Yup.string()
    .trim()
    .required(Messages.Required.replace(':item', 'Email address'))
    .email(Messages.InvalidEmail),
  password: Yup.string()
    .trim()
    .required(Messages.Required.replace(':item', 'Password')),
};

export { schema };
