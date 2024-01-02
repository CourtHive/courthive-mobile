import { loadDetails, stateChangeEvent, updateScore } from './displayUpdate';
import exportImage from '../assets/icons/exportwhite.png';
import recycleImage from '../assets/icons/recycle.png';
import { findUpClass, firstAndLast } from './utilities';
import { browserStorage } from './browserStorage';
import { modalExport } from './modalExport';
import { viewManager } from './viewManager';
import { SwipeList } from './swipeList';
import { loadMatch } from './loadMatch';
import { UUID } from './UUID';
import { env } from './env';

export function displayMatchArchive(params?: any) {
  const active = params?.active;
  let html = `<div class='swipe-panel no-top'>`;
  // archive used to sort by match.date when match_id was timestamp...
  // need a fix for this...
  const match_archive: string[] = JSON.parse(browserStorage.get('match_archive') || '[]')
    .filter((item: any, i: number, s: any) => s.lastIndexOf(item) == i)
    .reverse();
  if (!match_archive.length) {
    newMatch();
    return;
  }
  if (active) return;

  match_archive.forEach((match_id: string) => {
    const match_data = match_id && JSON.parse(browserStorage.get(match_id) ?? '[]');
    if (match_data) {
      html += archiveEntry(match_id, match_data);
    } else {
      browserStorage.remove(match_id);
    }
  });
  html += '</div>';
  const ma_elem = document.getElementById('matcharchiveList');
  if (ma_elem) ma_elem.innerHTML = html;

  SwipeList.init({
    container: '.swipe-item',
    buttons: [
      {
        class: 'img_export swipe_img',
        image_class: 'export_icon',
        image: exportImage,
        side: 'right',
        width: 60
      },
      {
        class: 'img_recycle swipe_img',
        image_class: 'recycle_icon',
        image: recycleImage,
        side: 'right',
        width: 60
      }
    ]
  });

  if (ma_elem) {
    ma_elem.addEventListener('click', function (e: any) {
      const p = findUpClass(e.target, 'swipe-item');
      const muid = p?.getAttribute('muid');
      const selected_match = findUpClass(e.target, 'mh_match');
      if (selected_match) {
        return loadMatch(muid);
      }

      if (e?.target?.className?.indexOf('img_export') >= 0 || e.target.className == 'export_icon') {
        p.classList.remove('move-out-click');
        p.style.webkitTransitionDuration = '125ms';
        p.style.transitionDuration = '125ms';
        p.style.webkitTransform = 'translateX(0px)';
        p.style.transform = 'translateX(0px)';
        modalExport(muid);
      }
      if (e.target.className.indexOf('img_recycle') >= 0 || e.target.className == 'recycle_icon') {
        deleteMatch(muid);
        p.remove();
      }
    });
  }

  return match_archive;
}

function deleteMatch(match_id: string) {
  /*
  if (broadcasting()) {
    const match_data = JSON.parse(browserStorage.get(match_id));
    const data: any = { muid: match_id };
    const tournament = (match_data && match_data.tournament) || {};
    data.tuid = tournament.tuid || tournament.name;
    // coms.socket.emit('delete match', data);
  }
  */

  browserStorage.remove(match_id);
  const current_match_id = browserStorage.get('current_match');
  let match_archive = JSON.parse(browserStorage.get('match_archive') || '[]');
  match_archive = match_archive.filter((archive_id: string) => match_id != archive_id);
  browserStorage.set('match_archive', JSON.stringify(match_archive));
  if (match_id == current_match_id) {
    resetMatch();
  }
  displayMatchArchive({ active: true });
}

export function resetMatch(muid?: string) {
  env.match.reset();
  loadDetails();
  updateScore();
  const date = new Date().valueOf();
  muid = muid || UUID();
  env.match.metadata.defineMatch({ muid, date });
  browserStorage.set('current_match', muid);
  stateChangeEvent();
}

export function newMatch(force_format?: boolean) {
  resetMatch();
  viewManager(force_format ? 'entry' : 'matchformat');
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function archiveEntry(match_id: string, match_data: any) {
  const date = new Date(match_data.match.date);
  const display_date = [date.getDate(), months[date.getMonth()], date.getFullYear()].join('-');
  const players = match_data.players;
  const display_players = `
         <span class='nowrap'>${firstAndLast(players[0].name)}</span>
         <span> v. </span>
         <span class='nowrap'>${firstAndLast(players[1].name)}</span>
         `;
  const match_score = match_data.scoreboard;
  const match_format = match_data.format.name;
  return `
      <div id='match_${match_id}' muid='${match_id}' class='flexcenter mh_swipe swipe-item'>
         <div class='flexcols mh_match'>
            <div class='mh_players'>${display_players}</div>
            <div class='mh_details'>
               <div>${display_date}</div>
               <div class='mh_format'>${match_format}</div>
            </div>
            <div class='mh_score'>${match_score}</div>
         </div>
      </div>`;
}
