import { Link } from 'react-router';

export function TracksPage() {
  return (
    <div className="p-6">
      <h1 className="text-2x1 font-semibold">Треки (заглушка)</h1>
      <Link to="/login" className="text-primary underline">
        ← к входу
      </Link>
    </div>
  );
}
