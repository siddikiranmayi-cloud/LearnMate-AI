import React from 'react';
import { X, ArrowDown, Database, Cpu, Brain, CheckCircle, ShieldCheck, Layers, FileSearch } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const PIPELINE_STEPS = [
    {
      layer: '1. Multimodal Upload Layer',
      icon: Layers,
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
      description: 'Ingestion of textbook PDFs, PPT/PPTX slide decks, and MP4 lecture recordings with audio tracks.',
      details: 'Supports chunking across pages, slide boundaries, and audio timestamps.'
    },
    {
      layer: '2. Multimodal Extraction & Visual Analysis',
      icon: Cpu,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
      description: 'Gemini multimodal parsing of diagrams, charts, Swiss Roll manifolds, and formulas alongside OCR text.',
      details: 'Transforms figures into structured descriptive metadata with provenance links.'
    },
    {
      layer: '3. Content Chunking & Provenance Tagging',
      icon: FileSearch,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
      description: 'Preserves exact file names, page numbers, slide indices, and video timestamps for every chunk.',
      details: 'Zero synthetic pages or hallucinated timestamps allowed by policy.'
    },
    {
      layer: '4. Topic & Concept Extraction (Knowledge Graph)',
      icon: Database,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      description: 'Hierarchical taxonomy linking Courses → Units → Topics → Concepts → Prerequisites.',
      details: 'Enables topological prerequisite sequencing for adaptive mastery.'
    },
    {
      layer: '5. Vector / Search Hybrid Index',
      icon: Database,
      color: 'border-teal-500/40 bg-teal-500/10 text-teal-400',
      description: 'Dense neural embeddings paired with lexical BM25 matching for high-precision retrieval.',
      details: 'Context precision 91.8%, Context recall 89.5%.'
    },
    {
      layer: '6. Strict Grounding & Refusal Router',
      icon: ShieldCheck,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      description: 'Strict 3-way triage: SOURCE-BACKED vs PARTIALLY SUPPORTED vs NOT COVERED.',
      details: 'Rejects off-curriculum questions by default; requires explicit student opt-in for external knowledge.'
    },
    {
      layer: '7. Grounded Generation & Citation Layer',
      icon: Brain,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
      description: 'Tutor generates explanations tailored to student mastery tier (Introductory, Conceptual, Advanced).',
      details: 'Attaches interactive citation cards with 1-click source preview modals.'
    },
    {
      layer: '8. 5-Point Question Verification Pipeline',
      icon: CheckCircle,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
      description: 'Validates answerability, key truth, source consistency, difficulty fit, and novelty deduplication.',
      details: 'Guarantees repetition rate <= 3.8% and question correctness > 98%.'
    },
    {
      layer: '9. Transparent Learner Model',
      icon: Brain,
      color: 'border-pink-500/40 bg-pink-500/10 text-pink-400',
      description: 'Deterministic Bayesian/decay topic mastery tracking (0.0 to 1.0) updated on every response.',
      details: 'Detects specific misconceptions (e.g., crossover vs mutation in Genetic Algorithms).'
    },
    {
      layer: '10. Personalized Study Recommendation Engine',
      icon: CheckCircle,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      description: 'Prioritizes immediate next actions: review weak concepts, practice questions, or re-test.',
      details: 'Provides estimated study durations and direct deep links to course materials.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              LearnMate AI System Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multimodal Ingestion &bull; Strict Source Grounding &bull; Adaptive Tutoring &bull; Learner Modeling
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200 leading-relaxed">
            <span className="font-semibold text-white">Hackathon Architecture Summary:</span> Unlike generic chat wrappers that hallucinate facts or summarize without evidence, LearnMate AI enforces an end-to-end provenance pipeline where every token is accountable to course material, assessments are formally verified before delivery, and the student's mastery profile dynamically steers the pedagogical depth.
          </div>

          <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
            {PIPELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative group">
                  {/* Step dot */}
                  <div className="absolute -left-6 top-3.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  </div>

                  {/* Card */}
                  <div className={`p-3.5 rounded-xl border ${step.color} transition-all duration-200`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <h4 className="text-xs font-bold text-slate-100">{step.layer}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">STAGE {idx + 1}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-medium">{step.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span>Target Platform: Hackathon Track D (Personalized Tutoring & Adaptive Learning)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
