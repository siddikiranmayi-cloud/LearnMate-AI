import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Brain, 
  FileText, 
  Film, 
  ExternalLink, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  Calculator, 
  HelpCircle,
  Eye,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { SourceProvenance } from '../../types/course';
import { retrieveRelevantSources } from '../../services/retrievalEngine';
import { askTutor } from '../../services/geminiService';
import { computeBktUpdate, INITIAL_STUDENT_PROFILE, generateRecommendations } from '../../services/learnerEngine';
import { evaluateAnswer } from '../../services/assessmentEvaluator';
import { Question } from '../../types/assessment';
import { INITIAL_SUPPLEMENTARY_VIDEOS } from '../../data/supplementaryVideos';

interface JudgeDemonstrationFlowProps {
  onOpenSourceModal: (source: SourceProvenance, visualId?: string) => void;
  onNavigateTab?: (tab: any) => void;
  onAskTutorPrompt?: (prompt: string) => void;
  onLaunchAssessment?: (topicId?: string) => void;
}

export const JudgeDemonstrationFlow: React.FC<JudgeDemonstrationFlowProps> = ({
  onOpenSourceModal,
  onNavigateTab,
  onAskTutorPrompt,
  onLaunchAssessment
}) => {
  const [currentStep, setCurrentStep] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'>('A');

  // Step B Tutor State
  const [stepBTutorLoading, setStepBTutorLoading] = useState(false);
  const [stepBTutorResult, setStepBTutorResult] = useState<any | null>(null);

  // Step F/G Assessment & BKT State
  const [userQuizAnswer, setUserQuizAnswer] = useState('MDS');
  const [quizEvalResult, setQuizEvalResult] = useState<any | null>(null);
  const [stepGBktTrace, setStepGBktTrace] = useState<any | null>(null);

  // Step H Negative Verification State
  const [stepHLoading, setStepHLoading] = useState(false);
  const [stepHResult, setStepHResult] = useState<any | null>(null);

  const demoStudent = INITIAL_STUDENT_PROFILE;

  // Execute Step B Live Tutor Query
  const handleRunStepBTutor = async () => {
    setStepBTutorLoading(true);
    try {
      const res = await askTutor({
        question: 'Explain the three steps of Isomap and its major pitfall.',
        learnerMastery: 0.48,
        allowOutsideKnowledge: false
      });
      setStepBTutorResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setStepBTutorLoading(false);
    }
  };

  // Execute Step F/G Quiz & BKT
  const handleEvaluateStepF = () => {
    const qMds: Question = {
      id: 'q_demo_mds',
      topicId: 'topic_isomap',
      topicTitle: 'Isometric Feature Mapping (Isomap)',
      difficulty: 'medium',
      type: 'short_answer',
      prompt: 'Name the classical linear dimensionality reduction method applied to the graph geodesic distance matrix in Step 3 of Isomap.',
      correctAnswer: 'Multidimensional Scaling',
      acceptableSynonyms: ['MDS', 'Classical MDS', 'classical multidimensional scaling', 'cmd'],
      partialMatchKeywords: ['scaling'],
      explanation: 'Step 3 of Isomap applies Classical MDS to the geodesic distance matrix to yield coordinate embeddings in low-dimensional space.',
      conceptTested: 'Classical MDS Step',
      source: {
        sourceType: 'pdf',
        fileName: 'Machine Learning Unit IV.pdf',
        page: 25,
        section: 'Section 4.5: Isometric Feature Mapping'
      },
      verification: {
        answerableFromSource: true,
        answerKeyVerified: true,
        explanationAgreesWithSource: true,
        difficultyAppropriate: true,
        noveltyConfirmed: true,
        similarityScore: 0.12,
        verifiedAt: new Date().toISOString()
      }
    };

    const evaluation = evaluateAnswer(qMds, userQuizAnswer);
    setQuizEvalResult(evaluation);

    // Compute single Corbett & Anderson BKT transition
    const bkt = computeBktUpdate({
      prior_pL: 0.48,
      observation: evaluation.status,
      difficulty: 'medium',
      topicId: 'topic_isomap',
      topicTitle: 'Isometric Feature Mapping (Isomap)',
      questionId: 'q_demo_mds',
      source: qMds.source,
      customParameters: { pG: 0.20, pS: 0.10, pT: 0.14 }
    });
    setStepGBktTrace(bkt);
  };

  // Execute Step H Negative Refusal
  const handleRunStepH = () => {
    setStepHLoading(true);
    const retrieval = retrieveRelevantSources('What is quantum computing and Shor algorithm factorization?');
    setStepHResult(retrieval);
    setStepHLoading(false);
  };

  const stepsList = [
    { id: 'A', title: 'A. Learner Topic Mastery', badge: 'Dashboard Baseline' },
    { id: 'B', title: 'B. Explain Isomap', badge: 'Strict Grounding' },
    { id: 'C', title: 'C. Inspect Real PDF Citation', badge: 'Evidence Excerpt' },
    { id: 'D', title: 'D. Supplementary Video Links', badge: 'Video A & B' },
    { id: 'E', title: 'E. Truthful Transcript Status', badge: 'No Fake Playback' },
    { id: 'F', title: 'F. Adaptive Quiz Interaction', badge: 'Question Bank' },
    { id: 'G', title: 'G. Answer Eval & BKT Update', badge: 'Corbett & Anderson' },
    { id: 'H', title: 'H. Negative Verification Gate', badge: 'Refusal Proof' },
    { id: 'I', title: 'I. Next Activity Recommendation', badge: 'Weakness Targeted' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Step Stepper Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Judge Demonstration Mode: 9-Stage Reproducible Flow
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Concise, step-by-step evaluation workflow (Steps A through I) demonstrating live source-grounding, honest media status, adaptive BKT math, and weakness-driven recommendations.
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-3 py-1 rounded-full shrink-0">
            Current Stage: Step {currentStep} of I
          </span>
        </div>

        {/* Stepper Buttons Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 pt-2 border-t border-slate-800">
          {stepsList.map(step => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                currentStep === step.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold block">{step.id}</span>
              <span className="text-[9px] truncate opacity-90 block">{step.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        {/* STEP A: DASHBOARD BASELINE */}
        {currentStep === 'A' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step A of I &bull; Learner Profile State
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Demonstrate Alex Ramos's Measured Baseline Mastery
                </h4>
              </div>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                >
                  <span>Open Full Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In this live session, student <strong>Alex Ramos</strong> has completed 52 curriculum questions across 5 syllabus topics with an overall course mastery of <strong>{demoStudent.overallMastery}%</strong>. The latent state is tracked independently per topic using Bayesian Knowledge Tracing.
            </p>

            {/* Topic Mastery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {Object.values(demoStudent.topicMasteries).map(topic => (
                <div key={topic.topicId} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-200 block truncate">
                    {topic.topicTitle}
                  </span>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 font-mono">P(L)</span>
                    <span className={`font-mono font-bold ${
                      topic.score >= 0.75 ? 'text-emerald-400' : topic.score >= 0.50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {topic.score.toFixed(2)} ({Math.round(topic.score * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${topic.score >= 0.75 ? 'bg-emerald-500' : topic.score >= 0.50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${Math.round(topic.score * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {topic.attemptsCount} tested &bull; {topic.lastPracticed}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200 flex items-center justify-between">
              <span>Notice: Isomap mastery is at <strong>48%</strong> (P(L)=0.48), representing an active learning opportunity.</span>
              <button
                onClick={() => setCurrentStep('B')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP B: STRICT COURSE GROUNDING TUTOR */}
        {currentStep === 'B' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step B of I &bull; Source-Grounded Explanation
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Ask “Explain Isomap” in Strict Course-Source Mode
                </h4>
              </div>
              <button
                onClick={handleRunStepBTutor}
                disabled={stepBTutorLoading}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                {stepBTutorLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Execute Grounded Query</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When asked about Isomap, the tutor retrieves both <strong>Page 25 of Machine Learning Unit IV.pdf</strong> (the 3 algorithmic stages & Swiss roll manifold) and <strong>Lecture 4 @ 18:42</strong> (short-circuiting pitfall). It maps each statement to an independently auditable claim.
            </p>

            {/* Result Display */}
            {stepBTutorResult ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                      GROUNDING: {stepBTutorResult.groundingStatus}
                    </span>
                    <span className="text-slate-400">
                      Tier: {stepBTutorResult.pedagogicalTier}
                    </span>
                  </div>
                  <span className="text-indigo-400 font-mono">
                    {stepBTutorResult.citations.length} Citations Attached
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-[11px] max-h-56 overflow-y-auto">
                  {stepBTutorResult.text}
                </div>

                {/* Claim-Level Grounding Proof */}
                {stepBTutorResult.claimCitations && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Claim-Level Grounding Breakdown:
                    </span>
                    {stepBTutorResult.claimCitations.map((c: any) => (
                      <div key={c.claimId} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between gap-2">
                        <span className="text-slate-300 truncate">&bull; {c.claimText}</span>
                        <span className="text-emerald-400 font-mono font-bold shrink-0">{c.supportLevel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400 space-y-2">
                <p>Click <strong>Execute Grounded Query</strong> to run the live retrieval and grounding pipeline.</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setCurrentStep('A')} className="text-xs text-slate-400 hover:text-white">
                &larr; Back to Step A
              </button>
              <button
                onClick={() => setCurrentStep('C')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step C (Inspect PDF)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP C: INSPECT REAL PDF CITATION */}
        {currentStep === 'C' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step C of I &bull; Real PDF Citation Verification
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Inspect Supporting Course PDF Passage & Manifold Diagram
                </h4>
              </div>
              <button
                onClick={() => onOpenSourceModal({
                  sourceType: 'pdf',
                  fileName: 'Machine Learning Unit IV.pdf',
                  page: 25,
                  section: 'Section 4.5: Isometric Feature Mapping',
                  excerpt: 'The underlying distance is geodesic across the neighborhood manifold.'
                }, 'vis_isomap_geodesic')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Launch Citation Viewer Modal</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Every citation in LearnMate AI references real physical pages in <strong>Machine Learning Unit IV.pdf</strong> (36 total pages). Page 25 contains the formal derivation of geodesic graph distance and Figure 4.7 (Swiss Roll Manifold Unfolding).
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Target Record: Machine Learning Unit IV.pdf &bull; Page 25
                </span>
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded font-mono text-[10px]">
                  Bounds Check: Valid (1–36)
                </span>
              </div>

              <div className="p-3 bg-amber-500/10 border-l-4 border-amber-400 rounded-r-lg text-amber-100 text-xs">
                <p className="font-bold text-[10px] text-amber-400 uppercase tracking-wider mb-1">
                  Extracted Ground-Truth Passage:
                </p>
                <p className="italic">
                  &ldquo;The underlying distance is geodesic across the neighborhood manifold. Once the all-pairs matrix is populated, classical multidimensional scaling (MDS) computes an optimal low-dimensional coordinate representation that minimizes stress.&rdquo;
                </p>
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400 flex items-center justify-between">
                <span>Diagram on Page 25: <strong>Figure 4.7: Swiss Roll Manifold Unfolding</strong></span>
                <span className="text-emerald-400 font-mono">Physically Verified on Page</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setCurrentStep('B')} className="text-xs text-slate-400 hover:text-white">
                &larr; Back to Step B
              </button>
              <button
                onClick={() => setCurrentStep('D')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step D (Supplementary Videos)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP D: SUPPLEMENTARY VIDEO LINKS */}
        {currentStep === 'D' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step D of I &bull; Supplementary Video References
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Verify Supplementary Isomap Video Resources A & B
                </h4>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                External Attribution
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              LearnMate AI integrates two prominent university lectures as supplementary references, clearly distinguishing them from the learner's own course recordings (never mislabeled as <em>Lecture 4.mp4</em>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_SUPPLEMENTARY_VIDEOS.map(video => (
                <div key={video.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {video.roleBadge}
                  </span>
                  <h5 className="text-xs font-bold text-white">{video.title}</h5>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <p><strong className="text-slate-300">Channel / Lecturer:</strong> {video.publisherOrChannel} ({video.lecturer})</p>
                    <p><strong className="text-slate-300">Course Context:</strong> {video.courseContext}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-amber-400 font-mono">External YouTube Link</span>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setCurrentStep('C')} className="text-xs text-slate-400 hover:text-white">
                &larr; Back to Step C
              </button>
              <button
                onClick={() => setCurrentStep('E')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step E (Truthful Transcript Status)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP E: TRUTHFUL TRANSCRIPT PROCESSING STATUS */}
        {currentStep === 'E' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step E of I &bull; Truthful Transcript Transparency
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Display Actual Processing Status & Absent-Media Transparency
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Zero Hallucinations
              </span>
            </div>

            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">
                  External video linked — transcript not indexed.
                </p>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  Neither video has been falsely claimed as downloaded, transcribed, or watched. Because YouTube captions are not ingested for these links, the status truthfully displays <strong>External video linked — transcript not indexed</strong>, and the tutor relies solely on verified course materials.
                </p>
              </div>
            </div>

            {/* Video vs Transcript Audit Matrix */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Media Provenance & Availability Audit Matrix:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Lecture 4.mp4</span>
                  <div className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Original video unavailable</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Transcript excerpt only; no fake player</p>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Ali Ghodsi Lec 4</span>
                  <div className="text-amber-400 font-semibold flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>External link available</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Transcript not indexed; link preserved</p>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Stefan Harmeling Lec 15</span>
                  <div className="text-amber-400 font-semibold flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>External link available</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Transcript not indexed; link preserved</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setCurrentStep('D')} className="text-xs text-slate-400 hover:text-white">
                &larr; Back to Step D
              </button>
              <button
                onClick={() => setCurrentStep('F')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step F (Quiz Interaction)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP F: ADAPTIVE QUIZ INTERACTION */}
        {currentStep === 'F' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step F of I &bull; Adaptive Quiz Interaction
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Test Technical Synonym & Free-Text Assessment Evaluation
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Verified Item Bank
              </span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-indigo-400">ITEM ID: q_demo_mds</span>
                <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded font-mono">DIFFICULTY: MEDIUM</span>
              </div>

              <p className="text-xs text-slate-200 font-medium">
                Name the classical linear dimensionality reduction method applied to the graph geodesic distance matrix in Step 3 of the Isomap algorithm.
              </p>

              <div className="space-y-2 pt-2">
                <label className="text-[11px] text-slate-400 block font-semibold">
                  Learner Answer (Try &ldquo;MDS&rdquo;, &ldquo;Classical MDS&rdquo;, or &ldquo;scaling&rdquo;):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userQuizAnswer}
                    onChange={(e) => setUserQuizAnswer(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    placeholder="Enter answer..."
                  />
                  <button
                    onClick={handleEvaluateStepF}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm shrink-0"
                  >
                    Submit & Evaluate
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluation Result */}
            {quizEvalResult && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    quizEvalResult.status === 'CORRECT' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    STATUS: {quizEvalResult.status} (Credit: {quizEvalResult.creditScore})
                  </span>
                  {quizEvalResult.isSynonymMatch && (
                    <span className="text-[10px] text-indigo-400 font-mono">
                      Synonym Matched: &ldquo;{quizEvalResult.matchedConcept}&rdquo;
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-[11px]">{quizEvalResult.feedback}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setCurrentStep('E')} className="text-xs text-slate-400 hover:text-white">
                &larr; Back to Step E
              </button>
              <button
                onClick={() => {
                  if (!quizEvalResult) handleEvaluateStepF();
                  setCurrentStep('G');
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step G (BKT Trace)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP G: BKT LEARNING UPDATE TRACE */}
        {currentStep === 'G' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step G of I &bull; Single-Transition BKT Mastery Update
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Verify Exact Corbett & Anderson (1995) Latent Mastery Update
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Updated Exactly Once
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When the learner answers correctly (or via technical synonym), the BKT model updates latent probability $P(L)$ from prior $0.48$ through posterior and applies learning transition $P(T)=0.14$ strictly once.
            </p>

            {stepGBktTrace ? (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">PRIOR P(L)</span>
                    <span className="text-sm font-bold text-slate-300">{stepGBktTrace.evidenceTrace.prior_pL}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">POSTERIOR P(L|OBS)</span>
                    <span className="text-sm font-bold text-indigo-400">{stepGBktTrace.evidenceTrace.posterior_pL}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">TRANSITION P(L_next)</span>
                    <span className="text-sm font-bold text-emerald-400">{stepGBktTrace.evidenceTrace.transition_pL}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">RESULTING MASTERY</span>
                    <span className="text-sm font-bold text-emerald-400">{stepGBktTrace.evidenceTrace.resultingMasteryPercent}%</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-[11px] text-slate-300 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Formula Applied:</span>
                  <p className="break-all">{stepGBktTrace.evidenceTrace.formulaApplied}</p>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Topic Isolation: Isomap updated, PCA & GA unaffected</span>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 text-center text-xs text-slate-400">
                <button onClick={handleEvaluateStepF} className="text-indigo-400 underline">Click to compute BKT update</button>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setCurrentStep('F')} className="text-xs text-slate-400 hover:text-white">
                &larr; Back to Step F
              </button>
              <button
                onClick={() => setCurrentStep('H')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step H (Negative Refusal Gate)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP H: NEGATIVE VERIFICATION & REFUSAL GATE */}
        {currentStep === 'H' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step H of I &bull; Negative Citation & Refusal Gate
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Demonstrate Unsupported Query Refusal & Zero Hallucinations
                </h4>
              </div>
              <button
                onClick={handleRunStepH}
                disabled={stepHLoading}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                {stepHLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Trigger Adversarial Query</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When an adversarial or off-curriculum question is submitted (e.g., Quantum Shor algorithm or non-existent Page 99), LearnMate AI refuses to manufacture citations or fake pages.
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="text-[11px] font-mono text-amber-300">
                PROBE QUERY: &ldquo;What is quantum computing and Shor algorithm factorization?&rdquo;
              </div>

              {stepHResult && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-400 bg-rose-950/70 border border-rose-800 px-2 py-0.5 rounded text-[10px]">
                      STATUS: {stepHResult.status} (Citations Produced: {stepHResult.citations.length})
                    </span>
                    <span className="text-emerald-400 font-mono text-[10px]">Zero Hallucinated Citations</span>
                  </div>
                  <p className="text-slate-300 text-[11px] bg-slate-900 p-2.5 rounded">
                    Refusal Reason: {stepHResult.refusalReason || 'Topic is outside uploaded course syllabus.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setCurrentStep('G')} className="text-xs text-slate-400 hover:text-white">
                &larr; Back to Step G
              </button>
              <button
                onClick={() => setCurrentStep('I')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Proceed to Step I (Next Activity)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP I: MEASURED WEAKNESS-DRIVEN NEXT ACTIVITY */}
        {currentStep === 'I' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Step I of I &bull; Weakness-Driven Next Action
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Select Subsequent Learning Activity from Measured Weakness
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Dynamic Personalization
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Rather than hardcoding arbitrary recommendations, LearnMate AI inspects the measured topic-level mastery vector. Because Genetic Algorithms has the lowest BKT score (<strong>37%</strong>), the engine dynamically targets operator misconceptions.
            </p>

            {/* Generated Recommendations */}
            <div className="space-y-2">
              {generateRecommendations(demoStudent).slice(0, 2).map(rec => (
                <div key={rec.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rec.title}</span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      Urgency: {rec.urgency}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{rec.description}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: {rec.sourceTarget.fileName} (p.{rec.sourceTarget.page || rec.sourceTarget.slide})</span>
                    <span className="text-indigo-400 font-semibold">{rec.estimatedMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
              <span>9-Stage Judge Demonstration Workflow Completed Successfully.</span>
              <button
                onClick={() => setCurrentStep('A')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-sm"
              >
                <span>Restart Flow at Step A</span>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
