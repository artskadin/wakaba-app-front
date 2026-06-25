export interface LocalizedText {
  ru: string;
  en?: string;
}

export type TokenType =
  | 'noun'
  | 'pronoun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'particle'
  | 'ending'
  | 'prefix'
  | 'number'
  | 'counter'
  | 'expression'
  | 'other';

export type SlotType = string;

export interface Token {
  id: string;
  surface: string;
  reading: string;
  romaji: string;
  cyrillic: string;
  gloss: LocalizedText;
  type: TokenType;
  audioKey?: string;
  grammarNoteId?: string;
  synonymGroupId?: string;
}

export interface TokenRef {
  tokenId: string;
  slotType?: SlotType;
  isFocusSlot?: boolean;
}

export interface Sentence {
  id: string;
  tokens: TokenRef[];
  translation: LocalizedText;
  romaji: string;
  cyrillicGuide: LocalizedText;
  audioKey: string;
  patternId?: string;
  grammarNoteIds?: string[];
}

export interface Pattern {
  id: string;
  explanation: LocalizedText;
  slotType: SlotType;
  grammarNoteIds: string[];
}

export interface ExampleForm {
  surface: string;
  romaji: string;
  cyrillic?: string;
  gloss?: string;
}

export type GrammarExample =
  | { kind: 'transform'; from: ExampleForm; to: ExampleForm; note?: LocalizedText }
  | { kind: 'phrase'; forms: ExampleForm[]; note?: LocalizedText }
  | { kind: 'plain'; text: LocalizedText };

export interface GrammarBlock {
  summary: LocalizedText;
  details?: LocalizedText[];
  examples: GrammarExample[];
}

export interface GrammarNote {
  id: string;
  title: LocalizedText;
  body: GrammarBlock[];
  deeper?: GrammarBlock[];
}

export interface DialogTurn {
  speaker: 'user' | 'stuff';
  sentenceId: string;
}

export interface Dialog {
  id: string;
  title: LocalizedText;
  turns: DialogTurn[];
}

export type LessonStep =
  | { kind: 'teach'; sentenceId: string; patternId?: string; siblingSentenceIds?: string[] }
  | { kind: 'assemble'; sentenceId: string }
  | { kind: 'speak'; sentenceId: string }
  | { kind: 'listen'; sentenceId: string }
  | { kind: 'dialog'; dialogId: string };

export interface ChangelogEntry {
  version: number;
  date: string;
  summary: LocalizedText;
  notify: boolean;
}

export interface Lesson {
  id: string;
  trackId: string;
  title: LocalizedText;
  context: LocalizedText;
  steps: LessonStep[];
  version: number;
  changelog: ChangelogEntry[];
}

export interface Track {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  lessonIds: string[];
}

export interface TrackManifest {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  lessons: { id: string; title: LocalizedText }[];
}

export interface ContentManifest {
  version: number;
  tracks: TrackManifest[];
}

export interface LessonBundle {
  lesson: Lesson;
  tokens: Record<string, Token>;
  grammarNotes: Record<string, GrammarNote>;
  patterns: Record<string, Pattern>;
  sentences: Record<string, Sentence>;
  dialogs: Record<string, Dialog>;
}
