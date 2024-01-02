import { findUpClass } from './utilities';

export function toggleChart(element: Element) {
  const container = findUpClass(element, 'statrow');
  const id = container.getAttribute('id');
  const el = document.getElementById(id + '_chart');
  console.log({ id, el });
  if (el) {
    const visible = el.style.display != 'none';
    el.style.display = visible ? 'none' : 'flex';
  }
}
