export type SupplementaryProcessingState = 
  | 'link_available'
  | 'transcript_available'
  | 'transcript_indexing_in_progress'
  | 'transcript_indexed'
  | 'verification_incomplete'
  | 'processing_failed';

export interface SupplementaryTranscriptSegment {
  id: string;
  timestamp: string; // e.g. "14:20"
  seconds: number;
  text: string;
  topicRef: string;
}

export interface SupplementaryVideoItem {
  id: string;
  role: 'primary_isomap_ref' | 'additional_isomap_ref';
  roleBadge: string;
  title: string;
  url: string;
  publisherOrChannel: string;
  lecturer: string;
  courseContext: string;
  topics: string[];
  processingStatus: SupplementaryProcessingState;
  statusLabel: string;
  limitationExplanation: string;
  isOriginalCourseLecture: false; // Invariant: Never Lecture 4.mp4
  provenanceNote: string;
  transcriptAvailable: boolean;
  transcriptSegments?: SupplementaryTranscriptSegment[];
}

export const INITIAL_SUPPLEMENTARY_VIDEOS: SupplementaryVideoItem[] = [
  {
    id: 'supp_video_ghodsi',
    role: 'primary_isomap_ref',
    roleBadge: 'Video A — Primary Isomap Reference',
    title: 'Ali Ghodsi, Lec 4: MDS, Isomap, LLE',
    url: 'https://www.youtube.com/watch?v=RPjPLlGefzw',
    publisherOrChannel: 'Data Science Courses',
    lecturer: 'Ali Ghodsi',
    courseContext: 'University of Waterloo, STAT 442/842',
    topics: ['Multidimensional Scaling', 'Isomap', 'Locally Linear Embedding'],
    processingStatus: 'link_available',
    statusLabel: 'External video linked — transcript not indexed',
    limitationExplanation: 'External YouTube resource linked for supplementary study. External video streams are not automatically transcribed without explicit captions access. No raw audio was downloaded, verified, or indexed.',
    isOriginalCourseLecture: false,
    provenanceNote: 'External lecture series from University of Waterloo (STAT 442/842). This is a supplementary learning reference, not CS 420 Lecture 4.mp4.',
    transcriptAvailable: false
  },
  {
    id: 'supp_video_harmeling',
    role: 'additional_isomap_ref',
    roleBadge: 'Video B — Additional Isomap Reference',
    title: 'Machine Learning Lecture 15/28 — ISOMAP and LLE',
    url: 'https://www.youtube.com/watch?v=BO_qxkpdo9A',
    publisherOrChannel: 'Stefan Harmeling',
    lecturer: 'Stefan Harmeling',
    courseContext: 'Machine Learning Lecture Series (Lecture 15/28)',
    topics: ['Nonlinear dimensionality reduction', 'Isomap', 'LLE', 'MDS'],
    processingStatus: 'link_available',
    statusLabel: 'External video linked — transcript not indexed',
    limitationExplanation: 'External YouTube resource linked for supplementary study. Captions are not currently ingested for this resource; external link is preserved for direct viewing.',
    isOriginalCourseLecture: false,
    provenanceNote: 'External lecture series by Stefan Harmeling. This is a supplementary learning reference, not CS 420 Lecture 4.mp4.',
    transcriptAvailable: false
  }
];

export const STATUS_LABELS: Record<SupplementaryProcessingState, { label: string; badgeColor: string; description: string }> = {
  link_available: {
    label: 'External video linked — transcript not indexed',
    badgeColor: 'amber',
    description: 'Resource link is valid and openable. No captions or transcripts have been downloaded or ingested.'
  },
  transcript_available: {
    label: 'Transcript available — ready for ingestion',
    badgeColor: 'blue',
    description: 'External caption stream located; awaiting pipeline parsing.'
  },
  transcript_indexing_in_progress: {
    label: 'Transcript indexing in progress',
    badgeColor: 'indigo',
    description: 'Timestamped segmentation and semantic chunking underway.'
  },
  transcript_indexed: {
    label: 'Transcript indexed — supplementary evidence active',
    badgeColor: 'emerald',
    description: 'Verified timestamped segments available for supplementary retrieval.'
  },
  verification_incomplete: {
    label: 'Source verification incomplete',
    badgeColor: 'purple',
    description: 'Partial metadata retrieved; audio-to-text alignment unconfirmed.'
  },
  processing_failed: {
    label: 'Processing failed — link preserved',
    badgeColor: 'rose',
    description: 'Automated retrieval failed (access restriction or no captions). Resource link remains active.'
  }
};
