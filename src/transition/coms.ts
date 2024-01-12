import { attemptJSONparse, formatDate, getOpponents, showModal } from './utilities';
import { app, env, updateAppState, updateMatchArchive } from './env';
import { loadDetails, stateChangeEvent } from './displayUpdate';
import { resetMatch } from './displayMatchArchive';
import { viewManager } from './viewManager';
import { connect } from 'socket.io-client';
import { pulseCircle } from './pulseCircle';
import { version } from '../config/version';

import * as d3 from 'd3';
import { closeModal } from './modals';

type ComsObject = {
  connectionOptions: any;
  socket: any;
};

export const coms: ComsObject = {
  socket: undefined,
  connectionOptions: {
    'force new connection': true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 'Infinity',
    timeout: 20000,
  },
};

export function connectSocket() {
  if ((navigator.onLine || window.location.hostname == 'localhost') && !coms.socket) {
    const server =
      window.location.hostname.startsWith('localhost') || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8833'
        : 'https://courthive.com';
    const connectionString = `${server}/mobile`;
    coms.socket = connect(connectionString, coms.connectionOptions);
    if (coms.socket) {
      coms.socket.on('connect', comsConnect);
      coms.socket.on('ack', (ack) => console.log({ ack }));
      coms.socket.on('disconnect', comsDisconnect);
      coms.socket.on('connect_error', comsError);
      coms.socket.on('history request', sendHistory);
      coms.socket.on('tmx message', receiveMatchUp);
    }
  }
}

export function disconnectSocket() {
  if (coms.socket) {
    coms.socket.disconnect();
    coms.socket = undefined;
  }
}

export function sendHistory() {
  connectSocket();
  if (coms.socket) {
    const match = env.match.metadata.defineMatch();
    const payload = {
      matchUp: {
        tournament: env.match.metadata.defineTournament(),
        first_service: env.match.set.firstService(),
        players: env.match.metadata.players(),
        format: env.match.format.settings(),
        scoreboard: env.match.scoreboard(),
        points: env.match.history.points(),
        matchUpId: match.muid,
        ch_version: version,
        match,
      },
    };
    if (match.muid) coms.socket.emit('mh', { type: 'history', payload });
  }
  closeModal();
}

function comsConnect() {
  console.log('connect');
}
function comsDisconnect() {
  console.log('socket closed');
}
function comsError() {
  showModal(` <p> <h1>No Internet Connection!</h1>`);
  endBroadcast();
}

function receiveMatchUp(data: any) {
  if (!data?.matchUpId) {
    const message = `<h2>Invalid Data</h2>`;
    return showModal(message);
  }

  const auth_match = attemptJSONparse(data.data);

  updateMatchArchive();
  resetMatch(auth_match.match.muid);

  env.match.metadata.defineTournament({
    name: auth_match.tournament.name,
    tuid: auth_match.tournament.tuid,
    start_date: formatDate(auth_match.tournament.start),
  });

  env.match.metadata.defineMatch({
    euid: auth_match.event.euid,
  });

  const format = auth_match.teams && 2 === auth_match.teams[0].length ? 'doubles' : 'singles';
  const teams = getOpponents({
    sides: auth_match.teams,
    format,
  });
  env.match.metadata.definePlayer({ index: 0, name: teams[0] });
  env.match.metadata.definePlayer({ index: 1, name: teams[1] });

  const surface: any = auth_match.event.surface;
  if (surface) {
    const surfaces: any = {
      C: 'clay',
      H: 'hard',
      G: 'grass',
    };
    if (surfaces[surface]) {
      env.match.metadata.defineTournament({ surface: surfaces[surface] });
    }
  }

  const in_out = auth_match.event.inout;
  if (in_out) {
    const inout: any = {
      o: 'out',
      i: 'in',
    };
    if (inout[in_out]) {
      env.match.metadata.defineTournament({ in_out: inout[in_out] });
    }
  }

  loadDetails();
  stateChangeEvent();
  viewManager('entry');
}

export function broadcasting() {
  if (app.broadcast && coms.socket) return true;
  if (app.broadcast) {
    connectSocket();
  }
  return false;
}

export function startBroadcast() {
  connectSocket();
  //@ts-expect-error unknown reason
  const pc: any = pulseCircle().color_range(['white', 'white']).height(60).width(60).radius(28).stroke_width(5);
  d3.select('#startpulse').style('display', 'none');
  d3.select('#pulse').style('display', 'block').call(pc);
}

function endBroadcast() {
  app.broadcast = false;
  d3.select('#startpulse').style('display', 'flex');
  d3.select('#pulse').style('display', 'none').selectAll('svg').remove();
  disconnectSocket();
}

export function sendKey(payload: any) {
  Object.assign(payload, {
    timestamp: new Date().getTime(),
    uuuid: app.user_uuid,
  });
  if (coms.socket) {
    coms.socket.emit('mh', { type: 'key', payload });
    closeModal();
  } else {
    const modaltext = ` <p> <h1>Not connected</h1> <p><i>Connection Error</i></p> </p> `;
    showModal(modaltext);
  }
}

export function broadcastToggle() {
  app.broadcast = !app.broadcast;
  if (app.broadcast) {
    startBroadcast();
  } else {
    endBroadcast();
  }
  updateAppState();
}

export function broadcastStatus(status: string) {
  if (broadcasting()) {
    const muid = env.match.metadata.defineMatch().muid;
    const data: any = { muid, status };
    const tournament = env.match.metadata.defineTournament();
    data.tuid = tournament.tuid || tournament.name;
    coms.socket.emit('mh', { type: 'status', payload: data });
  }
}
