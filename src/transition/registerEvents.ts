import { updateTournamentDetails } from './updateTournamentDetails';
import { updateMatchDetails } from './updateMatchDetails';
import { broadcastToggle, sendHistory } from './coms';
import { editMatchDetails } from './displayUpdate';
import { newMatch } from './displayMatchArchive';
import { updateDetails } from './updateDetails';
import { eventManager } from './eventManager';
import { closeGameFish } from './configureViz';
import { strokeAction } from './strokeAction';
import { updatePlayer } from './updatePlayer';
import { changeFormat } from './changeFormat';
import { classAction } from './classAction';
import { exportMatch } from './exportMatch';
import { toggleChart } from './toggleChart';
import { updateStats } from './updateStats';
import { modalShare } from './modalShare';
import { updatePoint } from './editPoint';
import { editPlayer } from './editPlayer';
import { modalHelp } from './modalHelp';
import { modalInfo } from './modalInfo';
import { updateAppState } from './env';
import { closeModal } from './modals';
import { enterKey } from './enterKey';
import {
  outcomeEntry,
  matchArchive,
  settings,
  mainMenu,
  swapAction,
  undoAction,
  redoAction,
  changeServer,
  viewStats,
  viewPointHistory,
  viewMomentum,
  viewGameTree,
  viewMatchFormat,
  viewGameFish,
  viewEditPoint,
} from './clickActions';

export function registerEvents() {
  eventManager
    .register('modalInfo', 'tap', modalInfo)
    .register('toggleChart', 'tap', toggleChart)
    .register('broadcastToggle', 'tap', broadcastToggle)
    .register('modalShare', 'tap', modalShare)
    .register('enterKey', 'tap', enterKey)
    .register('changeFormat', 'tap', changeFormat)
    .register('closeModal', 'tap', closeModal)
    .register('newMatch', 'tap', newMatch)
    .register('exportMatch', 'tap', exportMatch)
    .register('sendHistory', 'tap', sendHistory)
    .register('settings', 'tap', settings)
    .register('outcomeEntry', 'tap', outcomeEntry)
    .register('matchArchive', 'tap', matchArchive)
    .register('mainMenu', 'tap', mainMenu)
    .register('modalHelp', 'tap', modalHelp)
    .register('updateAppState', 'tap', updateAppState)
    .register('updateStats', 'tap', updateStats)
    .register('closeGameFish', 'tap', closeGameFish)
    .register('strokeAction', 'tap', strokeAction)
    .register('swapAction', 'tap', swapAction)
    .register('undoAction', 'tap', undoAction)
    .register('redoAction', 'tap', redoAction)
    .register('changeServer', 'tap', changeServer)
    .register('updatePoint', 'tap', updatePoint)
    .register('editPlayer', 'tap', editPlayer)
    .register('updatePlayer', 'tap', updatePlayer)
    .register('updateTournamentDetails', 'tap', updateTournamentDetails)
    .register('updateMatchDetails', 'tap', updateMatchDetails)
    .register('updateDetails', 'tap', updateDetails)
    .register('viewGameFish', 'tap', viewGameFish)
    .register('viewStats', 'tap', viewStats)
    .register('viewGameTree', 'tap', viewGameTree)
    .register('viewMomentum', 'tap', viewMomentum)
    .register('viewEditPoint', 'tap', viewEditPoint)
    .register('viewMatchFormat', 'tap', viewMatchFormat)
    .register('viewPointHistory', 'tap', viewPointHistory)
    .register('editMatchDetails', 'tap', editMatchDetails)
    .register('classAction', 'tap', classAction);
}
