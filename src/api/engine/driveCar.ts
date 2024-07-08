import API_URL from './constants';

type DriveResponse = {
  success: true;
};

export default async function driveCar(
  id: number,
  status: 'drive' = 'drive',
): Promise<DriveResponse | undefined> {
  const url = new URL(`${API_URL}`);

  url.searchParams.append('id', String(id));
  url.searchParams.append('status', status);

  return fetch(url, {
    method: 'PATCH',
  }).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }
    return response.json();
  });
}
