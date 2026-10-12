import { Course, SourceChunk } from '../types/course';
import { LearnerProfile } from '../types/learner';
import { AssessmentResult } from '../types/assessment';
import { DEMO_COURSE } from '../data/demoCourse';
import { INITIAL_STUDENT_PROFILE } from './learnerEngine';
import { SupplementaryVideoItem, INITIAL_SUPPLEMENTARY_VIDEOS } from '../data/supplementaryVideos';

const STORAGE_KEYS = {
  COURSE: 'learnmate_course_v2',
  CUSTOM_CHUNKS: 'learnmate_custom_chunks_v2',
  LEARNER: 'learnmate_learner_v2',
  ASSESSMENTS: 'learnmate_assessments_v2',
  QUESTION_HISTORY: 'learnmate_question_history_v2',
  JUDGE_AUDIT_LOG: 'learnmate_judge_audit_v2',
  TEST_REGISTRY: 'learnmate_test_registry_v2',
  SUPPLEMENTARY_VIDEOS: 'learnmate_supplementary_videos_v2'
};

const memoryStore: Record<string, string> = {};

const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fall through to memoryStore
    }
    return memoryStore[key] ?? null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Fall through to memoryStore
    }
    memoryStore[key] = value;
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Fall through to memoryStore
    }
    delete memoryStore[key];
  }
};

export const StorageService = {
  // Course persistence
  loadCourse(): Course {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.COURSE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load course from storage, using demo course', e);
    }
    return DEMO_COURSE;
  },

  saveCourse(course: Course): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.COURSE, JSON.stringify(course));
    } catch (e) {
      console.warn('Failed to save course', e);
    }
  },

  // Custom Chunks persistence
  loadCustomChunks(): SourceChunk[] {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.CUSTOM_CHUNKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load custom chunks', e);
    }
    return [];
  },

  saveCustomChunks(chunks: SourceChunk[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.CUSTOM_CHUNKS, JSON.stringify(chunks));
    } catch (e) {
      console.warn('Failed to save custom chunks', e);
    }
  },

  // Learner Profile persistence
  loadLearnerProfile(): LearnerProfile {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.LEARNER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load learner profile', e);
    }
    return INITIAL_STUDENT_PROFILE;
  },

  saveLearnerProfile(profile: LearnerProfile): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.LEARNER, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save learner profile', e);
    }
  },

  // Assessment results
  loadAssessmentResults(): AssessmentResult[] {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load assessments', e);
    }
    return [];
  },

  saveAssessmentResult(result: AssessmentResult): void {
    try {
      const existing = this.loadAssessmentResults();
      const updated = [result, ...existing].slice(0, 50); // Keep last 50
      safeStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save assessment result', e);
    }
  },

  // Question history (for novelty & repetition tracking)
  loadQuestionHistory(): string[] {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load question history', e);
    }
    return [];
  },

  addQuestionToHistory(questionId: string): void {
    try {
      const history = this.loadQuestionHistory();
      if (!history.includes(questionId)) {
        history.push(questionId);
        safeStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(history));
      }
    } catch (e) {
      console.warn('Failed to record question history', e);
    }
  },

  // Test Case Registry persistence (Requirement 1, 4)
  loadTestRegistry(): any[] | null {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.TEST_REGISTRY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load test registry', e);
    }
    return null;
  },

  saveTestRegistry(cases: any[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.TEST_REGISTRY, JSON.stringify(cases));
    } catch (e) {
      console.warn('Failed to save test registry', e);
    }
  },

  // Supplementary Educational Videos persistence (Requirement 1, 5)
  loadSupplementaryVideos(): SupplementaryVideoItem[] {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.SUPPLEMENTARY_VIDEOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load supplementary videos', e);
    }
    return INITIAL_SUPPLEMENTARY_VIDEOS;
  },

  saveSupplementaryVideos(videos: SupplementaryVideoItem[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.SUPPLEMENTARY_VIDEOS, JSON.stringify(videos));
    } catch (e) {
      console.warn('Failed to save supplementary videos', e);
    }
  },

  // Reset entire application back to pristine demo state
  resetAll(): void {
    try {
      safeStorage.removeItem(STORAGE_KEYS.COURSE);
      safeStorage.removeItem(STORAGE_KEYS.CUSTOM_CHUNKS);
      safeStorage.removeItem(STORAGE_KEYS.LEARNER);
      safeStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
      safeStorage.removeItem(STORAGE_KEYS.QUESTION_HISTORY);
      safeStorage.removeItem(STORAGE_KEYS.JUDGE_AUDIT_LOG);
      safeStorage.removeItem(STORAGE_KEYS.TEST_REGISTRY);
      safeStorage.removeItem(STORAGE_KEYS.SUPPLEMENTARY_VIDEOS);
    } catch (e) {
      console.warn('Failed to reset storage', e);
    }
  }
};
