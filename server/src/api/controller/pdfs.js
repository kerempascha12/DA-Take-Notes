import * as models from '../model/pdfs.js';

const postPDF = async (req, res) => {
  const { rows } = await models.postPDF(req.body.name);
  try {
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getPDF = async (req, res) => {
  const { rows, rowCount } = await models.getPDF(req.params.name);
  if (rowCount <= 0) return res.status(404).send('PDF Not found');
  return res.status(200).json(rows);
};

const deletePDF = async (req, res) => {
  const { rows } = await models.getPDF(req.params.name);
  if (rows.length <= 0) return res.status(404).send('Eine PDF-Datei mit diesem Namen existiert nicht');
  await models.deletePDF(req.params.name);
  return res.status(200).send('deleted');
};

const getPDFbyID = async (req, res) => {
  const { rows, rowCount } = await models.getPDFbyID(req.params);
  if (rowCount < 1) return res.status(400).send('Keine PDF Datei gefunden.');
  return res.status(200).json(rows);
};

const postNote = async (req, res) => {
  const { title, content, userID, pdfID } = req.body;
  if (title && content && userID && pdfID) {
    const { rows } = await models.postNote(title, content, userID, pdfID);
    return res.status(200).json(rows);
  }
  return res.status(400).send('Ein Fehler ist aufgetreten');
};

const getNotesByPDF = async (req, res) => {
  const { rows, rowCount } = await models.getNotesByPDF(req.params.pdfID);
  if (rowCount < 1) return res.status(400).send('Keine Notizen zu diesem PDF gefunden');
  return res.status(200).json(rows);
};

const delNote = async (req, res) => {
  await models.delNote(req.params.noteID);
  return res.status(200).send('deleted note.');
};

const getNoteByID = async (req, res) => {
  const { rows, rowCount } = await models.getNoteByID(req.params.noteid);
  if (rowCount < 1) return res.status(400).send('Eine Notiz mit diesem ID existiert nicht.');
  return res.status(200).json(rows);
};

const patchNote = async (req, res) => {
  const { noteid } = req.params;
  const { rowCount } = await models.getNoteByID(noteid);
  if (rowCount < 1) return res.status(400).send('Keine Notiz mit diesem ID gefunden.');
  const { title, content } = req.body;
  await models.updateNote(title, content, noteid);
  return res.status(200).send('Notiz bearbeitet');
};

export {
  postPDF,
  getPDF,
  deletePDF,
  getPDFbyID,
  postNote,
  getNotesByPDF,
  delNote,
  getNoteByID,
  patchNote,
};
