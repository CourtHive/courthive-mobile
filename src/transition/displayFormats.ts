import { mo } from '../services/matchObject/umo';
import { env } from './env';

export function displayFormats() {
  const format_types = env.match.format.types();
  const current = env.match.format.settings().code;
  let html = '';
  if (!format_types.length) return false;
  format_types.forEach((format: any) => {
    html += formatEntry(format, format === current);
  });
  const matchFormatList = document.getElementById('matchformatlist');
  if (matchFormatList) matchFormatList.innerHTML = html;
}

function formatEntry(format: any, isCurrent: boolean) {
  const { name, description } = mo.formats().matches[format];
  const color = isCurrent ? 'lightgreen' : 'white';
  return `
  <div class='changeFormat flexjustifystart mf_format' newFormat="${format}" style="background-color: ${color}">
      <div class='changeFormat flexcols'>
        <div class='changeFormat mf_name'> <b class='changeFormat'>${name || ''}</b> </div>
        <div class='changeFormat mf_description'> ${description} </div>
      </div>
  </div>
  `;
}
