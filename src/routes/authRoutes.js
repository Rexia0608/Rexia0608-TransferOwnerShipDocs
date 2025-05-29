import express from 'express';
import { getAuthUrl, oauthCallback, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', getAuthUrl);
router.get('/google/callback', oauthCallback);
router.get('/logout', logout);

export default router;