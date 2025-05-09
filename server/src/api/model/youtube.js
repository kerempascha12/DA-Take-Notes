import { query } from '../../db/index.js';

const getVideoByVideoID = (id) => query('SELECT * FROM video WHERE id = $1;', [id]);

const getNotesByVideoID = (id) =>
  query(
    `SELECT n.noteid,
       n.title,
       n.content,
       n.created_at,
       yn.time
FROM note n
JOIN youtube_note yn on n.noteid = yn.noteid
JOIN video v on v.id = yn.video_id
WHERE v.id = $1
ORDER BY yn.time;`,
    [id],
  );

const postNote = (title, content, userID, videoID, time) =>
  query(
    `WITH inserted_note AS (
    INSERT INTO note (title, content, user_id, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING noteid
)
INSERT INTO youtube_note (noteid, video_id, time)
SELECT noteid, $4, $5 FROM inserted_note
RETURNING *;`,
    [title, content, userID, videoID, time],
  );

const getNoteByID = ({ nid }) =>
  query(
    `SELECT n.noteid,
       n.title,
       n.content,
       n.created_at,
       yn.time
FROM note n
JOIN youtube_note yn on n.noteid = yn.noteid
JOIN video v on v.id = yn.video_id
WHERE n.noteid = $1;`,
    [nid],
  );

const delNote = ({ nid }) => query('DELETE FROM note WHERE noteid = $1;', [nid]);

const updateNote = (title, content, noteid) =>
  query('UPDATE note SET title = $1, content = $2 WHERE noteid = $3;', [title, content, noteid]);

export { getVideoByVideoID, getNotesByVideoID, postNote, getNoteByID, delNote, updateNote };
