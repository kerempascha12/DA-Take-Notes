import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import upload from '../../utils/upload.js';

const dirname = path.resolve();

const router = express.Router();

router.post('/', upload.single('pdfdatei'), (req, res) => {
  if (req.file) {
    res.send('Single file uploaded successfully');
  } else {
    res.status(400).send('Please upload a valid pdf');
  }
});

router.get('/', async (req, res) => {
  const files = await fs.readdir(path.join(dirname, '/public/pdf'));
  res.status(200).json(files);
});

router.delete('/:filename', async (req, res) => {
  try {
    const filePath = path.join(dirname, '/public/pdf', req.params.filename);
    await fs.access(filePath);
    await fs.unlink(filePath);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;
