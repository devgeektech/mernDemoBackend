/** @format */

import express from 'express';
import { AuthController } from '../../../controllers/web/v1';
import { validatePostBody } from '../../../util';
import { verifyToken } from '../../../util/User';

const router = express.Router();
const {
  adminLogin,
  ChangePassword,
  AdminProfile,
  ResetPassword,
} = require('../../../validators');

router.post(
  '/login',
  validatePostBody(adminLogin.schema),
  AuthController.login
);
router.get('/me', verifyToken, AuthController.me);
router.post(
  '/change-password',
  verifyToken,
  validatePostBody(ChangePassword.schema),
  AuthController.changePassword
);
router.put(
  '/',
  verifyToken,
  validatePostBody(AdminProfile.schema),
  AuthController.update
);

router.post('/forget-password', AuthController.forgetPassword);

router.put(
  '/set-password/:id',
  validatePostBody(ResetPassword.schema),
  AuthController.setPassword
);
router.put(
  '/reset-password/:id',
  validatePostBody(ResetPassword.schema),
  AuthController.setPassword
);
router.get('/user-list', verifyToken, AuthController.userList);
router.get('/check', (req, res) => {
  res.send('yes');
});

export default router;
