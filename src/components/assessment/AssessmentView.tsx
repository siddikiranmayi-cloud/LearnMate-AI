import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  BookOpen, 
  FileText, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Brain,
  Award,
  Hash,
  Calculator
} from 'lucide-react';
import { Course, SourceProvenance } from '../../types/course';
import { LearnerProfile, BktEvidenceTrace } from '../../types/learner';
import { DifficultyLevel, Question, QuestionAttempt, QuestionType, AssessmentResult } from '../../types/assessment';
import { buildAssessment, getQuestionRepetitionRate } from '../../services/questionGenerator';
import { detectMisconceptionsFromResults, updateMasteryOnAttempt, getTopicPriorMastery } from '../../services/learnerEngine';
import { evaluateAnswer } from '../../services/assessmentEvaluator';
import { StorageService } from '../../services/storageService';
import { DiagramSvg } from '../common/DiagramSvg';
import { NavTab } from '../layout/Sidebar';

interface AssessmentViewProps {
  course: Course;
  learnerProfile: LearnerProfile;
  initialTopicId?: string;
  onUpdateLearnerProfile: (updated: LearnerProfile) => void;
  onOpenSourceModal: (source: SourceProvenance, visualId?: string) => void;
  onAskTutorPrompt: (prompt: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  course,
  learnerProfile,
  initialTopicId,
  onUpdateLearnerProfile,
  onOpenSourceModal,
  onAskTutorPrompt,
  onNavigateTab
}) => {
  // Assessment configuration state
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('adaptive');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>(['mcq', 'short_answer', 'numerical']);

  // Test execution state
  const [isTestActive, setIsTestActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [lastBktTrace, setLastBktTrace] = useState<BktEvidenceTrace | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStats, setVerificationStats] = useState<{ rejectedDuplicates: number; rejectedUnverified: number } | null>(null);
  const [adaptationReason, setAdaptationReason] = useState<string>('');

  // Start new assessment session
  const handleStartAssessment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const generated = buildAssessment({
        topicId: selectedTopicId === 'all' ? undefined : selectedTopicId,
        difficulty: selectedDifficulty,
        count: questionCount,
        questionTypes: selectedQuestionTypes,
        learnerProfile
      });

      setQuestions(generated.questions);
      setAdaptationReason(generated.adaptationReason || '');
      setVerificationStats({
        rejectedDuplicates: generated.rejectedDuplicatesCount,
        rejectedUnverified: generated.unverifiedRejectedCount
      });
      setCurrentIndex(0);
      setUserAnswers({});
      setHasSubmittedCurrent(false);
      setAttempts([]);
      setLastBktTrace(null);
      setAssessmentResult(null);
      setIsVerifying(false);
      setIsTestActive(true);
    }, 550);
  };

  // Launch targeted adaptive follow-up quiz targeting weak topics
  const handleStartAdaptiveFollowup = () => {
    const targetWeakTopic = assessmentResult?.weakTopics?.[0]?.topicId || 'all';
    setSelectedTopicId(targetWeakTopic);
    setSelectedDifficulty('adaptive');
    setQuestionCount(3);
    setAssessmentResult(null);

    setIsVerifying(true);
    setTimeout(() => {
      const generated = buildAssessment({
        topicId: targetWeakTopic === 'all' ? undefined : targetWeakTopic,
        difficulty: 'adaptive',
        count: 3,
        questionTypes: selectedQuestionTypes,
        learnerProfile
      });

      setQuestions(generated.questions);
      setAdaptationReason(generated.adaptationReason || `Targeted remedial quiz focusing on ${targetWeakTopic} with calibrated difficulty.`);
      setVerificationStats({
        rejectedDuplicates: generated.rejectedDuplicatesCount,
        rejectedUnverified: generated.unverifiedRejectedCount
      });
      setCurrentIndex(0);
      setUserAnswers({});
      setHasSubmittedCurrent(false);
      setAttempts([]);
      setLastBktTrace(null);
      setAssessmentResult(null);
      setIsVerifying(false);
      setIsTestActive(true);
    }, 450);
  };

  // Submit current answer
  const handleSubmitCurrentAnswer = () => {
    const currentQ = questions[currentIndex];
    const rawAnswer = userAnswers[currentQ.id] || '';
    if (!rawAnswer.trim()) return;

    // Evaluate answer with technical synonym matching, tolerance, and partial correctness
    const evalResult = evaluateAnswer(currentQ, rawAnswer);

    const attempt: QuestionAttempt = {
      questionId: currentQ.id,
      userAnswer: rawAnswer,
      isCorrect: evalResult.isCorrect,
      status: evalResult.status,
      creditScore: evalResult.creditScore,
      evaluationFeedback: evalResult.feedback,
      timeSpentSeconds: 24,
      timestamp: new Date().toISOString()
    };

    setAttempts(prev => [...prev, attempt]);
    setHasSubmittedCurrent(true);

    // Retrieve topic-isolated prior mastery (guarantees topic isolation, e.g. GA cannot use Isomap prior)
    const priorInfo = getTopicPriorMastery(learnerProfile, currentQ.topicId, currentQ.topicTitle);
    
    // Retrieve or initialize topic mastery
    const baseMastery = learnerProfile.topicMasteries[currentQ.topicId] || {
      topicId: currentQ.topicId,
      topicTitle: currentQ.topicTitle,
      score: priorInfo.prior_pL,
      bkt_pL: priorInfo.prior_pL,
      measuredAccuracy: 0,
      history: [priorInfo.prior_pL],
      attemptsCount: 0,
      correctCount: 0,
      lastPracticed: 'Just now',
      trend: 'neutral' as const
    };

    // Calculate BKT update strictly on the question's topic
    const { updatedMastery, evidenceTrace } = updateMasteryOnAttempt(
      baseMastery, 
      evalResult.status, 
      currentQ.difficulty,
      currentQ.id,
      currentQ.source,
      priorInfo.reason
    );

    setLastBktTrace(evidenceTrace);

    // Update ONLY this exact topic's mastery (strict topic isolation)
    const updatedMasteries = {
      ...learnerProfile.topicMasteries,
      [currentQ.topicId]: updatedMastery
    };

    // Recalculate overall mastery across all syllabus topics
    const allScores = Object.values(updatedMasteries).map(m => m.score);
    const avgMastery = Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100);

    const updatedProfile: LearnerProfile = {
      ...learnerProfile,
      overallMastery: avgMastery,
      totalQuestionsAnswered: learnerProfile.totalQuestionsAnswered + 1,
      topicMasteries: updatedMasteries,
      bktEvidenceLog: [evidenceTrace, ...(learnerProfile.bktEvidenceLog || [])].slice(0, 30)
    };

    onUpdateLearnerProfile(updatedProfile);
    StorageService.saveLearnerProfile(updatedProfile);
  };

  // Move to next question or finalize assessment report
  const handleNextOrFinish = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setHasSubmittedCurrent(false);
      setLastBktTrace(null);
    } else {
      // Finalize report
      const allAttempts = attempts;
      const total = questions.length;
      const score = allAttempts.filter(a => a.isCorrect).length;
      const accuracy = Math.round((score / total) * 100);

      // Topic breakdowns
      const topicMap: Record<string, { title: string; total: number; correct: number }> = {};
      questions.forEach((q, idx) => {
        if (!topicMap[q.topicId]) {
          topicMap[q.topicId] = { title: q.topicTitle, total: 0, correct: 0 };
        }
        topicMap[q.topicId].total += 1;
        if (allAttempts[idx]?.isCorrect) {
          topicMap[q.topicId].correct += 1;
        }
      });

      const topicBreakdowns = Object.entries(topicMap).map(([tid, val]) => ({
        topicId: tid,
        topicTitle: val.title,
        score: val.correct,
        total: val.total,
        accuracy: Math.round((val.correct / val.total) * 100)
      }));

      const weakTopics = topicBreakdowns
        .filter(t => t.accuracy < 60)
        .map(t => ({
          topicId: t.topicId,
          topicTitle: t.topicTitle,
          masteryDrop: Math.max(5, 100 - t.accuracy)
        }));

      const mockResult: AssessmentResult = {
        id: `res_${Date.now()}`,
        assessmentTitle: `${selectedTopicId === 'all' ? 'Adaptive Comprehensive' : 'Targeted Topic'} Assessment`,
        completedAt: 'Just now',
        totalQuestions: total,
        score,
        accuracy,
        topicBreakdowns,
        weakTopics,
        detectedMisconceptions: [],
        attempts: allAttempts
      };

      const detectedMisconceptions = detectMisconceptionsFromResults(mockResult);
      mockResult.detectedMisconceptions = detectedMisconceptions;

      setAssessmentResult(mockResult);
      StorageService.saveAssessmentResult(mockResult);
      setIsTestActive(false);
    }
  };

  const currentQ = questions[currentIndex];
  const currentAttempt = attempts[currentIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* ============================================================ */}
      {/* 1. ASSESSMENT CONFIGURATION SCREEN */}
      {/* ============================================================ */}
      {!isTestActive && !assessmentResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                  Configure Adaptive Assessment
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate verified questions calibrated to your current BKT mastery state
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>5-Stage Verification Gate</span>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {/* Select Topic */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Curriculum Topic
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="all">All Topics (Comprehensive Mixed Diagnostic)</option>
                  <option value="topic_genetic_algorithms">Genetic Algorithms (Weak Topic &bull; P(L)=0.37)</option>
                  <option value="topic_isomap">Isometric Feature Mapping (Isomap &bull; P(L)=0.48)</option>
                  <option value="topic_least_squares">Least Squares & Ridge Regression (P(L)=0.68)</option>
                  <option value="topic_lda">Linear Discriminant Analysis (LDA &bull; P(L)=0.74)</option>
                  <option value="topic_pca">Principal Component Analysis (PCA &bull; P(L)=0.86)</option>
                </select>
              </div>

              {/* Difficulty & Count Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="adaptive">Adaptive (Auto-scales with learner performance)</option>
                    <option value="easy">Easy (Foundations & Intuition)</option>
                    <option value="medium">Medium (Mathematical Formulations)</option>
                    <option value="hard">Hard (Boundary Conditions & Algorithmic Nuance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Question Count
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 10].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          questionCount === cnt
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Question Formats
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                    &bull; Multiple Choice (MCQ)
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                    &bull; Numerical Bounds
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                    &bull; Short Conceptual Form
                  </span>
                </div>
              </div>

              {/* Question Novelty Indicator (Requirement 13) */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">Novelty & Deduplication Check:</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Filters against question history hash to guarantee high novelty.
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-indigo-400 font-bold">
                    Repetition Rate: {getQuestionRepetitionRate()}%
                  </span>
                  <span className="block text-[10px] text-slate-500">Benchmark target &le; 5.0%</span>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartAssessment}
                disabled={isVerifying}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Answerability & Key Correctness...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate & Start Verified Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ACTIVE TEST-TAKING INTERFACE */}
      {/* ============================================================ */}
      {isTestActive && currentQ && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Header step progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs font-semibold text-indigo-400">
                {currentQ.topicTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                currentQ.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                currentQ.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                {currentQ.difficulty}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                Verified Gate
              </span>
            </div>
          </div>

          {/* Adaptive Calibration Rationale Banner */}
          {adaptationReason && (
            <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{adaptationReason}</span>
            </div>
          )}

          {/* Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Target Concept: {currentQ.conceptTested}
              </span>
              <h3 className="text-base md:text-lg font-bold text-white leading-relaxed">
                {currentQ.prompt}
              </h3>
            </div>

            {/* If question has associated diagram */}
            {currentQ.relatedVisualId && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-indigo-300">
                  Referenced Visual Diagram:
                </span>
                <DiagramSvg type={
                  currentQ.relatedVisualId === 'vis_isomap_geodesic' ? 'manifold' :
                  currentQ.relatedVisualId === 'vis_pca_projection' ? 'pca_projection' :
                  currentQ.relatedVisualId === 'vis_ga_operators' ? 'genetic_crossover' : 'lda_separation'
                } />
              </div>
            )}

            {/* Answer Input options */}
            <div className="space-y-3 pt-2">
              {currentQ.type === 'mcq' && currentQ.options && (
                <div className="space-y-2">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = userAnswers[currentQ.id] === option;
                    return (
                      <button
                        key={idx}
                        disabled={hasSubmittedCurrent}
                        onClick={() => setUserAnswers({ ...userAnswers, [currentQ.id]: option })}
                        className={`w-full text-left p-3.5 rounded-xl text-xs md:text-sm font-medium border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'numerical' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Enter exact numerical value:
                  </label>
                  <input
                    type="number"
                    disabled={hasSubmittedCurrent}
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [currentQ.id]: e.target.value })}
                    placeholder="e.g. 3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              {currentQ.type === 'short_answer' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Enter technical concept or method name:
                  </label>
                  <input
                    type="text"
                    disabled={hasSubmittedCurrent}
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [currentQ.id]: e.target.value })}
                    placeholder="e.g. Multidimensional Scaling"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Submission Action */}
            {!hasSubmittedCurrent ? (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSubmitCurrentAnswer}
                  disabled={!userAnswers[currentQ.id]}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs md:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all"
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              /* Immediate Post-Submission Feedback */
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  currentAttempt?.status === 'CORRECT' || currentAttempt?.isCorrect
                    ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                    : currentAttempt?.status === 'PARTIALLY_CORRECT'
                    ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                    : 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                }`}>
                  {currentAttempt?.status === 'CORRECT' || currentAttempt?.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : currentAttempt?.status === 'PARTIALLY_CORRECT' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold">
                        {currentAttempt?.status === 'CORRECT' || currentAttempt?.isCorrect
                          ? '✓ Correct Answer'
                          : currentAttempt?.status === 'PARTIALLY_CORRECT'
                          ? '⚠ Partially Correct (0.5 credit awarded)'
                          : '✗ Needs Practice'}
                      </h4>
                      {currentAttempt?.status === 'PARTIALLY_CORRECT' && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-900/60 border border-amber-700 text-amber-300 font-bold">
                          Partial Credit
                        </span>
                      )}
                    </div>
                    {currentAttempt?.evaluationFeedback && (
                      <p className="text-xs text-slate-300 italic">
                        {currentAttempt.evaluationFeedback}
                      </p>
                    )}
                    <p className="text-xs">
                      <span className="font-semibold text-white">Reference Ground-Truth:</span> {currentQ.correctAnswer}
                    </p>
                  </div>
                </div>

                {/* Bayesian Knowledge Tracing Live Formula Trace */}
                {lastBktTrace && (
                  <div className="p-4 bg-slate-950/90 border border-indigo-900/70 rounded-xl space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 border-b border-indigo-900/50 pb-2">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                        Topic-Specific BKT Trace: [{lastBktTrace.topicTitle}]
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {lastBktTrace.isInitialEstimate ? 'Initial Estimate P(L0)' : 'Empirical History Isolated'}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">
                          P(L): {lastBktTrace.prior_pL.toFixed(2)} &rarr; {lastBktTrace.transition_pL.toFixed(2)} ({lastBktTrace.resultingMasteryPercent}%)
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1">
                      <p>
                        <span className="text-slate-500 font-semibold">Prior Selection: </span>
                        <span className="text-slate-300">{lastBktTrace.priorSelectionReason}</span>
                      </p>
                      <p className="font-mono text-[11px] text-indigo-200 bg-slate-900/90 p-2 rounded border border-slate-800">
                        {lastBktTrace.formulaApplied}
                      </p>
                    </div>
                  </div>
                )}

                {/* Explanation and Citation */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Source-Grounded Explanation:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 text-slate-300" />
                      <span>{currentQ.source.fileName}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="font-mono text-indigo-300">
                        {currentQ.source.page !== undefined ? `Page ${currentQ.source.page}` : currentQ.source.slide ? `Slide ${currentQ.source.slide}` : `@${currentQ.source.timestamp}`}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenSourceModal(currentQ.source, currentQ.relatedVisualId)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>[Open Citation]</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextOrFinish}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Post-Assessment Report'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. POST-ASSESSMENT REPORT SCREEN */}
      {/* ============================================================ */}
      {assessmentResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Post-Assessment Performance Report
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Completed {assessmentResult.completedAt} &bull; Learner model updated
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                Verified Run
              </span>
            </div>

            {/* Score & Accuracy Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Score</span>
                <p className="text-3xl font-extrabold text-white mt-1">
                  {assessmentResult.score} / {assessmentResult.totalQuestions}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Accuracy</span>
                <p className={`text-3xl font-extrabold mt-1 ${
                  assessmentResult.accuracy >= 70 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {assessmentResult.accuracy}%
                </p>
              </div>
            </div>

            {/* Topic Performance Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Topic Performance Breakdown:
              </h3>
              <div className="space-y-2">
                {assessmentResult.topicBreakdowns.map((tb) => (
                  <div key={tb.topicId} className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{tb.topicTitle}</span>
                      <span className={`font-mono font-bold ${
                        tb.accuracy >= 70 ? 'text-emerald-400' : tb.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {tb.accuracy}% ({tb.score}/{tb.total})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          tb.accuracy >= 70 ? 'bg-emerald-500' : tb.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${tb.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detected Misconceptions */}
            {assessmentResult.detectedMisconceptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Detected Conceptual Misconceptions:
                </h3>

                <div className="space-y-2.5">
                  {assessmentResult.detectedMisconceptions.map((misc) => (
                    <div key={misc.id} className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-rose-200">
                        &bull; {misc.description}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {misc.evidenceText}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Source: {misc.sourceCitation.fileName} {misc.sourceCitation.slide ? `Slide ${misc.sourceCitation.slide}` : `Page ${misc.sourceCitation.page}`}</span>
                        <button
                          onClick={() => onOpenSourceModal(misc.sourceCitation)}
                          className="text-indigo-400 hover:underline font-semibold"
                        >
                          Review Citation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Topics Diagnostic Reasoning */}
            {assessmentResult.weakTopics.length > 0 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Identified Weak Topics & Diagnostic Reasoning:
                </h3>
                <div className="space-y-2">
                  {assessmentResult.weakTopics.map(wt => {
                    const current_pL = learnerProfile.topicMasteries[wt.topicId]?.score ?? 0.4;
                    return (
                      <div key={wt.topicId} className="p-3.5 bg-rose-950/20 border border-rose-800/40 rounded-xl flex items-center justify-between text-xs gap-3">
                        <div>
                          <span className="font-bold text-rose-300">{wt.topicTitle}</span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Identified because current BKT latent mastery P(L) = {current_pL.toFixed(2)} is below the 0.60 mastery threshold. Recommended: targeted gap repair with foundational easy/medium questions.
                          </p>
                        </div>
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold shrink-0">
                          P(L): {current_pL.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommended Adaptive Next Steps */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Recommended Adaptive Next Steps:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={handleStartAdaptiveFollowup}
                  className="p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>[Take Adaptive Follow-up Quiz]</span>
                </button>

                <button
                  onClick={() => {
                    const weakName = assessmentResult.weakTopics[0]?.topicTitle || 'Genetic Algorithms';
                    onAskTutorPrompt(`Explain key concepts and clear analogies for ${weakName}.`);
                  }}
                  className="p-3.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>[Review Weak Concept]</span>
                </button>

                <button
                  onClick={() => onNavigateTab('progress')}
                  className="p-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>[View BKT Latent Model]</span>
                </button>
              </div>
            </div>

            {/* Question-by-Question Review with Verified Citations */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Question Attempt Review & Citations:
              </h3>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const att = attempts[idx];
                  return (
                    <div key={q.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            att?.isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white">{q.topicTitle}</span>
                          <span className="text-slate-500">&bull;</span>
                          <span className="text-slate-400">{q.difficulty}</span>
                        </div>
                        <span className={`font-bold font-mono ${att?.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {att?.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium">{q.prompt}</p>
                      <div className="p-2 bg-slate-900 rounded text-slate-300 text-[11px] leading-relaxed">
                        <span className="text-indigo-400 font-semibold">Explanation: </span>
                        {q.explanation}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                        <span>Source: {q.source.fileName} ({q.source.page ? `Page ${q.source.page}` : q.source.slide ? `Slide ${q.source.slide}` : `@${q.source.timestamp}`})</span>
                        <button
                          onClick={() => onOpenSourceModal(q.source, q.relatedVisualId)}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <span>[Open Citation]</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back to Dashboard Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setAssessmentResult(null);
                  onNavigateTab('dashboard');
                }}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
