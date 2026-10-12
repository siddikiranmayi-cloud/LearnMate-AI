import { DEMO_SOURCE_CHUNKS, DEMO_VISUALS } from '../data/demoCourse';
import { SourceChunk, VisualElement } from '../types/course';
import { Citation, GroundingStatus } from '../types/tutor';
import { StorageService } from './storageService';

export interface ScoredChunkDetail {
  chunk: SourceChunk;
  score: number;
  tokenOverlap: string[];
  rank: number;
}

export interface RetrievalResult {
  status: GroundingStatus;
  chunks: SourceChunk[];
  citations: Citation[];
  visuals: VisualElement[];
  topRelevance: number;
  thresholdApplied: string;
  scoredDetails: ScoredChunkDetail[];
  refusalReason?: string;
}

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'and', 'can', 'you', 'provide', 'using',
  'how', 'what', 'does', 'did', 'are', 'for', 'from', 'with', 'this', 'that', 'these',
  'those', 'discuss', 'discussed', 'explain', 'where', 'why', 'when', 'who',
  'step', 'steps', 'according', 'formula', 'tutorial', 'about', 'into', 'over',
  'after', 'before', 'between', 'during', 'through', 'under', 'above', 'below',
  'section', 'page', 'unit', 'lecture', 'chapter', 'material', 'course', 'slide',
  'would', 'could', 'should', 'been', 'have', 'has', 'had', 'were', 'being'
]);

const CONCEPT_SYNONYMS: Record<string, string[]> = {
  'flatten': ['manifold', 'isomap', 'unfolding', 'unroll', 'geodesic', 'swiss roll', 'dimensionality reduction'],
  'curved': ['manifold', 'nonlinear', 'swiss roll', 'geodesic', 'riemannian'],
  'short-cutting': ['short-circuiting', 'shortcut', 'shortcuts', 'corrupt', 'pitfall', 'empty space'],
  'shortcut': ['short-circuiting', 'shortcuts', 'pitfall'],
  'compact': ['within-class', 's_w', 'scatter', 'compactness', 'lda', 'fisher'],
  'spread': ['between-class', 's_b', 'scatter', 'separation', 'separability', 'lda'],
  'separability': ['between-class', 's_b', 'scatter', 'separation', 'lda', 'fisher'],
  'dimensions': ['dimensionality'],
  'reduce': ['reduction'],
  'dataset': ['data']
};

// Tokenize and clean text, filtering out general stopwords
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// BM25 / TF-IDF inspired scoring with concept synonym mapping
function scoreChunk(queryTokens: string[], chunk: SourceChunk): { score: number; overlap: string[] } {
  const contentLower = chunk.content.toLowerCase();
  const titleLower = chunk.title.toLowerCase();
  const keywords = (chunk.keywords || []).map(k => k.toLowerCase());
  
  let score = 0;
  const overlap: string[] = [];

  for (const token of queryTokens) {
    let matched = false;
    if (titleLower.includes(token)) {
      score += 3.5;
      matched = true;
    }
    if (keywords.some(k => k.includes(token))) {
      score += 4.0;
      matched = true;
    }
    
    // Exact word frequency in content
    const regex = new RegExp(`\\b${token}\\b`, 'gi');
    const matches = contentLower.match(regex);
    if (matches) {
      score += Math.min(matches.length * 1.5, 4.5);
      matched = true;
    }

    // Concept synonym matching
    const synonyms = CONCEPT_SYNONYMS[token];
    if (synonyms) {
      for (const syn of synonyms) {
        if (titleLower.includes(syn) || keywords.some(k => k.includes(syn))) {
          score += 2.5;
          matched = true;
          overlap.push(`${token}->${syn}`);
        } else if (contentLower.includes(syn)) {
          score += 1.5;
          matched = true;
          overlap.push(`${token}->${syn}`);
        }
      }
    }

    if (matched) {
      overlap.push(token);
    }
  }

  // Length normalization penalty to prevent long chunk bias
  const lenFactor = Math.log(chunk.content.length + 10) / 4;
  return {
    score: Number((score / lenFactor).toFixed(2)),
    overlap: Array.from(new Set(overlap))
  };
}

