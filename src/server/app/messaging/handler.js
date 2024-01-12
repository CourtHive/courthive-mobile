import { saveMatchUp } from '../services/fs/saveMatchUp';

const messages = {
  score: ({ client, payload }) => {
    client.emit('ack', { received: !!payload });
    return true;
  },
  history: ({ client, payload }) => {
    client.emit('ack', { received: !!payload });
    saveMatchUp(payload);
    return true;
  },
};

export function messageHandler(data, client, io) {
  const { type, payload = {} } = data;

  if (messages[type]) {
    const result = messages[type]({ client, payload, io });
    console.log({ type, result });
  } else {
    console.log({ notFound: type }, data);
  }
}
