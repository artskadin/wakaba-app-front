import { BrowserRouter, Routes, Navigate, Route } from 'react-router';
import { LoginPage } from '@/pages/login';
import { TracksPage } from '@/pages/tracks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequireAuth } from './RequireAuth';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Navigate to="/tracks" replace />} />
            <Route path="/tracks" element={<TracksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