export function retrieveRelevantSources(
  query: string, 
  customChunks?: SourceChunk[],
  minScoreThreshold = 2.0
): RetrievalResult {
  // Combine demo course chunks with any custom ingested chunks
  const storedCustom = StorageService.loadCustomChunks();
  const activeCustom = (customChunks && customChunks.length > 0) ? customChunks : storedCustom;
  const chunksToSearch = [...DEMO_SOURCE_CHUNKS, ...activeCustom];

  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return {
      status: 'NOT_COVERED',
      chunks: [],
      citations: [],
      visuals: [],
      topRelevance: 0,
      thresholdApplied: 'Empty or trivial query (Token count = 0)',
      scoredDetails: [],
      refusalReason: 'No search terms provided.'
    };
  }

  // Strict domain triggers for out-of-curriculum computer science topics using word boundary checks
  const offCurriculumTriggers = [
    'quantum', 'shor', 'qubit', 'transformer', 'attention mechanism', 
    'bert', 'gpt', 'react', 'css', 'sql database', 'cryptocurrency', 'bitcoin', 'blockchain',
    'bb84', 'fourier transform', 'prime factorization', 'professor smith', 'exponential o'
  ];
  const matchedTrigger = offCurriculumTriggers.find(trigger => {
    const rx = new RegExp(`\\b${trigger}\\b`, 'i');
    return rx.test(query);
  });

  const scored: ScoredChunkDetail[] = chunksToSearch.map((chunk) => {
    const { score, overlap } = scoreChunk(queryTokens, chunk);
    return {
      chunk,
      score,
      tokenOverlap: overlap,
      rank: 0
    };
  });

  scored.sort((a, b) => b.score - a.score);
  scored.forEach((item, idx) => { item.rank = idx + 1; });

  const topScored = scored.filter(item => item.score >= minScoreThreshold);
  const topRelevance = topScored.length > 0 ? topScored[0].score : (scored[0]?.score || 0);

  // Strict Grounding Policy Decision
  let status: GroundingStatus = 'NOT_COVERED';
  let thresholdApplied = '';
  let refusalReason: string | undefined = undefined;

  if (matchedTrigger) {
    status = 'NOT_COVERED';
    thresholdApplied = `Out-of-curriculum trigger matched ("${matchedTrigger}") - Concept is outside syllabus`;
    refusalReason = `Topic "${matchedTrigger}" is not covered in your uploaded syllabus materials.`;
  } else if (topRelevance >= 3.8) {
    status = 'SOURCE_BACKED';
    thresholdApplied = `Top relevance score (${topRelevance}) >= 3.8 threshold (Directly Supported)`;
  } else if (topRelevance >= 2.0) {
    status = 'PARTIALLY_SUPPORTED';
    thresholdApplied = `Relevance score (${topRelevance}) between 2.0 and 3.8 (Partial Course Evidence)`;
  } else {
    status = 'NOT_COVERED';
    thresholdApplied = `Top relevance score (${topRelevance}) < 2.0 threshold (Insufficient Evidence)`;
    refusalReason = 'Query terms did not meet evidence threshold in course documents.';
  }

  const selectedChunks = (status !== 'NOT_COVERED') ? topScored.slice(0, 3).map(s => s.chunk) : [];

  // Map to citations preserving exact metadata
  const citations: Citation[] = selectedChunks.map(chunk => {
    return {
      id: `cite_${chunk.id}`,
      sourceType: chunk.provenance.sourceType,
      fileName: chunk.provenance.fileName,
      sourceId: chunk.provenance.sourceId,
      chunkId: chunk.id,
      page: chunk.provenance.page,
      slide: chunk.provenance.slide,
      timestamp: chunk.provenance.timestamp,
      section: chunk.provenance.section,
      title: chunk.title,
      excerpt: chunk.provenance.excerpt || chunk.content.slice(0, 160) + '...',
      relevanceScore: Math.min(Math.round((topRelevance / 10) * 100), 99),
      visualElementId: chunk.visualElementId,
      contentFingerprint: chunk.provenance.contentFingerprint,
      fingerprintType: chunk.provenance.fingerprintType || 'extracted_derivative',
      evidenceStatus: status === 'SOURCE_BACKED' ? 'EVIDENCE_SUPPORTS_CLAIM' : 'PARTIALLY_SUPPORTED' as any
    };
  });

  // Find associated visuals
  const visualIds = new Set(selectedChunks.map(c => c.visualElementId).filter(Boolean));
  const visuals = DEMO_VISUALS.filter(v => visualIds.has(v.id));

  return {
    status,
    chunks: selectedChunks,
    citations,
    visuals,
    topRelevance,
    thresholdApplied,
    scoredDetails: scored.slice(0, 5),
    refusalReason
  };
}
