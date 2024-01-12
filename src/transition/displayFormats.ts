import { mo } from '../services/matchObject/umo';
import { env } from './env';

export function displayFormats() {
  const format_types = env.match.format.types();
  let html = '';
  if (!format_types.length) return false;
  format_types.forEach((format: any) => {
    html += formatEntry(format);
  });
  const matchFormatList = document.getElementById('matchformatlist');
  if (matchFormatList) matchFormatList.innerHTML = html;
}

function formatEntry(format: any) {
  const { name, description } = mo.formats().matches[format];
  return `
  <div class='changeFormat flexjustifystart mf_format' newFormat="${format}">
      <div class='changeFormat flexcols'>
        <div class='changeFormat mf_name'> <b class='changeFormat'>${name || ''}</b> </div>
        <div class='changeFormat mf_description'> ${description} </div>
      </div>
  </div>
  `;
}
