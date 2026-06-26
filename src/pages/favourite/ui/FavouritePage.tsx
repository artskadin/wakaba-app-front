import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { favouriteRepo } from '@/shared/api/favouriteRepo';
import { localize } from '@/shared/lib/localize';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { TokenDetailDrawer } from '@/widgets/token-detail';
import { SentenceFavouriteItem } from './SentenceFavouriteItem';

export function FavouritePage() {
  const { t } = useTranslation();
  const { data: favourites } = useQuery({
    queryKey: ['favourites'],
    queryFn: () => favouriteRepo.getAll(),
  });

  const tokens = (favourites ?? []).filter((item) => item.itemType === 'token' && item.token);
  const sentences = (favourites ?? []).filter(
    (item) => item.itemType === 'sentence' && item.sentence,
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: detail } = useQuery({
    queryKey: ['tokenDetail', selectedId],
    queryFn: () => contentRepo.getTokenDetail(selectedId!),
    enabled: !!selectedId,
  });

  const isEmpty = tokens.length === 0 && sentences.length === 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{t('nav.favourites')}</h1>
      {isEmpty && <p className="mt-4 text-muted-foreground">{t('favourites.empty')}</p>}

      {tokens.length > 0 && (
        <>
          <h2 className="mt-6 text-sm font-semibold text-muted-foreground">
            {t('favourites.tokens')}
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {tokens.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.token!.id)}
                  className="flex w-full flex-col rounded-xl border p-3 text-left"
                >
                  <span className="text-lg">{item.token!.surface}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.token!.romaji} · [ {item.token!.cyrillic} ]
                  </span>
                  <span className="text-sm">{localize(item.token!.gloss)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {sentences.length > 0 && (
        <>
          <h2 className="mt-6 text-sm font-semibold text-muted-foreground">
            {t('favourites.sentences')}
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {sentences.map((item) => (
              <SentenceFavouriteItem key={item.id} sentence={item.sentence!} />
            ))}
          </ul>
        </>
      )}

      <TokenDetailDrawer
        open={!!selectedId}
        token={detail?.token ?? null}
        note={detail?.grammarNote ?? null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
