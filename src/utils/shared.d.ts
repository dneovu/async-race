export type Car = {
  name: string;
  color: string;
  id: number;
};

interface GetCarsParams {
  page?: number;
  limit?: number;
}

type Winner = {
  id: number;
  wins: number;
  time: number;
};

interface GetWinnersParams extends GetCarsParams {
  sort?: 'id' | 'wins' | 'time';
  order?: 'ASC' | 'DESC';
}
