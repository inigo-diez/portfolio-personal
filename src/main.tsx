import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import './styles/tokens.css';
import './styles/global.css';
import './transition/transition.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app/App';
import { usingTestTracks } from './content/music';
import { readTestSwitches } from './transition/config';

readTestSwitches();

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Prerendered routes hydrate the real HTML; the dev server starts empty. With the Mi música test data
// (?musica=prueba) the page differs from the prerendered one, so it is rendered from scratch instead.
if (root.firstElementChild && !usingTestTracks()) hydrateRoot(root, app);
else {
  root.replaceChildren();
  createRoot(root).render(app);
}
