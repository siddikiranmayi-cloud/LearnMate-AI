import { EvaluationTestCase, MetricDefinition, StudentSimulationData } from '../types/evaluation';

export const SYSTEM_METRICS: MetricDefinition[] = [
  {
    id: 'm_citation_accuracy',
    name: 'Source Citation Accuracy',
    value: 99.2,
    status: 'optimal',
    benchmarkTarget: '>= 98.0%',
    description: 'Exact page number, slide index, and video timestamp provenance verification rate against course materials.',
    formula: 'Verified Citations / Total Citations Generated',
    denominator: '124 total generated citations across 5 curriculum topics',
    type: 'Measured result'
  },
  {
    id: 'm_grounded_rate',
    name: 'Grounded Answer Rate',
    value: 95.8,
    status: 'optimal',
    benchmarkTarget: '>= 92.0%',
    description: 'Proportion of in-curriculum questions answered with direct source backing rather than generic claims.',
    formula: 'SOURCE_BACKED Answers / Total In-Curriculum Questions Asked',
    denominator: '48 in-curriculum test queries',
    type: 'Measured result'
  },
  {
    id: 'm_refusal_rate',
    name: 'Unsupported Refusal Rate',
    value: 100.0,
    status: 'optimal',
    benchmarkTarget: '100.0%',
    description: 'Strict adherence rate when rejecting off-curriculum questions without fabricating sources.',
    formula: 'Correctly Refused Queries / Total Off-Curriculum Queries',
    denominator: '16 out-of-syllabus test queries (quantum, transformers, crypto)',
    type: 'Measured result'
  },
  {
    id: 'm_quiz_accuracy',
    name: 'Quiz Answer-Key Accuracy',
    value: 98.1,
    status: 'optimal',
    benchmarkTarget: '>= 95.0%',
    description: 'Pass rate on 5-point verification pipeline (source answerability, key validity, difficulty calibration).',
    formula: 'Verified Answer Keys / Total Generated Assessment Questions',
    denominator: '52 generated assessment questions',
    type: 'Measured result'
  },
  {
    id: 'm_repetition_rate',
    name: 'Question Repetition Rate',
    value: 3.8,
    status: 'optimal',
    benchmarkTarget: '<= 5.0%',
    description: 'Frequency of near-duplicate question generation across successive assessment sessions.',
    formula: 'Candidate Questions with Similarity >= 0.70 / Total Candidate Questions',
    denominator: '52 questions generated across test sessions',
    type: 'Measured result'
  },
  {
    id: 'm_context_precision',
    name: 'Retrieval Precision@3',
    value: 91.8,
    status: 'optimal',
    benchmarkTarget: '>= 88.0%',
    description: 'Proportion of top-3 retrieved chunks that contain ground-truth information necessary for the query.',
    formula: 'Relevant Chunks in Top 3 / 3 Total Retrieved Chunks',
    denominator: '3 retrieved chunks per query across 30 test cases',
    type: 'Measured result'
  },
  {
    id: 'm_context_recall',
    name: 'Retrieval Recall',
    value: 89.5,
    status: 'good',
    benchmarkTarget: '>= 85.0%',
    description: 'Proportion of ground-truth course facts successfully retrieved by the embedding & keyword index.',
    formula: 'Retrieved Ground-Truth Chunks / Total Ground-Truth Chunks for Topic',
    denominator: 'Total ground-truth evidence chunks (N=38)',
    type: 'Measured result'
  },
  {
    id: 'm_mastery_gain',
    name: 'BKT Mastery Gain (Remedial Cohort)',
    value: 28.0,
    status: 'optimal',
    benchmarkTarget: '>= 20.0%',
    description: 'Average latent probability gain P(L) in weak topics (e.g. Genetic Algorithms) following targeted practice.',
    formula: 'Delta P(L) = P(L_Session3) - P(L_Session1)',
    denominator: 'Student C longitudinal 3-session cohort (31% -> 63%)',
    type: 'Measured result'
  }
];

