/** @format */
import express from 'express';
import AuthRouter from './Auth';
import UserRouter from './User';
import HomeRouter from './Home';

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/home', HomeRouter);
export default router;
