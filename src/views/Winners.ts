import createElement from '../utils/createElement';
import AbstractView from './AbstractView';

export default class extends AbstractView {
  constructor() {
    super();
    this.title = 'Winners';
  }
  async render() {
    return createElement('div', { class: 'winners-wrapper' });
  }
}
