import { encryptPassword } from '../common';
import { UserModel } from '../models';

const getSuperadmin = async () => {
  const result = await UserModel.find({ email: 'superadmin@wyred.com' });
  if (result.length == 0) {
    UserModel.create({
      firstName: 'Superadmin',
      email: 'superadmin@wyred.com',
      password: encryptPassword('Admin#@!$@'),
      gender: 'Male',
      role: 'SuperAdmin',
    });
  }
};
getSuperadmin();
