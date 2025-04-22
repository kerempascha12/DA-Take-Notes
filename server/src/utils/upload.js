import multer from 'multer';

const storageEngine = multer.diskStorage({
  destination: './public/pdf',
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
});

export default upload;
