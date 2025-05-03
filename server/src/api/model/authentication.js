import { query } from '../../db/index.js';

/* === USERS === */
const addUser = (id, accessToken, refreshToken, expiresIn, obtainedAt) =>
  query(
    'INSERT INTO users(id, access_token, refresh_token, expires_in, obtained_at) VALUES ($1, $2, $3, $4, $5)',
    [id, accessToken, refreshToken, expiresIn, obtainedAt],
  );

const findUserById = (id) => query('SELECT * FROM users WHERE id = $1', [id]);

const deleteUserById = (id) => query('DELETE FROM users WHERE id = $1', [id]);

/* === VIDEO === */
/* === VIDEO === */
const findVideoByUserId = (userId) =>
  query('SELECT * FROM video WHERE user_id::numeric = $1;', [userId]);

const addVideo = (videoId, userId, title) =>
  query('INSERT INTO video (video_id, user_id, title) VALUES ($1, $2, $3)', [
    videoId,
    userId,
    title,
  ]);

const deleteVideoById = (videoId, userId) =>
  query('DELETE FROM video WHERE video_id = $1 AND user_id::numeric = $2', [videoId, userId]);

const updateVideoLikedStatus = (videoId, userId, liked) =>
  query('UPDATE video SET liked = $1 WHERE video_id = $2 AND user_id::numeric = $3', [
    liked,
    videoId,
    userId,
  ]);

const findVideoByRandomCode = (randomCode) =>
  query('SELECT * FROM video WHERE random_code = $1', [randomCode]);

export {
  // User
  addUser,
  findUserById,
  deleteUserById,

  // Video
  findVideoByUserId,
  addVideo,
  deleteVideoById,
  updateVideoLikedStatus,
  findVideoByRandomCode,
};
