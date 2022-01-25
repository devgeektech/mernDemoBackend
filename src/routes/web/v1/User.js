/** @format */

import express from 'express';
import { UserController } from '../../../controllers/web/v1';
import { validatePostBody } from '../../../util';
import { verifyToken } from '../../../util/User';


const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const router = express.Router();
const { User } = require('../../../validators');



router.post(
  '/',
  verifyToken,
  upload.single('audio'),
  validatePostBody(User.schema),
  UserController.add
);
router.get('/', verifyToken, UserController.list);
router.get('/:id', verifyToken, UserController.info);
router.delete('/:id', verifyToken, UserController.deleteUser);
router.post('/upload-audio', upload.single('audio'), UserController.uploadAudio);
router.put(
  '/:id',
  verifyToken,
  upload.single('audio'),
  validatePostBody(User.schema),
  UserController.update
);



export default router;
