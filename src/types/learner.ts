import { SourceProvenance } from './course';

export interface BktParameters {
  pL0: number; // Prior probability of knowing skill initially (e.g. 0.35)
  pT: number;  // Probability of learning (transition) per practice attempt (e.g. 0.15)
  pG: number;  // Probability of guessing correctly without knowing (e.g. 0.20)
  pS: number;  // Probability of slipping (making error despite knowing) (e.g. 0.10)
}

export interface BktEvidenceTrace {
  id: string;
  timestamp: string;
  topicId: string;
  topicTitle: string;
  questionId: string;
  observation: 'CORRECT' | 'INCORRECT' | 'PARTIALLY_CORRECT';
  difficulty: 'easy' | 'medium' | 'hard';
  prior_pL: number;
  posterior_pL: number;
  transition_pL: number;
  parameters: BktParameters;
  resultingMasteryPercent: number;
  formulaApplied: string;
  evidenceSource: SourceProvenance;
  priorSelectionReason?: string;
  isInitialEstimate?: boolean;
  isolatedTopicVerified?: boolean;
}

export interface TopicMastery {
  topicId: string;
  topicTitle: string;
  score: number; // 0.0 to 1.0 (e.g. 0.86 = 86% BKT latent mastery probability)
  bkt_pL: number; // Current latent probability in BKT model P(L)
  measuredAccuracy?: number; // Raw empirical score percentage: (correctCount / attemptsCount) * 100
  history: number[]; // past scores
  attemptsCount: number;
  correctCount: number;
  lastPracticed: string;
  trend: 'up' | 'down' | 'neutral';
  recentBktTrace?: BktEvidenceTrace;
}

export interface LearnerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  profileType: 'student_a' | 'student_b' | 'student_c' | 'custom';
  description: string;
  overallMastery: number; // percentage 0 - 100
  studyStreakDays: number;
  totalQuestionsAnswered: number;
  accuracyRate: number;
  topicMasteries: Record<string, TopicMastery>;
  lastActive: string;
  bktEvidenceLog: BktEvidenceTrace[];
}

export interface StudyRecommendation {
  id: string;
  topicId: string;
  topicTitle: string;
  actionType: 'review_concept' | 'practice_questions' | 'take_mini_quiz' | 'clarify_misconception';
  title: string;
  description: string;
  estimatedMinutes: number;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  sourceTarget: SourceProvenance;
  bktContext?: {
    current_pL: number;
    recommendedDifficulty: 'easy' | 'medium' | 'hard';
  };
}
