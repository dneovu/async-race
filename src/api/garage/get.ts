import API_URL from './constants';
import { Car, GetCarsParams } from '../../utils/shared';

export type TotalCount = number | null;

type GetCarsResponse = {
  cars: Car[];
  totalCount: TotalCount;
};

export async function getCar(id: number): Promise<Car | {}> {
  const url = new URL(`${API_URL}/${id}`);

  return fetch(url).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }
    return response.json();
  });
}

export async function getCars(params?: GetCarsParams): Promise<GetCarsResponse | undefined> {
  const url = new URL(API_URL);

  if (params?.page) url.searchParams.append('_page', String(params.page));
  if (params?.limit) url.searchParams.append('_limit', String(params.limit));

  return fetch(url).then((response) =>
    response.json().then((cars): GetCarsResponse => {
      let totalCount = null;
      if (params?.limit) {
        totalCount = Number(response.headers.get('X-Total-Count'));
      }
      return { cars, totalCount };
    }),
  );
}
