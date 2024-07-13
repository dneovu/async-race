import API_URL from './constants';

type DriveResponse =
  | {
      success: true;
    }
  | 'broken';

export default async function driveCar(id: number): Promise<DriveResponse> {
  const url = new URL(`${API_URL}`);
  const status = 'drive';

  url.searchParams.append('id', String(id));
  url.searchParams.append('status', status);

  return fetch(url, {
    method: 'PATCH',
  }).then(async (response) => {
    if (response.status === 500) {
      return 'broken';
    }
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }
    return response.json();
  });
}
