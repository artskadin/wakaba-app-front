import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App.tsx';
import '@/shared/config/i18n';
import { setOnUnauthorized } from './shared/api/client';
import { useAuthStore } from './features/auth';

import './index.css';

setOnUnauthorized(() => useAuthStore.getState().setUser(null));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
