import AbstractView from './AbstractView';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Garage');
  }

  async render() {
    return `<nav>
      <a href="/garage" class="nav__link" data-link>Garage</a>
      <a href="/winners" class="nav__link" data-link>Winners</a>
    </nav>
    <h1>Garage</h1>`;
  }
}
