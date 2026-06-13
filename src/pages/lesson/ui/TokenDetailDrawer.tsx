import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { GrammarNoteView, type LessonBundle, type ResolvedToken } from '@/entities/content';
import { localize } from '@/shared/lib/localize';

interface TokenDetailDrawerProps {
  resolvedToken: ResolvedToken | null;
  bundle: LessonBundle;
  onClose: () => void;
}

export function TokenDetailDrawer({ resolvedToken, bundle, onClose }: TokenDetailDrawerProps) {
  const note = resolvedToken?.token.grammarNoteId
    ? bundle.grammarNotes[resolvedToken.token.grammarNoteId]
    : undefined;

  return (
    <Drawer open={!!resolvedToken} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="p-4">
        {resolvedToken && (
          <div className="mx-auto w-full max-w-md pb-6">
            <div className="text-3xl">{resolvedToken.token.surface}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {resolvedToken.token.reading} · {resolvedToken.token.romaji} · [{' '}
              {resolvedToken.token.cyrillic} ]
            </div>
            <div className="mt-2 text-lg fonfont-semibold">
              {localize(resolvedToken.token.gloss)}
            </div>
            {note && <GrammarNoteView note={note} />}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
