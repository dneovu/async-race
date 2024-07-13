import API_URL from './constants';

export type RouteResponse = {
  velocity: number;
  distance: number;
};

export async function startStopEngine(
  id: number,
  status: 'started' | 'stopped',
): Promise<RouteResponse | undefined> {
  const url = new URL(API_URL);

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
