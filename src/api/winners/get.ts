import API_URL from './constants';
import { Winner, GetWinnersParams } from '../../utils/shared';

type GetWinnersResponse = {
  winners: Winner[];
  totalCount: number | null;
};

export async function getWinner(id: number): Promise<Winner | {}> {
  const url = new URL(`${API_URL}/${id}`);

  return fetch(url).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }
    return response.json();
  });
}

export async function getWinners(params?: GetWinnersParams): Promise<GetWinnersResponse | {}> {
  const url = new URL(API_URL);

  if (params?.page) url.searchParams.append('_page', String(params.page));
  if (params?.limit) url.searchParams.append('_limit', String(params.limit));
  if (params?.sort) url.searchParams.append('_sort', params.sort);
  if (params?.order) url.searchParams.append('_order', params.order);

  return fetch(url).then((response) =>
    response.json().then((winners) => {
      const totalCount = params?.limit ?? Number(response.headers.get('X-Total-Count'));
      return { winners, totalCount };
    }),
  );
}
