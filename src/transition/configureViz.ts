import { changeDisplay, viewManager } from './viewManager';
import { charts, env, setOrientation } from './env';
import { momentumChart } from './momentumChart';
import { groupGames } from './groupGames';
import { gameTree } from './gameTree';
import { ptsMatch } from './ptsChart';
import { gameFish } from './gameFish';

import * as d3 from 'd3';

export function configureViz() {
  // set up momentum
  let pcolors: any = ['#a55194', '#6b6ecf'];
  charts.mc = momentumChart();
  charts.mc.options({
    display: {
      sizeToFit: false,
      continuous: false,
      orientation: 'vertical',
      transition_time: 0,
      service: false,
      rally: true,
      player: false,
      grid: false,
      score: true
    },
    colors: pcolors
  });
  charts.mc.events({ score: { click: showGame } });
  d3.select('#momentumChart').call(charts.mc);

  // set up gameFish
  pcolors = { players: ['#a55194', '#6b6ecf'] };
  charts.gamefish = gameFish();
  charts.gamefish.options({
    display: { sizeToFit: true },
    colors: pcolors
  });
  d3.select('#gameFishChart').call(charts.gamefish);

  // set up gametree
  charts.gametree = gameTree();
  const options = {
    display: { sizeToFit: true },
    lines: {
      points: { winners: 'green', errors: '#BA1212', unknown: '#2ed2db' },
      colors: { underlines: 'black' }
    },
    nodes: {
      colors: {
        0: pcolors.players[0],
        1: pcolors.players[1],
        neutral: '#ecf0f1'
      }
    },
    selectors: {
      enabled: true,
      selected: { 0: false, 1: false }
    }
  };
  charts.gametree.options(options);
  d3.select('#gameTreeChart').call(charts.gametree);

  charts.pts_match = ptsMatch();
  charts.pts_match.options({
    margins: { top: 40, bottom: 20 },
    display: { sizeToFit: true }
  });
  charts.pts_match.data(env.match);
  d3.select('#PTSChart').call(charts.pts_match);
}

function showGame(d: any) {
  showGameFish(d.index);
}
export function closeGameFish() {
  const gFish = document.getElementById('gamefish');
  if (gFish) gFish.style.display = 'none';
}
export function showGameFish(index?: number) {
  const gFish = document.getElementById('gamefish');
  if (gFish) gFish.style.display = 'flex';
  const games = groupGames();
  const game = index != undefined ? games[index] : games[games.length - 1];
  const gridcells = game.points[0].tiebreak ? ['0', '1', '2', '3', '4', '5', '6', '7'] : ['0', '15', '30', '40', 'G'];
  charts.gamefish.options({
    display: { reverse: env.swap_sides },
    fish: {
      gridcells: gridcells,
      cell_size: 20
    },
    score: game.score
  });
  charts.gamefish.data(game.points).update();
  window.scrollTo(0, 0);
}

export function vizUpdate() {
  const direction = env.orientation == 'landscape' ? 'horizontal' : 'vertical';

  if (env.view == 'pts' && direction == 'vertical') {
    changeDisplay('none', 'pts');
    changeDisplay('inline', 'momentum');
    charts.mc.width(window.innerWidth).height(820);
    charts.mc.update();
    env.view = 'momentum';
  } else if (env.view == 'momentum' && direction == 'horizontal') {
    changeDisplay('none', 'momentum');
    changeDisplay('flex', 'pts');
    charts.pts_match.update({ sizeToFit: true });
    env.view = 'pts';
  }

  if (charts.gamefish) charts.gamefish.update();

  const players = env.match.metadata.players();

  if (charts.gametree) {
    charts.gametree.options({
      labels: {
        Player: players[0].name,
        Opponent: players[1].name
      }
    });
    charts.gametree.update({ sizeToFit: true });
  }
}

export function orientationEvent() {
  setOrientation();
  vizUpdate();
  viewManager();
}
