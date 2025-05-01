import { query } from '../../db/index.js';

// PowerPoint Dateien

const postPowerPoint = (src, width, height, name) =>
  query(
    'INSERT INTO powerpoint_file(src, height, width, name) values ($1, $2, $3, $4) RETURNING *;',
    [src, width, height, name],
  );

const getPowerPoints = () => query('SELECT * FROM powerpoint_file ORDER BY name;');

const getPowerPoint = ({ pptID }) =>
  query('SELECT * FROM powerpoint_file WHERE powerpoint_id = $1;', [pptID]);

const delPowerPointFile = ({ pptID }) =>
  query('DELETE FROM powerpoint_file WHERE powerpoint_id = $1;', [pptID]);

const renamePowerPoint = (pptName, pptID) =>
  query('UPDATE powerpoint_file SET name = $1 WHERE powerpoint_id = $2;', [pptName, pptID]);

// PowerPointNotes

const insertPPTNote = (title, content, userID, pptID) =>
  query(
    `WITH inserted_note AS (
    INSERT INTO note (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING noteid
)
    INSERT INTO powerpointnote (noteid, powerpoint_id)
    SELECT noteid, $4
    FROM inserted_note
    RETURNING *;
`,
    [title, content, userID, pptID],
  );

const getNoteByID = ({ nid }) =>
  query(
    `SELECT n.title as title,
       n.content as content,
       n.noteid as noteid,
       n.user_id as userid,
       ppt.src as src,
       ppt.powerpoint_id as pptID
FROM note n
JOIN powerpointnote pn on pn.noteid = n.noteid
JOIN powerpoint_file ppt on ppt.powerpoint_id = pn.powerpoint_id
WHERE n.noteid=$1;`,
    [nid],
  );

const delPPTNote = ({ nid }) => query('DELETE FROM note WHERE noteid=$1;', [nid]);

const getNotesByPPT = ({ pptID }) =>
  query(
    `SELECT n.title as title,
       n.content as content,
       n.noteid as noteid,
       n.user_id as userid,
       ppt.src as src,
       ppt.name as name,
       ppt.powerpoint_id as pptID
FROM note n
JOIN powerpointnote pn on pn.noteid = n.noteid
JOIN powerpoint_file ppt on ppt.powerpoint_id = pn.powerpoint_id
WHERE ppt.powerpoint_id = $1;`,
    [pptID],
  );

const getNotes = () =>
  query(`SELECT n.title as title,
       n.content as content,
       n.noteid as noteid,
       n.user_id as userid,
       ppt.src as src,
       ppt.powerpoint_id as pptID
FROM note n
JOIN powerpointnote pn on pn.noteid = n.noteid
JOIN powerpoint_file ppt on ppt.powerpoint_id = pn.powerpoint_id;`);

const updateNote = (title, content, noteid) =>
  query('UPDATE note SET title = $1, content = $2 WHERE noteid = $3;', [title, content, noteid]);

export {
  getPowerPoints,
  getPowerPoint,
  delPowerPointFile,
  postPowerPoint,
  renamePowerPoint,
  insertPPTNote,
  delPPTNote,
  getNoteByID,
  getNotesByPPT,
  getNotes,
  updateNote,
};
