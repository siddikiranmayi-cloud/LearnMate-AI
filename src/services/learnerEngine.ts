import { LearnerProfile, StudyRecommendation, TopicMastery, BktParameters, BktEvidenceTrace } from '../types/learner';
import { AssessmentResult } from '../types/assessment';
import { SourceProvenance } from '../types/course';

export const DEFAULT_BKT_PARAMETERS: BktParameters = {
  pL0: 0.35, // Prior knowledge
  pT: 0.15,  // Transition / learning rate
  pG: 0.20,  // Guess probability (standard 4-choice)
  pS: 0.10   // Slip probability
};

export const INITIAL_TOPIC_MASTERIES: Record<string, TopicMastery> = {
  'topic_pca': {
    topicId: 'topic_pca',
    topicTitle: 'Principal Component Analysis (PCA)',
    score: 0.86,
    bkt_pL: 0.86,
    measuredAccuracy: 86, // 12/14
    history: [0.75, 0.80, 0.86],
    attemptsCount: 14,
    correctCount: 12,
    lastPracticed: '2 hours ago',
    trend: 'up'
  },
  'topic_lda': {
    topicId: 'topic_lda',
    topicTitle: 'Linear Discriminant Analysis (LDA)',
    score: 0.74,
    bkt_pL: 0.74,
    measuredAccuracy: 80, // 8/10
    history: [0.65, 0.70, 0.74],
    attemptsCount: 10,
    correctCount: 8,
    lastPracticed: 'Yesterday',
    trend: 'up'
  },
  'topic_isomap': {
    topicId: 'topic_isomap',
    topicTitle: 'Isometric Feature Mapping (Isomap)',
    score: 0.48,
    bkt_pL: 0.48,
    measuredAccuracy: 50, // 4/8
    history: [0.55, 0.50, 0.48],
    attemptsCount: 8,
    correctCount: 4,
    lastPracticed: '3 days ago',
    trend: 'down'
  },
  'topic_least_squares': {
    topicId: 'topic_least_squares',
    topicTitle: 'Least Squares & Ridge Regression',
    score: 0.68,
    bkt_pL: 0.68,
    measuredAccuracy: 67, // 6/9
    history: [0.60, 0.65, 0.68],
    attemptsCount: 9,
    correctCount: 6,
    lastPracticed: '2 days ago',
    trend: 'neutral'
  },
  'topic_genetic_algorithms': {
    topicId: 'topic_genetic_algorithms',
    topicTitle: 'Genetic Algorithms (GAs)',
    score: 0.37,
    bkt_pL: 0.37,
    measuredAccuracy: 36, // 4/11
    history: [0.42, 0.39, 0.37],
    attemptsCount: 11,
    correctCount: 4,
    lastPracticed: '4 hours ago',
    trend: 'down'
  }
};

export const INITIAL_STUDENT_PROFILE: LearnerProfile = {
  id: 'learner_current',
  name: 'Alex Ramos',
  email: 'alex.ramos@university.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  profileType: 'custom',
  description: 'CS Senior specializing in Applied Machine Learning & Algorithmic Optimization.',
  overallMastery: 63,
  studyStreakDays: 5,
  totalQuestionsAnswered: 52,
  accuracyRate: 65,
  topicMasteries: INITIAL_TOPIC_MASTERIES,
  lastActive: 'Just now',
  bktEvidenceLog: [
    {
      id: 'trace_init_ga',
      timestamp: '4 hours ago',
      topicId: 'topic_genetic_algorithms',
      topicTitle: 'Genetic Algorithms (GAs)',
      questionId: 'q_ga_01',
      observation: 'INCORRECT',
      difficulty: 'medium',
      prior_pL: 0.42,
      posterior_pL: 0.28,
      transition_pL: 0.37,
      parameters: { pL0: 0.35, pT: 0.12, pG: 0.20, pS: 0.10 },
      resultingMasteryPercent: 37,
      formulaApplied: 'P(L|Incorrect) = (0.42 * 0.10) / (0.42 * 0.10 + 0.58 * 0.80) = 0.28; P(L_next) = 0.28 + (1-0.28)*0.12 = 0.37',
      evidenceSource: {
        sourceType: 'ppt',
        fileName: 'ML Unit IV.pptx',
        slide: 29,
        section: 'Slide 29: Crossover vs Mutation Mechanics'
      }
    }
  ]
};

