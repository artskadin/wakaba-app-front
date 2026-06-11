import { BrowserRouter, Routes, Navigate, Route } from 'react-router';
import { LoginPage } from '@/pages/login';
import { TracksPage } from '@/pages/tracks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequireAuth } from './RequireAuth';
import { useInitAuth } from '@/features/auth';
import { LessonPage } from '@/pages/lesson/ui/LessonPage';

const queryClient = new QueryClient();

export function App() {
  const ready = useInitAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ready ? (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Navigate to="/tracks" replace />} />
              <Route path="/tracks" element={<TracksPage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />}></Route>
            </Route>
          </Routes>
        ) : (
          <div className="grid min-h-screen place-items-center text-muted-foreground">
            Загрукза...
          </div>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}
