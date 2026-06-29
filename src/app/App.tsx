import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/pages/login';
import { TracksPage } from '@/pages/tracks';
import { useInitAuth } from '@/features/auth';
import { LessonPage } from '@/pages/lesson';
import { TrackPage } from '@/pages/track';
import { ProfilePage } from '@/pages/profile';
import { HomePage } from '@/pages/home';
import { FavouritePage } from '@/pages/favourite';
import { RegisterPage } from '@/pages/register';
import { PreviewIndexPage, PreviewLessonPage } from '@/pages/preview';
import { RequireAuth } from './RequireAuth';
import { AppLayout } from './AppLayout';
import { ErrorBoundary } from './ErrorBoundary';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient();

export function App() {
  const { t } = useTranslation();
  const ready = useInitAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          {ready ? (
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {import.meta.env.DEV && (
                <>
                  <Route path="/preview" element={<PreviewIndexPage />} />
                  <Route path="/preview/lessons/:lessonId" element={<PreviewLessonPage />} />
                </>
              )}

              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tracks" element={<TracksPage />} />
                  <Route path="/tracks/:trackId" element={<TrackPage />} />
                  <Route path="/favourites" element={<FavouritePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                <Route path="/lesson/:lessonId" element={<LessonPage />}></Route>
              </Route>
            </Routes>
          ) : (
            <div className="grid min-h-screen place-items-center text-muted-foreground">
              {t('common.loading')}
            </div>
          )}
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
