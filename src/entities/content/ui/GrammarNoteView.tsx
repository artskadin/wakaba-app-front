import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { localize } from '@/shared/lib/localize';
import type { GrammarNote } from '../types';
import { GrammarBlockView } from './GrammarBlockView';

interface GrammarNoteViewProps {
  note: GrammarNote;
}

export function GrammarNoteView({ note }: GrammarNoteViewProps) {
  const { t } = useTranslation();
  const [showDeeper, setShowDeeper] = useState(false);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">{localize(note.title)}</h3>

      {note.body.map((b, i) => (
        <GrammarBlockView key={i} block={b} />
      ))}

      {note.deeper && note.deeper.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => setShowDeeper((v) => !v)}
          >
            {showDeeper ? t('grammar.collapse') : t('grammar.showDeeper')}
          </button>
          {showDeeper && note.deeper.map((b, i) => <GrammarBlockView key={i} block={b} />)}
        </div>
      )}
    </section>
  );
}
