import * as models from '../model/powerpoint.js';

// PowerPoint Dateien

const getPowerPoints = async (req, res) => {
  const { rows } = await models.getPowerPoints();
  return res.status(200).json(rows);
};

const getPowerPoint = async (req, res) => {
  const { rows, rowCount } = await models.getPowerPoint(req.params);
  if (rowCount < 1) return res.status(400).send('Keine PowerPoint mit diesem ID gefunden');
  return res.status(200).json(rows);
};

const delPowerPointFile = async (req, res) => {
  const { rowCount } = await models.getPowerPoint(req.params);
  if (rowCount < 1) return res.status(400).send('Keine PowerPoint mit diesem ID gefunden');
  await models.delPowerPointFile(req.params);
  return res.status(200).send('deleted.');
};

const postPowerPoint = async (req, res) => {
  const { src, width, height, name } = req.body;
  if (width == null || height == null) {
    const { rows } = await models.postPowerPoint(src, null, null, name);
    return res.status(200).json(rows);
  }
  const { rows } = await models.postPowerPoint(src, width, height, name);
  return res.status(200).json(rows);
};

const renamePowerPoint = async (req, res) => {
  const { name } = req.body;
  if (name) {
    await models.renamePowerPoint(name, req.params.pptID);
    return res.status(200).send(`Die Notiz ${req.params.pptID} wurde ins ${name} umbenannt.`);
  }
  return res
    .status(400)
    .send(`Die PowerPoint-Datei mit dem ID ${req.params.pptID} konnte nicht umbenannt werden.`);
};

// Notes

const getNotes = async (req, res) => {
  const { rows, rowCount } = await models.getNotes();
  if (rowCount < 1) return res.status(400).send('Keine Notizen gefunden');
  return res.status(200).json(rows);
};

const getNotesByPPT = async (req, res) => {
  const { rows } = await models.getNotesByPPT(req.params);
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

const getNoteByID = async (req, res) => {
  const { rows, rowCount } = await models.getNoteByID(req.params);
  if (rowCount < 1)
    return res.status(400).send(`Keine Notiz mit dem ID ${req.params.nid} gefunden.`);
  return res.status(200).json(rows);
};

const delNote = async (req, res) => {
  const { rowCount } = await models.getNoteByID(req.params);
  if (rowCount < 1)
    return res.status(400).send(`Keine Notiz mit dem ID ${req.params.nid} gefunden.`);
  await models.delPPTNote(req.params);
  return res.status(200).send(`Notiz ${req.params.nid} deleted.`);
};

const patchNote = async (req, res) => {
  const { title, content } = req.body;
  await models.updateNote(title, content, req.params.nid);
  return res.status(200).send('updated.');
};

export {
  getPowerPoints,
  getPowerPoint,
  delPowerPointFile,
  postPowerPoint,
  renamePowerPoint,
  getNotes,
  getNoteByID,
  delNote,
  getNotesByPPT,
  insertPPTNote,
  patchNote,
};
