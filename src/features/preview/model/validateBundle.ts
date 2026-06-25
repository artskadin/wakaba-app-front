import type { LessonBundle } from '@/entities/content';

export function validateBundle(b: LessonBundle): string[] {
  const problems: string[] = [];
  const has = (rec: Record<string, unknown>, id: string) =>
    Object.prototype.hasOwnProperty.call(rec, id);

  for (const s of Object.values(b.sentences)) {
    for (const ref of s.tokens) {
      if (!has(b.tokens, ref.tokenId)) {
        problems.push(`Token ${ref.tokenId} referenced in sentence ${s.id} not found`);
      }

      if (s.patternId && !has(b.patterns, s.patternId)) {
        problems.push(`Sentence "${s.id}": pattern "${s.patternId}" not found`);
      }

      s.grammarNoteIds?.forEach((nid) => {
        if (!has(b.grammarNotes, nid)) {
          problems.push(`Sentence "${s.id}": note "${nid}" not found`);
        }
      });
    }

    for (const tok of Object.values(b.tokens)) {
      if (tok.grammarNoteId && !has(b.grammarNotes, tok.grammarNoteId)) {
        problems.push(`Token "${tok.id}": note "${tok.grammarNoteId}" not found`);
      }
    }

    for (const p of Object.values(b.patterns)) {
      p.grammarNoteIds.forEach((nid) => {
        if (!has(b.grammarNotes, nid)) {
          problems.push(`Pattern "${p.id}": note "${nid}" not found`);
        }
      });
    }

    for (const d of Object.values(b.dialogs)) {
      d.turns.forEach((turn, i) => {
        if (!has(b.sentences, turn.sentenceId)) {
          problems.push(
            `Dialog "${d.id}", line "${i + 1}": sentence "${turn.sentenceId}" not found`,
          );
        }
      });
    }

    b.lesson.steps.forEach((step, i) => {
      const where = `Step ${i + 1} (${step.kind})`;

      if ('sentenceId' in step && !has(b.sentences, step.sentenceId)) {
        problems.push(`${where}: sentence "${step.sentenceId}" not found`);
      }

      if (step.kind === 'teach') {
        if (step.patternId && !has(b.patterns, step.patternId)) {
          problems.push(`${where}: pattern "${step.patternId}" not found`);
        }

        step.siblingSentenceIds?.forEach((sid) => {
          if (!has(b.sentences, sid)) {
            problems.push(`${where}: sibling sentence "${sid}" not found`);
          }
        });
      }

      if (step.kind === 'dialog' && !has(b.dialogs, step.dialogId)) {
        problems.push(`${where}: dialog "${step.dialogId}" not found`);
      }
    });
  }

  return problems;
}
