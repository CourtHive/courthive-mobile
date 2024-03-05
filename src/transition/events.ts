import { stateChangeEvent, swapServer } from './displayUpdate';
import { buttons, env, updatePositions } from './env';

export function defineActionEvents() {
  env.match.events.addPoint(stateChangeEvent);
  env.match.events.undo(stateChangeEvent);
  env.match.events.reset(resetEvent);
}

export function resetEvent() {
  env.match.set.perspectiveScore(false);
  env.match.set.liveStats(true);
  env.match.metadata.timestamps(true);
  env.match.metadata.defineMatch({ date: null });

  env.serve2nd = false;
  env.rally_mode = false;
  env.serving = env.match.nextTeamServing();
  env.receiving = env.match.nextTeamReceiving();
  env.undone = [];
  env.rally = 0;
  env.lets = 0;

  resetStyles();
  updatePositions();
  swapServer();
  stateChangeEvent();
}

export function resetStyles() {
  Object.keys(buttons).forEach((id) => resetButton(id));
}

export function resetButton(id: string) {
  const button = document.getElementById(id);
  if (!button) return;
  if (buttons?.[id]?.color) {
    button.style.backgroundColor = 'white';
    button.style.color = buttons[id].color;
    button.style.borderColor = buttons[id].color;
  }
}
