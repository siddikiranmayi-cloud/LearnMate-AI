export type BenchmarkCategory =
  | 'source_grounded'
  | 'multi_source'
  | 'visual_diagram'
  | 'off_material'
  | 'ambiguous'
  | 'unverifiable_quiz_key'
  | 'duplicate_question'
  | 'learner_profile_adaptation';

export type RegistryTestCategory =
  | 'supported_citation'
  | 'paraphrase_concept'
  | 'unsupported_out_of_syllabus'
  | 'fabricated_citation'
  | 'specific_provenance'
  | 'quiz_answer_key'
  | 'duplicate_detection'
  | 'topic_mastery_bkt';

export interface TestExecutionResult {
  passed: boolean;
  actualOutput: string;
  executionTimestamp: string;
  executionTimeMs: number;
  log: string;
  citationValid?: boolean;
  citationNotes?: string;
  provenanceMatched?: boolean;
  score?: number;
  thresholdApplied?: string;
}

export interface RegistryTestCase {
  id: string;
  name: string;
  category: RegistryTestCategory;
  description: string;
  inputPayload: string; // Query, question payload, or JSON configuration
  expectedBehavior: string;
  relevantSource?: {
    sourceType: 'pdf' | 'ppt' | 'video';
    fileName: string;
    page?: number;
    slide?: number;
    timestamp?: string;
    section?: string;
  };
  lastResult?: TestExecutionResult;
  isCustom?: boolean; // User created
  createdAt: string;
  updatedAt: string;
}

export interface HonestMetricsSummary {
  overallPassRate: { passed: number; total: number; percentage: number | null; status: 'sufficient' | 'insufficient' };
  citationCorrectnessRate: { correct: number; total: number; percentage: number | null; status: 'sufficient' | 'insufficient' };
  unsupportedRejectionRate: { rejected: number; total: number; percentage: number | null; status: 'sufficient' | 'insufficient' };
  quizKeyAccuracy: { verified: number; total: number; percentage: number | null; status: 'sufficient' | 'insufficient' };
  duplicateDetectionRate: { caught: number; total: number; percentage: number | null; status: 'sufficient' | 'insufficient' };
  retrievalRelevanceAvg: { totalScore: number; count: number; avgScore: number | null; status: 'sufficient' | 'insufficient' };
  totalExecutedCount: number;
}

export interface EvaluationTestCase {
  id: string;
  category: BenchmarkCategory;
  name: string;
  query: string;
  description: string;
  expectedStatus: 'SOURCE_BACKED' | 'PARTIALLY_SUPPORTED' | 'NOT_COVERED' | 'REJECTED_VERIFICATION' | 'REJECTED_DUPLICATE';
  targetDocument: string;
  targetPageOrTimestamp?: string;
  groundTruthKeywords: string[];
  expectedVerificationPass?: boolean;
  testInputPayload?: any;
  lastRunResult?: {
    passed: boolean;
    actualStatus: string;
    score: number; // 0 - 100
    citationMatched: boolean;
    executionTimeMs: number;
    log: string;
    evidenceChunksCount?: number;
    thresholdReasoning?: string;
  };
}

export interface MetricDefinition {
  id: string;
  name: string;
  value: number; // percentage
  status: 'optimal' | 'good' | 'warning';
  benchmarkTarget: string;
  description: string;
  formula: string;
  denominator: string;
  type: 'Measured result' | 'Demo / simulated result';
}

export interface SimulatedSessionStep {
  sessionNumber: number;
  date: string;
  topicScores: Record<string, number>;
  questionsAttempted: number;
  accuracy: number;
  repetitionRate: number;
  notableGains: string;
}

export interface StudentSimulationData {
  studentId: 'student_a' | 'student_b' | 'student_c';
  studentName: string;
  archetype: string;
  sessions: SimulatedSessionStep[];
  overallGain: number; // percentage points
  keyTakeaway: string;
}

export interface JudgeInspectionItem {
  query: string;
  timestamp: string;
  retrievedChunks: {
    id: string;
    title: string;
    fileName: string;
    location: string;
    score: number;
    excerpt: string;
    tokenOverlap: string[];
  }[];
  groundingDecision: {
    status: 'SOURCE_BACKED' | 'PARTIALLY_SUPPORTED' | 'NOT_COVERED';
    score: number;
    thresholdApplied: string;
    refusalTriggered: boolean;
  };
  answer: string;
  claimCitationMapping: {
    claim: string;
    citationId: string;
    sourceFile: string;
    pageOrTimestamp: string;
  }[];
  verificationResult: {
    passed: boolean;
    checks: {
      answerableFromSource: boolean;
      answerKeyVerified: boolean;
      explanationAgrees: boolean;
      difficultyCalibrated: boolean;
      noveltyConfirmed: boolean;
    };
    notes: string;
  };
}
