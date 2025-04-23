import { query } from '../../db/index.js';

// PowerPoint Dateien

const getPowerPoints = () => query('SELECT * FROM powerpoint_file;');

const getPowerPoint = ({ pptID }) =>
  query('SELECT * FROM powerpoint_file WHERE powerpoint_id = $1;', [pptID]);

const delPowerPointFile = ({ pptID }) =>
  query('DELETE FROM powerpoint_file WHERE powerpoint_id = $1;', [pptID]);

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

const getNotesByPPT = ({ pptID }) =>
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
WHERE ppt_id = $1;`,
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

export { getPowerPoints, getPowerPoint, delPowerPointFile, insertPPTNote, getNotesByPPT, getNotes };
