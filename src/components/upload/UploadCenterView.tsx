import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Presentation, 
  Film, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { parseUploadedCourseFile, IngestionParseResult } from '../../services/documentParser';
import { StorageService } from '../../services/storageService';

interface UploadCenterViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onNewMaterialIngested: (result: IngestionParseResult) => void;
}

export const UploadCenterView: React.FC<UploadCenterViewProps> = ({
  onNavigateTab,
  onNewMaterialIngested
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [processingStats, setProcessingStats] = useState<{
    pagesProcessed: number;
    visualElementsAnalyzed: number;
    topicsDetected: number;
    conceptsIdentified: number;
    sourceChunksIndexed: number;
    fileSizeKB?: number;
    isRealFile?: boolean;
  } | null>(null);

  const PIPELINE_STAGES = [
    'File received & hash generated',
    'Content & layer extraction',
    'High-resolution OCR & transcript parsing',
    'Image & diagram visual analysis (Gemini)',
    'Curriculum topic boundary detection',
    'Concept extraction & prerequisite mapping',
    'Dense semantic vector & BM25 indexing',
    'Knowledge graph topological validation',
    'Ready for source-grounded tutoring'
  ];

  // Real file upload parsing
  const handleRealFileUpload = async (file: File) => {
    setSelectedFileName(file.name);
    setIsProcessing(true);
    setCurrentStageIndex(0);
    setProcessingStats(null);

    // Animate stages while parsing file in background
    let stage = 0;
    const stageTimer = setInterval(() => {
      if (stage < PIPELINE_STAGES.length - 2) {
        stage++;
        setCurrentStageIndex(stage);
      }
    }, 280);

    try {
      const parseResult = await parseUploadedCourseFile(file);

      // Persist custom chunks into local storage
      const existingChunks = StorageService.loadCustomChunks();
      StorageService.saveCustomChunks([...existingChunks, ...parseResult.chunks]);

      clearInterval(stageTimer);
      setCurrentStageIndex(PIPELINE_STAGES.length - 1);
      setIsProcessing(false);

      setProcessingStats({
        pagesProcessed: parseResult.stats.pagesProcessed,
        visualElementsAnalyzed: parseResult.stats.visualElementsAnalyzed,
        topicsDetected: parseResult.stats.topicsDetected,
        conceptsIdentified: parseResult.stats.conceptsIdentified,
        sourceChunksIndexed: parseResult.stats.sourceChunksIndexed,
        fileSizeKB: Math.round(file.size / 1024),
        isRealFile: true
      });

      onNewMaterialIngested(parseResult);
    } catch (err) {
      clearInterval(stageTimer);
      setIsProcessing(false);
      console.error('File parsing failed', err);
    }
  };

  // Preset demo material
  const handlePresetUpload = async (fileType: 'pdf' | 'ppt' | 'video') => {
    const defaultData = {
      pdf: {
        name: 'Deep Learning & Neural Manifolds Unit V.pdf',
        text: 'Unit V: Deep Learning, Neural Tangent Kernel, and Nonlinear Manifolds. Deep representations unwrap curved topological spaces through multi-layer composition.',
        type: 'application/pdf'
      },
      ppt: {
        name: 'Neural Optimization & Search Slides.pptx',
        text: 'Slide 1: Gradient Descent vs Heuristic Search. Slide 2: Evolutionary Strategies in High-Dimensional Landscapes.',
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      },
      video: {
        name: 'Lecture 5: Backpropagation & Topological Graphs.srt',
        text: '1\n00:05:10,000 --> 00:05:15,000\nProf. Miller: Notice how backpropagation acts as chain rule on computational DAG graphs.\n2\n00:14:20,000 --> 00:14:28,000\nTopological manifolds preserve metric neighborhoods under continuous smooth maps.',
        type: 'text/plain'
      }
    }[fileType];

    const blob = new Blob([defaultData.text], { type: defaultData.type });
    const file = new File([blob], defaultData.name, { type: defaultData.type });
    await handleRealFileUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleRealFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              Multimodal Ingestion Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload textbook PDFs, PPT/PPTX slide decks, SRT transcripts, or course notes for automated extraction & grounding.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Real File Parser Active</span>
          </span>
        </div>

        {/* Upload Dropzone */}
        <div className="mt-6 border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-2xl p-8 text-center transition-all bg-slate-950/40 relative group">
          <input
            type="file"
            accept=".pdf,.ppt,.pptx,.txt,.md,.srt,.vtt,.json"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isProcessing}
          />
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-100">
            Upload your course material
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Drag and drop your syllabus file here, or click to browse from device. Supports PDF, PPTX, SRT transcripts, TXT, and Markdown.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-400" />
              PDF Textbooks
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Presentation className="w-4 h-4 text-amber-400" />
              PPT / PPTX Slides
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4 text-blue-400" />
              SRT Video Transcripts
            </span>
          </div>
        </div>

        {/* Instant Demo Upload Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Or Test Ready-to-Ingest Presets (Evaluates Pipeline Live):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handlePresetUpload('pdf')}
              disabled={isProcessing}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Textbook PDF (Unit V)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => handlePresetUpload('ppt')}
              disabled={isProcessing}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-amber-400" />
                <span>Slide Deck (Optimization)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => handlePresetUpload('video')}
              disabled={isProcessing}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-400" />
                <span>Lecture Transcript (SRT)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* 9-Stage Ingestion Pipeline Progress */}
      {(isProcessing || processingStats) && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                9-Stage Ingestion Pipeline Execution {selectedFileName && `(${selectedFileName})`}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-pass analysis indexing exact text, figures, and audio timestamps
              </p>
            </div>
            {isProcessing ? (
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Processing Stage {currentStageIndex + 1}/9
              </span>
            ) : (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ingestion Completed & Indexed
              </span>
            )}
          </div>

          {/* Stepper view */}
          <div className="space-y-2">
            {PIPELINE_STAGES.map((stageName, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex && isProcessing;

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isPast
                      ? 'bg-emerald-950/15 border-emerald-800/40 text-emerald-200'
                      : isCurrent
                      ? 'bg-indigo-950/30 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPast ? 'bg-emerald-500 text-slate-950' : isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isPast ? '✓' : idx + 1}
                    </span>
                    <span>{stageName}</span>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] text-indigo-400 animate-pulse font-mono">
                      Running analysis...
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Verified Stats Display */}
          {processingStats && (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Ingested Knowledge Assets:
                </span>
                {processingStats.fileSizeKB !== undefined && (
                  <span className="text-xs text-slate-400 font-mono">
                    Parsed {processingStats.fileSizeKB} KB
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-lg font-bold text-white block">
                    ✓ {processingStats.pagesProcessed}
                  </span>
                  <span className="text-[10px] text-slate-400">pages / blocks</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-lg font-bold text-indigo-400 block">
                    ✓ {processingStats.visualElementsAnalyzed}
                  </span>
                  <span className="text-[10px] text-slate-400">visuals analyzed</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-lg font-bold text-purple-400 block">
                    ✓ {processingStats.topicsDetected}
                  </span>
                  <span className="text-[10px] text-slate-400">topics detected</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-lg font-bold text-emerald-400 block">
                    ✓ {processingStats.conceptsIdentified}
                  </span>
                  <span className="text-[10px] text-slate-400">concepts identified</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-lg font-bold text-sky-400 block">
                    ✓ {processingStats.sourceChunksIndexed}
                  </span>
                  <span className="text-[10px] text-slate-400">chunks indexed</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => onNavigateTab('library')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
                >
                  View Ingested Library
                </button>
                <button
                  onClick={() => onNavigateTab('tutor')}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <span>Start Tutoring on Material</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
