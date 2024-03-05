import { env } from './env';

export function formatChangePossible() {
  const advantages = env.match.history
    .score()
    .flatMap((s) => s.split('-'))
    .includes('A');
  if (advantages) return false;
  const common = env.match.history.common();
  if (common.length == 0) return true;
  const last = common[common.length - 1];
  return last.set.complete;

  // TODO: implement when umo can propagate changes to children...
  /*
      scores = points.map(point=>point.score);
      var games = match.score().counters.games.reduce((a, b) => a + b);
      var advantages = scores.map(m=>m.indexOf('A') >= 0).filter(f=>f);
      if (games < 1 && advantages < 1) return true;
      */
}
