import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import uploadsRouter from './api/routes/upload.js';
import databaseRouter from './api/routes/dbPDF.js';

const dirname = path.resolve();

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'], // or '*' to allow all (not recommended for production)
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

app.use(morgan('tiny'));
app.use(express.static(path.join(dirname, 'public')));
app.use(express.json());

app.use('/uploads', uploadsRouter);
app.use('/database', databaseRouter);

const PORT = process.env.PORT ?? 5555;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log('Server started');
