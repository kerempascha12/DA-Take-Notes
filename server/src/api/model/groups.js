import { query } from '../../db/index.js';

/* === Gruppe erstellen mit randomCode === */
const createGroup = (name, ownerId, videoId, randomCode) =>
  query(
    'INSERT INTO groups (name, owner_id, video_id, random_code) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, ownerId, videoId, randomCode],
  );

/* === Gruppe anhand ID finden === */
const findGroupById = (groupId) => query('SELECT * FROM groups WHERE id = $1', [groupId]);

/* === Gruppe anhand randomCode finden === */
const findGroupByRandomCode = (randomCode) =>
  query('SELECT * FROM groups WHERE random_code = $1', [randomCode]);

/* === Mitglied zu einer Gruppe hinzufügen === */
const addMemberToGroup = (groupId, userId) =>
  query('INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *', [
    groupId,
    userId,
  ]);

/* === Mitglieder einer Gruppe holen === */
const getMembersByGroupId = (groupId) =>
  query(
    `
    SELECT u.id, u.name, u.email
    FROM group_members gm
    JOIN users u ON gm.user_id = u.id
    WHERE gm.group_id = $1
    `,
    [groupId],
  );

/* === Gruppe löschen === */
const deleteGroup = (groupId) => query('DELETE FROM groups WHERE id = $1', [groupId]);

/* === Gruppen, an denen ein Benutzer beteiligt ist === */
const getGroupsByUserId = (userId) =>
  query(
    `
    SELECT DISTINCT g.*
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    WHERE g.owner_id = $1 OR gm.user_id = $1
    `,
    [userId],
  );

export {
  createGroup,
  findGroupById,
  findGroupByRandomCode, // NEU hinzugefügt ✅
  addMemberToGroup,
  getMembersByGroupId,
  deleteGroup,
  getGroupsByUserId,
};
