import { broadcastToggle } from './coms';

import * as d3 from 'd3';

export function pulseCircle() {
  let width: number; // in pixels
  let height: number; // in pixels
  let radius = 50;
  let duration = 1000;
  const stroke = 'black';
  let pulse_circles = 5;
  let stroke_width = 10;
  let delay_multiplier = 150;
  let color_range = ['white', 'blue'];
  const margins = { top: 0, right: 0, bottom: 0, left: 0 };

  function pulseCircle(selection: any) {
    const dims = selection.node().getBoundingClientRect();
    if (!height || !width) {
      radius = Math.min(width || dims.width, dims.width, height || dims.height, dims.height) * 0.45;
      stroke_width = radius / 3;
    }
    width = width || dims.width;
    height = height || dims.height;

    if (!height || !width) return;

    const color = d3.scaleLinear().domain([100, 0]).range(color_range).interpolate(d3.interpolateHcl);

    const colorFill = function (d: number) {
      return color(Math.abs((d % 20) - 10));
    };

    const y = d3.scalePoint().domain(d3.range(pulse_circles)).range([0, height]);

    /*
    const z = d3
      .scaleLinear()
      .domain([10, 0])
      .range(['hsl(240, 90%, 100%)', 'hsl(240,90%,40%)'])
      .interpolate(d3.interpolateHcl);
      */

    const svg = selection.append('svg').attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    g.selectAll('circle')
      .data(y.domain())
      .enter()
      .append('circle')
      .attr('fill', '#000')
      .attr('stroke', stroke)
      .attr('stroke-width', stroke_width + 'px')
      .attr('r', 0)
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .style('fill', colorFill)
      .on('click', broadcastToggle)
      .transition()
      .duration(duration)
      .delay((d: number) => {
        return d * delay_multiplier;
      })
      .on('start', function repeat(_, i: number, n: any) {
        d3.active(n[i])
          .attr('r', radius)
          .attr('stroke-width', '0px')
          .transition()
          .attr('r', 0)
          .attr('stroke-width', stroke_width + 'px')
          .transition()
          .on('start', repeat);
      });
  }

  pulseCircle.height = (d: number) => {
    return d ? ((height = d), pulseCircle) : height;
  };
  pulseCircle.width = (d: number) => {
    return d ? ((width = d), pulseCircle) : width;
  };
  pulseCircle.duration = (d: number) => {
    return d ? ((duration = d), pulseCircle) : duration;
  };
  pulseCircle.pulse_circles = (d: number) => {
    return d ? ((pulse_circles = d), pulseCircle) : pulse_circles;
  };
  pulseCircle.radius = (d: number) => {
    return d ? ((radius = d), pulseCircle) : radius;
  };
  pulseCircle.delay_multiplier = (d: number) => {
    return d ? ((delay_multiplier = d), pulseCircle) : delay_multiplier;
  };
  pulseCircle.stroke_width = (d: number) => {
    return d ? ((stroke_width = d), pulseCircle) : stroke_width;
  };
  pulseCircle.color_range = (d: any) => {
    return d ? ((color_range = d), pulseCircle) : color_range;
  };

  return pulseCircle;
}
