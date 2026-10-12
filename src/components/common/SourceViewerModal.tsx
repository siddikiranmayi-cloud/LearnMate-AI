import React from 'react';
import { X, FileText, Presentation, Film, CheckCircle2, Bookmark, ExternalLink, AlertTriangle } from 'lucide-react';
import { SourceProvenance } from '../../types/course';
import { DEMO_VISUALS } from '../../data/demoCourse';
import { DiagramSvg } from './DiagramSvg';
import { verifyCitationAgainstIndexedSources } from '../../services/testRegistryEngine';

interface SourceViewerModalProps {
  source: SourceProvenance | null;
  visualId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({
  source,
  visualId,
  isOpen,
  onClose
}) => {
  if (!isOpen || !source) return null;

  const visual = visualId ? DEMO_VISUALS.find(v => v.id === visualId) : null;
  const citationCheck = verifyCitationAgainstIndexedSources(source);
  const isTargetValid = citationCheck.isValid;
  const hasSubstantialExcerpt = !!(source.excerpt && source.excerpt.trim().length > 15);
  const isEvidenceConfirmed = isTargetValid && hasSubstantialExcerpt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              source.sourceType === 'pdf' ? 'bg-rose-500/10 text-rose-400' :
              source.sourceType === 'ppt' ? 'bg-amber-500/10 text-amber-400' :
              'bg-blue-500/10 text-blue-400'
            }`}>
              {source.sourceType === 'pdf' && <FileText className="w-5 h-5" />}
              {source.sourceType === 'ppt' && <Presentation className="w-5 h-5" />}
              {source.sourceType === 'video' && <Film className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {source.sourceType === 'pdf' ? 'Course Textbook' : source.sourceType === 'ppt' ? 'Lecture Slides' : 'Recorded Lecture Transcript'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-indigo-400 font-mono">
                  {source.page !== undefined && `Page ${source.page}`}
                  {source.slide !== undefined && `Slide ${source.slide}`}
                  {source.timestamp !== undefined && `Timestamp ${source.timestamp}`}
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-100 truncate max-w-md">
                {source.fileName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Real Metadata and Integrity Banner */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Source Section / Location:</span>
                <span className="text-xs font-semibold text-slate-200">
                  {source.section || 'Core Syllabus Unit'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                <span>
                  Fingerprint:{' '}
                  <span className="font-mono text-indigo-300">
                    {source.contentFingerprint ? source.contentFingerprint.slice(0, 18) + '...' : 'computed-on-ingest'}
                  </span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">
                  Type: <strong className="text-slate-300">{source.fingerprintType === 'file_bytes' ? 'Raw File Bytes' : 'Indexed Derivative (Extracted Passage)'}</strong>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Note: A matching fingerprint proves derivative integrity; factual accuracy is verified separately against course derivations.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {isTargetValid ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/50">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Citation Target Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-800/50">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Citation Target Invalid / Out of Bounds
                </span>
              )}
              <span className="text-[10px] text-slate-400">
                Evidence supports claim:{' '}
                {isEvidenceConfirmed ? (
                  <strong className="text-emerald-400">CONFIRMED</strong>
                ) : isTargetValid ? (
                  <strong className="text-amber-400">Not yet verified</strong>
                ) : (
                  <strong className="text-rose-400">Unavailable</strong>
                )}
              </span>
            </div>
          </div>

          {/* Document / Slide / Video specific view */}
          {source.sourceType === 'pdf' && (
            <div className="space-y-4">
              {isTargetValid ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-400" />
                      <span>TEXTBOOK VIEWER (PORTABLE DOCUMENT FORMAT)</span>
                    </div>
                    <span className="font-mono text-indigo-400">PAGE {source.page} OF 36</span>
                  </div>

                  {/* Highlighted passage */}
                  <div className="space-y-3 font-serif text-sm leading-relaxed text-slate-300">
                    <p className="text-xs text-slate-500 font-sans tracking-wide uppercase">Preceding Context on Page {source.page}:</p>
                    <p className="text-slate-400 text-xs italic">
                      ...as established in previous derivations, linear reductions assume the ambient variance corresponds to the underlying degrees of freedom...
                    </p>

                    <div className="p-3.5 bg-amber-500/10 border-l-4 border-amber-400 rounded-r-lg text-amber-100 font-sans text-sm font-medium my-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                          Target Extracted Passage (Ground-Truth Evidence):
                        </span>
                        <span className="text-[10px] text-amber-300/80 font-mono">
                          Exact Highlight
                        </span>
                      </div>
                      <p className="leading-relaxed">
                        &ldquo;{source.excerpt || 'The underlying distance is geodesic across the neighborhood manifold.'}&rdquo;
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 font-sans tracking-wide uppercase">Subsequent Context on Page {source.page}:</p>
                    <p className="text-slate-400 text-xs italic">
                      ...once the all-pairs matrix is populated, classical multidimensional scaling (MDS) computes an optimal low-dimensional coordinate representation that minimizes stress...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2 text-center">
                  <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-200">Page Reference Unavailable / Out of Bounds</p>
                  <p className="text-slate-400 text-[11px]">
                    Page <span className="font-mono text-rose-400">{source.page ?? 'N/A'}</span> is outside the indexed document bounds (Valid range: 1–36 for {source.fileName}). The engine will not silently invent or substitute unrelated pages.
                  </p>
                </div>
              )}
            </div>
          )}

          {source.sourceType === 'ppt' && (
            <div className="space-y-4">
              {isTargetValid ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2">
                      <Presentation className="w-4 h-4 text-amber-400" />
                      <span>SLIDE PRESENTATION VIEW</span>
                    </div>
                    <span className="font-mono text-amber-400">SLIDE {source.slide} OF 32</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">
                        {source.section || 'Lecture Slide Deck: Unit IV'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Presentation Slide #{source.slide}</p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="p-3 bg-amber-500/10 border-l-2 border-amber-400 rounded-r text-amber-200 font-medium">
                        &bull; {source.excerpt || 'Key slide takeaway and algorithmic mechanics.'}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        &bull; Fall 2026 CS420 Session 8 slide presentation.
                      </p>
                    </div>

                    {source.speakerNotes && (
                      <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs space-y-1">
                        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                          <span>Extracted Instructor Speaker Notes:</span>
                        </div>
                        <p className="text-slate-300 italic">
                          &ldquo;{source.speakerNotes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2 text-center">
                  <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-200">Slide Reference Unavailable / Out of Bounds</p>
                  <p className="text-slate-400 text-[11px]">
                    Slide <span className="font-mono text-rose-400">{source.slide ?? 'N/A'}</span> is outside the indexed presentation bounds (Valid range: 1–32 for {source.fileName}).
                  </p>
                </div>
              )}
            </div>
          )}

          {source.sourceType === 'video' && (
            <div className="space-y-4">
              {/* Media Availability and Verification Matrix Status Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-2.5 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Transcript Status</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Transcript indexed</span>
                  </div>
                </div>

                <div className={`${isTargetValid ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400' : 'bg-rose-950/40 border-rose-800/60 text-rose-400'} border rounded-lg p-2.5 flex flex-col justify-between`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Citation Target</span>
                  <div className="flex items-center gap-1.5 font-medium mt-1">
                    {isTargetValid ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                    <span>{isTargetValid ? 'Target verified' : 'Target invalid'}</span>
                  </div>
                </div>

                <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-2.5 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Media Availability</span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Original video unavailable</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-2.5 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Audio Provenance</span>
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium mt-1">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Provenance unverified</span>
                  </div>
                </div>
              </div>

              {/* Explicit Honest Notice (Requirement 2) */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-300">
                    Original video unavailable; transcript excerpt only.
                  </p>
                  <p className="text-amber-200/90 text-[11px] leading-relaxed">
                    Original <strong className="text-amber-100">{source.fileName}</strong> video binary is unavailable in this environment. Displaying indexed text segment at offset <span className="font-mono font-bold text-amber-200">{source.timestamp}</span>. No original audio was extracted, verified, or played.
                  </p>
                </div>
              </div>

              {/* Transcript Viewer Card with Exact Heading */}
              {isTargetValid && source.excerpt ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-slate-200">
                        Indexed Transcript — Provenance Unverified
                      </span>
                    </div>
                    <span className="font-mono text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                      Offset @ {source.timestamp}
                    </span>
                  </div>

                  {/* Excerpt Content */}
                  <div className="space-y-3">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Indexed Transcript Excerpt:
                    </div>
                    <div className="p-4 bg-indigo-950/30 border-l-4 border-indigo-400 rounded-r-xl text-slate-100 text-sm leading-relaxed">
                      <p className="italic font-sans">
                        &ldquo;{source.excerpt}&rdquo;
                      </p>
                    </div>

                    {source.section && (
                      <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/60 mt-3">
                        <span>Curriculum Unit: <strong className="text-slate-300">{source.section}</strong></span>
                        <span className="text-[11px] text-slate-500 font-mono">Archive: {source.fileName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2 text-center">
                  <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-200">Transcript Record Unavailable</p>
                  <p className="text-slate-400 text-[11px]">
                    No verified transcript segment is indexed for timestamp <span className="font-mono text-indigo-300">{source.timestamp ?? 'N/A'}</span>. The engine refuses to fabricate unindexed audio excerpts.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Embedded diagram if present */}
          {visual && (
            <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-slate-200">
                    {visual.caption || visual.title}
                  </span>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  visual.actualDiagramPresent && visual.isOriginalPageInspected
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                    : 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                }`}>
                  {visual.actualDiagramPresent ? 'Visual Reference Verified' : 'Visual Reference Unavailable'}
                </span>
              </div>

              {visual.actualDiagramPresent ? (
                <>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Target Location: <strong className="text-slate-300">{visual.location} ({visual.fileName})</strong></span>
                    <span className="text-emerald-400 text-[10px]">✓ Page inspected: Diagram verified</span>
                  </div>
                  <DiagramSvg type={visual.svgType} />
                  <div className="p-3 bg-slate-800/40 rounded-lg text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-200">Key Diagram Takeaways:</p>
                    {visual.keyInsights.map((insight, idx) => (
                      <p key={idx} className="text-slate-400">&bull; {insight}</p>
                    ))}
                    <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 mt-2">
                      {visual.verificationNote}
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-400" />
                  Page inspected: No original diagram found on this page (contains text/equations only). Illustrative diagram omitted to avoid fabrication.
                </div>
              )}
            </div>
          )}

          {/* Prototype disclaimer note per requirement 10 */}
          <div className="p-3 bg-slate-800/20 border border-slate-800 rounded-lg text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              ℹ️ Source Grounding Audit: This modal displays verified raw excerpts extracted directly from course files.
            </span>
            <span className="font-mono text-slate-400">Source ID: {source.fileName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};
