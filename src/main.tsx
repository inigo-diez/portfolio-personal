import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import './styles/tokens.css';
import './styles/global.css';
import './transition/transition.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app/App';
import { readTestSwitches } from './transition/config';

readTestSwitches();

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Prerendered routes hydrate the real HTML; the dev server starts empty.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
