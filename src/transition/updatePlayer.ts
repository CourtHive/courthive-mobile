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
  return player;
}
