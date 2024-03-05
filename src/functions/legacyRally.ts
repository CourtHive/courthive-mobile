import { isNumeric, isString } from './typeOf';

export function legacyRally(rally) {
  if (Array.isArray(rally)) return rally;
  if (isString(rally)) return new Array(rally);
  return [];
}

export function rallyCount(rally) {
  if (Array.isArray(rally)) return rally.length;
  if (isString(rally)) return parseInt(rally);
  if (isNumeric(rally)) return rally;
  return 0;
}
