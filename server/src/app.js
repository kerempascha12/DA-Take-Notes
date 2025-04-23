import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import pgSession from 'connect-pg-simple'; // ⬅ falls du PostgreSQL-basierte Sessions willst

import { errorHandler, notFoundHandler } from './error/errorHandler.js';
import authRoutes from './api/routes/authentication.js';
import uploadsRouter from './api/routes/upload.js';
import databaseRouter from './api/routes/dbPDF.js';

dotenv.config();

const { SESSION_LIFETIME, SESSION_NAME, SESSION_SECRET } = process.env;

const dirname = path.resolve();
const app = express();

// Logging
app.use(morgan('dev'));

// CORS-Konfiguration
app.use(cors({
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  credentials: true,
}));

// JSON-Verarbeitung
app.use(express.json());

// Statische Dateien (z. B. Bilder, PDF-Previews)
app.use(express.static(path.join(dirname, 'public')));

// === Session Setup ===
const PgSession = pgSession(session);
import { pool } from './db/index.js'; // deine PostgreSQL DB-Connection

app.use(session({
  store: new PgSession({
    pool: pool, // PostgreSQL-Pool
    tableName: 'session',
  }),
  name: SESSION_NAME,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(SESSION_LIFETIME) || 1000 * 60 * 60 * 2, // 2h
    sameSite: 'lax',
    secure: false, // auf true setzen mit HTTPS
  }
}));

// === Routen ===
app.use('/auth', authRoutes);
app.use('/uploads', uploadsRouter);
app.use('/database', databaseRouter);

// === Fehler-Handling ===
app.use(notFoundHandler);
app.use(errorHandler);

// === Server-Start ===
const PORT = process.env.PORT ?? 5555;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
