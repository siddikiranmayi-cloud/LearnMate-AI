import React from 'react';
import { 
  Compass, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  BookOpen, 
  Play, 
  RefreshCw, 
  ExternalLink,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { LearnerProfile, StudyRecommendation } from '../../types/learner';
import { generateRecommendations } from '../../services/learnerEngine';
import { SourceProvenance } from '../../types/course';
import { NavTab } from '../layout/Sidebar';

interface RecommendationsViewProps {
  learnerProfile: LearnerProfile;
  onOpenSourceModal: (source: SourceProvenance) => void;
  onAskTutorPrompt: (prompt: string) => void;
  onLaunchAssessment: (topicId?: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  learnerProfile,
  onOpenSourceModal,
  onAskTutorPrompt,
  onLaunchAssessment,
  onNavigateTab
}) => {
  const recommendations = generateRecommendations(learnerProfile.topicMasteries);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Personalized Study Recommendation Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "What should I study next?" &bull; Factoring topic mastery, recent misconceptions, difficulty calibration, and prerequisite topology.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Total Recommended: ~28 Minutes</span>
        </div>
      </div>

      {/* Recommendations Queue (Requirement 19) */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isUrgent = rec.urgency === 'high';
          return (
            <div
              key={rec.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-4 transition-all ${
                isUrgent ? 'border-rose-500/40' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isUrgent ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Priority Step {index + 1} &bull; {rec.topicTitle}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {rec.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {rec.estimatedMinutes} min
                  </span>
                  {isUrgent && (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-1 rounded-lg">
                      High Urgency
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {rec.description}
                </p>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Algorithmic Rationale:</span> {rec.reason}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target: {rec.sourceTarget.fileName} ({rec.sourceTarget.slide ? `Slide ${rec.sourceTarget.slide}` : rec.sourceTarget.page ? `Page ${rec.sourceTarget.page}` : `@${rec.sourceTarget.timestamp}`})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSourceModal(rec.sourceTarget)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>View Citation</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {rec.actionType === 'review_concept' || rec.actionType === 'clarify_misconception' ? (
                    <button
                      onClick={() => onAskTutorPrompt(`Please review the core principles of ${rec.topicTitle}: ${rec.description}`)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <span>Launch Tutor Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onLaunchAssessment(rec.topicId)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <span>Start Practice Test</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
