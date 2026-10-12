import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  ClipboardCheck, 
  Network, 
  Compass, 
  BarChart3, 
  X,
  BookOpen,
  UploadCloud,
  Settings,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose
}) => {
  const BOTTOM_ITEMS: { id: NavTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'judge', label: 'Judge', icon: ShieldCheck },
    { id: 'tutor', label: 'Tutor', icon: Bot },
    { id: 'assessment', label: 'Quiz', icon: ClipboardCheck },
    { id: 'recommendations', label: 'Next', icon: Compass }
  ];

  const ALL_DRAWER_ITEMS: { id: NavTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'judge', label: 'Judge Demo & Proof Mode', icon: ShieldCheck },
    { id: 'tutor', label: 'Source-Grounded AI Tutor', icon: Bot },
    { id: 'assessment', label: 'Adaptive Assessment', icon: ClipboardCheck },
    { id: 'map', label: 'Knowledge & Prerequisite Map', icon: Network },
    { id: 'recommendations', label: 'Study Recommendations', icon: Compass },
    { id: 'progress', label: 'Learner Model & BKT', icon: TrendingUp },
    { id: 'library', label: 'Course Library & Units', icon: BookOpen },
    { id: 'upload', label: 'Upload & Multimodal Ingestion', icon: UploadCloud },
    { id: 'evaluation', label: 'Hackathon Evaluation Center', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Model Rubric', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-bold text-white text-base">LearnMate AI</span>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {ALL_DRAWER_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 bg-slate-950/50 rounded-xl text-[10px] text-slate-500">
              Track D: Personalized Tutoring & Adaptive Learning
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar on Small Screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 border-t border-slate-800 backdrop-blur z-20 flex items-center justify-around px-2">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