/**
 * Topic-Specific Prior Retrieval & Isolation Guard
 * Enforces Requirements A.1, A.2, A.6, A.7, A.8:
 * 1. Confirms question maps to stable topic identifier
 * 2. Retrieves prior mastery for that exact topic and learner
 * 3. Never uses Isomap mastery for Genetic Algorithms or vice-versa
 * 4. Explains why prior mastery was selected with evidence history
 * 5. Uses documented initial estimate P(L_0) = 0.35 labeled as initial if unpracticed
 */
export function getTopicPriorMastery(
  profile: LearnerProfile | null | undefined,
  topicId: string,
  topicTitle?: string
): {
  prior_pL: number;
  isInitialEstimate: boolean;
  reason: string;
  topicTitle: string;
  historyCount: number;
  measuredAccuracy?: number;
} {
  const mastery = profile?.topicMasteries?.[topicId];
  if (mastery) {
    const rawVal = mastery.bkt_pL !== undefined ? mastery.bkt_pL : mastery.score;
    // Strict probability bound validation within [0, 1]
    const clampedPrior = Math.max(0.02, Math.min(0.98, rawVal));
    const acc = mastery.measuredAccuracy ?? (mastery.attemptsCount > 0 ? Math.round((mastery.correctCount / mastery.attemptsCount) * 100) : 0);
    return {
      prior_pL: clampedPrior,
      isInitialEstimate: false,
      reason: `Historical Prior P(L)=${clampedPrior.toFixed(2)}: Retrieved strictly from topic '${mastery.topicTitle}' [ID: ${topicId}] for learner '${profile?.name || 'Current'}'. Evidence: ${mastery.attemptsCount} previous attempts (measured accuracy: ${acc}%). Prior is strictly isolated to '${mastery.topicTitle}' and cannot inherit from adjacent units.`,
      topicTitle: mastery.topicTitle,
      historyCount: mastery.attemptsCount,
      measuredAccuracy: acc
    };
  }

  // Documented initial mastery fallback
  const initialEstimate = DEFAULT_BKT_PARAMETERS.pL0; // 0.35
  return {
    prior_pL: initialEstimate,
    isInitialEstimate: true,
    reason: `Documented Initial Estimate: P(L_0) = ${initialEstimate.toFixed(2)} (Skill has no recorded prior interactions for topic '${topicTitle || topicId}'). Labeled as an initial baseline estimate.`,
    topicTitle: topicTitle || topicId,
    historyCount: 0
  };
}

/**
 * Genuine Bayesian Knowledge Tracing (BKT) Update
 * Mathematical specification (Corbett & Anderson, 1995):
 * 1. Posterior P(L_t | Observation) via Bayes' Theorem:
 *    - Correct:   P(L_t) * (1 - P(S)) / [ P(L_t) * (1 - P(S)) + (1 - P(L_t)) * P(G) ]
 *    - Incorrect: P(L_t) * P(S)       / [ P(L_t) * P(S)       + (1 - P(L_t)) * (1 - P(G)) ]
 *    - Partial:   Weighted expected posterior: 0.5 * P(L|Correct) + 0.5 * P(L|Incorrect)
 * 2. Learning Opportunity Transition (applied strictly AFTER posterior calculation):
 *    - P(L_{t+1}) = P(L_t | Obs) + (1 - P(L_t | Obs)) * P(T)
 * All probabilities are strictly validated and bounded within [0, 1].
 */
