/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { TutorView } from './components/tutor/TutorView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { KnowledgeMapView } from './components/knowledge/KnowledgeMapView';
import { CourseLibraryView } from './components/knowledge/CourseLibraryView';
import { UploadCenterView } from './components/upload/UploadCenterView';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { EvaluationCenterView } from './components/evaluation/EvaluationCenterView';
import { LearnerProgressView } from './components/progress/LearnerProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { JudgeModeView } from './components/judge/JudgeModeView';
import { SourceViewerModal } from './components/common/SourceViewerModal';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { IngestionParseResult } from './services/documentParser';

import { DEMO_COURSE } from './data/demoCourse';
import { INITIAL_STUDENT_PROFILE } from './services/learnerEngine';
import { StorageService } from './services/storageService';
import { LearnerProfile } from './types/learner';
import { Course, SourceProvenance } from './types/course';
import { speakTutorText, stopSpeaking } from './services/geminiService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [course, setCourse] = useState<Course>(() => StorageService.loadCourse());
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(() => StorageService.loadLearnerProfile());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Synchronize state changes to localStorage
  React.useEffect(() => {
    StorageService.saveCourse(course);
  }, [course]);

  React.useEffect(() => {
    StorageService.saveLearnerProfile(learnerProfile);
  }, [learnerProfile]);

  // Deep linking parameters between components
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string>('');
  const [assessmentTopicId, setAssessmentTopicId] = useState<string | undefined>(undefined);

  // Modals
  const [sourceModal, setSourceModal] = useState<{
    isOpen: boolean;
    source: SourceProvenance | null;
    visualId?: string;
  }>({
    isOpen: false,
    source: null
  });

  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Handle student profile persona switching
  const handleChangeProfile = (type: 'student_a' | 'student_b' | 'student_c' | 'custom') => {
    if (type === 'student_a') {
      setLearnerProfile({
        ...INITIAL_STUDENT_PROFILE,
        id: 'student_a',
        name: 'Elena Rostova (Student A)',
        profileType: 'student_a',
        overallMastery: 89,
        topicMasteries: {
          ...INITIAL_STUDENT_PROFILE.topicMasteries,
          'topic_pca': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_pca'], score: 0.96 },
          'topic_lda': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_lda'], score: 0.91 },
          'topic_isomap': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_isomap'], score: 0.86 },
          'topic_least_squares': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_least_squares'], score: 0.94 },
          'topic_genetic_algorithms': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_genetic_algorithms'], score: 0.88 }
        }
      });
    } else if (type === 'student_b') {
      setLearnerProfile({
        ...INITIAL_STUDENT_PROFILE,
        id: 'student_b',
        name: 'Jordan Lee (Student B)',
        profileType: 'student_b',
        overallMastery: 75,
        topicMasteries: {
          ...INITIAL_STUDENT_PROFILE.topicMasteries,
          'topic_pca': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_pca'], score: 0.85 },
          'topic_lda': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_lda'], score: 0.78 },
          'topic_isomap': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_isomap'], score: 0.68 },
          'topic_least_squares': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_least_squares'], score: 0.80 },
          'topic_genetic_algorithms': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_genetic_algorithms'], score: 0.67 }
        }
      });
    } else if (type === 'student_c') {
      setLearnerProfile({
        ...INITIAL_STUDENT_PROFILE,
        id: 'student_c',
        name: 'Alex Ramos (Student C - Session 3)',
        profileType: 'student_c',
        overallMastery: 67,
        topicMasteries: {
          ...INITIAL_STUDENT_PROFILE.topicMasteries,
          'topic_pca': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_pca'], score: 0.78 },
          'topic_lda': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_lda'], score: 0.70 },
          'topic_isomap': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_isomap'], score: 0.54 },
          'topic_least_squares': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_least_squares'], score: 0.72 },
          'topic_genetic_algorithms': { ...INITIAL_STUDENT_PROFILE.topicMasteries['topic_genetic_algorithms'], score: 0.63 }
        }
      });
    } else {
      setLearnerProfile(INITIAL_STUDENT_PROFILE);
    }
  };

  const handleOpenSourceModal = (source: SourceProvenance, visualId?: string) => {
    setSourceModal({
      isOpen: true,
      source,
      visualId
    });
  };

  const handleAskTutorPrompt = (prompt: string) => {
    setTutorInitialPrompt(prompt);
    setCurrentTab('tutor');
  };

  const handleLaunchAssessment = (topicId?: string) => {
    setAssessmentTopicId(topicId);
    setCurrentTab('assessment');
  };

  const handleToggleVoice = () => {
    if (isVoiceActive) {
      stopSpeaking();
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      speakTutorText('LearnMate AI voice tutoring mode active. Ask any question about your course materials.', () => {
        setIsVoiceActive(false);
      });
    }
  };

  const handleNewMaterialIngested = (result: IngestionParseResult) => {
    const newMaterial = {
      id: `mat_${Date.now()}`,
      title: result.fileName,
      type: result.sourceType,
      fileName: result.fileName,
      pagesOrLength: result.pagesOrLength,
      chunksCount: result.chunks.length,
      visualsCount: result.stats.visualElementsAnalyzed
    };

    setCourse(prev => {
      const updatedUnits = prev.units.map((unit, idx) => {
        if (idx === 0 && result.detectedTopics.length > 0) {
          return {
            ...unit,
            topics: [...unit.topics, ...result.detectedTopics]
          };
        }
        return unit;
      });

      return {
        ...prev,
        materials: [newMaterial, ...prev.materials],
        units: updatedUnits
      };
    });
  };

  const handleLoadDemoCourse = () => {
    StorageService.resetAll();
    setCourse(DEMO_COURSE);
    setLearnerProfile(INITIAL_STUDENT_PROFILE);
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Persistent Desktop Sidebar (Requirement 3) */}
      <div className="hidden md:block">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          currentTab={currentTab}
          learnerProfile={learnerProfile}
          onChangeProfile={handleChangeProfile}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          isVoiceActive={isVoiceActive}
          onToggleVoice={handleToggleVoice}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onLoadDemoCourse={handleLoadDemoCourse}
          onSelectTab={setCurrentTab}
        />

        {/* View Switcher Container */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardView
              course={course}
              learnerProfile={learnerProfile}
              onNavigate={setCurrentTab}
              onLaunchAssessment={handleLaunchAssessment}
              onAskTutorPrompt={handleAskTutorPrompt}
              onOpenSourcePreview={handleOpenSourceModal}
            />
          )}

          {currentTab === 'judge' && (
            <JudgeModeView
              onOpenSourceModal={handleOpenSourceModal}
              onNavigateTab={setCurrentTab}
              onAskTutorPrompt={handleAskTutorPrompt}
              onLaunchAssessment={handleLaunchAssessment}
            />
          )}

          {currentTab === 'tutor' && (
            <TutorView
              course={course}
              learnerProfile={learnerProfile}
              initialPrompt={tutorInitialPrompt}
              onOpenSourceModal={handleOpenSourceModal}
              onAssessmentTrigger={handleLaunchAssessment}
            />
          )}

          {currentTab === 'assessment' && (
            <AssessmentView
              course={course}
              learnerProfile={learnerProfile}
              initialTopicId={assessmentTopicId}
              onUpdateLearnerProfile={setLearnerProfile}
              onOpenSourceModal={handleOpenSourceModal}
              onAskTutorPrompt={handleAskTutorPrompt}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'map' && (
            <KnowledgeMapView
              course={course}
              learnerProfile={learnerProfile}
              onOpenSourceModal={handleOpenSourceModal}
              onAskTutorPrompt={handleAskTutorPrompt}
              onLaunchAssessment={handleLaunchAssessment}
            />
          )}

          {currentTab === 'recommendations' && (
            <RecommendationsView
              learnerProfile={learnerProfile}
              onOpenSourceModal={handleOpenSourceModal}
              onAskTutorPrompt={handleAskTutorPrompt}
              onLaunchAssessment={handleLaunchAssessment}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'progress' && (
            <LearnerProgressView
              course={course}
              learnerProfile={learnerProfile}
              onNavigateTab={setCurrentTab}
              onAskTutorPrompt={handleAskTutorPrompt}
            />
          )}

          {currentTab === 'library' && (
            <CourseLibraryView
              course={course}
              onOpenSourceModal={handleOpenSourceModal}
              onAskTutorPrompt={handleAskTutorPrompt}
            />
          )}

          {currentTab === 'upload' && (
            <UploadCenterView
              onNavigateTab={setCurrentTab}
              onNewMaterialIngested={handleNewMaterialIngested}
            />
          )}

          {currentTab === 'evaluation' && (
            <EvaluationCenterView
              onAskTutorPrompt={handleAskTutorPrompt}
              onOpenSourceModal={handleOpenSourceModal}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              learnerProfile={learnerProfile}
              onResetLearnerProfile={setLearnerProfile}
              onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar (Requirement 3 & 27) */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Interactive Source Viewer Modal (Requirement 10) */}
      <SourceViewerModal
        isOpen={sourceModal.isOpen}
        source={sourceModal.source}
        visualId={sourceModal.visualId}
        onClose={() => setSourceModal({ ...sourceModal, isOpen: false })}
      />

      {/* Architecture Deep Dive Modal (Requirement 29) */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
