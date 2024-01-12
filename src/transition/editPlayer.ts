import { closeModal } from './modals';
import { env } from './env';

export function editPlayer(element: any) {
  const index = parseInt(element.getAttribute('playerIndex') ?? 0);
  env.edit_player = env.swap_sides ? 1 - index : index;
  closeModal();
  const editPlayerDisplay = document.getElementById('editplayer');
  if (editPlayerDisplay) editPlayerDisplay.style.display = 'flex';
  const player = env.match.metadata.players(env.edit_player);
  const playerName: any = document.getElementById('playername');
  if (playerName) playerName.value = player.name;
  const team: any = document.getElementById('team');
  if (team) team.value = player.team ?? '';
  const attributes = ['hand', 'entry', 'seed', 'draw_position', 'ioc'];
  attributes.forEach((attribute) => {
    const target_id = `player_${attribute}`;
    const targetElement: any = document.getElementById(target_id);
    if (targetElement) targetElement.value = player[attribute] || '';
  });
  const playerRank: any = document.getElementById('player_rank');
  if (playerRank) playerRank.value = player.rank || '';
}
