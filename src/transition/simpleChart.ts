import * as d3 from 'd3';

export function simpleChart(target: any, data: any) {
  const dom_parent = d3.select('#' + target);
  // let dims = dom_parent.node().getBoundingClientRect();
  //   let screen_width = dims.width;
  //   let screen_height = screen_width / 2;
  const screen_width = window.innerWidth * 0.85;
  const screen_height = screen_width / 2;

  const min_points = 50;
  const colors = ['blue', 'red'];
  dom_parent.selectAll('svg').remove();
  const svg = dom_parent.append('svg').attr('width', screen_width).attr('height', screen_height);

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const line = d3
    .line()
    .x(function (d) {
      return x(d[0]);
    })
    .y(function (d) {
      return y(d[1]);
    });
  //      .curve(d3.curveStepAfter);

  const chart = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const maxY = Math.max(...data.map((p) => p.length));
  x.domain([0, Math.max(...data.map((p) => Math.max(...p)), min_points)]);
  y.domain([0, maxY]);

  chart
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).ticks(0));

  chart
    .append('g')
    .style('font', '24px times')
    .call(
      d3
        .axisLeft(y)
        .ticks(Math.min(maxY, 4))
        .tickFormat((d) => d)
    );

  drawLines(data);
  appendCircles(data);

  function lineData(points) {
    points = points.map((point, index) => [point, index + 1]);
    points.unshift([0, 0]);
    return points;
  }

  function drawLines(players) {
    players.forEach((points, index) => {
      chart
        .append('path')
        .datum(lineData(points))
        .attr('fill', 'none')
        .attr('stroke', colors[index])
        .attr('stroke-width', '5px')
        .attr('shape-rendering', 'crispEdges')
        .attr('d', line);
    });
  }

  function appendCircles(players) {
    players.forEach((points, index) => {
      const targetclass = '.datapoint' + index;
      if (points.length < 10) {
        chart
          .selectAll(targetclass)
          .data(lineData(points))
          .enter()
          .append('circle')
          .attr('class', targetclass)
          .attr('fill', '#FFFFFF')
          .attr('stroke', colors[index])
          .attr('stroke-width', '2px')
          .attr('r', 3.5)
          .attr('cx', function (d) {
            return x(d[0]);
          })
          .attr('cy', function (d) {
            return y(d[1]);
          });
      }
    });
  }
}
