export enum Category {
  GRAMMAR = 'grammar',
  LISTENING = 'listening',
  VOCABULARY = 'vocabulary',
  SPEAKING = 'speaking',
  WRITING = 'writing',
  PRONUNCIATION = 'pronunciation',
  PHRASAL_VERBS = 'phrasal-verbs',
  READING = 'reading',
}

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
