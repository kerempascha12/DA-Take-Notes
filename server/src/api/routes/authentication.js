import express from 'express';
import * as controller from '../controller/authentication.js';

const router = express.Router();

/* === OAuth & User === */
router.post('/oauth2callback', controller.oauth2callback);
router.get('/user', controller.redirectLogin, controller.getUser);
router.get('/logout', controller.redirectLogin, controller.logout);

/* === Videos === */
router.get('/user/video', controller.redirectLogin, controller.getUserVideo);
router.post('/user/video', controller.redirectLogin, controller.addUserVideo);
router.get('/user/youtube/video-info', controller.redirectLogin, controller.getYoutubeVideoInfo);
router.delete('/user/video/:videoId', controller.redirectLogin, controller.deleteUserVideo);

export default router;
