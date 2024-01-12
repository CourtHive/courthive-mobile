import { SUCCESS, UTF8 } from '../../constants';

import { getMatchStats } from '../statistics/getMatchStats';
import { config } from '../../config/env';
import fs from 'fs-extra';

const cache_dir = config.fileSystem.cacheDir;
const destination = '/matchups';

export function saveMatchUp({ matchUp }) {
  fs.ensureDirSync(cache_dir + destination);

  const provider = matchUp.provider || '';
  if (provider) fs.ensureDirSync(cache_dir + destination + '/' + provider);

  const matchUpId = matchUp.muid || matchUp.matchUpId;
  const providerDestination = provider ? `/${provider}` : '';
  const fileName = `${cache_dir}${destination}${providerDestination}/${matchUpId}.json`;

  fs.writeFile(fileName, JSON.stringify(matchUp, null, 2), UTF8, function (err) {
    if (!err) {
      return SUCCESS;
    } else {
      return { error: err };
    }
  });

  const stats = getMatchStats({ source: matchUp });
  if (stats && stats.length) {
    const statsFileName = `${cache_dir}${destination}${providerDestination}/${matchUpId}.stats.json`;
    fs.writeFile(statsFileName, JSON.stringify(stats, null, 2), UTF8, function (err) {
      if (!err) {
        return SUCCESS;
      } else {
        return { error: err };
      }
    });
  }

  return true;
}
