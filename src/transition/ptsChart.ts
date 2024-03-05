import * as d3 from 'd3';
import { rallyCount } from '../functions/legacyRally';

export function ptsMatch() {
  let match_data: any;

  const options: any = {
    id: 0,
    class: 'ptsMatch',

    resize: true,
    width: window.innerWidth,
    height: 80,
    max_height: 100,

    margins: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    set: {
      average_points: 56,
    },

    lines: {
      width: 2,
      interpolation: 'linear',
    },

    points: {
      max_width_points: 100,
    },

    score: {
      font: 'Arial',
      font_size: '12px',
      font_weight: 'bold',
      reverse: true,
    },

    header: {
      font: 'Arial',
      font_size: '14px',
      font_weight: 'bold',
    },

    display: {
      sizeToFit: true,
      transition_time: 0,
      point_highlighting: true,
      point_opacity: 0.4,
      win_err_highlight: true,
      game_highlighting: true,
      game_opacity: 0.2,
      game_boundaries: true,
      gamepoints: false,
      score: true,
      points: true,
      winner: true,
    },

    colors: {
      orientation: 'yellow',
      gamepoints: 'black',
      players: { 0: '#a55194', 1: '#6b6ecf' },
    },
  };

  // functions which should be accessible via ACCESSORS
  let update: any;

  // programmatic
  const pts_sets: any[] = [];
  let dom_parent;

  // prepare charts
  const pts_charts: any[] = [];
  for (let s = 0; s < 5; s++) {
    pts_charts.push(ptsChart());
  }

  // DEFINABLE EVENTS
  // Define with ACCESSOR function chart.events()
  const events: any = {
    update: { begin: null, end: null },
    set_box: { mouseover: null, mouseout: null },
    point_bars: { mouseover: null, mouseout: null, click: null },
  };

  function chart(selection) {
    dom_parent = selection;

    if (options.display.sizeToFit) {
      const dims = selection.node().getBoundingClientRect();
      options.width = Math.max(dims.width, 400);
    }

    // append svg
    const root = dom_parent
      .append('div')
      .attr('class', options.class + 'root')
      .style('width', options.width + 'px')
      .style('height', options.height + 'px');

    for (let s = 0; s < 5; s++) {
      pts_sets[s] = root.append('div').attr('class', 'pts').style('display', 'none');
      pts_sets[s].call(pts_charts[s]);
    }

    update = function (opts) {
      const sets = match_data.sets();

      if (options.display.sizeToFit || opts?.sizeToFit) {
        const dims = selection.node().getBoundingClientRect();
        options.width = Math.max(dims.width, 400);
        options.height = (dims.height - (+options.margins.top + +options.margins.bottom)) / sets.length;
        if (options.height > options.max_height) options.height = options.max_height;
      }

      let true_height = 0;
      for (let s = 0; s < pts_charts.length; s++) {
        if (sets?.[s]?.history.points().length) {
          pts_sets[s].style('display', 'inline');
          pts_charts[s].width(options.width);
          pts_charts[s].height(options.height);
          pts_charts[s].update();
          true_height += +options.height + 5;
        } else {
          pts_sets[s].style('display', 'none');
        }
      }

      root.style('width', options.width + 'px').style('height', true_height + 'px');
    };
  }

  // ACCESSORS

  // allows updating individual options and suboptions
  // while preserving state of other options
  chart.options = function (values) {
    if (!arguments.length) return options;
    keyWalk(values, options);
    return chart;
  };

  function keyWalk(valuesObject: any, optionsObject: any) {
    if (!valuesObject || !optionsObject) return;
    const vKeys = Object.keys(valuesObject);
    const oKeys = Object.keys(optionsObject);
    for (const key of vKeys) {
      if (oKeys.indexOf(key) >= 0) {
        const oo = optionsObject[key];
        const vo = valuesObject[key];
        if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
          keyWalk(valuesObject[key], optionsObject[key]);
        } else {
          optionsObject[key] = valuesObject[key];
        }
      }
    }
  }

  chart.events = function (functions: any) {
    if (!arguments.length) return events;
    keyWalk(functions, events);
    return chart;
  };

  chart.colors = function (colores: any) {
    if (!arguments.length) return options.colors;
    options.colors.players = colores;
    return chart;
  };

  chart.width = function (value: any) {
    if (!arguments.length) return options.width;
    options.width = value;
    if (typeof update === 'function') update(true);
    pts_charts.forEach(function (e) {
      e.width(value);
    });
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) return options.height;
    options.height = value;
    if (typeof update === 'function') update(true);
    pts_charts.forEach(function (e) {
      e.height(value);
    });
    return chart;
  };

  chart.duration = function (value) {
    if (!arguments.length) return options.display.transition_time;
    options.display.transition_time = value;
    return chart;
  };

  chart.update = function (opts?: any) {
    if (events.update.begin) events.update.begin();
    const sets = match_data.sets();
    const max_width_points = Math.max(
      ...sets.map((set, index) => set.history.points().filter((f) => f.set == index).length),
    );
    if (sets.length > 1) chart.options({ points: { max_width_points } });
    sets.forEach(function (_, i: number) {
      pts_charts[i].data(sets[i]);
      pts_charts[i].options({ id: i });
      pts_charts[i].options({
        lines: options.lines,
        points: options.points,
        score: options.score,
        header: options.header,
      });
      pts_charts[i].options({ set: options.set, display: options.display, colors: options.colors });
      pts_charts[i].events(events);
      pts_charts[i].width(options.width).height(options.height).update(opts);
    });
    if (typeof update === 'function') update(opts);
    setTimeout(function () {
      if (events.update.end) events.update.end();
    }, options.display.transition_time);
    return true;
  };

  chart.data = function (matchObject) {
    if (!arguments.length) {
      return match_data;
    }
    match_data = matchObject;
    chart.update();
  };

  return chart;
}

