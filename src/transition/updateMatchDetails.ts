import { env, updateMatchArchive } from './env';

export function updateMatchDetails() {
  const match_details = {};
  const attributes = ['court', 'umpire'];
  attributes.forEach((attribute) => {
    const target: any = document.getElementById(`match_${attribute}`);
    const value = target.value;
    if (value) match_details[attribute] = value;
  });
  env.match.metadata.defineMatch(match_details);
  updateMatchArchive();
}
