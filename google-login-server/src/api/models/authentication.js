import { query } from '../../db/index.js';

const addUser = (id, accessToken, refreshToken, expiresIn, obtainedAt) =>
  query(
    'insert into users(id, access_token, refresh_token, expires_in, obtained_at) VALUES ($1, $2, $3, $4, $5)',
    [id, accessToken, refreshToken, expiresIn, obtainedAt],
  );

const findUserById = (id) => query('SELECT * FROM users WHERE id = $1', [id]);

const deleteUserById = (id) => query('DELETE FROM users WHERE id = $1', [id]);

const findVideoByUserId = (userId) =>
  query('SELECT * FROM video WHERE user_id::numeric = $1;', [userId]);

// Add the deleteVideoByUserId function here

export { addUser, findUserById, deleteUserById, findVideoByUserId };
