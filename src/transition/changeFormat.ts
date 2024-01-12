import { env, updateMatchArchive } from './env';
import { updateScore } from './displayUpdate';
import { viewManager } from './viewManager';
import { findUpClass } from './utilities';

export function changeFormat(element: Element) {
  const selectionContainer = findUpClass(element, 'mf_format');
  if (selectionContainer) {
    const format = selectionContainer.getAttribute('newFormat');
    env.match.format.type(format);
    const format_name = env.match.format.settings().name;
    document.getElementById('md_format').innerHTML = format_name;
    updateScore();
    updateMatchArchive();
    viewManager('entry');
  }
}
