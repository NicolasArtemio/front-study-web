export const Category = {
  GRAMMAR: 'grammar',
  LISTENING: 'listening',
  VOCABULARY: 'vocabulary',
  SPEAKING: 'speaking',
  WRITING: 'writing',
  PRONUNCIATION: 'pronunciation',
  PHRASAL_VERBS: 'phrasal-verbs',
  READING: 'reading',
} as const;

export type CategoryType = 'grammar' | 'listening' | 'vocabulary' | 'speaking' | 'writing' | 'pronunciation' | 'phrasal-verbs' | 'reading';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type RecommendationType = 'book' | 'video' | 'podcast' | 'website';
export type Priority = 'low' | 'medium' | 'high';

export interface Log {
  id: number;
  title: string;
  content: string;
  category: CategoryType | null;
  date: string;
}

export interface CreateLogDTO {
  title: string;
  content: string;
  category: string;
}

export interface UpdateLogDTO {
  title?: string;
  content?: string;
  category?: string;
}

export interface Vocabulary {
  id: number;
  word: string;
  meaning: string | null;
  example: string | null;
  category: CategoryType | null;
  audioRecording: string | null;
  difficulty: Difficulty | null;
  date: string;
}

export interface CreateVocabularyDTO {
  word: string;
  meaning?: string;
  example?: string;
  category?: string;
  audioRecording?: string;
  difficulty?: Difficulty;
}

export interface UpdateVocabularyDTO {
  word?: string;
  meaning?: string;
  example?: string;
  category?: string;
  audioRecording?: string;
  difficulty?: Difficulty;
}

export interface Mistake {
  id: number;
  title: string;
  description: string;
  correction: string | null;
  category: CategoryType | null;
  audioRecording: string | null;
  date: string;
}

export interface CreateMistakeDTO {
  title: string;
  description: string;
  correction?: string;
  category?: string;
  audioRecording?: string;
}

export interface UpdateMistakeDTO {
  title?: string;
  description?: string;
  correction?: string;
  category?: string;
  audioRecording?: string;
}

export interface Recommendation {
  id: number;
  title: string;
  content: string;
  category: CategoryType | null;
  type: RecommendationType | null;
  url: string | null;
  priority: Priority | null;
  date: string;
}

export interface CreateRecommendationDTO {
  title: string;
  content: string;
  category?: string;
  type?: RecommendationType;
  url?: string;
  priority?: Priority;
}

export interface UpdateRecommendationDTO {
  title?: string;
  content?: string;
  category?: string;
  type?: RecommendationType;
  url?: string;
  priority?: Priority;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export type PhraseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface PhraseCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Phrase {
  id: number;
  english: string;
  spanish: string;
  categoryId: number;
  category?: PhraseCategory;
  subcategory: string | null;
  difficulty: PhraseDifficulty;
  isQuestion: boolean;
  relatedPhraseId: number | null;
  relatedPhrase?: Phrase;
  audioUrl: string | null;
  pronunciation: string | null;
  timesCompleted: number;
  lastPracticed: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeSession {
  id: number;
  phraseId: number;
  phrase?: Phrase;
  recordingUrl: string | null;
  recordingBlob: string | null;
  duration: number;
  score: number | null;
  createdAt: string;
}

export interface CreatePracticeSessionDTO {
  phraseId: number;
  recordingUrl?: string;
  recordingBlob?: string;
  duration?: number;
  score?: number;
}

export interface UpdatePhraseDTO {
  timesCompleted?: number;
  lastPracticed?: string;
}
