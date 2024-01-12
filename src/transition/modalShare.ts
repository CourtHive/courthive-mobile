import emailblackImage from '../assets/icons/emailblack.png';
import { broadcastScore } from './broadcastScore';
import { browserStorage } from './browserStorage';
import { showModal } from './utilities';
import { app, env } from './env';
import { UUID } from './UUID';
import { coms } from './coms';

export function modalShare() {
  broadcastScore();
  const match_id = browserStorage.get('current_match');
  const match_data = match_id && browserStorage.get(match_id);
  if (match_data) {
    const json_data = JSON.parse(match_data);
    let muid = json_data.match.muid;
    if (!muid) {
      muid = UUID();
      json_data.match.muid = muid;
      env.match.metadata.defineMatch({ muid });
      browserStorage.set(match_id, JSON.stringify(json_data));
    }
    shareResult(json_data);
  } else {
    const modaltext = ` <p> <h1>First Track a Match!</h1> </p> `;
    showModal(modaltext);
  }
}

function shareResult(json_data: any) {
  if (!coms.socket) {
    const modaltext = ` <p> <h1>Unable to share match...</h1> <p><i>Connection Error</i></p> </p> `;
    showModal(modaltext);
    return;
  }
  const broadcast_link = app.broadcast ? `CourtHive Live Score: ${location.origin}/scores?muid=${json_data.muid}` : '';
  const email_message = `${broadcast_link}%0D%0A `;
  const emailOption = app.broadcast
    ? `
    <div class='closeModal flexcenter iconmargin'>
      <a href='mailto:?subject=CourtHive Match Link&body=${email_message}' class="notextdecoration">
          <img class="icon_large" src='${emailblackImage}'>
      </a> 
    </div>
  `
    : '';
  const clipboardOption = json_data
    ? `
    <div class='flexcenter iconmargin'>
      <button id='copy2clipboard' class="flexcenter c2c" data-clipboard-text=""> 
          <div class='export_action action_icon_large iconclipboard'></div> 
      </button>
    </div>
  `
    : '';

  const match_id = json_data?.match?.muid;
  const sendHistoryOption = match_id
    ? `
   <div matchId="${match_id}" class="sendHistory flexcenter">
      <div matchId="${match_id}" class='sendHistory export_action action_icon iconsave'></div>
   </div>
`
    : '';

  const modaltext = `
      <p>&nbsp;</p>
      <h1>Options for Sharing</h1>
      <div class='flexrows'> 
        ${emailOption}
        ${sendHistoryOption}
        ${clipboardOption}
      </div>`;
  showModal(modaltext, JSON.stringify(json_data));
}
