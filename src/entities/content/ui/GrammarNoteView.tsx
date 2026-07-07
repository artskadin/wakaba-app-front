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
    <div className="mt-2 flex flex-col gap-3">
      {note.title && (
        <span className="text-sm font-medium text-primary">{localize(note.title)}</span>
      )}

      <div className="flex flex-col gap-6">
        {note.body.map((b, i) => (
          <GrammarBlockView key={i} block={b} />
        ))}

        {note.deeper && note.deeper.length > 0 && (
          <div>
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline cursor-pointer mb-3"
              onClick={() => setShowDeeper((v) => !v)}
            >
              {showDeeper ? t('grammar.collapse') : t('grammar.showDeeper')}
            </button>
            <div className="flex flex-col gap-6">
              {showDeeper && note.deeper.map((b, i) => <GrammarBlockView key={i} block={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
