/** @format */

import { Messages } from '../common';
import * as Yup from 'yup';

const schema = {
    newPassword: Yup.string()
        .trim()
        .required(Messages.Required.replace(':item', 'New Password'))
        .min(6, 'New Password must be at least 6 characters.')
        .max(15, 'New Password must be at most 15 characters.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], Messages.ConfirmPassword)
};

export { schema };
