import express from 'express';
import {
  oauth2callback,
  getUser,
  logout,
  redirectLogin,
  getUserVideo,
} from '../controllers/authentication.js';

const router = express.Router();

router.post('/oauth2callback', oauth2callback);

router.get('/user', redirectLogin, getUser);

router.get('/user/video', getUserVideo);

router.get('/logout', redirectLogin, logout);

export default router;
