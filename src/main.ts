import { router, navigateTo } from './router/router';

async function main() {
  window.addEventListener('popstate', router);

  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLAnchorElement;

      if (target.matches('[data-link]')) {
        e.preventDefault();
        navigateTo(target.href);
      }
    });
    router();
  });
}

main();