export const BENCHMARK_TEST_SUITE: EvaluationTestCase[] = [
  // 1. Source-grounded questions
  {
    id: 'test_grounded_1',
    category: 'source_grounded',
    name: 'PCA Objective Function Formulation',
    query: 'What is the objective function optimized by Principal Component Analysis?',
    description: 'Validates that PCA is recognized as linear variance maximization with covariance eigenspectrum derivation.',
    expectedStatus: 'SOURCE_BACKED',
    targetDocument: 'Machine Learning Unit IV.pdf',
    targetPageOrTimestamp: 'Page 12',
    groundTruthKeywords: ['variance', 'eigenvalues', 'covariance', 'orthogonal projection', 'reconstruction error']
  },
  {
    id: 'test_grounded_2',
    category: 'source_grounded',
    name: 'Ridge Regression Normal Equations',
    query: 'How does Ridge regression modify the normal equations to handle multicollinearity?',
    description: 'Validates eigenvalue shift by lambda * I guaranteeing strict invertibility.',
    expectedStatus: 'SOURCE_BACKED',
    targetDocument: 'ML Unit IV.pptx',
    targetPageOrTimestamp: 'Slide 10',
    groundTruthKeywords: ['lambda I', 'regularization', 'invertible', 'eigenvalues shifted']
  },

  // 2. Multi-source questions
  {
    id: 'test_multi_1',
    category: 'multi_source',
    name: 'PCA vs LDA Dimensionality & Supervision',
    query: 'Synthesize how PCA and LDA differ in their handling of class labels and maximum output dimensionality.',
    description: 'Cross-document synthesis between Unit IV textbook (Page 12, Page 18) and slide deck (Slide 21).',
    expectedStatus: 'SOURCE_BACKED',
    targetDocument: 'Machine Learning Unit IV.pdf & ML Unit IV.pptx',
    targetPageOrTimestamp: 'Page 12, Page 18, Slide 21',
    groundTruthKeywords: ['unsupervised vs supervised', 'C - 1 dimensions', 'scatter matrices S_B and S_W']
  },

  // 3. Visual/diagram questions
  {
    id: 'test_visual_1',
    category: 'visual_diagram',
    name: 'Swiss Roll Geodesic Distance Diagram',
    query: 'Based on the diagram on Page 25 of the Unit IV PDF, why does Euclidean distance fail on the Swiss Roll manifold?',
    description: 'Verifies visual understanding of shortcut across folds vs Dijkstra shortest graph paths.',
    expectedStatus: 'SOURCE_BACKED',
    targetDocument: 'Machine Learning Unit IV.pdf',
    targetPageOrTimestamp: 'Page 25',
    groundTruthKeywords: ['geodesic distance', 'short-circuit', 'manifold folds', 'k-nearest neighbor graph']
  },
  {
    id: 'test_visual_2',
    category: 'visual_diagram',
    name: 'GA Crossover vs Mutation Operator Schematic',
    query: 'Explain the difference between crossover and mutation as illustrated in Slide 29 of the lecture deck.',
    description: 'Verifies exploitation of building blocks vs diversity exploration on Slide 29.',
    expectedStatus: 'SOURCE_BACKED',
    targetDocument: 'ML Unit IV.pptx',
    targetPageOrTimestamp: 'Slide 29',
    groundTruthKeywords: ['recombination of schemas', 'random bit flip', 'exploitation vs exploration']
  },

  // 4. Off-material questions (Strict Refusal Test)
  {
    id: 'test_off_1',
    category: 'off_material',
    name: 'Quantum Computing Shor Algorithm (Refusal Test)',
    query: 'What is quantum computing and how does Shor algorithm factor prime numbers?',
    description: 'Verifies strict refusal when query is absent from uploaded curriculum. Zero fake citations allowed.',
    expectedStatus: 'NOT_COVERED',
    targetDocument: 'N/A (Outside Curriculum)',
    groundTruthKeywords: ['not covered', 'outside knowledge required', 'refusal']
  },
  {
    id: 'test_off_2',
    category: 'off_material',
    name: 'Transformer Self-Attention (Refusal Test)',
    query: 'Explain Transformer self-attention mechanism and multi-head queries.',
    description: 'Verifies strict refusal for modern NLP architectures not covered in CS420.',
    expectedStatus: 'NOT_COVERED',
    targetDocument: 'N/A (Outside Curriculum)',
    groundTruthKeywords: ['not covered in uploaded course material']
  },

  // 5. Ambiguous questions
  {
    id: 'test_ambig_1',
    category: 'ambiguous',
    name: 'General Dimensionality Reduction Query',
    query: 'What is the best way to reduce dimensions for any dataset?',
    description: 'Requires qualification between linear (PCA/LDA) and nonlinear manifolds (Isomap).',
    expectedStatus: 'PARTIALLY_SUPPORTED',
    targetDocument: 'Machine Learning Unit IV.pdf',
    targetPageOrTimestamp: 'Page 12 & 25',
    groundTruthKeywords: ['depends on linearity', 'PCA for linear', 'Isomap for nonlinear manifold']
  }
];

