import { env, options, settings, updateMatchArchive, updatePositions } from './env';
import { browserStorage } from './browserStorage';
import { groupGames } from './groupGames';
import { closeModal } from './modals';

export function updateScore() {
  const score = env.match.score();
  const sets_counter = score.counters.sets;
  const games_counter = score.counters.games;
  const points = score.points.split('-');
  const left_side = env.swap_sides ? 1 : 0;
  const right_side = env.swap_sides ? 0 : 1;

  // old way
  const point_fields: any = Array.from(document.getElementsByClassName('points'));
  point_fields.forEach((field: any, index: number) => {
    field.value = points[env.swap_sides ? 1 - index : index];
  });

  // new way
  const display_point_0 = Array.from(document.querySelectorAll('.display_points_0'));
  display_point_0.forEach((element) => (element.innerHTML = points[left_side]));
  const display_point_1 = Array.from(document.querySelectorAll('.display_points_1'));
  display_point_1.forEach((element) => (element.innerHTML = points[right_side]));

  const display_game_0 = Array.from(document.querySelectorAll('.display_games_0'));
  display_game_0.forEach((element) => (element.innerHTML = games_counter[left_side]));
  const display_game_1 = Array.from(document.querySelectorAll('.display_games_1'));
  display_game_1.forEach((element) => (element.innerHTML = games_counter[right_side]));

  const display_set_0 = Array.from(document.querySelectorAll('.display_sets_0'));
  display_set_0.forEach((element) => (element.innerHTML = sets_counter[left_side]));
  const display_set_1 = Array.from(document.querySelectorAll('.display_sets_1'));
  display_set_1.forEach((element) => (element.innerHTML = sets_counter[right_side]));

  const sets = score.components.sets;
  const threshold = env.match.format.threshold();
  const max_games = threshold == 1 ? 0 : threshold > 2 ? 4 : 2;
  [0, 1, 2, 3, 4].forEach((index) => {
    if (!sets || (sets && !sets[index])) {
      // old way
      const set_fields = Array.from(document.getElementsByClassName('games' + index));
      set_fields.forEach((field: any) => (field.value = '-'));
      // new way
      const player0_games = Array.from(document.getElementsByClassName('display_set_' + index + '_games_0'));
      player0_games.forEach((field) => (field.innerHTML = index > max_games ? ' ' : '-'));
      const player1_games = Array.from(document.getElementsByClassName('display_set_' + index + '_games_1'));
      player1_games.forEach((field) => (field.innerHTML = index > max_games ? ' ' : '-'));
    }
  });

  if (!sets) return;

  sets.forEach((set: any, index: number) => {
    // old way
    const set_fields: any = Array.from(document.getElementsByClassName('games' + index));
    set_fields.forEach((field: any, index: number) => (field.value = set.games[env.swap_sides ? 1 - index : index]));
    // new way
    const player0_games = Array.from(document.getElementsByClassName('display_set_' + index + '_games_0'));
    player0_games.forEach((field) => (field.innerHTML = set.games[env.swap_sides ? 1 : 0]));
    const player1_games = Array.from(document.getElementsByClassName('display_set_' + index + '_games_1'));
    player1_games.forEach((field) => (field.innerHTML = set.games[env.swap_sides ? 0 : 1]));
  });
}

export function loadDetails() {
  const players = env.match.metadata.players();
  players.forEach((player: any, index: number) => {
    const attributes = ['hand', 'entry', 'seed', 'draw_position', 'ioc', 'rank'];
    attributes.forEach((detail) => {
      const target_id = `player${index}_${detail}`;
      const target: any = document.getElementById(target_id);
      if (target) target.value = player[detail] || '';
    });
  });

  const match_details = env.match.metadata.defineMatch();
  const m_attrs = ['court', 'umpire'];
  m_attrs.forEach((attribute) => {
    const target_id = `match_${attribute}`;
    const tid: any = document.getElementById(target_id);
    if (tid) tid.value = match_details[attribute] || '';
  });

  const tournament = env.match.metadata.defineTournament();
  const t_attrs = ['name', 'start_date', 'tour', 'rank', 'surface', 'in_out', 'draw', 'draw_size', 'round'];
  t_attrs.forEach((attribute) => {
    const target_id = `tournament_${attribute}`;
    const tid: any = document.getElementById(target_id);
    if (tid) tid.value = tournament[attribute] || '';
  });
}

