import { formatChangePossible } from './formatChangePossible';
import { displayPointHistory } from './displayPointHistory';
import { displayMatchArchive } from './displayMatchArchive';
import { browserStorage } from './browserStorage';
import { displayFormats } from './displayFormats';
import { strokeSlider } from './strokeSlider';
import { touchManager } from './touchManager';
import { env, options, charts } from './env';
import { updateStats } from './updateStats';

export const changeDisplay = (display: string, id: string) => {
  const element = document.getElementById(id);
  if (element) element.style.display = display;
};

export function viewManager(new_view = env.view, params?: any) {
  // hide strokeslider any time view changes
  strokeSlider();
  // changeDisplay('none', 'system');

  const views: any = {
    mainmenu({ activate = true } = {}) {
      if (activate) {
        touchManager.prevent_touch = false;

        const match_archive = JSON.parse(browserStorage.get('match_archive') || '[]');
        const menuMatchArchive = document.getElementById('menu_match_archive');
        if (menuMatchArchive) menuMatchArchive.style.display = match_archive.length ? 'flex' : 'none';

        const menuMatchFormat = document.getElementById('menu_match_format');
        if (menuMatchFormat) menuMatchFormat.style.display = formatChangePossible() ? 'flex' : 'none';

        const points = env.match.history.points();
        const menuChangeServer = document.getElementById('menu_change_server');
        if (menuChangeServer) menuChangeServer.style.display = points.length == 0 ? 'flex' : 'none';
        // document.getElementById('footer_change_server').style.display = points.length == 0 ? 'inline' : 'none';
      }
      changeDisplay(activate ? 'flex' : 'none', 'mainmenu');
    },
    pointhistory({ activate = true } = {}) {
      if (activate) {
        touchManager.prevent_touch = false;
        displayPointHistory();
      }
      changeDisplay(activate ? 'flex' : 'none', 'pointhistory');
    },
    matcharchive({ activate = true } = {}) {
      if (activate) {
        touchManager.prevent_touch = false;
        displayMatchArchive();
      }
      changeDisplay(activate ? 'flex' : 'none', 'matcharchive');
    },
    matchformat({ activate = true } = {}) {
      displayFormats();
      if (activate) touchManager.prevent_touch = false;
      changeDisplay(activate ? 'flex' : 'none', 'matchformats');
    },
    settings({ activate = true } = {}) {
      changeDisplay(activate ? 'flex' : 'none', 'settings');
    },
    welcome({ activate = true } = {}) {
      changeDisplay(activate ? 'flex' : 'none', 'welcome');
    },
    matchdetails({ activate = true } = {}) {
      if (activate) touchManager.prevent_touch = false;
      changeDisplay(activate ? 'flex' : 'none', 'matchdetails');
    },
    entry({ activate = true } = {}) {
      if (activate) touchManager.prevent_touch = true;
      changeDisplay(activate && env.orientation == 'landscape' ? 'flex' : 'none', options.horizontal_view);
      changeDisplay(activate && env.orientation == 'portrait' ? 'flex' : 'none', options.vertical_view);
      changeDisplay(activate && env.orientation == 'portrait' ? 'flex' : 'none', 'toolbar');
    },
    stats({ activate = true } = {}) {
      changeDisplay(activate ? 'flex' : 'none', 'statsscreen');
      if (activate) {
        touchManager.prevent_touch = false;
        env.match.metadata.resetStats(); // necessary because decorations not added when calculated
        updateStats();
      }
    },
    momentum({ activate = true } = {}) {
      if (!activate) {
        changeDisplay('none', 'momentum');
        changeDisplay('none', 'pts');
      } else {
        if (env.orientation == 'landscape') {
          changeDisplay('none', 'momentum');
          changeDisplay('flex', 'pts');
          charts.pts_match.update();
        } else {
          changeDisplay('inline', 'momentum');
          changeDisplay('none', 'pts');
        }
        touchManager.prevent_touch = false;
        const point_episodes = env.match.history.action('addPoint');
        charts.mc.width(window.innerWidth).height(820);
        charts.mc.data(point_episodes).update();
        charts.mc.update();
      }
    },
    gametree({ activate = true } = {}) {
      changeDisplay(activate ? 'flex' : 'none', 'gametree');
      if (activate) {
        touchManager.prevent_touch = false;
        const point_episodes = env.match.history.action('addPoint');
        const noAd = env.match.format.settings().code.indexOf('n_') >= 0;
        charts.gametree.options({ display: { noAd } });
        charts.gametree.data(point_episodes).update();
        charts.gametree.update({ sizeToFit: true });
      }
    }
  };

  const view_keys = Object.keys(views);
  if (view_keys.indexOf(new_view) >= 0) {
    // disactivate all views that don't match the new_view
    view_keys.filter((view) => view != new_view).forEach((view) => views[view]({ activate: false }));
    views[new_view]({ activate: true, params });
    env.view = new_view;
    return new_view;
  }
}
