import { Question } from '../types/assessment';

export interface AnswerEvaluationResult {
  isCorrect: boolean;
  status: 'CORRECT' | 'PARTIALLY_CORRECT' | 'INCORRECT';
  creditScore: number; // 1.0 = full, 0.5 = partial, 0.0 = none
  feedback: string;
  matchedConcept?: string;
  isSynonymMatch?: boolean;
}

// Built-in verified technical synonym dictionary for core course topics
const TECHNICAL_SYNONYM_DICTIONARY: Record<string, {
  canonical: string;
  synonyms: string[];
  partialKeywords?: string[];
  conceptDescription: string;
}> = {
  // Isomap MDS
  'mds': {
    canonical: 'Multidimensional Scaling',
    synonyms: [
      'multidimensional scaling',
      'classical multidimensional scaling',
      'mds',
      'classical mds',
      'metric mds',
      'cmd',
      'classical scaling'
    ],
    partialKeywords: ['scaling', 'multidimensional', 'spectral embedding'],
    conceptDescription: 'Classical Multidimensional Scaling (MDS) converts all-pairs geodesic distances into low-dimensional Euclidean coordinates.'
  },
  // Normal Equations
  'normal_equations': {
    canonical: 'Normal Equations',
    synonyms: [
      'normal equations',
      'normal equation',
      'ols normal equations',
      'least squares normal equations',
      'xt x w = xt y',
      'x^t x w = x^t y',
      'xtxw = xty',
      'closed-form normal equation',
      'normal equations of least squares'
    ],
    partialKeywords: ['normal', 'equations', 'least squares', 'closed form'],
    conceptDescription: 'Setting gradient ∇RSS = 0 gives the Normal Equations X^T X w = X^T y for Ordinary Least Squares.'
  },
  // Roulette Wheel Selection
  'roulette_wheel': {
    canonical: 'Roulette Wheel Selection',
    synonyms: [
      'roulette wheel selection',
      'roulette wheel',
      'fitness proportionate selection',
      'fitness-proportionate selection',
      'fitness proportional selection',
      'roulette selection',
      'proportionate selection',
      'roulette-wheel',
      'roulette-wheel selection'
    ],
    partialKeywords: ['roulette', 'fitness proportionate', 'fitness proportional'],
    conceptDescription: 'Fitness-proportionate selection assigns reproduction probabilities proportional to individual fitness relative to total population fitness.'
  },
  // Dijkstra / Floyd-Warshall
  'shortest_path_alg': {
    canonical: 'Floyd-Warshall or Dijkstra algorithm',
    synonyms: [
      'dijkstra',
      'floyd warshall',
      'floyd-warshall',
      'dijkstra or floyd-warshall',
      'floyd-warshall or dijkstra',
      'dijkstra algorithm',
      'floyd warshall algorithm',
      'all-pairs shortest paths',
      'dijkstras algorithm',
      'dijkstra or floyd warshall'
    ],
    partialKeywords: ['dijkstra', 'floyd', 'shortest path'],
    conceptDescription: 'Step 2 of Isomap computes all-pairs shortest paths across the k-NN graph using Dijkstra or Floyd-Warshall.'
  }
};

/**
 * Normalizes input string for robust technical terminology comparison:
 * - Lowercases and trims
 * - Strips leading/trailing punctuation and markdown
 * - Collapses internal whitespace
 */
export function normalizeAnswerText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Evaluates a learner's answer against formal course ground-truth:
 * - MCQ: Robust option letter and label matching
 * - Numerical: Tolerant floating-point evaluation with configurable margin
 * - Free-Text / Short Answer:
 *     1. Accepts verified technical synonyms & acronyms (e.g. "MDS" for "Multidimensional Scaling")
 *     2. Recognizes alternative mathematical formulations (e.g. "X^T X w = X^T y" for "Normal Equations")
 *     3. Distinguishes Partial Correctness from complete mistakes (e.g. capturing core mechanism without full qualification)
 *     4. Explains why the answer was scored as correct, partial, or incorrect
 */
