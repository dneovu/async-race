import API_URL from './constants';
import { Winner } from '../../utils/shared';

export default async function updateWinner(
  id: number,
  winner: { wins: number; time: number },
): Promise<Winner | {}> {
  const url = new URL(`${API_URL}/${id}`);

  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify(winner),
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
