import API_URL from './constants';
import { Car } from '../../utils/shared';

export default async function updateCar(
  id: number,
  car: { name: string; color: string },
): Promise<Car | {}> {
  const url = new URL(`${API_URL}/${id}`);

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
