import React from 'react';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Compass,
  Play
} from 'lucide-react';
import { Course } from '../../types/course';
import { LearnerProfile } from '../../types/learner';
import { NavTab } from '../layout/Sidebar';
import { generateRecommendations } from '../../services/learnerEngine';
import { SupplementaryVideosSection } from '../common/SupplementaryVideosSection';

interface DashboardViewProps {
  course: Course;
  learnerProfile: LearnerProfile;
  onNavigate: (tab: NavTab) => void;
  onLaunchAssessment: (topicId?: string) => void;
  onAskTutorPrompt: (prompt: string) => void;
  onOpenSourcePreview: (source: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  course,
  learnerProfile,
  onNavigate,
  onLaunchAssessment,
  onAskTutorPrompt,
  onOpenSourcePreview
}) => {
  const masteries = Object.values(learnerProfile.topicMasteries);
  const weakestTopic = [...masteries].sort((a, b) => a.score - b.score)[0];
  const recommendations = generateRecommendations(learnerProfile);
  const primaryRec = recommendations[0];

  const totalAttempts = masteries.reduce((acc, t) => acc + (t.attemptsCount || 0), 0) || learnerProfile.totalQuestionsAnswered;
  const totalCorrect = masteries.reduce((acc, t) => acc + (t.correctCount || 0), 0);
  const computedAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : learnerProfile.accuracyRate;

  // Dynamic review prompt tailored strictly to the actual weakest topic
  const getReviewPrompt = (topicId: string, title: string) => {
    if (topicId === 'topic_genetic_algorithms') {
      return 'Explain the difference between crossover and mutation in Genetic Algorithms with an example.';
    }
    if (topicId === 'topic_isomap') {
      return 'Explain the three steps of Isomap and why short-circuiting occurs on the Swiss Roll manifold.';
    }
    if (topicId === 'topic_least_squares') {
      return 'Explain the normal equations for Ordinary Least Squares and why Ridge regularization adds lambda * I.';
    }
    if (topicId === 'topic_lda') {
      return "Explain Fisher's Linear Discriminant Analysis objective and how between-class and within-class scatter matrices are used.";
    }
    if (topicId === 'topic_pca') {
      return 'Explain why mean centering is required before PCA covariance eigendecomposition.';
    }
    return `Explain core principles and key derivations of ${title}.`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner (Requirement 28) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Multimodal AI Hackathon 2026 &bull; Track D: Adaptive Learning</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Turn your course material into a personalized AI tutor.
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            Upload lectures, textbooks and slides. Learn from your sources, practice intelligently, and improve with every session.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('tutor')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Start Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs md:text-sm font-semibold rounded-xl border border-slate-700/80 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Explore Knowledge Map</span>
            </button>

            <button
              onClick={() => onNavigate('evaluation')}
              className="px-4 py-2.5 text-slate-400 hover:text-indigo-300 text-xs md:text-sm font-medium transition-colors"
            >
              View System Evaluation &rarr;
            </button>
          </div>

          {/* Secondary trust indicators */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Source-grounded answers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Adaptive assessments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Personalized mastery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Multimodal understanding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overall Course Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {learnerProfile.overallMastery}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">+14% this week</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${learnerProfile.overallMastery}%` }}
            />
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {learnerProfile.studyStreakDays} Days
            </span>
            <span className="text-xs text-amber-400 font-medium">Active</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            Consistent retrieval practice daily
          </p>
        </div>

        {/* Questions Answered */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Questions Attempted</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {totalAttempts}
            </span>
            <span className="text-xs text-slate-400 font-medium">{computedAccuracy}% accuracy</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            Across 5 curriculum topics
          </p>
        </div>

        {/* Active Unit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Study Unit</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="text-base font-bold text-white truncate block">
              Unit IV: Dimensionality
            </span>
            <span className="text-xs text-indigo-400 font-mono">CS 420 &bull; Prof. Miller</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            36 pages &bull; 32 slides &bull; 1 lecture video
          </p>
        </div>
      </div>

      {/* Main 2-Column: Mastery Overview & Recommended Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Mastery Breakdown per Topic */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Topic Mastery Overview</h3>
                <p className="text-xs text-slate-400">
                  Calculated by deterministic learner model from recent quizzes & interactions
                </p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-800 px-2 py-0.5 rounded">
                Live Model
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {masteries.map((topic) => {
                const pct = Math.round(topic.score * 100);
                const isWeak = topic.score < 0.60;
                return (
                  <div key={topic.topicId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {topic.topicTitle}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${
                          pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {pct}%
                        </span>
                        {isWeak && (
                          <span className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.2 rounded">
                            Needs Review
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{topic.attemptsCount} questions tested</span>
                      <span>Last practiced: {topic.lastPracticed}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Want to diagnose overall knowledge?</span>
            <button
              onClick={() => onLaunchAssessment()}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Take Full Diagnostic Assessment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Recommended Next Action (Requirement 4) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Urgent Weak Topic Card */}
          {weakestTopic && (
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Recommended Next Action</span>
              </div>

              <h4 className="text-base font-bold text-white mt-2">
                Your weakest topic is {weakestTopic.topicTitle}.
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Current mastery is <span className="text-rose-400 font-semibold font-mono">{Math.round(weakestTopic.score * 100)}%</span> (P(L)={weakestTopic.score.toFixed(2)}). {primaryRec?.description || `Foundational gap detected in ${weakestTopic.topicTitle}. Prioritize remedial practice before advancing.`}
              </p>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => onAskTutorPrompt(getReviewPrompt(weakestTopic.topicId, weakestTopic.topicTitle))}
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>[Review: {primaryRec?.title || weakestTopic.topicTitle}]</span>
                  </span>
                  <span className="text-[10px] opacity-80">{primaryRec?.estimatedMinutes || 10} min</span>
                </button>

                <button
                  onClick={() => onLaunchAssessment(weakestTopic.topicId)}
                  className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-amber-400" />
                    <span>[Practice Weak Topic Assessment]</span>
                  </span>
                  <span className="text-[10px] text-slate-400">8 min</span>
                </button>

                <button
                  onClick={() => onLaunchAssessment(weakestTopic.topicId)}
                  className="w-full py-2.5 px-3 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-800 transition-colors flex items-center justify-between"
                >
                  <span>[Diagnostic Gap Repair Quiz]</span>
                  <span className="text-[10px] text-slate-400">5 min</span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  {primaryRec?.sourceTarget.page 
                    ? `Course Reference: Page ${primaryRec.sourceTarget.page}` 
                    : primaryRec?.sourceTarget.slide 
                    ? `Slide Deck: Slide ${primaryRec.sourceTarget.slide}` 
                    : 'Grounded Course Repository'}
                </span>
                <button
                  onClick={() => onOpenSourcePreview(primaryRec?.sourceTarget || {
                    sourceType: 'pdf',
                    fileName: 'Machine Learning Unit IV.pdf',
                    page: 25
                  })}
                  className="text-indigo-400 hover:underline"
                >
                  Inspect Source
                </button>
              </div>
            </div>
          )}

          {/* Quick Grounding Rule reminder */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Grounding Policy Active</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every answer generated by LearnMate AI is audited against your uploaded documents. If a question is outside the syllabus, it will not fabricate fake page numbers or citations.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed (Requirement 4) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Recent Learning Activity</h3>
          </div>
          <span className="text-xs text-slate-500">Live session ledger</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Completed Mini Quiz: Principal Component Analysis (PCA)
                </p>
                <p className="text-[11px] text-slate-400">
                  Scored 3/3 (100%) &bull; Answered covariance eigenspectrum derivation correctly
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-400 font-bold">+6% PCA Mastery</span>
              <p className="text-[10px] text-slate-500">2 hours ago</p>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Practiced Genetic Algorithms Assessment
                </p>
                <p className="text-[11px] text-slate-400">
                  Scored 1/3 (33%) &bull; Misconception detected on exploration vs exploitation operators
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-rose-400 font-bold">-4% GA Mastery</span>
              <p className="text-[10px] text-slate-500">4 hours ago</p>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Studied Isomap Geodesic Graph Distance
                </p>
                <p className="text-[11px] text-slate-400">
                  Reviewed Swiss Roll diagram on Page 25 and inspected Lecture 4 transcript excerpt at offset @18:42
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-indigo-400 font-semibold">Transcript Inspected</span>
              <p className="text-[10px] text-slate-500">Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supplementary Educational Resources Section (Requirement 1 & 5) */}
      <SupplementaryVideosSection 
        onAskTutorPrompt={onAskTutorPrompt}
      />
    </div>
  );
};