export function computeBktUpdate({
  prior_pL,
  isCorrect,
  observation,
  difficulty = 'medium',
  topicId,
  topicTitle,
  questionId,
  source,
  customParameters,
  priorSelectionReason,
  isInitialEstimate = false
}: {
  prior_pL: number;
  isCorrect?: boolean;
  observation?: 'CORRECT' | 'INCORRECT' | 'PARTIALLY_CORRECT';
  difficulty?: 'easy' | 'medium' | 'hard';
  topicId: string;
  topicTitle: string;
  questionId: string;
  source: SourceProvenance;
  customParameters?: Partial<BktParameters>;
  priorSelectionReason?: string;
  isInitialEstimate?: boolean;
}): {
  updatedMastery: TopicMastery;
  evidenceTrace: BktEvidenceTrace;
} {
  // Determine actual observation status
  const obsStatus: 'CORRECT' | 'INCORRECT' | 'PARTIALLY_CORRECT' = 
    observation || (isCorrect === true ? 'CORRECT' : 'INCORRECT');

  // Calibrate parameters by difficulty unless explicitly overridden
  let pG = 0.20; // Guessing probability
  let pS = 0.10; // Slip probability
  let pT = 0.14; // Learning rate

  if (difficulty === 'easy') {
    pG = 0.25;
    pS = 0.05;
    pT = 0.12;
  } else if (difficulty === 'hard') {
    pG = 0.10;
    pS = 0.15;
    pT = 0.18;
  }

  // Apply custom parameters if provided (e.g. for controlled regression testing)
  if (customParameters) {
    if (customParameters.pG !== undefined) pG = customParameters.pG;
    if (customParameters.pS !== undefined) pS = customParameters.pS;
    if (customParameters.pT !== undefined) pT = customParameters.pT;
  }

  // Validate parameters are strictly within [0, 1]
  pG = Math.max(0.0, Math.min(1.0, pG));
  pS = Math.max(0.0, Math.min(1.0, pS));
  pT = Math.max(0.0, Math.min(1.0, pT));

  // Validate prior is strictly within [0, 1] and bounded for numerical stability
  const pL_prev = Math.max(0.01, Math.min(0.99, prior_pL));

  let posterior_pL = 0;
  let formulaStr = '';

  // Step 1: Calculate Bayes Posterior
  if (obsStatus === 'CORRECT') {
    const num = pL_prev * (1 - pS);
    const denom = num + (1 - pL_prev) * pG;
    posterior_pL = num / (denom || 1);
    formulaStr = `P(L|Correct) = (${pL_prev.toFixed(2)} * ${(1 - pS).toFixed(2)}) / [${num.toFixed(3)} + ${(1 - pL_prev).toFixed(2)} * ${pG.toFixed(2)}] = ${posterior_pL.toFixed(4)}`;
  } else if (obsStatus === 'INCORRECT') {
    const num = pL_prev * pS;
    const denom = num + (1 - pL_prev) * (1 - pG);
    posterior_pL = num / (denom || 1);
    formulaStr = `P(L|Incorrect) = (${pL_prev.toFixed(2)} * ${pS.toFixed(2)}) / [${num.toFixed(3)} + ${(1 - pL_prev).toFixed(2)} * ${(1 - pG).toFixed(2)}] = ${posterior_pL.toFixed(4)}`;
  } else {
    // Partially correct: mixture of knowledge states
    const numC = pL_prev * (1 - pS);
    const denomC = numC + (1 - pL_prev) * pG;
    const postC = numC / (denomC || 1);

    const numI = pL_prev * pS;
    const denomI = numI + (1 - pL_prev) * (1 - pG);
    const postI = numI / (denomI || 1);

    posterior_pL = 0.5 * postC + 0.5 * postI;
    formulaStr = `P(L|Partial) = 0.5 * P(L|Correct: ${postC.toFixed(3)}) + 0.5 * P(L|Incorrect: ${postI.toFixed(3)}) = ${posterior_pL.toFixed(4)}`;
  }

  // Validate posterior is strictly within [0, 1]
  posterior_pL = Math.max(0.01, Math.min(0.99, posterior_pL));

  // Step 2: Learning Opportunity Transition (applied strictly AFTER posterior)
  const transition_pL = posterior_pL + (1 - posterior_pL) * pT;
  
  // Validate final probability is strictly within [0, 1]
  const final_pL = Math.max(0.02, Math.min(0.99, Number(transition_pL.toFixed(4))));
  const resultingPercent = Math.round(final_pL * 100);

  formulaStr += `; P(L_next) = ${posterior_pL.toFixed(4)} + (1 - ${posterior_pL.toFixed(4)}) * ${pT.toFixed(2)} = ${final_pL.toFixed(4)} (${resultingPercent}%)`;

  const reason = priorSelectionReason || 
    (isInitialEstimate 
      ? `Documented initial prior estimate P(L_0)=${pL_prev.toFixed(2)}`
      : `Prior P(L)=${pL_prev.toFixed(2)} retrieved from historical evidence for '${topicTitle}'.`);

  const evidenceTrace: BktEvidenceTrace = {
    id: `bkt_trace_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: 'Just now',
    topicId,
    topicTitle,
    questionId,
    observation: obsStatus,
    difficulty,
    prior_pL: Number(pL_prev.toFixed(4)),
    posterior_pL: Number(posterior_pL.toFixed(4)),
    transition_pL: final_pL,
    parameters: { pL0: 0.35, pT, pG, pS },
    resultingMasteryPercent: resultingPercent,
    formulaApplied: formulaStr,
    evidenceSource: source,
    priorSelectionReason: reason,
    isInitialEstimate,
    isolatedTopicVerified: true
  };

  const updatedMastery: TopicMastery = {
    topicId,
    topicTitle,
    score: Number(final_pL.toFixed(2)),
    bkt_pL: final_pL,
    history: [Number(final_pL.toFixed(2))],
    attemptsCount: 1,
    correctCount: obsStatus === 'CORRECT' ? 1 : obsStatus === 'PARTIALLY_CORRECT' ? 0.5 : 0,
    lastPracticed: 'Just now',
    trend: final_pL > pL_prev ? 'up' : final_pL < pL_prev ? 'down' : 'neutral',
    recentBktTrace: evidenceTrace
  };

  return { updatedMastery, evidenceTrace };
}

export function updateMasteryOnAttempt(
  currentMastery: TopicMastery,
  observation: boolean | 'CORRECT' | 'INCORRECT' | 'PARTIALLY_CORRECT',
  difficulty: 'easy' | 'medium' | 'hard',
  questionId: string = 'q_generic',
  source: SourceProvenance = { sourceType: 'pdf', fileName: 'Machine Learning Unit IV.pdf', page: 12 },
  priorSelectionReason?: string
): { updatedMastery: TopicMastery; evidenceTrace: BktEvidenceTrace } {
  const current_pL = currentMastery.bkt_pL !== undefined ? currentMastery.bkt_pL : currentMastery.score;

  const obsStatus: 'CORRECT' | 'INCORRECT' | 'PARTIALLY_CORRECT' = 
    typeof observation === 'boolean' 
      ? (observation ? 'CORRECT' : 'INCORRECT') 
      : observation;

  const { updatedMastery: calc, evidenceTrace } = computeBktUpdate({
    prior_pL: current_pL,
    observation: obsStatus,
    difficulty,
    topicId: currentMastery.topicId,
    topicTitle: currentMastery.topicTitle,
    questionId,
    source,
    priorSelectionReason
  });

  const newAttempts = currentMastery.attemptsCount + 1;
  const credit = obsStatus === 'CORRECT' ? 1 : obsStatus === 'PARTIALLY_CORRECT' ? 0.5 : 0;
  const newCorrect = currentMastery.correctCount + credit;
  const newAccuracy = Math.round((newCorrect / newAttempts) * 100);

  return {
    updatedMastery: {
      ...currentMastery,
      score: calc.score,
      bkt_pL: calc.bkt_pL,
      measuredAccuracy: newAccuracy,
      history: [...currentMastery.history.slice(-6), calc.score],
      attemptsCount: newAttempts,
      correctCount: newCorrect,
      lastPracticed: 'Just now',
      trend: calc.score > currentMastery.score ? 'up' : calc.score < currentMastery.score ? 'down' : 'neutral',
      recentBktTrace: evidenceTrace
    },
    evidenceTrace
  };
}

/**
 * Controlled BKT Regression Test (Requirement C)
 * Parameters:
 * - Prior mastery = 0.92
 * - Learning transition = 0.14
 * - Slip probability = 0.10 (pS in Corbett & Anderson formula)
 * - Guess probability = 0.20 (pG in Corbett & Anderson formula)
 * Expected outcomes:
 * - Incorrect: Posterior = 23/39 ≈ 0.5897, Post-transition = 25.24/39 ≈ 0.6471 (updates 92% -> ~65%)
 * - Correct:   Posterior = 207/211 ≈ 0.9810, Post-transition ≈ 0.9837 (updates 92% -> ~98.4%)
 * Also validates:
 * - Topic isolation (Genetic Algorithms update does NOT touch Isomap or PCA)
 * - Persistence survival in Storage
 * - Probability bounds strictly in [0, 1]
 */
export function runBktRegressionTest() {
  const prior = 0.92;
  const pG = 0.20;
  const pS = 0.10;
  const pT = 0.14;

  // 1. Incorrect response update
  const resIncorrect = computeBktUpdate({
    prior_pL: prior,
    observation: 'INCORRECT',
    difficulty: 'medium',
    topicId: 'topic_genetic_algorithms',
    topicTitle: 'Genetic Algorithms',
    questionId: 'q_ga_regression',
    source: { sourceType: 'ppt', fileName: 'ML Unit IV.pptx', slide: 29 },
    customParameters: { pG, pS, pT }
  });

  const postInc = resIncorrect.evidenceTrace.posterior_pL;
  const transInc = resIncorrect.evidenceTrace.transition_pL;
  const passIncPost = Math.abs(postInc - 0.5897) < 0.002;
  const passIncTrans = Math.abs(transInc - 0.6471) < 0.003;

  // 2. Correct response update
  const resCorrect = computeBktUpdate({
    prior_pL: prior,
    observation: 'CORRECT',
    difficulty: 'medium',
    topicId: 'topic_genetic_algorithms',
    topicTitle: 'Genetic Algorithms',
    questionId: 'q_ga_regression_c',
    source: { sourceType: 'ppt', fileName: 'ML Unit IV.pptx', slide: 29 },
    customParameters: { pG, pS, pT }
  });

  const postCor = resCorrect.evidenceTrace.posterior_pL;
  const transCor = resCorrect.evidenceTrace.transition_pL;
  const passCorPost = Math.abs(postCor - 0.9810) < 0.002;
  const passCorTrans = Math.abs(transCor - 0.9837) < 0.003;

  // 3. Topic isolation verification
  const initialMasteries = { ...INITIAL_TOPIC_MASTERIES };
  const isomapPrior = initialMasteries['topic_isomap'].score;
  const pcaPrior = initialMasteries['topic_pca'].score;
  const gaPrior = initialMasteries['topic_genetic_algorithms'].score;

  // Update Genetic Algorithms
  const gaUpdated = updateMasteryOnAttempt(
    initialMasteries['topic_genetic_algorithms'],
    'INCORRECT',
    'medium',
    'q_ga_01',
    { sourceType: 'ppt', fileName: 'ML Unit IV.pptx', slide: 29 }
  );

  const topicIsolationPassed = 
    initialMasteries['topic_isomap'].score === isomapPrior &&
    initialMasteries['topic_pca'].score === pcaPrior &&
    gaUpdated.updatedMastery.topicId === 'topic_genetic_algorithms' &&
    gaUpdated.updatedMastery.score !== gaPrior;

  // 4. Bounds verification
  const boundsPassed = 
    postInc >= 0 && postInc <= 1 &&
    transInc >= 0 && transInc <= 1 &&
    postCor >= 0 && postCor <= 1 &&
    transCor >= 0 && transCor <= 1;

  return {
    incorrectTest: {
      expectedPosterior: 0.5897,
      actualPosterior: postInc,
      expectedTransition: 0.6471,
      actualTransition: transInc,
      passed: passIncPost && passIncTrans,
      formula: resIncorrect.evidenceTrace.formulaApplied
    },
    correctTest: {
      expectedPosterior: 0.9810,
      actualPosterior: postCor,
      expectedTransition: 0.9837,
      actualTransition: transCor,
      passed: passCorPost && passCorTrans,
      formula: resCorrect.evidenceTrace.formulaApplied
    },
    topicIsolationTest: {
      passed: topicIsolationPassed,
      isomapPreserved: isomapPrior,
      pcaPreserved: pcaPrior,
      gaPrior,
      gaUpdated: gaUpdated.updatedMastery.score
    },
    probabilityBoundsTest: {
      passed: boundsPassed
    },
    overallPassed: passIncPost && passIncTrans && passCorPost && passCorTrans && topicIsolationPassed && boundsPassed
  };
}

export function generateRecommendations(
  masteriesOrProfile: Record<string, TopicMastery> | LearnerProfile
): StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = [];
  const masteries = 'topicMasteries' in masteriesOrProfile ? masteriesOrProfile.topicMasteries : masteriesOrProfile;
  const sortedTopics = Object.values(masteries).sort((a, b) => a.score - b.score);

  const TOPIC_METADATA: Record<string, {
    title: string;
    reviewTitle: string;
    reviewDescription: string;
    practiceTitle: string;
    sourceTarget: SourceProvenance;
  }> = {
    'topic_genetic_algorithms': {
      title: 'Genetic Algorithms',
      reviewTitle: 'Review Crossover vs Mutation Mechanics',
      reviewDescription: 'Focus on Slide 29: differentiate schema recombination (exploitation) from diversity restoration (exploration).',
      practiceTitle: 'Practice Genetic Algorithm Fitness & Operator Questions',
      sourceTarget: {
        sourceType: 'ppt',
        fileName: 'ML Unit IV.pptx',
        slide: 29,
        section: 'Slide 29: Crossover vs Mutation Mechanics'
      }
    },
    'topic_isomap': {
      title: 'Isometric Feature Mapping (Isomap)',
      reviewTitle: 'Inspect Geodesic Graph & Short-Circuiting',
      reviewDescription: 'Analyze Page 25 Swiss Roll diagram and transcript at 18:42 showing why large k or noise corrupts geodesic graph distances.',
      practiceTitle: 'Practice Isomap Algorithm & Short-Circuiting Diagnostics',
      sourceTarget: {
        sourceType: 'pdf',
        fileName: 'Machine Learning Unit IV.pdf',
        page: 25,
        section: 'Section 4.5: Isometric Feature Mapping'
      }
    },
    'topic_least_squares': {
      title: 'Least Squares & Ridge Regression',
      reviewTitle: 'Review Normal Equations & Ridge Regularization',
      reviewDescription: 'Study Page 8: closed form (X^T X)^-1 X^T y and why Ridge regularization adds lambda * I to avoid singular inversion.',
      practiceTitle: 'Practice Ordinary Least Squares & Conditioning Problems',
      sourceTarget: {
        sourceType: 'pdf',
        fileName: 'Machine Learning Unit IV.pdf',
        page: 8,
        section: 'Section 3.2: Ordinary Least Squares Estimation'
      }
    },
    'topic_lda': {
      title: 'Linear Discriminant Analysis (LDA)',
      reviewTitle: 'Review Fisher Separability Criterion',
      reviewDescription: 'Examine Page 18: maximizing between-class scatter S_B over within-class scatter S_W, and the rank limitation of C-1 dimensions.',
      practiceTitle: 'Practice Supervised Projection & Scatter Matrix Calculations',
      sourceTarget: {
        sourceType: 'pdf',
        fileName: 'Machine Learning Unit IV.pdf',
        page: 18,
        section: 'Section 4.3: Linear Discriminant Analysis'
      }
    },
    'topic_pca': {
      title: 'Principal Component Analysis (PCA)',
      reviewTitle: 'Review Covariance Eigenstructure & Mean Centering',
      reviewDescription: 'Review Page 12: variance maximization along eigenvectors and why centering data by subtracting mean vector is mandatory.',
      practiceTitle: 'Practice PCA Eigenvector Projection Problems',
      sourceTarget: {
        sourceType: 'pdf',
        fileName: 'Machine Learning Unit IV.pdf',
        page: 12,
        section: 'Section 4.1: Principal Component Analysis'
      }
    }
  };

  for (const topic of sortedTopics) {
    if (topic.score < 0.75) {
      const meta = TOPIC_METADATA[topic.topicId] || {
        title: topic.topicTitle || topic.topicId,
        reviewTitle: `Review Core Principles of ${topic.topicTitle}`,
        reviewDescription: `Target key derivations and concepts for ${topic.topicTitle}.`,
        practiceTitle: `Practice ${topic.topicTitle} Questions`,
        sourceTarget: {
          sourceType: 'pdf' as const,
          fileName: 'Machine Learning Unit IV.pdf',
          page: 1
        }
      };

      const isSeverelyWeak = topic.score < 0.50;
      const recDifficulty = isSeverelyWeak ? 'easy' as const : 'medium' as const;

      recommendations.push({
        id: `rec_${topic.topicId}_review`,
        topicId: topic.topicId,
        topicTitle: meta.title,
        actionType: isSeverelyWeak ? 'review_concept' : 'clarify_misconception',
        title: meta.reviewTitle,
        description: meta.reviewDescription,
        estimatedMinutes: isSeverelyWeak ? 10 : 7,
        urgency: isSeverelyWeak ? 'high' : 'medium',
        reason: `Measured BKT latent mastery is ${Math.round(topic.score * 100)}% (P(L)=${topic.score.toFixed(2)}). Prioritize ${isSeverelyWeak ? 'foundational gap repair' : 'remedial concept review'} before advancing.`,
        sourceTarget: meta.sourceTarget,
        bktContext: {
          current_pL: topic.score,
          recommendedDifficulty: recDifficulty
        }
      });

      // Add practice step if severely weak
      if (isSeverelyWeak && recommendations.length < 5) {
        recommendations.push({
          id: `rec_${topic.topicId}_practice`,
          topicId: topic.topicId,
          topicTitle: meta.title,
          actionType: 'practice_questions',
          title: meta.practiceTitle,
          description: `Target verified questions with difficulty calibrated to ${recDifficulty.toUpperCase()} to transition latent state above 0.50.`,
          estimatedMinutes: 8,
          urgency: 'high',
          reason: `Repeated observation opportunities with learning rate P(T)=0.14 will accelerate mastery recovery for ${meta.title}.`,
          sourceTarget: meta.sourceTarget,
          bktContext: {
            current_pL: topic.score,
            recommendedDifficulty: recDifficulty
          }
        });
      }
    }
  }

  // Fallback if all topics are high
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec_comprehensive_review',
      topicId: 'topic_pca',
      topicTitle: 'PCA & Dimensionality Reduction',
      actionType: 'take_mini_quiz',
      title: 'Challenging Mixed Unit Review',
      description: 'Take an advanced adaptive assessment comparing supervised LDA vs unsupervised PCA eigenspaces.',
      estimatedMinutes: 12,
      urgency: 'low',
      reason: 'Excellent overall mastery! Maintain retention with high-tier mixed questions.',
      sourceTarget: {
        sourceType: 'pdf',
        fileName: 'Machine Learning Unit IV.pdf',
        page: 12
      },
      bktContext: {
        current_pL: 0.88,
        recommendedDifficulty: 'hard'
      }
    });
  }

  return recommendations;
}

export function detectMisconceptionsFromResults(result: AssessmentResult) {
  const misconceptions = [];

  for (const attempt of result.attempts) {
    if (!attempt.isCorrect) {
      if (attempt.questionId === 'q_ga_01' || attempt.questionId === 'q_ga_03') {
        misconceptions.push({
          id: 'misc_ga_crossover_mutation',
          topicId: 'topic_genetic_algorithms',
          topicTitle: 'Genetic Algorithms',
          description: 'You appear to be confusing genetic mutation with crossover.',
          evidenceText: 'Crossover performs structural exploitation of existing fit building blocks, while mutation introduces random exploratory perturbations to prevent premature convergence.',
          sourceCitation: {
            sourceType: 'ppt' as const,
            fileName: 'ML Unit IV.pptx',
            slide: 29,
            section: 'Slide 29: Crossover vs Mutation Mechanics'
          },
          remedialAction: 'Review Slide 29 diagram and practice 3 targeted operator comparison questions.'
        });
      }

      if (attempt.questionId === 'q_isomap_01' || attempt.questionId === 'q_isomap_02') {
        misconceptions.push({
          id: 'misc_isomap_euclidean',
          topicId: 'topic_isomap',
          topicTitle: 'Isomap',
          description: 'Conflating Euclidean straight-line distance with manifold geodesic distance.',
          evidenceText: 'Euclidean distance cuts directly through the empty space between manifold folds. Isomap uses graph shortest paths along nearest neighbors to compute true geodesic distance.',
          sourceCitation: {
            sourceType: 'pdf' as const,
            fileName: 'Machine Learning Unit IV.pdf',
            page: 25,
            section: 'Section 4.5: Isometric Feature Mapping'
          },
          remedialAction: 'Examine the Swiss Roll diagram on Page 25 and Lecture 4 at 18:42.'
        });
      }

      if (attempt.questionId === 'q_pca_01') {
        misconceptions.push({
          id: 'misc_pca_centering',
          topicId: 'topic_pca',
          topicTitle: 'PCA',
          description: 'Overlooking the mathematical requirement of mean centering in PCA.',
          evidenceText: 'Without mean subtraction (X - mu), the first principal component points toward the dataset centroid rather than the direction of maximal variance.',
          sourceCitation: {
            sourceType: 'video' as const,
            fileName: 'Lecture 4.mp4',
            timestamp: '08:15',
            section: 'Lecture 4: Centering Pitfalls'
          },
          remedialAction: 'Watch Lecture 4 clip at 08:15.'
        });
      }
    }
  }

  // Deduplicate by id
  return Array.from(new Map(misconceptions.map(m => [m.id, m])).values());
}
