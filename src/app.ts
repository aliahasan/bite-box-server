import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

app.use(
  cors({
    origin: ['https://bitebox-meal.vercel.app', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to BiteBox',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
