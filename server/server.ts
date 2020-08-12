import { dev, dbURI, dbOptions } from './constants';
import express from 'express';
import { connect } from 'mongoose';
import passport from 'passport';
import { auth, users } from './routes';

connect(dbURI, dbOptions)
  .then(() => {
    console.log('> DB Connected.');
  })
  .catch((err) => {
    console.log(`> MongoDB connection error. ${err}`);
    process.exit(1);
  });

const server = express();

if (dev) {
  server.use(require('morgan')('dev'));
}

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(passport.initialize());

server.use('/api/v1/auth', auth);
server.use('/api/v1/users', users);

export default server;
