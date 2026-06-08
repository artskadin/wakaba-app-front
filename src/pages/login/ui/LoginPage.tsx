import { Link } from 'react-router';

export function LoginPage() {
  return (
    <div className="p-6">
      <h1 className="text-2x1 font-semibold">Вход (заглушка)</h1>
      <Link to="/tracks" className="text-primary underline">
        к трекам →
      </Link>
    </div>
  );
}
