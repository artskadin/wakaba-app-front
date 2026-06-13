import { localize } from '@/shared/lib/localize';
import type { GrammarNote } from '../types';
import { GrammarExampleView } from './GrammarExampleView';

interface GrammarNoteViewProps {
  note: GrammarNote;
}

export function GrammarNoteView({ note }: GrammarNoteViewProps) {
  return (
    <div className="mt-4 rounded-xl bg-purple-50 p-3">
      <h4 className="text-sm font-semibold text-purple-700">{localize(note.title)}</h4>
      <p className="mt-1 text-sm">{localize(note.body)}</p>
      {note.examples.map((example, i) => (
        <GrammarExampleView key={i} example={example} />
      ))}
    </div>
  );
}
