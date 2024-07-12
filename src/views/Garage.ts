import AbstractView from './AbstractView';
import { getCars, TotalCount, getCar } from '../api/garage/get';
import getCarSvg from '../utils/getCarSvg';
import { Car, GetCarsParams } from '../utils/shared';
import createElement from '../utils/createElement';
import deleteCar from '../api/garage/deleteCar';
import createCar from '../api/garage/createCar';
import updateCar from '../api/garage/updateCar';
import isCar from '../utils/isCar';
import { carNames } from '../utils/carNames';

export default class extends AbstractView {
  currentPageNumber: number;
  totalCount: TotalCount;
  NumberOfCarsPerPage: number;

  constructor() {
    super();
    this.title = 'Garage';
    this.currentPageNumber = 1;
    this.totalCount = 0;
    this.NumberOfCarsPerPage = 0;
  }
  createHtmlTitle(totalCount: TotalCount): HTMLElement {
    const title = createElement('h1', {
      class: 'page-title',
      text: `Garage (${totalCount})`,
    });
    return title;
  }

  createHtmlPageNumber(): HTMLElement {
    const currentPageNumber = createElement('h2', {
      class: 'page-number',
      text: `Page #${this.currentPageNumber}`,
    });
    return currentPageNumber;
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
      class: 'button',
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
    const button = createElement('button', { class: 'button', text: 'Create' });

    const carCreationHandler = async (e: Event) => {
      e.preventDefault();
      const name = inputName.value;
      const color = inputColor.value;

      if (name !== '') {
        await createCar({ name, color });
        this.updateGarage();
      }
    };

    button.addEventListener('click', carCreationHandler);

    const carCreationContainer = createElement('div', { class: 'car-creation' });
    carCreationContainer.append(inputName, inputColor, button);
    return carCreationContainer;
  }

  createHtmlCarButtons(id: number): { remove: HTMLElement; select: HTMLElement } {
    const carRemove = createElement('button', {
      class: 'button',
      text: 'Remove',
    });

    carRemove.addEventListener('click', async (e) => {
      e.preventDefault();
      await deleteCar(id);
      this.updateGarage();
    });

    const carSelect = createElement('button', {
      class: 'button',
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

  async generateNewCars(): Promise<Car[]> {
    const newCars: Promise<Car>[] = [];
    const randomCarProps = () => {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const randomName = `${carNames.makes[Math.floor(Math.random() * carNames.makes.length)]} ${carNames.models[Math.floor(Math.random() * carNames.models.length)]}`;
      return { name: randomName, color: randomColor };
    };
    for (let i = 0; i < 100; i++) {
      const car = createCar(randomCarProps());
      newCars.push(car);
    }

    const resolvedCars = await Promise.all(newCars);
    return resolvedCars;
  }

  createGenerateCarsButton(): HTMLElement {
    const button = createElement('button', { class: 'button', text: 'Generate cars' });

    button.addEventListener('click', async (e) => {
      e.preventDefault();
      await this.generateNewCars();
      this.updateGarage();
    });

    return button;
  }

  createPaginationButtons(): HTMLElement {
    const paginationButtonHandler = (btnType: 'prev' | 'next') => {
      // const shownCars = this.NumberOfCarsPerPage + (this.currentPageNumber - 1) * this.NumberOfCarsPerPage;
      let numberOfPages = 1;
      if (this.totalCount) numberOfPages = Math.ceil(this.totalCount / this.NumberOfCarsPerPage);

      const prevBtn = document.getElementById('garage-prev-page');
      const nextBtn = document.getElementById('garage-next-page');

      if (btnType === 'next') {
        this.currentPageNumber++;

        prevBtn?.removeAttribute('disabled');

        if (numberOfPages === this.currentPageNumber) {
          nextBtn?.setAttribute('disabled', 'true');
        }
      } else {
        this.currentPageNumber--;

        nextBtn?.removeAttribute('disabled');

        if (this.currentPageNumber === 1) {
          prevBtn?.setAttribute('disabled', 'true');
        }
      }
      this.updateGarage();
    };

    const buttonNext = createElement('button', {
      class: 'button',
      text: 'Next',
      id: 'garage-next-page',
    });
    buttonNext.addEventListener('click', () => paginationButtonHandler('next'));

    const buttonPrev = createElement('button', {
      class: 'button',
      text: 'Prev',
      id: 'garage-prev-page',
    });
    buttonPrev.addEventListener('click', () => paginationButtonHandler('prev'));

    const paginationContainer = createElement('div', { class: 'pagination' });
    paginationContainer.append(buttonPrev, buttonNext);
    return paginationContainer;
  }

  async renderCars(
    params?: GetCarsParams,
  ): Promise<{ totalCount: TotalCount; carsHtml: HTMLElement }> {
    const setNumberOfCarsPerPage = (n: number) => {
      this.NumberOfCarsPerPage = n;
    };

    const garageContainer = createElement('div', { class: 'garage' });

    const response = await getCars(params);

    if (!response) {
      garageContainer.innerHTML = `Failed to load cars`;
      return { totalCount: null, carsHtml: garageContainer };
    }

    const { totalCount, cars } = response;
    setNumberOfCarsPerPage(cars.length);

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

  async updateGarage() {
    const { totalCount, carsHtml } = await this.renderCars({
      page: this.currentPageNumber,
      limit: 7,
    });
    this.totalCount = totalCount;

    const pageTitle = document.querySelector('.page-title') as HTMLElement;
    pageTitle.textContent = `Garage (${totalCount})`;

    const pageNumber = document.querySelector('.page-number') as HTMLElement;
    pageNumber.textContent = `Page #${this.currentPageNumber}`;

    const garageWrapper = document.querySelector('.garage') as HTMLElement;
    garageWrapper.innerHTML = '';
    garageWrapper.appendChild(carsHtml);
  }

  async render() {
    const { totalCount, carsHtml } = await this.renderCars({
      page: this.currentPageNumber,
      limit: 7,
    });
    this.totalCount = totalCount;

    const garageWrapper = createElement('div', { class: 'garage-wrapper' });
    const controlWrapper = createElement('div', { class: 'control-wrapper' });
    garageWrapper.innerHTML = `<nav>
      <a href="/garage" class="nav__link" data-link>Garage</a>
      <a href="/winners" class="nav__link" data-link>Winners</a>
    </nav>`;

    controlWrapper.append(
      this.createHtmlCarCreation(),
      this.createHtmlCarUpdate(),
      this.createGenerateCarsButton(),
    );
    garageWrapper.append(
      controlWrapper,
      this.createHtmlTitle(totalCount),
      this.createHtmlPageNumber(),
      carsHtml,
      this.createPaginationButtons(),
    );

    return garageWrapper;
  }
}
