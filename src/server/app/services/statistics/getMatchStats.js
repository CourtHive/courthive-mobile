import * as m from '../umo/matchObject.min';

export function getMatchStats({ source }) {
  const match = m.Match();
  match.addPoints(source.points);
  return match.stats.calculated();
}
