import React from 'react';
import { Menu, Mic, MicOff, BookOpen, ShieldCheck } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  learnerProfile: LearnerProfile;
  onChangeProfile: (profileType: 'student_a' | 'student_b' | 'student_c' | 'custom') => void;
  onToggleMobileNav: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  onOpenArchitecture: () => void;
  onLoadDemoCourse: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  learnerProfile,
  onChangeProfile,
  onToggleMobileNav,
  isVoiceActive,
  onToggleVoice,
  onLoadDemoCourse,
  onSelectTab
}) => {
  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Student Learning Dashboard',
      subtitle: 'Course mastery overview, streak, and adaptive study targets'
    },
    judge: {
      title: 'Judge Demo & Evidence Audit Mode',
      subtitle: 'Live technical proof: raw retrieval scoring, grounding thresholds, claim mapping & test runner'
    },
    tutor: {
      title: 'Source-Grounded AI Tutor',
      subtitle: 'Strict provenance answers derived directly from course textbooks, slides & lecture transcripts'
    },
    assessment: {
      title: 'Adaptive Assessment & Verification Engine',
      subtitle: '5-stage verified questions with novelty deduplication and diagnostic mastery scoring'
    },
    map: {
      title: 'Knowledge & Prerequisite Map',
      subtitle: 'Interactive topological course graph with mastery color-coding and source provenance'
    },
    recommendations: {
      title: 'Study Recommendation Engine',
      subtitle: 'Prioritized "What should I study next?" queue based on weak topics and spaced retention'
    },
    progress: {
      title: 'Learner Model & Bayesian Knowledge Tracing',
      subtitle: 'Transparent BKT latent probability calculations, attempt histories, and misconception tracking'
    },
    library: {
      title: 'Course Materials & Ingested Knowledge Base',
      subtitle: 'Multimodal units, topics, concepts, slides, and synchronized video transcripts'
    },
    upload: {
      title: 'Multimodal Ingestion Pipeline',
      subtitle: 'Upload PDF textbooks, PPT/PPTX slide decks, and MP4 lecture recordings'
    },
    evaluation: {
      title: 'Hackathon Evaluation Center',
      subtitle: 'Defined RAG metrics with mathematical denominators, test suite runner, and longitudinal gains'
    },
    settings: {
      title: 'Settings & Evaluation Rubric',
      subtitle: 'Platform parameters, API status, model configuration, and track requirements'
    }
  };

  const currentInfo = titles[currentTab] || titles.dashboard;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2 truncate">
            {currentInfo.title}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xl">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right controls: Judge Mode, Demo Reset, Voice Tutor, Profile Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Judge Mode Button */}
        <button
          onClick={() => onSelectTab('judge')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
            currentTab === 'judge'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
              : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-700/60'
          }`}
          title="Open Judge Proof & Test Runner Mode"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Judge Mode</span>
        </button>

        {/* Demo Course Quick Reload */}
        <button
          onClick={onLoadDemoCourse}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-700/80 transition-colors"
          title="Reset to CS420 demo state"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Demo Course</span>
        </button>

        {/* Voice Tutor Button */}
        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            isVoiceActive
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
              : 'bg-indigo-600/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/20'
          }`}
          title="Voice Tutoring with speech synthesis"
        >
          {isVoiceActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isVoiceActive ? 'Stop Voice' : 'Voice Tutor'}</span>
        </button>

        {/* Student Profile Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200 leading-none">
              {learnerProfile.name}
            </span>
            <span className="text-[10px] text-slate-400 capitalize">
              {learnerProfile.profileType === 'custom' ? 'Interactive Student' : learnerProfile.profileType.replace('_', ' ')}
            </span>
          </div>

          <select
            value={learnerProfile.profileType}
            onChange={(e) => onChangeProfile(e.target.value as any)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            title="Switch Simulated Student Persona"
          >
            <option value="custom">Alex Ramos (Current)</option>
            <option value="student_a">Student A (Strong Learner)</option>
            <option value="student_b">Student B (Average Learner)</option>
            <option value="student_c">Student C (Struggling Learner)</option>
          </select>
        </div>
      </div>
    </header>
  );
};
