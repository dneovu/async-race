import API_URL from './constants';
import { Car } from '../../utils/shared';

export default async function updateCar(car: Car): Promise<Car | {}> {
  const url = new URL(`${API_URL}/${car.id}`);

  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify(car),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    return response.json();
  });
}
