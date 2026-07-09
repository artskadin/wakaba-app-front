import { localize } from '@/shared/lib/localize';
import type { ExampleForm, GrammarExample } from '../types';
import { ArrowRight } from 'lucide-react';

function FormView({ form }: { form: ExampleForm }) {
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      {form.surface && <span className="text-lg">{form.surface}</span>}
      <span className="text-sm text-muted-foreground">{form.romaji}</span>
      {form.cyrillic && <span className="text-sm">{form.cyrillic}</span>}
    </span>
  );
}

interface GrammarExampleProps {
  example: GrammarExample;
}

export function GrammarExampleView({ example }: GrammarExampleProps) {
  if (example.kind === 'plain') {
    return <p className="text-sm text-muted-foreground">{localize(example.text)}</p>;
  }

  if (example.kind === 'transform') {
    return (
      <div className="flex flex-col gap-2 bg-muted rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-3 ">
          <FormView form={example.from} />
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          <FormView form={example.to} />
        </div>
        {example.note && (
          <span className="ml-1 text-sm text-heading">{localize(example.note)}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-baseline bg-muted rounded-lg px-3 py-2.5">
      <div className="flex flex-col gap-3">
        {example.forms.map((f, i) => (
          <FormView key={i} form={f} />
        ))}
      </div>
      {example.note && <span className="text-sm text-heading">{localize(example.note)}</span>}
    </div>
  );
}
