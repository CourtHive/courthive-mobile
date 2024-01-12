// CourtHive Mobile Server
// Copyright 2024-2025 Charles Allen -- All Rights Reserved

// external module dependencies
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import passport from 'passport';
import express from 'express';
import cors from 'cors';
const app = express();

import { Server } from 'http';
const server = new Server(app);

// load configuration
// dotEnv is used in config to load environment variables from .env
// it must be in the config file or it may not load before use in other files
import { config } from './app/config/env';

import { jwtStrategy } from './app/config/passport-jwt';
import HttpStatusCodes from 'http-status-codes';

// Messaging
import { Server as SocketServer } from 'socket.io';
import coms from './app/messaging/coms';

// scoped variables
const port = config.app.port;
const staticFiles = '/app/static/';

// RECEIVING
// ===========================================================================
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: config.app.bodyParser.limit }));
app.use(bodyParser.urlencoded({ limit: config.app.bodyParser.limit, extended: true }));
app.use(cookieParser());
app.use(compress());

// AUTHENTICATION
// ===========================================================================
app.use(passport.initialize());
passport.use(jwtStrategy());

// ROUTES -------------------------------
app.use('/', express.static(__dirname + staticFiles));
// app.use('/auth', authRouter);
// app.use('/test', testRouter);
// app.use('/api', apiRouter);

// Handle 404
app.use((req, res) => {
  res.status(HttpStatusCodes.NOT_FOUND);
  let options = { root: './app/static/' };
  res.sendFile('index.html', options);
});

// START THE SERVER
// =============================================================================
const socketCors = {
  cors: {
    origins: ['*'],
    methods: ['GET', 'POST'],
  },
};
const io = new SocketServer(server, socketCors);

io.on('connection', (client) => {
  client.on('event', (data) => {
    console.log('event', { data });
  });
  client.on('disconnect', () => {
    console.log('disconnect');
  });
});

app.set('socketIo', io);
// alternatively... as middleware
// app.use((req, res, next) => { req.io = io; next(); });

coms.startComs(io);

server.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('MS:', { host, port, date: new Date() });
});
