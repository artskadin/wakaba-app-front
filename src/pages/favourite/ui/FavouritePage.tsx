import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { favouriteRepo } from '@/shared/api/favouriteRepo';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { TokenDetailDrawer } from '@/widgets/token-detail';
import { PageHeader } from '@/shared/ui';
import { SentenceFavouriteItem } from './SentenceFavouriteItem';
import { FavouriteTokenItem } from './FavouriteTokenItem';
import { usePersistanceState } from '@/shared/lib/usePersistenceState';
import { FavouriteFilter, type FavFilter } from './FavouriteFilter';

export function FavouritePage() {
  const { t } = useTranslation();
  const { data: favourites, isLoading: isFavouritesLoading } = useQuery({
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

  const openToken = (tokenId: string) => setSelectedId(tokenId);

  const counts: Record<FavFilter, number> = {
    all: tokens.length + sentences.length,
    tokens: tokens.length,
    sentences: sentences.length,
  };
  const [filter, setFilter] = usePersistanceState<FavFilter>('favourite-filter', 'all', [
    'all',
    'tokens',
    'sentences',
  ]);
  const showTokens = filter === 'all' || filter === 'tokens';
  const showSentences = filter === 'all' || filter === 'sentences';
  const isEmpty = counts.all === 0;

  if (isFavouritesLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div data-component="favourites-page" className="p-6">
      <PageHeader>
        <h1 className="text-lg font-semibold text-heading">{t('nav.favourites')}</h1>
      </PageHeader>

      <div className="mb-4 flex justify-center">
        <FavouriteFilter value={filter} counts={counts} onChange={setFilter} />
      </div>

      {isEmpty && <p className="text-muted-foreground">{t('favourites.empty')}</p>}

      {showTokens && tokens.length > 0 && (
        <>
          <h2 className="text-sm font-semibold uppercase">{t('favourites.tokens')}</h2>
          <ul className="mt-2 flex flex-col gap-2.5">
            {tokens.map((item) => (
              <FavouriteTokenItem key={item.id} token={item.token!} onOpenToken={openToken} />
            ))}
          </ul>
        </>
      )}

      {showSentences && sentences.length > 0 && (
        <>
          <h2 className="mt-7 text-sm font-semibold uppercase">{t('favourites.sentences')}</h2>
          <ul className="mt-2 flex flex-col gap-2.5">
            {sentences.map((item) => (
              <SentenceFavouriteItem
                key={item.id}
                sentence={item.sentence!}
                onOpenToken={openToken}
              />
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
