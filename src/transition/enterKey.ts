import { showModal } from './utilities';
import { closeModal } from './modals';
import { sendKey } from './coms';

export function enterKey(value: string) {
  const html = `
    <h2>Enter key:</h2>
    <input id='key' class='key_input'>
    <button id='submit_key' class='btn btn-small submit-btn'>Submit</button>
  `;
  showModal(html);

  const key: any = document.getElementById('key');
  if (key && value) key.value = value;

  const key_entry = document.getElementById('key');
  if (key_entry) key_entry.addEventListener('keyup', keyAction);

  const submit = document.getElementById('submit_key');
  if (submit) submit.addEventListener('click', submitKey);

  function submitKey() {
    if (key.value) sendKey({ key: key.value });
    closeModal();
  }

  function keyAction(evt: any) {
    if (evt.which == 13) submitKey();
  }
}
