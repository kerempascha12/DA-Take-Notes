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
    return req.status(200).json(rows);
  }
  const { rows } = await model.postNote(title, content, userID, videoID, null);
  return res.status(200).json(rows);
};

export { getVideoByID, getNotesByVideoID, postYTnote };
