import * as d3 from 'd3';

export function strokeSlider(show?: string) {
  let range;
  const width = window.innerWidth;
  const stroke_slider = document.getElementById('stroke_slider');
  const slideRight = document.getElementById('slideright');
  const slideLeft = document.getElementById('slideleft');

  const hideSlide = () => {
    if (stroke_slider) stroke_slider.style.display = 'none';
  };

  if (show) {
    if (stroke_slider) {
      stroke_slider.style.display = 'flex';
      stroke_slider.style.left = show == 'left' ? width * -1 + 'px' : width * 1.5 + 'px';
    }
    if (slideLeft) slideLeft.style.display = show == 'right' ? 'flex' : 'none';
    if (slideRight) slideRight.style.display = show == 'left' ? 'flex' : 'none';

    range = show == 'left' ? d3.range(0, 1.1, 0.1) : d3.range(0, 1.1, 0.1).reverse();
    d3.selectAll('.stroke_slider')
      .data(range)
      .transition()
      .duration(500)
      .style('left', function (d: number) {
        return d * width * 0.5 + 'px';
      });
  } else {
    const side = slideLeft?.style.display == 'flex' ? 'right' : 'left';
    range = side == 'left' ? d3.range(-1.5, 1.1, 0.1) : d3.range(1, 2.6, 0.1).reverse();
    setTimeout(() => hideSlide(), 700);
  }
  d3.selectAll('.stroke_slider')
    .data(range)
    .transition()
    .duration(500)
    .style('left', function (d: number) {
      return d * width * 0.5 + 'px';
    });
}
