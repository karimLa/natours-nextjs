import path from 'path';
import dotenv from 'dotenv';
import { ConnectionOptions, QueryFindOneAndUpdateOptions } from 'mongoose';

export const dev = process.env.NODE_ENV !== 'production';

if (dev) {
  dotenv.config({
    path: path.resolve(__dirname, '..', '.env.development.local'),
  });
} else {
  dotenv.config({
    path: path.resolve(__dirname, '..', '.env.production.local'),
  });
}

export const port = parseInt(process.env.PORT || '3000', 10);
export const dbOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
export const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/natours';
export const queryUpdateOptions: QueryFindOneAndUpdateOptions = {
  new: true,
  runValidators: true,
};
