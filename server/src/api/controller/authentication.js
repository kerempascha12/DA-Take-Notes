import axios from 'axios';
import dotenv from 'dotenv';
import * as model from '../model/authentication.js';

dotenv.config();
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

/* === Tokenprüfung === */
const isTokenExpired = (expiresIn, obtainedAt) => {
  const currentTime = Date.now();
  const expirationTime = obtainedAt.getTime() + expiresIn * 1000;
  return currentTime >= expirationTime;
};

/* === OAuth2-Callback === */
const oauth2callback = async (req, res) => {
  try {
    const { code } = req.body;
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = response.data;

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { sub: id } = userResponse.data;

    const { rowCount } = await model.findUserById(id);
    if (rowCount === 0) {
      const obtainedAt = new Date();
      await model.addUser(id, accessToken, refreshToken, expiresIn, obtainedAt);
    }

    req.session.userId = id;
    req.session.save();
    return res.redirect('/auth/user');
  } catch (error) {
    return res.status(400).end();
  }
};

/* === Middleware zum Login-Check === */
const redirectLogin = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

/* === User-Daten holen === */
const getUser = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized: No active session' });
  }

  try {
    const { rows, rowCount } = await model.findUserById(req.session.userId);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { access_token: accessToken, expires_in: expiresIn, obtained_at: obtainedAt } = rows[0];
    const obtainedAtDate = new Date(obtainedAt);

    if (isTokenExpired(expiresIn, obtainedAtDate)) {
      await model.deleteUserById(req.session.userId);
      return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            return reject(res.status(500).json({ error: 'Session destruction failed' }));
          }

          res.clearCookie('connect.sid');
          return resolve(res.status(401).json({ message: 'Token expired, please log in again' }));
        });
      });
    }

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { name, email, picture } = userResponse.data;

    return res.status(200).json({ name, email, picture });
  } catch (error) {
    console.error('Error in getUser function:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* === Logout === */
const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie(process.env.SESSION_NAME);
  res.status(200).end();
};

/* === Videos === */
const getUserVideo = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized: No active session' });
  }

  try {
    const { rows, rowCount } = await model.findVideoByUserId(req.session.userId);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'No video found for this user' });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error in getUserVideo function:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addUserVideo = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized: No active session' });
  }

  try {
    const { videoId, title } = req.body;
    await model.addVideo(videoId, req.session.userId, title);
    return res.status(201).json({ message: 'Video added successfully' });
  } catch (error) {
    console.error('Error in addUserVideo function:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { oauth2callback, getUser, redirectLogin, logout, getUserVideo, addUserVideo };
