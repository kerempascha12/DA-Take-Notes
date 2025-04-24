import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import authRoutes from './api/routes/authentication.js';
import { errorHandler, notFoundHandler } from './error/errorHandler.js';

dotenv.config();
const { SESSION_LIFETIME, SESSION_NAME, SESSION_SECRET } = process.env;

const dirname = path.resolve();

const app = express();

app.use(morgan('dev'));

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cors(corsConfig));
app.use(express.static(path.join(dirname, '/public')));

app.use(
  session({
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: SESSION_LIFETIME * 1000 * 60 * 60,
      httpOnly: false,
      sameSite: false,
      secure: false,
    },
  }),
);

app.use(express.json());

app.use('/auth', authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
