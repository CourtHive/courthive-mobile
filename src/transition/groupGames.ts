import { env } from './env';

export function groupGames(point_episodes?: any[]) {
  point_episodes = point_episodes || env.match.history.action('addPoint');
  const games: any = [{ points: [] }];
  let game_counter = 0;
  let current_game = 0;
  point_episodes?.forEach((episode: any) => {
    const point = episode.point;
    if (point.game != current_game) {
      game_counter += 1;
      current_game = point.game;
      games[game_counter] = { points: [] };
    }
    games[game_counter].points.push(point);
    games[game_counter].index = game_counter;
    games[game_counter].set = episode.set.index;
    games[game_counter].score = episode.game.games;
    games[game_counter].complete = episode.game.complete;
    if (episode.game.complete) games[game_counter].winner = point.winner;
    if (episode.set.complete) games[game_counter].last_game = true;
  });
  return games;
  // if (set != undefined) games = games.filter(function(game) { return game.set == set });
}
