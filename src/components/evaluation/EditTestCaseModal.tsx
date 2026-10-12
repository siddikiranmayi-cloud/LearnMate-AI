import React, { useState } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Presentation,
  Film
} from 'lucide-react';
import { RegistryTestCase, RegistryTestCategory } from '../../types/evaluation';
import { verifyCitationAgainstIndexedSources } from '../../services/testRegistryEngine';

interface EditTestCaseModalProps {
  testCase: RegistryTestCase | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (testCase: RegistryTestCase) => void;
}

const CATEGORY_OPTIONS: { id: RegistryTestCategory; label: string; desc: string }[] = [
  { id: 'supported_citation', label: 'Supported Question (Source Grounded)', desc: 'Validates retrieval of verified citations for in-curriculum concepts' },
  { id: 'paraphrase_concept', label: 'Paraphrase Concept (Semantic Match)', desc: 'Tests recognizing concepts expressed with non-identical wording' },
  { id: 'unsupported_out_of_syllabus', label: 'Unsupported / Out-of-Syllabus Question', desc: 'Verifies strict refusal without hallucinating sources' },
  { id: 'fabricated_citation', label: 'Fabricated / Adversarial Citation Check', desc: 'Tests rejection of false claims or invalid page/slide/timestamp bounds' },
  { id: 'specific_provenance', label: 'Specific PDF / PPT / Video Provenance', desc: 'Tests exact pin-point citation to a page, slide, or video timestamp' },
  { id: 'quiz_answer_key', label: 'Quiz Answer-Key Correctness', desc: 'Validates 6-stage question verification and answer-key consistency' },
  { id: 'duplicate_detection', label: 'Duplicate-Question Detection', desc: 'Tests candidate similarity suppression against existing questions' },
  { id: 'topic_mastery_bkt', label: 'Topic-Specific BKT Mastery Update', desc: 'Verifies Corbett & Anderson mathematical update & topic isolation' }
];

export const EditTestCaseModal: React.FC<EditTestCaseModalProps> = ({
  testCase,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const isEditing = !!testCase;

  const [name, setName] = useState(testCase?.name || '');
  const [category, setCategory] = useState<RegistryTestCategory>(testCase?.category || 'supported_citation');
  const [description, setDescription] = useState(testCase?.description || '');
  const [inputPayload, setInputPayload] = useState(testCase?.inputPayload || '');
  const [expectedBehavior, setExpectedBehavior] = useState(testCase?.expectedBehavior || '');

  // Source Provenance configuration
  const [hasSource, setHasSource] = useState(!!testCase?.relevantSource);
  const [sourceType, setSourceType] = useState<'pdf' | 'ppt' | 'video'>(testCase?.relevantSource?.sourceType || 'pdf');
  const [fileName, setFileName] = useState(testCase?.relevantSource?.fileName || 'Machine Learning Unit IV.pdf');
  const [page, setPage] = useState<number | ''>(testCase?.relevantSource?.page ?? 25);
  const [slide, setSlide] = useState<number | ''>(testCase?.relevantSource?.slide ?? 14);
  const [timestamp, setTimestamp] = useState(testCase?.relevantSource?.timestamp || '08:15');
  const [section, setSection] = useState(testCase?.relevantSource?.section || 'Unit IV Core Materials');

  // Live Citation Bounds Audit
  const previewSource = hasSource ? {
    sourceType,
    fileName,
    ...(sourceType === 'pdf' && page !== '' ? { page: Number(page) } : {}),
    ...(sourceType === 'ppt' && slide !== '' ? { slide: Number(slide) } : {}),
    ...(sourceType === 'video' && timestamp ? { timestamp } : {}),
    section
  } : undefined;

  const citationAudit = previewSource ? verifyCitationAgainstIndexedSources(previewSource) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !inputPayload.trim()) return;

    const updated: RegistryTestCase = {
      id: testCase?.id || `reg_custom_${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      inputPayload: inputPayload.trim(),
      expectedBehavior: expectedBehavior.trim(),
      relevantSource: previewSource,
      lastResult: testCase?.lastResult,
      isCustom: testCase?.isCustom ?? true,
      createdAt: testCase?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Edit Registry Test Case' : 'Create New Registry Test Case'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure reproducible input payload, category, expected outcome, and source bounds.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Test Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Test Case Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Geodesic Shortest-Path Proof Verification"
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Test Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Category (Hackathon Track D) <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as RegistryTestCategory)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              {CATEGORY_OPTIONS.find(o => o.id === category)?.desc}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description / Objective
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Explain the technical requirement tested by this scenario..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Input Payload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Input Payload (Query or Configuration) <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={inputPayload}
              onChange={e => setInputPayload(e.target.value)}
              rows={3}
              placeholder="Enter user query text, JSON configuration, or question ID..."
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Expected Behavior */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Expected Behavior / Outcome <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={expectedBehavior}
              onChange={e => setExpectedBehavior(e.target.value)}
              rows={2}
              placeholder="e.g., Status = SOURCE_BACKED, citation from Unit IV page 25..."
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Relevant Source Association */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Link Target Course Material Citation</span>
              </label>
              <button
                type="button"
                onClick={() => setHasSource(!hasSource)}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                  hasSource ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {hasSource ? 'Source Enabled' : 'None (e.g. Refusal)'}
              </button>
            </div>

            {hasSource && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Material Type</label>
                    <select
                      value={sourceType}
                      onChange={e => {
                        const t = e.target.value as 'pdf' | 'ppt' | 'video';
                        setSourceType(t);
                        if (t === 'pdf') setFileName('Machine Learning Unit IV.pdf');
                        else if (t === 'ppt') setFileName('ML Unit IV.pptx');
                        else setFileName('Lecture 4.mp4');
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                    >
                      <option value="pdf">PDF Textbook</option>
                      <option value="ppt">PowerPoint Slides</option>
                      <option value="video">Lecture Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Source File</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={e => setFileName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {sourceType === 'pdf' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Page Number (1-36)</label>
                      <input
                        type="number"
                        min="1"
                        max="36"
                        value={page}
                        onChange={e => setPage(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                      />
                    </div>
                  )}

                  {sourceType === 'ppt' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Slide Number (1-32)</label>
                      <input
                        type="number"
                        min="1"
                        max="32"
                        value={slide}
                        onChange={e => setSlide(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                      />
                    </div>
                  )}

                  {sourceType === 'video' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Timestamp (MM:SS)</label>
                      <input
                        type="text"
                        placeholder="08:15"
                        value={timestamp}
                        onChange={e => setTimestamp(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Section / Topic Title</label>
                    <input
                      type="text"
                      value={section}
                      onChange={e => setSection(e.target.value)}
                      placeholder="e.g., Section 4.5"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                    />
                  </div>
                </div>

                {/* Real-time Citation Verification Status */}
                {citationAudit && (
                  <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                    citationAudit.isValid 
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                  }`}>
                    {citationAudit.isValid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{citationAudit.details}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Changes' : 'Create Test Case'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
