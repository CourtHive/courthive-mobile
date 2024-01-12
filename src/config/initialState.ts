import { setWindow } from './setWindow';
import { version } from './version';

import 'bulma/css/bulma.css';
import '../transition/css/courtHive.css';
import '../transition/css/swipeList.css';
import '../transition/css/icons.css';

export function setInitialState() {
  console.log(`%cversion: ${version}`, 'color: lightblue');
  setWindow();
}