function ptsChart() {
  let set_data;

  let game_data;
  let points_to_set;

  const winners = ['Ace', 'Winner', 'Serve Winner'];
  const errors = ['Forced Error', 'Unforced Error', 'Double Fault', 'Penalty', 'Out', 'Net'];

  const options = {
    id: 0,
    class: 'ptsChart',

    resize: true,
    width: window.innerWidth,
    height: 80,

    margins: {
      top: 5,
      right: 15,
      bottom: 5,
      left: 5,
    },

    set: {
      average_points: 56,
    },

    lines: {
      width: 2,
      interpolation: 'linear',
    },

    points: {
      max_width_points: 100,
    },

    score: {
      font: 'Arial',
      font_size: '12px',
      font_weight: 'bold',
      reverse: true,
    },

    header: {
      font: 'Arial',
      font_size: '14px',
      font_weight: 'bold',
    },

    display: {
      transition_time: 0,
      point_highlighting: true,
      point_opacity: 0.4,
      win_err_highlight: true,
      game_highlighting: true,
      game_opacity: 0.2,
      game_boundaries: false,
      gamepoints: false,
      score: true,
      points: true,
      winner: true,
    },

    colors: {
      orientation: 'yellow',
      gamepoints: 'black',
      players: { 0: 'blue', 1: 'purple' },
    },
  };

  // functions which should be accessible via ACCESSORS
  let update;

  // programmatic
  let dom_parent;

  // DEFINABLE EVENTS
  // Define with ACCESSOR function chart.events()
  const events = {
    set_box: { mouseover: null, mouseout: null },
    update: { begin: null, end: null },
    point_bars: { mouseover: null, mouseout: null, click: null },
  };

  function chart(selection) {
    selection.each(function (_, i: number, n: any) {
      dom_parent = d3.select(n[i]);

      // append svg
      const root = dom_parent
        .append('svg')
        .attr('class', options.class + 'root')
        .style('width', options.width + 'px')
        .style('height', options.height + 'px');

      // append children g
      const pts = root
        .append('g')
        .attr('class', options.class + 'pts')
        .attr('transform', 'translate(5, 5)');

      // For Point Bars which must always be on top
      const ptsHover = root
        .append('g')
        .attr('class', options.class + 'pts')
        .attr('transform', 'translate(5, 5)');

      // append labels
      const set_winner = pts
        .append('text')
        .attr('class', options.class + 'Header')
        .attr('opacity', 0)
        .attr('font-size', options.header.font_size)
        .attr('font-weight', options.header.font_weight)
        .attr('x', function () {
          return options.margins.left + 'px';
        })
        .attr('y', function () {
          return options.margins.top + 8 + 'px';
        });

      const set_score = pts
        .append('text')
        .attr('class', options.class + 'Score')
        .attr('opacity', 0)
        .attr('font-size', options.score.font_size)
        .attr('font-weight', options.score.font_weight)
        .attr('x', function () {
          return options.margins.left + 'px';
        })
        .attr('y', function () {
          return options.margins.top + 20 + 'px';
        });

      // resize used to disable transitions during resize operation
      update = function (_, resize?: boolean) {
        if (!set_data) {
          return false;
        }

        root
          .transition()
          .duration(options.display.transition_time)
          .style('width', options.width + 'px')
          .style('height', options.height + 'px');

        const points = set_data.history.action('addPoint').filter((f) => f.point.set == options.id);
        const range_start = points[0].point.index;

        game_data = groupGames(points);
        points_to_set = points.map((p) => p.needed.points_to_set);
        const pts_max = Math.max(
          ...[].concat(
            points_to_set.map((p) => p[0]),
            points_to_set.map((p) => p[1]),
          ),
        );
        const pts_start = Math.max(...points_to_set[0]);

        // add pts prior to first point
        points_to_set.unshift([pts_start, pts_start]);

        const longest_rally =
          Math.max.apply(
            null,
            points.map(function (m) {
              return m.point.rally ? rallyCount(m.point.rally) : 0;
            }),
          ) + 2;

        displayScore(resize);

        const xScale = d3
          .scaleLinear()
          .domain([0, calcWidth()])
          .range([0, options.width - (options.margins.left + options.margins.right)]);

        function pointScale(d, r, a) {
          if (d.range[r] < range_start) return xScale(d.range[r] + a);
          return xScale(d.range[r] + a - range_start);
        }

        const yScale = d3
          .scaleLinear()
          .range([options.height - (options.margins.top + options.margins.bottom), options.margins.bottom])
          .domain([-2, pts_max - 1]);

        // Set Box
        const set_box = pts.selectAll('.' + options.class + 'SetBox').data([options.id]); // # of list elements only used for index, data not important

        set_box
          .enter()
          .append('rect')
          .attr('class', options.class + 'SetBox')
          .style('position', 'relative')
          .attr('height', function () {
            return options.height - (options.margins.top + options.margins.bottom);
          })
          .attr('width', function () {
            return xScale(boxWidth() + 1);
          })
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('fill', 'none')
          .on('mouseover', function (d, i) {
            if (events.set_box.mouseover) events.set_box.mouseover(d, i);
          })
          .on('mouseout', function (d, i) {
            if (events.set_box.mouseout) events.set_box.mouseout(d, i);
          })
          .merge(set_box)
          .transition()
          .duration(resize ? 0 : options.display.transition_time)
          .attr('height', function () {
            return options.height - (options.margins.top + options.margins.bottom);
          })
          .attr('width', function () {
            return xScale(boxWidth() + 1);
          });

        set_box
          .exit()
          .transition()
          .duration(resize ? 0 : options.display.transition_time)
          .style('opacity', 0)
          .remove();

        // Game Boundaries
        const game_boundaries = pts.selectAll('.' + options.class + 'GameBoundary').data(game_data);

        game_boundaries.exit().remove();

        game_boundaries
          .enter()
          .append('rect')
          .attr('class', options.class + 'GameBoundary')
          .merge(game_boundaries)
          .attr('id', function (_, i: number) {
            return options.class + options.id + 'boundary' + i;
          })
          .transition()
          .duration(resize ? 0 : options.display.transition_time)
          .attr('opacity', function () {
            return options.display.game_boundaries ? 0.02 : 0;
          })
          .attr('transform', function (d: any) {
            return 'translate(' + pointScale(d, 0, 0) + ', 0)';
          })
          .attr('height', yScale(-2))
          .attr('width', function (d: any) {
            return pointScale(d, 1, 1) - pointScale(d, 0, 0);
          })
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('fill', 'none');

        // Game Boxes
        const game_boxes = pts.selectAll('.' + options.class + 'Game').data(game_data);

        game_boxes.exit().remove();

        game_boxes
          .enter()
          .append('rect')
          .attr('class', options.class + 'Game')
          .merge(game_boxes)
          .attr('id', function (_, i: number) {
            return options.class + options.id + 'game' + i;
          })
          .transition()
          .duration(resize ? 0 : options.display.transition_time)
          .attr('opacity', function () {
            return options.display.game_boundaries ? 0.02 : 0;
          })
          .attr('transform', function (d: any) {
            return 'translate(' + pointScale(d, 0, 0) + ', 0)';
          })
          .attr('height', yScale(-2))
          .attr('width', function (d: any) {
            return pointScale(d, 1, 1) - pointScale(d, 0, 0);
          })
          .attr('stroke', function (d: any) {
            return options.colors.players[d.winner];
          })
          .attr('stroke-width', 1)
          .attr('fill', function (d: any) {
            return d.winner != undefined ? options.colors.players[d.winner] : 'none';
          });

        // Player PTS Lines
        const lineGen = d3
          .line()
          .x(function (_, i: number) {
            return xScale(i);
          })
          .y(function (d: number) {
            return yScale(pts_max - d);
          });

        const pts_lines = pts.selectAll('.' + options.class + 'Line').data([0, 1]);

        pts_lines.exit().remove();

        pts_lines
          .enter()
          .append('path')
          .attr('class', options.class + 'Line')
          .attr('id', function (d) {
            return options.class + options.id + 'player' + d + 'Line';
          })
          .attr('fill', 'none')
          .merge(pts_lines)
          .transition()
          .duration(resize ? 0 : options.display.transition_time / 2)
          .style('opacity', 0.1)
          .transition()
          .duration(resize ? 0 : options.display.transition_time / 2)
          .style('opacity', 1)
          .attr('stroke', function (d) {
            return options.colors.players[d];
          })
          .attr('stroke-width', function () {
            return options.lines.width;
          })
          // .attr('d', function(d) { return lineGen(player_data[d]) })
          .attr('d', function (d) {
            return lineGen(points_to_set.map((p) => p[d]));
          });

        const bp_data = [
          points_to_set.map((p) => {
            return { pts: p[0] };
          }),
          points_to_set.map((p) => {
            return { pts: p[1] };
          }),
        ];
        const bp_wrappers = pts.selectAll('.' + options.class + 'BPWrapper').data(bp_data);

        bp_wrappers
          .enter()
          .append('g')
          .attr('class', options.class + 'BPWrapper');

        bp_wrappers.exit().remove();

        const breakpoints = bp_wrappers.selectAll('.' + options.class + 'Breakpoint').data(function (d, i) {
          return add_index(d, i);
        });

        breakpoints.exit().attr('opacity', '0').remove();

        breakpoints
          .enter()
          .append('circle')
          .attr('class', options.class + 'Breakpoint')
          .attr('opacity', '0')
          .merge(breakpoints)
          .transition()
          .duration(resize ? 0 : options.display.transition_time / 2)
          .style('opacity', 0)
          .transition()
          .duration(resize ? 0 : options.display.transition_time / 2)
          .attr('fill', function (d, i) {
            if (points[i - 1] && points[i - 1].point.breakpoint != undefined) {
              return options.colors.players[d._i];
            }
          })
          .style('opacity', function (d, i) {
            if (points[i - 1] && points[i - 1].point.breakpoint != undefined) {
              // return points[i - 1].point.breakpoint == d._i ? 1 : 0
              return points[i - 1].point.server == 1 - d._i ? 1 : 0;
            }
          })
          .attr('cx', function (_, i: number) {
            return xScale(i);
          })
          .attr('cy', function (d: any) {
            return yScale(pts_max - d.pts);
          })
          .attr('r', 2);

        const points_index = d3.range(points.length);
        const barsX = d3
          .scaleBand()
          .domain(points_index)
          .range([0, xScale(points.length)])
          .round(true);

        const bX = d3
          .scaleLinear()
          .domain([0, points.length])
          .range([0, xScale(points.length)]);

        // gradients cause hover errors when data is replaced
        pts.selectAll('.gradient' + options.id).remove();

        const gradients = pts.selectAll('.gradient' + options.id).data(d3.range(points.length)); // data not important, only length of array

        gradients.exit().remove();

        gradients
          .enter()
          .append('linearGradient')
          .attr('id', function (_, i: number) {
            return 'gradient' + options.id + i;
          })
          .attr('class', function () {
            return 'gradient' + options.id;
          })
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', function () {
            return barsX.bandwidth() / 2;
          })
          .attr('y1', function () {
            return 0;
          })
          .attr('x2', function () {
            return barsX.bandwidth() / 2;
          })
          .attr('y2', function () {
            return yScale(-2);
          })
          .merge(gradients)
          .attr('transform', function (_, i: number) {
            return 'translate(' + bX(i) + ', 0)';
          });

        const point_stops = gradients.selectAll('.points_stop').data(function (d: any) {
          return calcStops(points[d].point);
        });

        point_stops.exit().remove();

        point_stops
          .enter()
          .append('stop')
          .attr('class', 'points_stop')
          .attr('offset', function (d) {
            return d.offset;
          })
          .attr('stop-color', function (d) {
            return d.color;
          })
          .merge(point_stops)
          .attr('offset', function (d) {
            return d.offset;
          });

        const point_bars = ptsHover.selectAll('.' + options.class + 'Bar').data(d3.range(points.length)); // data not important, only length of array

        point_bars
          .exit()
          .transition()
          .duration(resize ? 0 : options.display.transition_time)
          .attr('opacity', '0')
          .remove();

        point_bars
          .enter()
          .append('line')
          .attr('class', options.class + 'Bar')
          .attr('opacity', '0')
          .merge(point_bars)
          .attr('opacity', '0')
          .attr('transform', function (_, i: number) {
            return 'translate(' + bX(i) + ', 0)';
          })
          .attr('x1', function () {
            return barsX.bandwidth() / 2;
          })
          .attr('y1', function () {
            return 0;
          })
          .attr('x2', function () {
            return barsX.bandwidth() / 2;
          })
          .attr('y2', function () {
            return yScale(-2);
          })
          .attr('stroke-width', function () {
            return barsX.bandwidth();
          })
          .attr('stroke', function (_, i: number) {
            return 'url(#gradient' + options.id + i + ')';
          })
          .attr('uid', function (_, i: number) {
            return 'point' + i;
          })
          .on('mousemove', function (d: any, i: number, n: Node) {
            if (options.display.point_highlighting) {
              d3.select(n[i]).attr('opacity', options.display.point_opacity);
            }
            if (options.display.game_highlighting && points[i]) {
              d3.select('[id="' + options.class + options.id + 'game' + points[i].point.game + '"]').attr(
                'opacity',
                options.display.game_opacity,
              );
            }
            if (events.point_bars.mouseover) {
              events.point_bars.mouseover(points[d], i);
            }
            if (d == 0) {
              ptsHover.selectAll('.' + options.class + 'Bar').attr('opacity', options.display.point_opacity);
            }
            /** highlightScore(d, i); */
          })
          .on('mouseout', function (d, i) {
            ptsHover.selectAll('.' + options.class + 'Bar').attr('opacity', 0);
            pts.selectAll('.' + options.class + 'Game').attr('opacity', '0');
            if (events.point_bars.mouseout) {
              events.point_bars.mouseout(points[d], i);
            }
            displayScore();
          })
          .on('click', function (d: any, i: number, n: Node) {
            if (events.point_bars.click) {
              events.point_bars.click(points[d], i, n[i]);
            }
          });

        function displayScore(resize?: boolean) {
          const winner = set_data.winner();
          const players = set_data.metadata.players();
          function lastName(name) {
            const split = name.split(' ');
            return split[split.length - 1];
          }
          const legend =
            winner != undefined ? players[winner].name : `${lastName(players[0].name)}/${lastName(players[1].name)}`;

          set_winner
            .transition()
            .duration(resize ? 0 : options.display.transition_time)
            .attr('opacity', 1)
            .attr('fill', winner != undefined ? options.colors.players[winner] : 'black')
            .text(legend);

          const game_score = set_data.scoreboard(winner);
          set_score
            .transition()
            .duration(resize ? 0 : options.display.transition_time)
            .attr('opacity', 1)
            .attr('fill', winner != undefined ? options.colors.players[winner] : 'black')
            .text(game_score);
        }

        function calcStops(point) {
          let win_pct = 0;
          let err_pct = 0;
          let u_pct = 0;

          if (options.display.win_err_highlight) {
            console.log('calcstops:', point);
            const rally = point.rally;
            const result = point.result;
            const rally_pct = rally ? 100 - Math.floor((rallyCount(rally) / longest_rally) * 100) : 100;
            if (winners.indexOf(result) >= 0) {
              win_pct = rally_pct;
            } else if (errors.indexOf(result) >= 0) {
              err_pct = rally_pct;
            } else {
              u_pct = rally_pct;
            }
          }

          return [
            { offset: '0%', color: 'blue' },
            { offset: u_pct + '%', color: 'blue' },
            { offset: u_pct + '%', color: 'green' },
            { offset: u_pct + win_pct + '%', color: 'green' },
            { offset: u_pct + win_pct + '%', color: 'red' },
            { offset: u_pct + win_pct + err_pct + '%', color: 'red' },
            { offset: u_pct + win_pct + err_pct + '%', color: options.colors.orientation },
            { offset: '100%', color: options.colors.orientation },
          ];
        }
      };
    });
  }

  // REUSABLE functions
  // ------------------

  function add_index(d, i) {
    for (const item of d) {
      item['_i'] = i;
    }
    return d;
  }

  function boxWidth() {
    const dl = set_data.history.points().filter((f) => f.set == options.id).length - 1;
    return set_data.complete() ? dl : dl < options.set.average_points ? options.set.average_points : dl;
  }

  function calcWidth() {
    const dl = set_data.history.points().filter((f) => f.set == options.id).length - 1;
    return Math.max(dl, options.points.max_width_points, options.set.average_points);
  }

  function groupGames(point_episodes) {
    const games: any = [{ points: [], range: [0, 0] }];
    let game_counter = 0;
    let current_game = 0;
    point_episodes.forEach((episode) => {
      const point = episode.point;
      if (point.game != current_game) {
        game_counter += 1;
        current_game = point.game;
        games[game_counter] = { points: [], range: [point.index, point.index] };
      }
      games[game_counter].points.push(point);
      games[game_counter].index = game_counter;
      games[game_counter].set = episode.set.index;
      games[game_counter].score = episode.game.games;
      games[game_counter].complete = episode.game.complete;
      games[game_counter].range[1] = point.index;
      if (episode.game.complete) {
        games[game_counter].winner = point.winner;
      }
    });
    return games;
  }

  // ACCESSORS

  // allows updating individual options and suboptions
  // while preserving state of other options
  chart.options = function (values) {
    if (!arguments.length) return options;
    const vKeys = Object.keys(values);
    const oKeys = Object.keys(options);
    for (const vKey of vKeys) {
      if (oKeys.indexOf(vKey) >= 0) {
        if (typeof options[vKey] == 'object') {
          const sKeys = Object.keys(values[vKey]);
          const osKeys = Object.keys(options[vKey]);
          for (const sKey of sKeys) {
            if (osKeys.indexOf(sKey) >= 0) {
              options[vKey][sKey] = values[vKey][sKey];
            }
          }
        } else {
          options[vKey] = values[vKey];
        }
      }
    }
    return chart;
  };

  chart.data = function (set_object) {
    if (!arguments.length) return set_data;
    set_data = set_object;
  };

  chart.events = function (functions) {
    if (!arguments.length) return events;
    const fKeys = Object.keys(functions);
    const eKeys = Object.keys(events);
    for (const fKey of fKeys) {
      if (eKeys.indexOf(fKey) >= 0) events[fKey] = functions[fKey];
    }
    return chart;
  };

  chart.colors = function (colores) {
    if (!arguments.length) return options.colors;
    options.colors.players = colores;
    return chart;
  };

  chart.width = function (value) {
    if (!arguments.length) return options.width;
    options.width = value;
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) return options.height;
    options.height = value;
    return chart;
  };

  chart.update = function (opts) {
    if (events.update.begin) events.update.begin();
    if (typeof update === 'function') update(opts);
    setTimeout(function () {
      if (events.update.end) events.update.end();
    }, options.display.transition_time);
    return true;
  };

  chart.duration = function (value) {
    if (!arguments.length) return options.display.transition_time;
    options.display.transition_time = value;
    return chart;
  };

  return chart;
}
