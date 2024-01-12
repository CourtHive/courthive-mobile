import { showModal } from './utilities';
import { sendKey } from './coms';

export function enterKey() {
  const html = `
    <h2>Enter key:</h2>
    <input id='key' class='key_input input is-primary'>
    <button id='submit_key' class='btn btn-small submit-btn'>Submit</button>
  `;
  showModal(html);

  const key: any = document.getElementById('key');

  const key_entry = document.getElementById('key');
  if (key_entry) key_entry.addEventListener('keyup', keyAction);

  const submit = document.getElementById('submit_key');
  if (submit) submit.addEventListener('click', submitKey);

  function submitKey() {
    if (key.value) sendKey({ key: key.value });
  }

  function keyAction(evt: any) {
    if (evt.which == 13) submitKey();
  }
}
