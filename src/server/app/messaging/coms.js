import { messageHandler } from './handler.js';
import { config } from '../config/env';

export const coms = {
  startComs: (io) => {
    const messageContext = io.of(config.socketIo.tmx);
    messageContext.on('connection', (client) => {
      client.on('mh', (data) => messageHandler(data, client, io));
      client.on('leave', client.leave);
      client.on('disconnect', () => {});
    });
  }
};

export default coms;
