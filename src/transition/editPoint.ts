import { browserStorage } from './browserStorage';
import { stateChangeEvent } from './displayUpdate';
import { loadMatch } from './loadMatch';
import { env } from './env';

export function editPoint(index: number) {
  env.edit_point_index = index;
  const episodes = env.match.history.action('addPoint');
  env.edit_point = episodes[index].point;
  env.edit_point_result = env.edit_point.result;
  let score = env.edit_point.server ? env.edit_point.score.split('-').reverse().join('-') : env.edit_point.score;
  if (score == '0-0') score = 'Gamepoint';
  const epSGP = document.getElementById('ep_sgp');
  if (epSGP) epSGP.innerHTML = `Set: ${env.edit_point.set + 1}, Game: ${env.edit_point.game + 1}, Point: ${score}`;
  const players = env.match.metadata.players();
  const player_select = Array.from(document.querySelectorAll('.select_player'));
  player_select.forEach((select: any) =>
    players.forEach((player: any, index: number) => (select.options[index] = new Option(player.name, index.toString())))
  );
  const point_winner: any = document.getElementById('point_winner');
  const point_loser: any = document.getElementById('point_loser');
  if (point_winner) point_winner.value = env.edit_point.winner;
  if (point_loser) point_loser.value = env.edit_point.result || '';
  changePointWinner();
  changeResultOptions();
  const editPointDisplay = document.getElementById('editpoint');
  if (editPointDisplay) editPointDisplay.style.display = 'flex';
}

function changePointWinner() {
  const pointPlayer: any = document.getElementById('point_player');
  const pointResult: any = document.getElementById('point_result');
  const pointWinner: any = document.getElementById('point_winner');
  const player = pointPlayer?.value;
  const result = pointResult?.value;
  const winner = pointWinner?.value;
  if (result.indexOf('Winner') < 0 && result.indexOf('Ace') < 0 && player == winner) {
    pointPlayer.value = 1 - winner;
  }
  if ((result.indexOf('Winner') >= 0 || result.indexOf('Ace') >= 0) && player != winner) {
    pointPlayer.value = winner;
  }
}

function changeResultOptions() {
  const pointPlayer: any = document.getElementById('point_player');
  const pointResult: any = document.getElementById('point_result');
  const player = pointPlayer?.value;
  env.edit_point_result = pointResult.value;
  pointResult.innerHTML = '';
  pointResult.options[0] = new Option('- select -', '');
  let results: any[] = [];
  if (player == env.edit_point.server) results = ['Ace', 'Double Fault'].concat(...results);
  results = ['Winner', 'Unforced Error', 'Forced Error'].concat(...results);
  results.forEach((result, index) => (pointResult.options[index + 1] = new Option(result, result)));
  pointResult.value = env.edit_point_result;
}

/*
function changePointPlayer() {
  var player = document.getElementById('point_player').value;
  var result = document.getElementById('point_result').value;
  env.edit_point.result = result;
  var winner = document.getElementById('point_winner').value;
  if ((result.indexOf('Winner') >= 0 || result.indexOf('Ace') >= 0) && player != winner) {
    document.getElementById('point_winner').value = player;
  }
  if (result.indexOf('Winner') < 0 && result.indexOf('Ace') < 0 && player == winner) {
    document.getElementById('point_winner').value = 1 - player;
  }
  changeResultOptions();
}
*/

export function updatePoint() {
  const pointResult: any = document.getElementById('point_result');
  const pointWinner: any = document.getElementById('point_winner');
  const winner = pointWinner.value;
  const result = pointResult.value;
  env.edit_point.winner = winner;
  env.edit_point.result = result;
  env.edit_point.code = undefined; // TODO: code needs to be updated properly
  stateChangeEvent();
  const current_match_id = browserStorage.get('current_match');
  if (current_match_id) {
    loadMatch(current_match_id, 'pointhistory');
    const editPointDisplay = document.getElementById('editpoint');
    if (editPointDisplay) editPointDisplay.style.display = 'none';
  }
}
