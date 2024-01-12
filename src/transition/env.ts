import { browserStorage } from './browserStorage';
import { firstAndLast } from './utilities';
import { mo } from '../services/matchObject/umo';

export const ch_version = '1.9';
export const charts: any = {};
const match = mo.Match();

export const app: any = {
  broadcast: undefined,
  user_uuid: undefined,
};

export const settings: any = {
  track_shot_types: undefined,
  audible_clicks: undefined,
  display_gamefish: undefined,
  auto_swap_sides: undefined,
  point_buttons: undefined,
};

export const env: any = {
  lets: 0,
  rally: 0,
  undone: [],
  view: 'entry',
  serve2nd: false,
  rally_mode: false,
  edit_player: undefined,
  match_swap: false, // automatic swap
  swap_sides: false, // user initiated swap
  orientation: 'vertical',
  serving: match.nextTeamServing(),
  receiving: match.nextTeamReceiving(),
  edit_point_index: undefined,
  provider: undefined,
  match,
};

const c1 = 'rgb(64, 168, 75)';
const c2 = 'rgb(255, 116, 51)';
const c3 = 'rgb(221, 56, 48)';
export const buttons: any = {
  first_serve: { color: c1, type: 'toggle' },
  second_serve: { color: c2, type: 'toggle' },
  double_fault: { color: c3, type: 'flash' },
  penalty: { color: c3, type: 'flash' },
  first_ace: { color: c1, type: 'flash' },
  second_ace: { color: c2, type: 'flash' },
  server_winner: { color: c1, type: 'flash' },
  server_unforced: { color: c3, type: 'flash' },
  server_forced: { color: c2, type: 'flash' },
  receiving_winner: { color: c1, type: 'flash' },
  receiving_unforced: { color: c3, type: 'flash' },
  receiving_forced: { color: c2, type: 'flash' },
};
export const options = {
  user_swap: false,
  highlight_better_stats: true,
  vertical_view: browserStorage.get('vertical_view') || 'vblack',
  horizontal_view: browserStorage.get('horizontal_view') || 'hblack',
};

export const device: any = {
  isStandalone: 'standalone' in window.navigator && window.navigator.standalone,
  isIDevice: /iphone|ipod|ipad/i.test(window.navigator.userAgent),
  isMobile: typeof window.orientation !== 'undefined',
  geoposition: {},
};

export const default_players = ['Player One', 'Player Two'];

export function clearActionEvents() {
  match.events.clearEvents();
}

export function updatePositions() {
  const left_side = env.swap_sides ? 1 : 0;
  const right_side = env.swap_sides ? 0 : 1;
  // var server_side = env.swap_sides ? 1 - env.serving : env.serving;
  // var receiver_side = env.swap_sides ? 1 - env.receiving : env.receiving;

  updateMatchArchive();

  const player_names = match.metadata.players();
  // var display_position = Array.from(document.getElementsByClassName("position_display"));
  // display_position[0].value = firstAndLast(player_names[left_side].name);
  // display_position[1].value = firstAndLast(player_names[right_side].name);
  const p1 = document.getElementById('playerone');
  const p2 = document.getElementById('playertwo');
  if (p1) p1.innerHTML = firstAndLast(player_names[left_side].name);
  if (p2) p2.innerHTML = firstAndLast(player_names[right_side].name);

  // new way
  const display_player_0 = Array.from(document.querySelectorAll('.display_player_0'));
  display_player_0.forEach((element) => (element.innerHTML = player_names[left_side].name));
  const display_player_1 = Array.from(document.querySelectorAll('.display_player_1'));
  display_player_1.forEach((element) => (element.innerHTML = player_names[right_side].name));
}

export function updateMatchArchive(force?: boolean) {
  const points = match.history.points();

  // var match_id = match.metadata.defineMatch().muid;
  const match_id = browserStorage.get('current_match');
  if (!match_id) return;
  const players = match.metadata.players();
  const save =
    force || points.length || (players[0].name != default_players[0] && players[1].name != default_players[1]);
  if (!save) return;

  // add key for current match
  const match_archive = JSON.parse(browserStorage.get('match_archive') || '[]');

  if (match_archive.indexOf(match_id) < 0) {
    match_archive.push(match_id);
    browserStorage.set('match_archive', JSON.stringify(match_archive));
  }

  const match_object = {
    ch_version: ch_version,
    players: players,
    first_service: match.set.firstService(),
    match: match.metadata.defineMatch(),
    format: match.format.settings(),
    tournament: match.metadata.defineTournament(),
    points: points,
    scoreboard: match.scoreboard(),
  };
  browserStorage.set(match_id, JSON.stringify(match_object));
}

export function restoreAppState() {
  const app_settings = browserStorage.get('CH_AppSettings');
  if (app_settings) Object.assign(settings, JSON.parse(app_settings));
  Object.keys(settings).forEach((key) => {
    const em: any = document.getElementById(key);
    if (em) em.checked = settings[key];
  });
  const app_state = browserStorage.get('CH_AppState');
  if (app_state) Object.assign(app, JSON.parse(app_state));
}

export function updateAppState() {
  Object.keys(settings).forEach((key) => {
    const em: any = document.getElementById(key);
    if (em) settings[key] = em.checked;
  });
  browserStorage.set('CH_AppSettings', JSON.stringify(settings));
  browserStorage.set('CH_AppState', JSON.stringify(app));
}

export function setOrientation() {
  if (device.isMobile) {
    env.orientation = window.screen.orientation.type == 'landscape-primary' ? 'landscape' : 'portrait';
  } else {
    env.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }
}
