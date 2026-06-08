import { BrowserRouter, Routes, Navigate, Route } from 'react-router';
import { LoginPage } from '@/pages/login';
import { TracksPage } from '@/pages/tracks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tracks" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tracks" element={<TracksPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