export function stateChangeEvent() {
  updateMatchArchive();
  env.serve2nd = false;
  env.rally_mode = false;
  updateState();
  updateScore();
  visibleButtons();
}

export function visibleButtons() {
  const points = env.match.history.action('addPoint');
  const match_archive = JSON.parse(browserStorage.get('match_archive') || '[]');
  Array.from(document.querySelectorAll('.view_stats')).forEach(
    (div: any) => (div.style.display = points.length > 0 ? 'inline' : 'none'),
  );
  Array.from(document.querySelectorAll('.change_server')).forEach(
    (div: any) => (div.style.display = points.length == 0 ? 'inline' : 'none'),
  );
  Array.from(document.querySelectorAll('.view_archive')).forEach(
    (div: any) => (div.style.display = points.length == 0 && match_archive.length ? 'inline' : 'none'),
  );
  Array.from(document.querySelectorAll('.view_settings')).forEach(
    (div: any) => (div.style.display = points.length == 0 && !match_archive.length ? 'inline' : 'none'),
  );
  Array.from(document.querySelectorAll('.view_history')).forEach(
    (div: any) => (div.style.display = points.length > 0 ? 'inline' : 'none'),
  );
  Array.from(document.querySelectorAll('.undo')).forEach((div: any) => {
    div.style.display = points.length > 0 || env.serve2nd || env.rally_mode ? 'flex' : 'none';
  });
  Array.from(document.querySelectorAll('.redo')).forEach((div: any) => {
    div.style.display = env.undone.length ? 'flex' : 'none';
  });
  const last_point = points.length ? points[points.length - 1] : undefined;
  const status_message = statusMessage();
  env.match.status = status_message;
  Array.from(document.querySelectorAll('.status_message')).forEach((div) => (div.innerHTML = status_message));

  function statusMessage() {
    if (last_point) {
      if (last_point.needed.points_to_set && Math.min(...last_point.needed.points_to_set) == 1) return 'SET POINT';
      if (last_point.point.breakpoint) return 'BREAK POINT';
      if (last_point.needed.points_to_game && last_point.needed.points_to_game[last_point.point.server] == 1)
        return 'GAME POINT';
    }
    if (env.lets) return `Lets: ${env.lets}`;
    return '';
  }
}

export function updateState() {
  if (env.match.nextTeamServing() != env.serving) setTimeout(() => swapServer(), 400);
  resetButtons();
  updatePositions();
}

export function resetButtons() {
  const server_side = env.swap_sides ? 1 - env.serving : env.serving;
  const receiver_side = env.swap_sides ? 1 - env.receiving : env.receiving;

  Array.from(document.querySelectorAll('.fault')).forEach((div) => (div.innerHTML = 'Fault'));

  const server_mode = `.modeaction_player${server_side}`;
  Array.from(document.querySelectorAll(server_mode)).forEach((div) => (div.innerHTML = 'Serve'));

  const server_fault = `.modeerr_player${server_side}`;
  Array.from(document.querySelectorAll(server_fault)).forEach((div) => (div.innerHTML = 'Fault'));
  const server_ace = `.modewin_player${server_side}`;
  Array.from(document.querySelectorAll(server_ace)).forEach((div) => (div.innerHTML = 'Ace'));
  const server_let = `.modeforce_player${server_side}`;
  Array.from(document.querySelectorAll(server_let)).forEach((div) => (div.innerHTML = 'Let'));

  const receiver_mode = `.modeaction_player${receiver_side}`;
  Array.from(document.querySelectorAll(receiver_mode)).forEach((div) => (div.innerHTML = 'Return'));

  const receiver_ufe = `.modeerr_player${receiver_side}`;
  Array.from(document.querySelectorAll(receiver_ufe)).forEach((div) => (div.innerHTML = 'UFE'));
  const receiver_winner = `.modewin_player${receiver_side}`;
  Array.from(document.querySelectorAll(receiver_winner)).forEach((div) => (div.innerHTML = 'Winner'));
  const receiver_forced = `.modeforce_player${receiver_side}`;
  Array.from(document.querySelectorAll(receiver_forced)).forEach((div) => (div.innerHTML = 'Forced'));

  Array.from(document.querySelectorAll('.vs_point_button')).forEach(
    (div: any) => (div.style.display = settings.point_buttons ? 'flex' : 'none'),
  );

  Array.from(document.querySelectorAll('.rally')).forEach((div) => (div.innerHTML = 'Rally'));
}

