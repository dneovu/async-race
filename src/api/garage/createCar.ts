import { Car } from '../../utils/shared';
import API_URL from './constants';

export default async function createCar(car: { name: string; color: string }): Promise<Car> {
  const url = new URL(API_URL);

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(car),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}
