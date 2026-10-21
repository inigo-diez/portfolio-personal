// Build-time renderer used by scripts/prerender.mjs (never shipped to the browser).
import { renderToString } from 'react-dom/server';
import { App } from './app/App';
import { setServerPath } from './app/router';
import { allRoutes, BASE, href, metaOf, pathOf, type Route } from './app/routes';

export { allRoutes, metaOf, pathOf };
export const base = BASE;
export const notFound: Route = { kind: 'notfound' };

export function render(route: Route) {
  setServerPath(href(pathOf(route)));
  return renderToString(<App />);
}
