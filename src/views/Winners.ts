import createElement from '../utils/createElement';
import AbstractView from './AbstractView';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Winners');
  }

  async render() {
    return createElement('div', { class: 'winners-wrapper' });
    //   return `<nav>
    //     <a href="/garage" class="nav__link" data-link>Garage</a>
    //     <a href="/winners" class="nav__link" data-link>Winners</a>
    //   </nav>
    //   <h1 class="page-title">Winners</h1>`;
    // }
  }
}
