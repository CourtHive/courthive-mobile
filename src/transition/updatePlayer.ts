import { env, updateMatchArchive } from './env';

export function updatePlayer() {
  env.match.metadata.definePlayer(updatePlayerDetails());
  updateMatchArchive();
}

function updatePlayerDetails() {
  const player: any = { index: env.edit_player };
  const attributes = ['hand', 'entry', 'seed', 'draw_position', 'ioc'];
  attributes.forEach((attribute) => {
    const target_id = `player_${attribute}`;
    const obj: any = document.getElementById(target_id);
    if (obj.selectedIndex >= 0) {
      const value = obj.options[obj.selectedIndex].value;
      if (value) player[attribute] = value;
    }
  });
  const rankElement: any = document.getElementById('player_rank');
  if (rankElement.value) player.rank = rankElement.value;
  const wtnElement: any = document.getElementById('player_wtn');
  if (wtnElement.value) player.wtn = wtnElement.value;
  const utrElement: any = document.getElementById('player_utr');
  if (utrElement.value) player.utr = utrElement.value;

  const teamElement: any = document.getElementById('team');
  if (teamElement.value) player.team = teamElement.value;
  const idElement: any = document.getElementById('playerid');
  if (idElement.value) player.id = idElement.value;

  return player;
}
