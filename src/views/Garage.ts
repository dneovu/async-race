import AbstractView from './AbstractView';
import { getCars, TotalCount } from '../api/garage/get';
import getCarSvg from '../utils/getCarSvg';
import { Car } from '../utils/shared';
import createElement from '../utils/createElement';
import deleteCar from '../api/garage/deleteCar';

export default class extends AbstractView {
  private updateView: () => void;

  constructor(updateView: () => void) {
    super();
    this.updateView = updateView;
    this.setTitle('Garage');
  }

  createCarButtons(id: number): HTMLElement {
    const carRemove = createElement('button', { class: 'car-button', text: 'Remove' });
    carRemove.addEventListener('click', async (e) => {
      e.preventDefault();
      await deleteCar(id);
      this.updateView();
    });
    return carRemove;
  }

  async renderCars(): Promise<{ totalCount: TotalCount; carsHtml: HTMLElement }> {
    const garageContainer = createElement('div', { class: 'garage' });

    const response = await getCars({ limit: 7 });

    if (!response) {
      garageContainer.innerHTML = `Failed to load cars`;
      return { totalCount: null, carsHtml: garageContainer };
    }

    const { totalCount, cars } = response;

    cars?.forEach(async (car: Car) => {
      const divCar = createElement('div', { class: 'car', id: String(car.id) });
      const carContent = createElement('div', { class: 'car-content' });
      const carRemove = this.createCarButtons(car.id);
      const carName = createElement('p', { text: car.name });
      const carIconWrapper = createElement('div', { class: 'car-icon' });
      const carIcon = createElement('svg');
      carIcon.innerHTML = getCarSvg(car);

      carIconWrapper.append(carIcon);
      carContent.append(carRemove, carName);
      divCar.append(carContent, carIconWrapper);
      garageContainer.append(divCar);
    });

    return { totalCount, carsHtml: garageContainer };
  }

  async render() {
    const { totalCount, carsHtml } = await this.renderCars();
    const garageWrapper = createElement('div', { class: 'garage-wrapper' });
    garageWrapper.innerHTML = `<nav>
      <a href="/garage" class="nav__link" data-link>Garage</a>
      <a href="/winners" class="nav__link" data-link>Winners</a>
    </nav>
    <h1 class="page-title">Garage (${totalCount})</h1>`;
    garageWrapper.appendChild(carsHtml);

    return garageWrapper;
  }
}