export function evaluateAnswer(question: Question, rawAnswer: string): AnswerEvaluationResult {
  const trimmed = (rawAnswer || '').trim();
  if (!trimmed) {
    return {
      isCorrect: false,
      status: 'INCORRECT',
      creditScore: 0.0,
      feedback: 'No answer provided.'
    };
  }

  // ==========================================
  // 1. Multiple Choice Questions (MCQ)
  // ==========================================
  if (question.type === 'mcq') {
    const userNorm = normalizeAnswerText(trimmed);
    const correctNorm = normalizeAnswerText(question.correctAnswer);

    // Direct string match
    if (userNorm === correctNorm) {
      return {
        isCorrect: true,
        status: 'CORRECT',
        creditScore: 1.0,
        feedback: 'Correct: Your selection matches the verified answer.'
      };
    }

    // Option letter matching (e.g., user selected "Option B" or "B")
    if (question.options) {
      const correctIndex = question.options.findIndex(
        opt => normalizeAnswerText(opt) === correctNorm
      );
      if (correctIndex !== -1) {
        const optionLetter = String.fromCharCode(65 + correctIndex); // 'A', 'B', 'C', 'D'
        if (
          userNorm === optionLetter.toLowerCase() ||
          userNorm === `option ${optionLetter.toLowerCase()}` ||
          userNorm.startsWith(`${optionLetter.toLowerCase()} `)
        ) {
          return {
            isCorrect: true,
            status: 'CORRECT',
            creditScore: 1.0,
            feedback: `Correct: Option ${optionLetter} correctly selected.`
          };
        }
      }
    }

    return {
      isCorrect: false,
      status: 'INCORRECT',
      creditScore: 0.0,
      feedback: `Incorrect: Expected "${question.correctAnswer}".`
    };
  }

  // ==========================================
  // 2. Numerical Questions
  // ==========================================
  if (question.type === 'numerical') {
    // Extract first valid floating-point number from user input (e.g., "3 dimensions" -> 3)
    const match = trimmed.match(/-?\d+(\.\d+)?/);
    if (!match) {
      return {
        isCorrect: false,
        status: 'INCORRECT',
        creditScore: 0.0,
        feedback: 'Invalid input: Numerical value expected.'
      };
    }

    const userVal = parseFloat(match[0]);
    const correctVal = parseFloat(question.correctAnswer);
    const tolerance = question.acceptableNumericTolerance ?? 0.05;

    if (Math.abs(userVal - correctVal) <= tolerance) {
      return {
        isCorrect: true,
        status: 'CORRECT',
        creditScore: 1.0,
        feedback: `Correct: Computed value ${userVal} is within acceptable numeric tolerance (±${tolerance}).`
      };
    }

    return {
      isCorrect: false,
      status: 'INCORRECT',
      creditScore: 0.0,
      feedback: `Incorrect: Calculated ${userVal}, expected ${correctVal} (±${tolerance}).`
    };
  }

  // ==========================================
  // 3. Short Answer / Free-Text Questions
  // ==========================================
  const userNorm = normalizeAnswerText(trimmed);
  const correctNorm = normalizeAnswerText(question.correctAnswer);

  // Exact normalized match
  if (userNorm === correctNorm) {
    return {
      isCorrect: true,
      status: 'CORRECT',
      creditScore: 1.0,
      feedback: `Exact match: Correctly identified "${question.correctAnswer}".`
    };
  }

  // Full phrase containment if user provided full canonical answer in a sentence
  if (userNorm.length >= 6 && userNorm.includes(correctNorm)) {
    return {
      isCorrect: true,
      status: 'CORRECT',
      creditScore: 1.0,
      feedback: `Accepted: Your answer accurately identifies "${question.correctAnswer}".`
    };
  }

  // Check question's explicitly declared acceptable synonyms
  if (question.acceptableSynonyms && question.acceptableSynonyms.length > 0) {
    for (const syn of question.acceptableSynonyms) {
      const synNorm = normalizeAnswerText(syn);
      if (userNorm === synNorm || userNorm.includes(synNorm)) {
        return {
          isCorrect: true,
          status: 'CORRECT',
          creditScore: 1.0,
          isSynonymMatch: true,
          matchedConcept: syn,
          feedback: `Accepted technical synonym: Recognized "${syn}" as an equivalent formulation for "${question.correctAnswer}".`
        };
      }
    }
  }

  // Check built-in technical dictionary
  for (const entry of Object.values(TECHNICAL_SYNONYM_DICTIONARY)) {
    const entryCanonNorm = normalizeAnswerText(entry.canonical);
    if (entryCanonNorm === correctNorm || correctNorm.includes(entryCanonNorm) || entryCanonNorm.includes(correctNorm)) {
      // Check full synonyms
      for (const syn of entry.synonyms) {
        const synNorm = normalizeAnswerText(syn);
        if (userNorm === synNorm || userNorm.includes(synNorm)) {
          return {
            isCorrect: true,
            status: 'CORRECT',
            creditScore: 1.0,
            isSynonymMatch: true,
            matchedConcept: syn,
            feedback: `Accepted verified terminology: "${syn}" matches expected concept (${entry.conceptDescription}).`
          };
        }
      }

      // Check partial matches
      if (entry.partialKeywords) {
        for (const kw of entry.partialKeywords) {
          const kwNorm = normalizeAnswerText(kw);
          if (userNorm.includes(kwNorm)) {
            return {
              isCorrect: false,
              status: 'PARTIALLY_CORRECT',
              creditScore: 0.5,
              feedback: `Partially correct (0.5 credit): Captured core concept component "${kw}", but reference answer is specifically "${question.correctAnswer}".`
            };
          }
        }
      }
    }
  }

  // Check question's explicitly declared partial match keywords
  if (question.partialMatchKeywords && question.partialMatchKeywords.length > 0) {
    for (const pkw of question.partialMatchKeywords) {
      const pkwNorm = normalizeAnswerText(pkw);
      if (userNorm.includes(pkwNorm)) {
        return {
          isCorrect: false,
          status: 'PARTIALLY_CORRECT',
          creditScore: 0.5,
          feedback: `Partially correct (0.5 credit): Touches on "${pkw}", but missing complete terminology "${question.correctAnswer}".`
        };
      }
    }
  }

  return {
    isCorrect: false,
    status: 'INCORRECT',
    creditScore: 0.0,
    feedback: `Incorrect: Expected "${question.correctAnswer}".`
  };
}
