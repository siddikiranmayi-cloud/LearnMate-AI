import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Presentation, 
  Film, 
  ExternalLink, 
  Layers, 
  Search, 
  ChevronRight,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { Course, SourceProvenance, SourceType } from '../../types/course';
import { DEMO_SOURCE_CHUNKS, DEMO_VISUALS } from '../../data/demoCourse';
import { SupplementaryVideosSection } from '../common/SupplementaryVideosSection';

interface CourseLibraryViewProps {
  course: Course;
  onOpenSourceModal: (source: SourceProvenance, visualId?: string) => void;
  onAskTutorPrompt: (prompt: string) => void;
}

export const CourseLibraryView: React.FC<CourseLibraryViewProps> = ({
  course,
  onOpenSourceModal,
  onAskTutorPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'documents' | 'chunks' | 'supplementary'>('taxonomy');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  const filteredChunks = DEMO_SOURCE_CHUNKS.filter(chunk => {
    const matchesSearch = chunk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTypeFilter === 'all' || chunk.provenance.sourceType === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Course Library & Multimodal Ingested Corpus
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hierarchical syllabus indexing with exact provenance retention (PDF pages, slide numbers, video timestamps).
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'taxonomy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Curriculum Taxonomy
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'documents' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Raw Materials ({course.materials.length})
          </button>
          <button
            onClick={() => setActiveTab('chunks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chunks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Indexed Chunks ({DEMO_SOURCE_CHUNKS.length})
          </button>
          <button
            onClick={() => setActiveTab('supplementary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'supplementary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Supplementary Videos (2)
          </button>
        </div>
      </div>

      {/* 1. CURRICULUM TAXONOMY VIEW */}
      {activeTab === 'taxonomy' && (
        <div className="space-y-6">
          {course.units.map(unit => (
            <div key={unit.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Unit {unit.number}
                  </span>
                  <h3 className="text-base font-bold text-white">{unit.title}</h3>
                  <p className="text-xs text-slate-400">{unit.description}</p>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {unit.topics.length} Ingested Topics
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.topics.map(topic => (
                  <div key={topic.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                          {topic.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100">{topic.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-medium">
                        {topic.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Concepts */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                        Extracted Concepts:
                      </span>
                      <div className="space-y-1">
                        {topic.concepts.map(concept => (
                          <div key={concept.id} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-400">&bull;</span>
                            <div>
                              <span className="font-semibold text-slate-200">{concept.name}:</span>{' '}
                              <span className="text-slate-400">{concept.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Provenance footer */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>PDF p.{topic.sourceSummary.pdfPages.join(', ')} &bull; Slides {topic.sourceSummary.slides.join(', ')}</span>
                      <button
                        onClick={() => onAskTutorPrompt(`Explain the complete derivation of ${topic.title}.`)}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Ask Tutor &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. RAW MATERIALS VIEW */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {course.materials.map(mat => (
            <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className={`p-3 rounded-xl w-fit ${
                  mat.type === 'pdf' ? 'bg-rose-500/10 text-rose-400' :
                  mat.type === 'ppt' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {mat.type === 'pdf' && <FileText className="w-6 h-6" />}
                  {mat.type === 'ppt' && <Presentation className="w-6 h-6" />}
                  {mat.type === 'video' && <Film className="w-6 h-6" />}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {mat.type === 'pdf' ? 'Course Textbook' : mat.type === 'ppt' ? 'Slide Deck' : 'Lecture Recording'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 leading-snug">
                    {mat.title}
                  </h3>
                  <p className="text-xs font-mono text-indigo-400 mt-1">
                    {mat.fileName}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Length / Size:</span>
                    <span className="font-semibold text-slate-200">{mat.pagesOrLength}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Indexed Chunks:</span>
                    <span className="font-semibold text-emerald-400">{mat.chunksCount} Chunks</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Visual Diagrams:</span>
                    <span className="font-semibold text-indigo-400">{mat.visualsCount} Extracted</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenSourceModal({
                  sourceType: mat.type,
                  fileName: mat.fileName,
                  page: mat.type === 'pdf' ? 12 : undefined,
                  slide: mat.type === 'ppt' ? 14 : undefined,
                  timestamp: mat.type === 'video' ? '08:15' : undefined,
                  section: 'Overview Ingestion Layer'
                })}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Inspect Extracted Provenance</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. INDEXED CHUNKS EXPLORER */}
      {activeTab === 'chunks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search indexed chunks or keywords..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Filter Source:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Formats</option>
                <option value="pdf">PDF Textbook</option>
                <option value="ppt">Slide Decks</option>
                <option value="video">Lecture Videos</option>
              </select>
            </div>
          </div>

          {/* Chunks List */}
          <div className="space-y-3">
            {filteredChunks.map(chunk => (
              <div
                key={chunk.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {chunk.provenance.sourceType === 'pdf' && <FileText className="w-4 h-4 text-rose-400" />}
                    {chunk.provenance.sourceType === 'ppt' && <Presentation className="w-4 h-4 text-amber-400" />}
                    {chunk.provenance.sourceType === 'video' && <Film className="w-4 h-4 text-blue-400" />}
                    <h4 className="text-xs md:text-sm font-bold text-white">{chunk.title}</h4>
                  </div>

                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded">
                    {chunk.provenance.fileName} {chunk.provenance.page ? `p.${chunk.provenance.page}` : chunk.provenance.slide ? `s.${chunk.provenance.slide}` : `@${chunk.provenance.timestamp}`}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {chunk.content}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex flex-wrap gap-1">
                    {chunk.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenSourceModal(chunk.provenance, chunk.visualElementId)}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>Inspect Raw Passage</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 4. SUPPLEMENTARY VIDEOS TAB */}
      {activeTab === 'supplementary' && (
        <SupplementaryVideosSection 
          onAskTutorPrompt={onAskTutorPrompt}
        />
      )}
    </div>
  );
};
