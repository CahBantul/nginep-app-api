import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { config as dotenv } from 'dotenv';
import cors from 'cors';

import HotelsRoutes from './routers/HotelsRoutes';
import ErrorHandling from './utils/ErrorHandling';
import AuthRoutes from './routers/AuthRoutes';
import cookieParser from 'cookie-parser';
import UsersRoutes from './routers/UsersRoutes';
import RoomRoutes from './routers/RoomRoutes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.parser();
    this.routes();
    this.errorHandling();
    dotenv();
  }

  protected parser(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
  }

  protected routes(): void {
    this.app.use('/api/v1', AuthRoutes);
    this.app.use('/api/v1/hotels', HotelsRoutes);
    this.app.use('/api/v1/users', UsersRoutes);
    this.app.use('/api/v1/rooms', RoomRoutes);
  }

  protected errorHandling(): void {
    this.app.use(ErrorHandling.serverError);
    this.app.use(ErrorHandling.clientError);
  }
}

const PORT: number = 3001;
const app = new App().app;

const connect = async () => {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('connected to mongoDB');
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('connected', () => {
  console.log('mongoDB connected!');
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!');
});

app.listen(PORT, () => {
  connect();
  console.log(`app run at http://localhost:${PORT}`);
});
