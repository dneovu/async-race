import API_URL from './constants';

export default async function deleteCar(id: number): Promise<{}> {
  const url = new URL(`${API_URL}/${id}`);

  return fetch(url, {
    method: 'DELETE',
  }).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }
    return response.json();
  });
}
