/** @format */

import express from 'express';
import AdminRoutes from './web/v1';
//import AppRoutes from './app/v1';

const router = express.Router();

router.use('/web/v1', AdminRoutes);
//router.use('/app/v1', AppRoutes);

export default router;