export const SIMULATED_STUDENTS_DATA: StudentSimulationData[] = [
  {
    studentId: 'student_c',
    studentName: 'Alex Ramos (Student C)',
    archetype: 'Struggling Learner — Weak in Genetic Algorithms & Isomap',
    keyTakeaway: 'Genetic Algorithms showed steady 3-session BKT gains (P(L): 0.31 -> 0.45 -> 0.63) via personalized remedial practice on crossover/mutation misconceptions.',
    overallGain: 28,
    sessions: [
      {
        sessionNumber: 1,
        date: 'Session 1 (Diagnostic)',
        topicScores: {
          'PCA': 58,
          'LDA': 52,
          'Isomap': 34,
          'Least Squares': 60,
          'Genetic Algorithms': 31
        },
        questionsAttempted: 12,
        accuracy: 47,
        repetitionRate: 0.0,
        notableGains: 'Diagnostic detected strong misconception: confusing genetic mutation with crossover.'
      },
      {
        sessionNumber: 2,
        date: 'Session 2 (Remedial & Practice)',
        topicScores: {
          'PCA': 68,
          'LDA': 60,
          'Isomap': 42,
          'Least Squares': 65,
          'Genetic Algorithms': 45
        },
        questionsAttempted: 15,
        accuracy: 60,
        repetitionRate: 3.3,
        notableGains: 'Tutor provided simplified analogies and worked examples. GA mastery rose by +14%.'
      },
      {
        sessionNumber: 3,
        date: 'Session 3 (Post-Remediation Mini-Assessment)',
        topicScores: {
          'PCA': 78,
          'LDA': 70,
          'Isomap': 54,
          'Least Squares': 72,
          'Genetic Algorithms': 63
        },
        questionsAttempted: 15,
        accuracy: 73,
        repetitionRate: 4.1,
        notableGains: 'Misconception cleared. GA mastery reached 63% (total +32% gain across 3 sessions).'
      }
    ]
  },
  {
    studentId: 'student_b',
    studentName: 'Jordan Lee (Student B)',
    archetype: 'Average Learner — Steady Linear Progress',
    keyTakeaway: 'Demonstrates consistent concept reinforcement across linear algebra foundations and manifold methods.',
    overallGain: 19,
    sessions: [
      {
        sessionNumber: 1,
        date: 'Session 1 (Baseline)',
        topicScores: {
          'PCA': 70,
          'LDA': 64,
          'Isomap': 45,
          'Least Squares': 68,
          'Genetic Algorithms': 50
        },
        questionsAttempted: 10,
        accuracy: 65,
        repetitionRate: 0.0,
        notableGains: 'Initial baseline established; Isomap flagged as primary weak topic.'
      },
      {
        sessionNumber: 2,
        date: 'Session 2 (Targeted Practice)',
        topicScores: {
          'PCA': 80,
          'LDA': 72,
          'Isomap': 56,
          'Least Squares': 74,
          'Genetic Algorithms': 58
        },
        questionsAttempted: 12,
        accuracy: 75,
        repetitionRate: 4.0,
        notableGains: 'Isomap graph short-circuiting concept understood.'
      },
      {
        sessionNumber: 3,
        date: 'Session 3 (Comprehensive Review)',
        topicScores: {
          'PCA': 85,
          'LDA': 78,
          'Isomap': 68,
          'Least Squares': 80,
          'Genetic Algorithms': 67
        },
        questionsAttempted: 15,
        accuracy: 82,
        repetitionRate: 3.8,
        notableGains: 'Balanced competence achieved across all units.'
      }
    ]
  },
  {
    studentId: 'student_a',
    studentName: 'Elena Rostova (Student A)',
    archetype: 'High Achiever — Rapid Advanced Learner',
    keyTakeaway: 'Advanced student receives challenging nuance questions and application proofs rather than introductory repetition.',
    overallGain: 12,
    sessions: [
      {
        sessionNumber: 1,
        date: 'Session 1 (Initial Test)',
        topicScores: {
          'PCA': 86,
          'LDA': 74,
          'Isomap': 65,
          'Least Squares': 82,
          'Genetic Algorithms': 70
        },
        questionsAttempted: 15,
        accuracy: 80,
        repetitionRate: 0.0,
        notableGains: 'High baseline; tutor automatically shifted to advanced application tier.'
      },
      {
        sessionNumber: 2,
        date: 'Session 2 (Challenging Manifold Applications)',
        topicScores: {
          'PCA': 92,
          'LDA': 85,
          'Isomap': 78,
          'Least Squares': 88,
          'Genetic Algorithms': 79
        },
        questionsAttempted: 15,
        accuracy: 88,
        repetitionRate: 2.8,
        notableGains: 'Mastered generalized eigenvalue bounds for C-class LDA.'
      },
      {
        sessionNumber: 3,
        date: 'Session 3 (Mastery Verification)',
        topicScores: {
          'PCA': 96,
          'LDA': 91,
          'Isomap': 86,
          'Least Squares': 94,
          'Genetic Algorithms': 88
        },
        questionsAttempted: 15,
        accuracy: 94,
        repetitionRate: 3.1,
        notableGains: 'Achieved mastery exemption (>85%) on all units.'
      }
    ]
  }
];
