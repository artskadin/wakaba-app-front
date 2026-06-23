import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { favouriteRepo } from '@/shared/api/favouriteRepo';
import { localize } from '@/shared/lib/localize';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { TokenDetailDrawer } from '@/widgets/token-detail';

export function FavouritePage() {
  const { t } = useTranslation();
  const { data: favourites } = useQuery({
    queryKey: ['favourites'],
    queryFn: () => favouriteRepo.getAll(),
  });

  const words = (favourites ?? []).filter(
    (item) => item.itemType === 'token' && item.token !== null,
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: detail } = useQuery({
    queryKey: ['tokenDetail', selectedId],
    queryFn: () => contentRepo.getTokenDetail(selectedId!),
    enabled: !!selectedId,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{t('nav.favourites')}</h1>
      {words.length === 0 && <p className="mt-4 text-muted-foreground">{t('favourites.empty')}</p>}

      <ul className="mt-6 flex flex-col gap-2">
        {words.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setSelectedId(item.token.id)}
              className="flex w-full flex-col rounded-xl border p-3 text-left"
            >
              <span className="text-lg">{item.token.surface}</span>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {item.token.romaji} · [ {item.token.cyrillic} ]
                </span>
                <span className="text-sm">{localize(item.token.gloss)}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <TokenDetailDrawer
        open={!!selectedId}
        token={detail?.token ?? null}
        note={detail?.grammarNote ?? null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
