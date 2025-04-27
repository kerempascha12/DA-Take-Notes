import { query } from '../../db/index.js';

const postPDF = (name) => query('INSERT INTO pdf_file (name) VALUES ($1) returning *;', [name]);

const deletePDF = (name) => query('DELETE FROM pdf_file WHERE name = $1', [name]);

const getPDF = (name) => query('SELECT * FROM pdf_file WHERE name=$1;', [name]);

const getPDFbyID = ({ id }) => query('SELECT * FROM pdf_file WHERE id=$1;', [id]);

const postNote = (title, content, userID, pdfID) =>
  query(
    `WITH inserted_note AS (
    INSERT INTO note (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING noteid
)
INSERT INTO pdfnote (noteid, pdf_id)
SELECT noteid, $4 FROM inserted_note
RETURNING *;`,
    [title, content, userID, pdfID],
  );

const getNotesByPDF = (id) =>
  query(
    `SELECT n.title as title,
       n.content as content,
       pdf.id as pdfID,
       pdf.name as pdfName,
       n.noteid as noteID
FROM note n
JOIN pdfnote p ON p.noteid = n.noteid
JOIN pdf_file pdf on pdf.id = p.pdf_id
WHERE pdf_id = $1;`,
    [id],
  );

const delNote = (noteid) => query('DELETE FROM note WHERE noteid = $1;', [noteid]);

const getNoteByID = (noteid) => query('SELECT * FROM note WHERE noteid = $1;', [noteid]);

const updateNote = (title, content, noteid) =>
  query('UPDATE note SET title = $1, content = $2 WHERE noteid = $3;', [title, content, noteid]);

export {
  postPDF,
  getPDF,
  deletePDF,
  postNote,
  getPDFbyID,
  getNotesByPDF,
  delNote,
  getNoteByID,
  updateNote,
};
