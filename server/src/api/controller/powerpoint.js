import * as models from '../model/powerpoint.js';

// PowerPoint Dateien

const getPowerPoints = async (req, res) => {
  const { rows, rowCount } = await models.getPowerPoints();
  if (rowCount < 1) return res.status(400).send('Keine PowerPoint Dateien existieren');
  return res.status(200).json(rows);
};

const getPowerPoint = async (req, res) => {
  const { rows, rowCount } = await models.getPowerPoint(req.params);
  if (rowCount < 1) return res.status(400).send('Keine PowerPoint mit diesem ID gefunden');
  return res.status(200).json(rows[0]);
};

const delPowerPointFile = async (req, res) => {
  const { rowCount } = await models.getPowerPoint(req.params);
  if (rowCount < 1) return res.status(400).send('Keine PowerPoint mit diesem ID gefunden');
  await models.delPowerPointFile(req.params);
  return res.status(200).send('deleted.');
};

const postPowerPoint = async (req, res) => {
  const { src, width, height } = req.body;
  if (width == null || height == null) {
    const { rows } = await models.postPowerPoint(src, null, null);
    return res.status(200).json(rows);
  }
  const { rows } = await models.postPowerPoint(src, width, height);
  return res.status(200).json(rows);
};

// Notes

const getNotes = async (req, res) => {
  const { rows, rowCount } = await models.getNotes();
  if (rowCount < 1) return res.status(400).send('Keine Notizen gefunden');
  return res.status(200).json(rows);
};

const getNotesByPPT = async (req, res) => {
  const { rows, rowCount } = await models.getNotesByPPT(req.params);
  if (rowCount < 1) return res.status(400).send('Keine Notizen zu dieser PPT-Datei gefunden');
  return res.status(200).json(rows);
};

const insertPPTNote = async (req, res) => {
  const { title, content, userID, pptID } = req.body;
  if (title && content && userID && pptID) {
    const { rows } = await models.insertPPTNote(title, content, userID, pptID);
    return res.status(200).json(rows);
  }
  return res.status(400).send('Die Notiz konnte nicht hinzugefügt werden.');
};

export {
  getPowerPoints,
  getPowerPoint,
  delPowerPointFile,
  postPowerPoint,
  getNotes,
  getNotesByPPT,
  insertPPTNote,
};
