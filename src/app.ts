import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config';
import authRouter from './modules/auth/auth.route';
import { notFound } from './middlewares/notFound';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('FixItNow Server Running')
});

app.use('/api/auth/', authRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;