export function swapServer() {
  env.serving = env.match.nextTeamServing();
  env.receiving = env.match.nextTeamReceiving();

  if (settings.auto_swap_sides) {
    const games = groupGames();
    let game_number: number = games.length;
    if (games[games.length - 1].complete) game_number += 1;
    env.match_swap = swapSides(game_number);
  } else {
    env.match_swap = false;
  }
  setCourtSide();

  const server_side = env.swap_sides ? 1 - env.serving : env.serving;
  const receiver_side = env.swap_sides ? 1 - env.receiving : env.receiving;

  /**
  let div = document.getElementById(server_side ? 'player_receiving' : 'player_serving');
  div.parentNode.insertBefore(div, document.getElementById('team_two'));
  div = document.getElementById(server_side ? 'player_serving' : 'player_receiving');
  div.parentNode.insertBefore(div, document.getElementById('entry_end'));
  */

  changeTextColor(`.indicate_serve.display_player_${server_side}`, 'yellow');
  changeTextColor(`.indicate_serve.display_player_${receiver_side}`, 'white');

  /**
  document.getElementById("team_one_role").innerHTML = server_side ? 'Receiving:' : 'Serving:';
  document.getElementById("team_two_role").innerHTML = server_side ? 'Serving:' : 'Receiving:';
  */

  if (server_side) {
    changeClassDisplay('.display_0_serving', 'none');
    changeClassDisplay('.display_1_serving', 'flex');
  } else {
    changeClassDisplay('.display_0_serving', 'flex');
    changeClassDisplay('.display_1_serving', 'none');
  }

  const point_fields = Array.from(document.getElementsByClassName('points'));
  point_fields.forEach((field: any, index) => {
    const player = env.swap_sides ? 1 - index : index;
    field.style.backgroundColor = player == env.serving ? '#FBF781' : '#D1FBFB';
  });
  resetButtons();
}

function swapSides(number: number) {
  const iterations = [true].concat([...Array(number).keys()].map((i) => (i + 1) % 4 < 2));
  return !iterations[number];
}

export function setCourtSide() {
  env.swap_sides = env.match_swap;
  if (options.user_swap) env.swap_sides = !env.swap_sides;
  stateChangeEvent();
}

function changeTextColor(classes: string, value: any) {
  const objs = Array.from(document.querySelectorAll(classes));
  objs.forEach((obj: any) => (obj.style.color = value));
}

function changeClassDisplay(className: string, display: string) {
  const elements = Array.from(document.querySelectorAll(className));
  elements.forEach((element: any) => (element.style.display = display));
}

export function checkPlayerName(keypress: any) {
  if (keypress.keyCode == 13 || keypress.code == 9) {
    const player_hand = document.getElementById('player_hand');
    if (player_hand) player_hand.focus();
    changePlayerName();
  }
}

export function changePlayerName() {
  const player_name: any = document.getElementById('playername');
  const team: any = document.getElementById('team');
  const id: any = document.getElementById('playerid');
  if (player_name) {
    const update: any = {
      index: env.edit_player,
      name: player_name.value,
    };
    if (team) update.team = team.value;
    if (id) update.id = id.value;
    env.match.metadata.definePlayer(update);
  }
  updatePositions();
}

export function editMatchDetails() {
  closeModal();
  const matchDetails = document.getElementById('matchdeets');
  if (matchDetails) matchDetails.style.display = 'flex';
  const detailContent = document.getElementById('matchdetail_content');
  if (detailContent) detailContent.scrollTop = 0;
}
