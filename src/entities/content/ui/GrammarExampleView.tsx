import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, StickyNote, X } from 'lucide-react';
import { localize } from '@/shared/lib/localize';
import type { ContrastSide, ExampleForm, GrammarExample, LocalizedText } from '../types';
import { Badge } from '@/components/ui/badge';

function FormView({ form }: { form: ExampleForm }) {
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      {form.surface && <span className="text-lg">{form.surface}</span>}
      <span className="text-sm text-muted-foreground">{form.romaji}</span>
      {form.cyrillic && <span className="text-sm">{form.cyrillic}</span>}
      {form.translation && (
        <span className="text-sm mt-1 text-heading">{localize(form.translation)}</span>
      )}
    </span>
  );
}

interface GrammarExampleProps {
  example: GrammarExample;
}

export function GrammarExampleView({ example }: GrammarExampleProps) {
  switch (example.kind) {
    case 'plain':
      return <p className="text-sm text-muted-foreground">{localize(example.text)}</p>;

    case 'transform':
      return (
        <ExampleCard>
          <div className="flex items-center gap-1.5">
            <FormView form={example.from} />
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            <FormView form={example.to} />
          </div>

          <ExampleNote note={example.note} />
        </ExampleCard>
      );

    case 'phrase':
      return (
        <ExampleCard>
          <div className="flex flex-col gap-1">
            {example.forms.map((f, i) => (
              <FormView key={i} form={f} />
            ))}
          </div>

          <ExampleNote note={example.note} />
        </ExampleCard>
      );

    case 'dialog-pair':
      return (
        <ExampleCard>
          <div className="flex flex-col gap-1">
            <div className="self-start rounded-3xl rounded-bl-sm border bg-background px-3 py-2">
              <FormView form={example.a} />
            </div>

            <div className="self-end rounded-3xl rounded-br-sm border bg-primary/10 px-3 py-2">
              <FormView form={example.b} />
            </div>
          </div>

          <ExampleNote note={example.note} />
        </ExampleCard>
      );

    case 'contrast':
      return (
        <ExampleCard>
          <div className="flex flex-col gap-1">
            <ContrastSideView side={example.a} />
            <div className="h-px bg-border" />
            <ContrastSideView side={example.b} />
          </div>

          <ExampleNote note={example.note} />
        </ExampleCard>
      );

    case 'wrong-right':
      return (
        <ExampleCard>
          <div className="flex flex-row gap-4">
            {example.wrong && (
              <div className="flex flex-col items-center gap-1.5">
                <WrongRightBadge tone="wrong" />
                <FormView form={example.wrong} />
              </div>
            )}

            {example.right && (
              <div className="flex flex-col items-center gap-1.5">
                <WrongRightBadge tone="right" />
                <FormView form={example.right} />
              </div>
            )}
          </div>

          <ExampleNote note={example.note} />
        </ExampleCard>
      );
  }
}

function ExampleCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg bg-muted px-3 py-2.5">
      {children}
    </div>
  );
}

function ExampleNote({ note }: { note?: LocalizedText }) {
  if (!note) {
    return null;
  }

  return (
    <div className="flex flex-row gap-1.5 items-start text-muted-foreground">
      <StickyNote className="size-3 shrink-0 mt-1" />
      <span className="text-sm">{localize(note)}</span>
    </div>
  );
}

function WrongRightBadge({ tone }: { tone: 'wrong' | 'right' }) {
  const { t } = useTranslation();
  const isWrong = tone === 'wrong';

  if (isWrong) {
    return (
      <Badge variant="destructive">
        <X className="size-3" />
        {t('lesson.example.wrong')}
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" variant="default">
      <Check className="size-3" />
      {t('lesson.example.right')}
    </Badge>
  );
}

function ContrastSideView({ side }: { side: ContrastSide }) {
  const hasHighlight = side.segments.some((s) => s.isHighlight);
  const cls = (on?: boolean) => (on && hasHighlight ? 'text-primary' : '');
  const hasCyrillic = side.segments.some((s) => s.cyrillic);

  return (
    <span className="inline-flex flex-col items-center leading-tight">
      <span className="text-lg">
        {side.segments.map((s, i) => (
          <span key={i} className={cls(s.isHighlight)}>
            {s.surface}
          </span>
        ))}
      </span>

      <span className="text-sm text-muted-foreground">
        {side.segments.map((s, i) => (
          <span key={i} className={cls(s.isHighlight)}>
            {i > 0 ? ' ' : ''}
            {s.romaji}
          </span>
        ))}
      </span>

      {hasCyrillic && (
        <span className="text-sm">
          {side.segments.map((s, i) => (
            <span key={i} className={cls(s.isHighlight)}>
              {i > 0 ? ' ' : ''}
              {s.cyrillic}
            </span>
          ))}
        </span>
      )}

      {side.translation && (
        <span className="text-sm text-heading">{localize(side.translation)}</span>
      )}
    </span>
  );
}
