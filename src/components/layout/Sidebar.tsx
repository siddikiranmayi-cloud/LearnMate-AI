import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  UploadCloud, 
  Network, 
  Bot, 
  ClipboardCheck, 
  TrendingUp, 
  Compass, 
  BarChart3, 
  Settings,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'judge'
  | 'tutor'
  | 'assessment'
  | 'map'
  | 'recommendations'
  | 'progress'
  | 'library'
  | 'upload'
  | 'evaluation'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenArchitecture: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenArchitecture,
  isCollapsed
}) => {
  const NAV_ITEMS: { id: NavTab; label: string; icon: any; count?: number; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'judge', label: 'Judge Demo Mode', icon: ShieldCheck, badge: 'Proof' },
    { id: 'tutor', label: 'AI Tutor', icon: Bot, badge: 'Grounded' },
    { id: 'assessment', label: 'Adaptive Assessment', icon: ClipboardCheck },
    { id: 'map', label: 'Knowledge Map', icon: Network },
    { id: 'recommendations', label: 'Study Recommendations', icon: Compass, count: 3 },
    { id: 'progress', label: 'Learner Model & BKT', icon: TrendingUp },
    { id: 'library', label: 'Course Library', icon: BookOpen },
    { id: 'upload', label: 'Upload & Ingest', icon: UploadCloud },
    { id: 'evaluation', label: 'Evaluation Center', icon: BarChart3, badge: 'Hackathon' },
    { id: 'settings', label: 'Settings & Rubric', icon: Settings },
  ];

  return (
    <aside className={`h-screen sticky top-0 bg-slate-900/95 border-r border-slate-800 flex flex-col transition-all duration-300 z-30 select-none ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-base font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
                LearnMate AI
              </h1>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                Multimodal Tutor
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Course Selector Widget */}
      {!isCollapsed ? (
        <div className="mx-3 my-3 p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Enrolled Course</span>
            <span className="text-indigo-400 font-mono">CS 420</span>
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate">
            Machine Learning: Dimensionality & Search
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Overall Mastery</span>
            <span className="font-semibold text-emerald-400">63%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700/60 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: '63%' }} />
          </div>
        </div>
      ) : (
        <div className="my-2 flex justify-center">
          <div className="w-10 h-1.5 bg-slate-700 rounded-full" />
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              
              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.badge === 'Proof'
                          ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/60'
                          : item.badge === 'Hackathon' 
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Architecture Trigger Button */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onOpenArchitecture}
          className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-slate-800/60 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 transition-all ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="Inspect System Architecture"
        >
          <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
          {!isCollapsed && <span className="truncate">System Architecture</span>}
        </button>
      </div>

      {/* Grounding Trust Footer */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-slate-950/50 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Strict Grounding Active
          </span>
          <span className="font-mono text-slate-400">Zero Hallucinations</span>
        </div>
      )}
    </aside>
  );
};
