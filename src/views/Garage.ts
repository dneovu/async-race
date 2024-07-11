import AbstractView from './AbstractView';
import { getCars, TotalCount, getCar } from '../api/garage/get';
import getCarSvg from '../utils/getCarSvg';
import { Car } from '../utils/shared';
import createElement from '../utils/createElement';
import deleteCar from '../api/garage/deleteCar';
import createCar from '../api/garage/createCar';
import updateCar from '../api/garage/updateCar';
import isCar from '../utils/isCar';

export default class extends AbstractView {
  private updateView: () => void;

  constructor(updateView: () => void) {
    super();
    this.updateView = updateView;
    this.setTitle('Garage');
  }

  createHtmlTitle(totalCount: TotalCount): HTMLElement {
    const title = createElement('h1', { class: 'page-title', text: `Garage (${totalCount})` });
    return title;
  }

  createHtmlCarUpdate(): HTMLElement {
    const inputName = createElement('input', {
      class: 'control-name',
      type: 'text',
      id: 'car-update-name',
    }) as HTMLInputElement;

    const inputColor = createElement('input', {
      class: 'control-color',
      type: 'color',
      id: 'car-update-color',
    }) as HTMLInputElement;

    const button = createElement('button', {
      class: 'control-button',
      text: 'Update',
      id: 'car-update-button',
    });

    const setDisabledAndClearInput = () => {
      inputName.value = '';
      inputColor.value = '#000000';
      inputName.setAttribute('disabled', 'true');
      inputColor.setAttribute('disabled', 'true');
      button.setAttribute('disabled', 'true');
    };

    setDisabledAndClearInput();

    const carUpdateHandler = async (e: Event) => {
      e.preventDefault();
      const carToUpdate: Car = JSON.parse(localStorage.getItem('carToUpdate') as string) ?? null;
      if (carToUpdate === null) return;

      const htmlCarToUpdate = document.getElementById(String(carToUpdate.id));
      const htmlCarToUpdateName = htmlCarToUpdate?.querySelector('p');
      const htmlCarToUpdateSvg = htmlCarToUpdate?.querySelector('svg');
      if (htmlCarToUpdateName) htmlCarToUpdateName.textContent = inputName.value;
      if (htmlCarToUpdateSvg) htmlCarToUpdateSvg.innerHTML = getCarSvg(inputColor.value);

      await updateCar({ id: carToUpdate.id, name: inputName.value, color: inputColor.value });

      localStorage.removeItem('carToUpdate');
      setDisabledAndClearInput();
    };

    button.addEventListener('click', carUpdateHandler);

    const carUpdateContainer = createElement('div', { class: 'car-update' });
    carUpdateContainer.append(inputName, inputColor, button);
    return carUpdateContainer;
  }

  setCarUpdate(car: Car): void {
    const inputName = document.getElementById('car-update-name') as HTMLInputElement;
    const inputColor = document.getElementById('car-update-color') as HTMLInputElement;
    const button = document.getElementById('car-update-button') as HTMLButtonElement;
    inputName.value = car.name;
    inputColor.value = car.color;
    inputName.removeAttribute('disabled');
    inputColor.removeAttribute('disabled');
    button.removeAttribute('disabled');

    localStorage.setItem('carToUpdate', JSON.stringify(car));
  }

  createHtmlCarCreation(): HTMLElement {
    const inputName = createElement('input', {
      class: 'control-name',
      type: 'text',
    }) as HTMLInputElement;
    const inputColor = createElement('input', {
      class: 'control-color',
      type: 'color',
    }) as HTMLInputElement;
    const button = createElement('button', { class: 'control-button', text: 'Create' });

    const carCreationHandler = async (e: Event) => {
      e.preventDefault();
      const name = inputName.value;
      const color = inputColor.value;

      if (name !== '') {
        await createCar({ name, color });
        this.updateView();
      }
    };

    button.addEventListener('click', carCreationHandler);

    const carCreationContainer = createElement('div', { class: 'car-creation' });
    carCreationContainer.append(inputName, inputColor, button);
    return carCreationContainer;
  }

  createHtmlCarButtons(id: number): { remove: HTMLElement; select: HTMLElement } {
    const carRemove = createElement('button', {
      class: 'car-button',
      text: 'Remove',
    });

    carRemove.addEventListener('click', async (e) => {
      e.preventDefault();
      await deleteCar(id);
      this.updateView();
    });

    const carSelect = createElement('button', {
      class: 'car-button',
      text: 'Select',
    });

    carSelect.addEventListener('click', async (e) => {
      e.preventDefault();
      const selectedCar = await getCar(id);
      if (isCar(selectedCar)) {
        this.setCarUpdate(selectedCar);
      }
    });
    return { remove: carRemove, select: carSelect };
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
      const carSelect = this.createHtmlCarButtons(car.id).select;
      const carRemove = this.createHtmlCarButtons(car.id).remove;
      const carName = createElement('p', { text: car.name });
      const carIconWrapper = createElement('div', { class: 'car-icon' });
      const carIcon = createElement('svg');
      carIcon.innerHTML = getCarSvg(car.color);

      carIconWrapper.append(carIcon);
      carContent.append(carSelect, carRemove, carName);
      divCar.append(carContent, carIconWrapper);
      garageContainer.append(divCar);
    });

    return { totalCount, carsHtml: garageContainer };
  }

  async render() {
    const { totalCount, carsHtml } = await this.renderCars();
    const garageWrapper = createElement('div', { class: 'garage-wrapper' });
    const controlWrapper = createElement('div', { class: 'control-wrapper' });
    garageWrapper.innerHTML = `<nav>
      <a href="/garage" class="nav__link" data-link>Garage</a>
      <a href="/winners" class="nav__link" data-link>Winners</a>
    </nav>`;
    controlWrapper.appendChild(this.createHtmlCarCreation());
    controlWrapper.appendChild(this.createHtmlCarUpdate());
    garageWrapper.appendChild(controlWrapper);
    garageWrapper.appendChild(this.createHtmlTitle(totalCount));
    garageWrapper.appendChild(carsHtml);

    return garageWrapper;
  }
}
