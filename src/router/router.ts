import AbstractView from '../views/AbstractView';
import Garage from '../views/Garage';
import Winners from '../views/Winners';

type Route = {
  path: string;
  view: AbstractView;
};

type RouteMatch = {
  route: Route;
  isMatch: boolean;
};

export const router = async (): Promise<void> => {
  const routes: Route[] = [
    { path: '/garage', view: new Garage() },
    { path: '/winners', view: new Winners() },
  ];

  const potentialMatches: RouteMatch[] = routes.map((route) => {
    return {
      route,
      isMatch: location.pathname === route.path,
    };
  });

  let match: RouteMatch | undefined = potentialMatches.find(
    (potentialMatch) => potentialMatch.isMatch,
  );

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const { view } = match.route;

  document.body.innerHTML = '';
  document.body.appendChild(await view.render());
  view.setTitle(view.title);
};

export const navigateTo = (url: string): void => {
  history.pushState(null, '', url);
  router();
};
