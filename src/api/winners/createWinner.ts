import API_URL from './constants';
import { Winner } from '../../utils/shared';

export default async function createWinner(winner: Winner): Promise<Winner | undefined> {
  const url = new URL(API_URL);

  return fetch(url, {
    method: 'POST',
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
