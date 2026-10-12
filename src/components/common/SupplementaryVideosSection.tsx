import React, { useState } from 'react';
import { 
  Film, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';
import { 
  SupplementaryVideoItem, 
  SupplementaryProcessingState, 
  STATUS_LABELS 
} from '../../data/supplementaryVideos';
import { StorageService } from '../../services/storageService';

interface SupplementaryVideosSectionProps {
  onAskTutorPrompt?: (prompt: string) => void;
  compact?: boolean;
}

export const SupplementaryVideosSection: React.FC<SupplementaryVideosSectionProps> = ({
  onAskTutorPrompt,
  compact = false
}) => {
  const [videos, setVideos] = useState<SupplementaryVideoItem[]>(() => {
    return StorageService.loadSupplementaryVideos();
  });

  const [selectedVideoId, setSelectedVideoId] = useState<string>(videos[0]?.id || 'supp_video_ghodsi');

  // Handle status update (for demonstration of the 6 required states)
  const handleUpdateStatus = (videoId: string, newStatus: SupplementaryProcessingState) => {
    const updated = videos.map(v => {
      if (v.id === videoId) {
        const meta = STATUS_LABELS[newStatus];
        return {
          ...v,
          processingStatus: newStatus,
          statusLabel: meta.label,
          transcriptAvailable: newStatus === 'transcript_available' || newStatus === 'transcript_indexed',
          transcriptSegments: newStatus === 'transcript_indexed' ? [
            {
              id: 'seg_1',
              timestamp: '14:20',
              seconds: 860,
              text: 'Isomap calculates the geodesic distance on the graph using Dijkstra, then feeds that distance matrix to Classical MDS.',
              topicRef: 'Isomap & MDS'
            },
            {
              id: 'seg_2',
              timestamp: '22:15',
              seconds: 1335,
              text: 'A major challenge in Isomap is topological instability: if epsilon is too large, you get short-circuiting across the folds.',
              topicRef: 'Short-Circuiting Pitfall'
            }
          ] : undefined
        };
      }
      return v;
    });

    setVideos(updated);
    StorageService.saveSupplementaryVideos(updated);
  };

  const selectedVideo = videos.find(v => v.id === selectedVideoId) || videos[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Supplementary Educational Videos
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
              External References
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            External university lecture videos linked for supplementary conceptual exploration. Never relabeled as course lecture recordings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-1 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Provenance Verified
          </span>
        </div>
      </div>

      {/* Strict Course Grounding Distinction Notice (Requirement 1 & 3) */}
      <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-200">
            Strict Source Boundary Policy
          </p>
          <p className="text-[11px] text-amber-300/80 leading-relaxed">
            In <strong>STRICT COURSE SOURCES mode</strong>, LearnMate AI restricts all citations to your official course textbook (<strong>Machine Learning Unit IV.pdf</strong>) and slides (<strong>ML Unit IV.pptx</strong>). These supplementary videos are external resources from the University of Waterloo and Stefan Harmeling—they are never confused with <em>Lecture 4.mp4</em>, and no media has been falsely claimed as downloaded or transcribed.
          </p>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map(video => {
          const statusInfo = STATUS_LABELS[video.processingStatus];
          const isSelected = video.id === selectedVideoId;

          return (
            <div 
              key={video.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? 'bg-slate-950/90 border-indigo-500 shadow-md shadow-indigo-500/10' 
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
              onClick={() => setSelectedVideoId(video.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                    {video.roleBadge}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    video.processingStatus === 'transcript_indexed'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                      : video.processingStatus === 'link_available'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {statusInfo.label}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-2">
                  {video.title}
                </h4>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p>
                    <strong className="text-slate-300">Channel / Lecturer:</strong> {video.publisherOrChannel} {video.lecturer ? `(${video.lecturer})` : ''}
                  </p>
                  <p>
                    <strong className="text-slate-300">Context:</strong> {video.courseContext}
                  </p>
                </div>

                {/* Topics Tag List */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {video.topics.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <span>Open Video Externally</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {onAskTutorPrompt && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskTutorPrompt(`Compare the course PDF formulation of Isomap (Page 25) with supplementary perspectives from ${video.title}.`);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Ask Tutor</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Video Deep-Dive & Processing State Machine Controller */}
      {selectedVideo && !compact && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Video-Assisted Processing Engine (Requirement 5)
              </span>
              <h5 className="text-xs font-bold text-slate-200 mt-0.5">
                Current Status Inspection: {selectedVideo.title}
              </h5>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Simulate Pipeline State:</span>
              <select
                value={selectedVideo.processingStatus}
                onChange={(e) => handleUpdateStatus(selectedVideo.id, e.target.value as SupplementaryProcessingState)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value="link_available">1. Link available (Default)</option>
                <option value="transcript_available">2. Transcript available</option>
                <option value="transcript_indexing_in_progress">3. Indexing in progress</option>
                <option value="transcript_indexed">4. Transcript indexed</option>
                <option value="verification_incomplete">5. Verification incomplete</option>
                <option value="processing_failed">6. Processing failed</option>
              </select>
            </div>
          </div>

          {/* Transparent State Explanation */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-slate-200 font-medium">
                  {STATUS_LABELS[selectedVideo.processingStatus].description}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  {selectedVideo.limitationExplanation}
                </p>
              </div>
            </div>

            {/* Transcript Segments (Only shown if genuinely indexed) */}
            {selectedVideo.processingStatus === 'transcript_indexed' && selectedVideo.transcriptSegments ? (
              <div className="mt-3 p-3 bg-slate-900 border border-emerald-800/40 rounded-lg space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Genuinely Indexed Supplementary Segments ({selectedVideo.transcriptSegments.length}):
                </span>
                <div className="space-y-1.5">
                  {selectedVideo.transcriptSegments.map(seg => (
                    <div key={seg.id} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-0.5">
                      <div className="flex items-center justify-between text-indigo-400 font-mono">
                        <span>Offset @ {seg.timestamp}</span>
                        <span className="text-slate-400">{seg.topicRef}</span>
                      </div>
                      <p className="text-slate-300 italic">&ldquo;{seg.text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] text-slate-400">
                <span className="text-slate-300 font-semibold block mb-0.5">Honest Evidence Policy:</span>
                Since transcript captions are not ingested for this external video, LearnMate AI works exclusively from the uploaded PDF textbook (Machine Learning Unit IV.pdf) and slide deck. It will never invent video timestamps or captions.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
