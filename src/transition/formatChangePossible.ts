import { env } from './env';

export function formatChangePossible() {
  const points = env.match.history.points();
  return points.length == 0;

  // TODO: implement when umo can propagate changes to children...
  /*
      scores = points.map(point=>point.score);
      var games = match.score().counters.games.reduce((a, b) => a + b);
      var advantages = scores.map(m=>m.indexOf('A') >= 0).filter(f=>f);
      if (games < 1 && advantages < 1) return true;
      */
}
