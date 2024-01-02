import { loadDetails, stateChangeEvent, updateScore } from './displayUpdate';
import { clearActionEvents, env, updatePositions } from './env';
import { browserStorage } from './browserStorage';
import { defineActionEvents } from './events';
import { viewManager } from './viewManager';
import { isJSON } from './utilities';
import { UUID } from './UUID';

export function loadMatch(match_id: string, view = 'entry') {
  if (!match_id) {
    viewManager('entry');
    return;
  }
  env.match.reset();
  const json = browserStorage.get(match_id);
  const match_data = json && isJSON(json) && match_id ? JSON.parse(browserStorage.get(match_id) ?? '[]') : undefined;
  if (!match_data) {
    // newMatch(); ??
    // insure match_id is not in match_archive ??
    viewManager('entry');
    return;
  }

  // reduce overhead by turning off matchObject state change events;
  clearActionEvents();
  browserStorage.set('current_match', match_id);
  if (match_data.match) {
    if (!match_data.match.muid) {
      match_data.match.muid = UUID();
      browserStorage.remove(match_id);
    }
    env.match.metadata.defineMatch(match_data.match);
  }
  if (match_data.first_service) env.match.set.firstService(match_data.first_service);
  if (match_data.tournament) env.match.metadata.defineTournament(match_data.tournament);
  if (match_data.format) {
    env.match.format.settings(match_data.format);
    const mdFormat = document.getElementById('md_format');
    if (mdFormat) mdFormat.innerHTML = match_data.format.name;
  }

  if (!match_data.version) {
    match_data.points.forEach((point: any) => env.match.addPoint(point));
  }

  // turn on timestamps *after* loading all points
  env.match.metadata.timestamps(true);

  if (match_data.players) {
    match_data.players.forEach((player: any, index: number) => {
      player.index = index;
      env.match.metadata.definePlayer(player);
    });
  }
  updatePositions();
  updateScore();
  loadDetails();
  stateChangeEvent();
  defineActionEvents();
  viewManager(view);
}
