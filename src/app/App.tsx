import { BrowserRouter, Routes, Navigate, Route } from 'react-router';
import { LoginPage } from '@/pages/login';
import { TracksPage } from '@/pages/tracks';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tracks" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tracks" element={<TracksPage />} />
      </Routes>
    </BrowserRouter>
  );
}
