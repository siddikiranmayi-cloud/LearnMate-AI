export type SourceType = 'pdf' | 'ppt' | 'video';

export type IndexingStatus = 'indexed' | 'indexing_failed' | 'unindexed' | 'degraded';
export type EvidenceStatus = 
  | 'SOURCE_INDEXED'
  | 'SOURCE_UNAVAILABLE'
  | 'CITATION_TARGET_VERIFIED'
  | 'EVIDENCE_SUPPORTS_CLAIM'
  | 'EVIDENCE_INSUFFICIENT'
  | 'TRANSCRIPT_AVAILABLE'
  | 'TRANSCRIPT_PROVENANCE_UNVERIFIED'
  | 'ORIGINAL_VIDEO_UNAVAILABLE'
  | 'VISUAL_REFERENCE_VERIFIED'
  | 'VISUAL_REFERENCE_UNAVAILABLE';

export interface SourceProvenance {
  sourceType: SourceType;
  fileName: string;
  sourceId?: string;
  page?: number;
  slide?: number;
  timestamp?: string; // e.g. "18:42"
  section?: string;
  excerpt?: string;
  diagramTitle?: string;
  contentFingerprint?: string; // SHA-256 fingerprint of the extracted chunk or actual bytes
  fingerprintType?: 'file_bytes' | 'extracted_derivative';
  indexingStatus?: IndexingStatus;
  indexingError?: string;
  lastIndexedAt?: string;
  hasOriginalFile?: boolean;
  hasTranscriptRecord?: boolean;
  transcriptProvenanceVerified?: boolean;
  speakerNotes?: string;
}

export interface VisualElement {
  id: string;
  title: string;
  description: string;
  sourceType: SourceType;
  fileName: string;
  location: string; // e.g. "Page 25" or "Slide 14"
  page?: number;
  slide?: number;
  svgType: 'manifold' | 'pca_projection' | 'genetic_crossover' | 'lda_separation' | 'neighborhood_graph';
  keyInsights: string[];
  isOriginalPageInspected: boolean; // True if physically verified on the page
  actualDiagramPresent: boolean;     // False if page only contains equations/text
  caption?: string;
  verificationNote: string;
}

export interface SourceChunk {
  id: string;
  topicId: string;
  title: string;
  content: string;
  provenance: SourceProvenance;
  visualElementId?: string;
  keywords: string[];
  contentFingerprint?: string;
}

export interface Concept {
  id: string;
  name: string;
  topicId: string;
  description: string;
  sourceChunkIds: string[];
  visualElementIds?: string[];
}

export interface Topic {
  id: string;
  unitId: string;
  title: string;
  code: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[]; // topicIds
  concepts: Concept[];
  sourceSummary: {
    pdfPages: number[];
    slides: number[];
    videoTimestamps: string[];
  };
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  term: string;
  description: string;
  units: Unit[];
  materials: {
    id: string;
    title: string;
    type: SourceType;
    fileName: string;
    pagesOrLength: string;
    chunksCount: number;
    visualsCount: number;
  }[];
}
