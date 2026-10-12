import { SourceProvenance } from './course';

export type QuestionType = 'mcq' | 'short_answer' | 'numerical';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'adaptive';

export interface VerificationCheck {
  answerableFromSource: boolean;
  answerKeyVerified: boolean;
  explanationAgreesWithSource: boolean;
  difficultyAppropriate: boolean;
  noveltyConfirmed: boolean;
  similarityScore: number; // 0.0 to 1.0 (repetition detector)
  verifiedAt: string;
  notes?: string;
}

export interface Question {
  id: string;
  topicId: string;
  topicTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: QuestionType;
  prompt: string;
  options?: string[]; // For MCQ
  correctAnswer: string;
  acceptableNumericTolerance?: number; // e.g. ±0.05
  acceptableSynonyms?: string[]; // Accepted technical synonyms/abbreviations for free text
  partialMatchKeywords?: string[]; // Keywords that award partial credit
  explanation: string;
  conceptTested: string;
  source: SourceProvenance;
  verification: VerificationCheck;
  relatedVisualId?: string;
}

export interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  status?: 'CORRECT' | 'PARTIALLY_CORRECT' | 'INCORRECT';
  creditScore?: number; // 1.0, 0.5, 0.0
  evaluationFeedback?: string;
  timeSpentSeconds: number;
  timestamp: string;
}

export interface AssessmentResult {
  id: string;
  assessmentTitle: string;
  completedAt: string;
  totalQuestions: number;
  score: number;
  accuracy: number; // percentage e.g. 70
  topicBreakdowns: {
    topicId: string;
    topicTitle: string;
    score: number;
    total: number;
    accuracy: number;
  }[];
  weakTopics: {
    topicId: string;
    topicTitle: string;
    masteryDrop: number;
  }[];
  detectedMisconceptions: {
    id: string;
    topicId: string;
    topicTitle: string;
    description: string;
    evidenceText: string;
    sourceCitation: SourceProvenance;
    remedialAction: string;
  }[];
  attempts: QuestionAttempt[];
}
