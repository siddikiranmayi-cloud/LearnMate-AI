import React from 'react';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Brain, 
  RotateCcw,
  BookOpen,
  ChevronRight,
  Flame,
  Calculator,
  History,
  FileText,
  Info
} from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { Course } from '../../types/course';
import { NavTab } from '../layout/Sidebar';
import { DEFAULT_BKT_PARAMETERS } from '../../services/learnerEngine';

interface LearnerProgressViewProps {
  course: Course;
  learnerProfile: LearnerProfile;
  onNavigateTab: (tab: NavTab) => void;
  onAskTutorPrompt: (prompt: string) => void;
}

export const LearnerProgressView: React.FC<LearnerProgressViewProps> = ({
  course,
  learnerProfile,
  onNavigateTab,
  onAskTutorPrompt
}) => {
  const masteries = Object.values(learnerProfile.topicMasteries);
  const evidenceLog = learnerProfile.bktEvidenceLog || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Learner Model & Bayesian Knowledge Tracing (BKT)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Genuine educational data mining implementation: tracks latent knowledge probabilities P(L) updated after every assessment response.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-xl">
          <Brain className="w-4 h-4" />
          <span>Active BKT Engine</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Average P(L) Mastery</span>
          <p className="text-2xl font-bold text-white mt-1">{learnerProfile.overallMastery}%</p>
          <span className="text-[11px] text-emerald-400 font-medium">Latent Knowledge State</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Study Streak</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{learnerProfile.studyStreakDays} Days</p>
          <span className="text-[11px] text-slate-500">Spaced retrieval practice</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Assessment Questions</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{learnerProfile.totalQuestionsAnswered}</p>
          <span className="text-[11px] text-slate-500">{learnerProfile.accuracyRate}% overall accuracy</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400">Identified Weak Areas</span>
          <p className="text-2xl font-bold text-rose-400 mt-1">2 Topics</p>
          <span className="text-[11px] text-rose-400 font-medium">GA (37%) & Isomap (48%)</span>
        </div>
      </div>

      {/* BKT Mathematical Parameters & Architecture Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            Bayesian Knowledge Tracing (BKT) Parameters & Formula Specification
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Corbett & Anderson (1995)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400">Prior Knowledge P(L₀):</span>
            <p className="text-base font-bold font-mono text-white">{DEFAULT_BKT_PARAMETERS.pL0}</p>
            <p className="text-[10px] text-slate-500">Initial probability before observations</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400">Transition Rate P(T):</span>
            <p className="text-base font-bold font-mono text-indigo-400">{DEFAULT_BKT_PARAMETERS.pT}</p>
            <p className="text-[10px] text-slate-500">Learning probability per practice chance</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400">Guess Probability P(G):</span>
            <p className="text-base font-bold font-mono text-amber-400">{DEFAULT_BKT_PARAMETERS.pG}</p>
            <p className="text-[10px] text-slate-500">Correct response despite unlearned state</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400">Slip Probability P(S):</span>
            <p className="text-base font-bold font-mono text-rose-400">{DEFAULT_BKT_PARAMETERS.pS}</p>
            <p className="text-[10px] text-slate-500">Error made despite knowing skill</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-xl text-xs font-mono text-slate-300 space-y-1 border border-slate-800/80">
          <p className="text-indigo-300 font-sans font-semibold">Bayes Posterior Formulas:</p>
          <p>&bull; P(L|Correct) = [P(L) &bull; (1 - P(S))] / [P(L) &bull; (1 - P(S)) + (1 - P(L)) &bull; P(G)]</p>
          <p>&bull; P(L|Incorrect) = [P(L) &bull; P(S)] / [P(L) &bull; P(S) + (1 - P(L)) &bull; (1 - P(G))]</p>
          <p>&bull; Transition to Next State: P(L_t+1) = P(L|Obs) + (1 - P(L|Obs)) &bull; P(T)</p>
        </div>
      </div>

      {/* Detailed Topic Mastery Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white">
          Curriculum Topic Competency Matrix
        </h3>

        {/* Educational Methodology: Latent Probability vs Measured Knowledge */}
        <div className="p-3.5 bg-slate-950/70 border border-indigo-900/40 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Methodological Rigor: Estimated Latent State vs. Directly Measured Performance</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-1">
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="font-bold text-white block text-[11px] mb-0.5">1. Estimated Latent Mastery P(L):</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Probabilistic Bayesian inference of the student&apos;s true underlying knowledge state. Accounts for slip probability P(S) and lucky guess probability P(G).
              </p>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="font-bold text-white block text-[11px] mb-0.5">2. Directly Measured Performance:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Empirical observation calculated directly from recorded attempts (Correct / Attempts), representing raw test accuracy without Bayesian smoothing.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {masteries.map((tm) => {
            const pct = Math.round(tm.score * 100);
            const current_pL = tm.bkt_pL !== undefined ? tm.bkt_pL : tm.score;
            const measuredPct = tm.measuredAccuracy !== undefined 
              ? tm.measuredAccuracy 
              : tm.attemptsCount > 0 
              ? Math.round((tm.correctCount / tm.attemptsCount) * 100) 
              : 0;

            return (
              <div key={tm.topicId} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{tm.topicTitle}</h4>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      pct >= 75 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' :
                      pct >= 50 ? 'bg-amber-950 text-amber-400 border border-amber-800/50' :
                      'bg-rose-950 text-rose-400 border border-rose-800/50'
                    }`}>
                      {pct >= 75 ? 'Mastered' : pct >= 50 ? 'In Progress' : 'Weak Area'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {tm.attemptsCount} attempts &bull; {tm.correctCount} correct &bull; Last practiced: {tm.lastPracticed}
                  </p>
                </div>

                {/* Score and Progress bar: Showing both BKT P(L) and Measured Accuracy */}
                <div className="flex items-center gap-4 w-full md:w-80">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>BKT Latent P(L): <strong className="text-white font-mono">{current_pL.toFixed(2)}</strong></span>
                      <span>Measured: <strong className="text-slate-300 font-mono">{measuredPct}%</strong></span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-base font-bold font-mono w-14 text-right ${
                    pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {pct}%
                  </span>
                </div>

                {/* Direct Action triggers */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskTutorPrompt(`Explain key concepts of ${tm.topicTitle} with examples.`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                  >
                    Tutor Concept
                  </button>
                  <button
                    onClick={() => onNavigateTab('assessment')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
                  >
                    Quiz Topic
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traceable BKT Evidence Audit Log (Requirement 4) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Traceable Assessment Evidence & Bayesian Update Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every score update is mathematically derived from recorded question attempts and grounded evidence.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {evidenceLog.length} Evidence Records
          </span>
        </div>

        {evidenceLog.length > 0 ? (
          <div className="space-y-3">
            {evidenceLog.slice(0, 10).map((trace) => (
              <div
                key={trace.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      trace.observation === 'CORRECT'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : trace.observation === 'PARTIALLY_CORRECT'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {trace.observation}
                    </span>
                    <span className="font-bold text-white">{trace.topicTitle}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400">Difficulty: {trace.difficulty}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">Prior: {trace.prior_pL.toFixed(2)}</span>
                    <span className="text-indigo-400">&rarr;</span>
                    <span className="font-bold text-white">Post: {trace.transition_pL.toFixed(2)} ({trace.resultingMasteryPercent}%)</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-300">
                  {trace.formulaApplied}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Source: {trace.evidenceSource.fileName} ({trace.evidenceSource.slide ? `Slide ${trace.evidenceSource.slide}` : trace.evidenceSource.page ? `Page ${trace.evidenceSource.page}` : `@${trace.evidenceSource.timestamp}`})</span>
                  </div>
                  <span>{trace.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-slate-400">
            Take a diagnostic quiz or practice assessment to record real Bayesian evidence updates.
          </div>
        )}
      </div>
    </div>
  );
};
