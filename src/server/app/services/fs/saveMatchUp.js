import { SUCCESS, UTF8 } from '../../constants';

import { config } from '../../config/env';
import fs from 'fs-extra';

const cache_dir = config.fileSystem.cacheDir;
const destination = '/matchups';

export function saveMatchUp({ matchUp }) {
  fs.ensureDirSync(cache_dir + destination);

  const matchUpId = matchUp.muid || matchUp.matchUpId;
  const filename = `${matchUpId}.json`;
  const filetype = 'json';
  const file_to_write = `${cache_dir}${destination}/${filename}.${filetype}`;

  fs.writeFile(file_to_write, JSON.stringify(matchUp), UTF8, function (err) {
    if (!err) {
      return SUCCESS;
    } else {
      return { error: err };
    }
  });
  return true;
}
