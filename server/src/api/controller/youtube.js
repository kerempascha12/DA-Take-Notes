import * as model from '../model/youtube.js';

const getVideoByID = async (req, res) => {
  const { rows, rowCount } = await model.getVideoByVideoID(req.params.id);
  if (rowCount < 1) return res.status(400).send(`Kein Video mit dem ID ${req.params.id}`);
  return res.status(200).json(rows);
};

// Notes

const getNotesByVideoID = async (req, res) => {
  const { rows, rowCount } = await model.getNotesByVideoID(req.params.vid);
  if (rowCount < 1) return res.status(400).send(`Keine Notizen mit dem Video ${req.params.vid}`);
  return res.status(200).json(rows);
};

const postYTnote = async (req, res) => {
  const { title, content, userID, videoID, time } = req.body;
  if (time) {
    const { rows } = await model.postNote(title, content, userID, videoID, time);
    return res.status(200).json(rows);
  }
  const { rows } = await model.postNote(title, content, userID, videoID, null);
  return res.status(200).json(rows);
};

const getNoteByID = async (req, res) => {
  const { rows, rowCount } = await model.getNoteByID(req.params);
  if (rowCount < 1) return res.status(400).send(`Keine Notiz mit dem ID ${req.params.nid} gefunden`);
  return res.status(200).json(rows);
};

const delNote = async (req, res) => {
  const { rowCount } = await model.getNoteByID(req.params);
  if (rowCount < 1) return res.status(400).send(`Keine Notiz mit dem ID ${req.params.nid} gefunden`);
  await model.delNote(req.params);
  return res.status(200).send('deleted.');
};

const patchNote = async (req, res) => {
  const { rowCount } = await model.getNoteByID(req.params.nid);
  if (rowCount < 1) return res.status(400).send(`Keine Notiz mit dem ID ${req.params.nid} gefunden`);
  const { title, content } = req.body;
  if (title && content) {
    await model.updateNote(title, content, req.params.nid);
    return res.status(200).send(`Note ${req.params.nid} deleted`);
  }
  return res.status(400).send('Die Notiz konnte nicht bearbeitet werden.');
};

export { getVideoByID, getNotesByVideoID, postYTnote, getNoteByID, delNote, patchNote };
