import { updateTournamentDetails } from './updateTournamentDetails';
import { updateMatchDetails } from './updateMatchDetails';
import { browserStorage } from './browserStorage';
import { env } from './env';

export function updateDetails() {
  updateTournamentDetails();
  updateMatchDetails();
  const target: any = document.getElementById(`provider`);
  const value = target.value;
  env.provider = value;

  if (value) {
    browserStorage.set('mobile-provider', value);
  }
}
