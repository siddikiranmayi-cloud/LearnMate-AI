import { SourceProvenance, EvidenceStatus } from './course';

export type GroundingStatus = 'SOURCE_BACKED' | 'PARTIALLY_SUPPORTED' | 'NOT_COVERED';

export type TutorLanguage = 'en' | 'hi' | 'te';

export interface Citation {
  id: string;
  sourceType: 'pdf' | 'ppt' | 'video';
  fileName: string;
  sourceId?: string;
  chunkId?: string;
  page?: number;
  slide?: number;
  timestamp?: string;
  section?: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
  visualElementId?: string;
  contentFingerprint?: string;
  fingerprintType?: 'file_bytes' | 'extracted_derivative';
  evidenceStatus?: EvidenceStatus;
}

export interface ClaimCitation {
  claimId: string;
  claimText: string;
  isSupported: boolean;
  supportLevel: 'verified_supported' | 'partially_supported' | 'insufficient_evidence';
  evidenceReason?: string;
  citations: Citation[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  timestamp: string;
  text: string;
  groundingStatus?: GroundingStatus;
  citations?: Citation[];
  claimCitations?: ClaimCitation[];
  outsideKnowledgeText?: string;
  conceptTested?: string;
  language?: TutorLanguage;
  pedagogicalTier?: 'introductory' | 'conceptual' | 'advanced';
  isAudioTranscribed?: boolean;
}
