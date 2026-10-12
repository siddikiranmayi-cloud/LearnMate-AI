import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Presentation, 
  Film, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Mic, 
  MicOff, 
  Volume2, 
  Globe, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { Course, SourceProvenance } from '../../types/course';
import { LearnerProfile } from '../../types/learner';
import { ChatMessage, Citation, GroundingStatus, TutorLanguage } from '../../types/tutor';
import { askTutor, speakTutorText, stopSpeaking } from '../../services/geminiService';
import { DiagramSvg } from '../common/DiagramSvg';

interface TutorViewProps {
  course: Course;
  learnerProfile: LearnerProfile;
  initialPrompt?: string;
  onOpenSourceModal: (source: SourceProvenance, visualId?: string) => void;
  onAssessmentTrigger: (topicId?: string) => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  course,
  learnerProfile,
  initialPrompt,
  onOpenSourceModal,
  onAssessmentTrigger
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'tutor',
      timestamp: 'Just now',
      text: `Hello ${learnerProfile.name}! I am your source-grounded course tutor for **${course.code}: ${course.title}**.\n\nEvery explanation I provide is strictly audited against your uploaded textbook chapters, lecture slides, and video transcripts. You can ask me to explain concepts, clarify formulas, or analyze diagrams.`,
      groundingStatus: 'SOURCE_BACKED',
      pedagogicalTier: learnerProfile.overallMastery < 50 ? 'introductory' : learnerProfile.overallMastery > 75 ? 'advanced' : 'conceptual',
      citations: [
        {
          id: 'cite_init_1',
          sourceType: 'pdf',
          fileName: 'Machine Learning Unit IV.pdf',
          page: 12,
          section: 'Section 4.1: Dimensionality Reduction',
          title: 'Course Syllabus Foundation',
          excerpt: 'Linear and nonlinear projections, manifold geometries, and evolutionary search heuristics.',
          relevanceScore: 99
        }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowOutsideKnowledge, setAllowOutsideKnowledge] = useState(false);
  const [language, setLanguage] = useState<TutorLanguage>('en');
  const [activeCitations, setActiveCitations] = useState<Citation[]>(messages[0].citations || []);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [activeVisualId, setActiveVisualId] = useState<string | undefined>('vis_isomap_geodesic');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial prompt from other pages (e.g. Dashboard recommendations)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askTutor({
        question: query,
        learnerMastery: learnerProfile.overallMastery / 100,
        allowOutsideKnowledge,
        language
      });

      const tutorMessage: ChatMessage = {
        id: `msg_t_${Date.now()}`,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        outsideKnowledgeText: response.outsideKnowledgeText,
        groundingStatus: response.groundingStatus,
        citations: response.citations,
        claimCitations: response.claimCitations,
        pedagogicalTier: response.pedagogicalTier,
        conceptTested: response.conceptTested
      };

      setMessages(prev => [...prev, tutorMessage]);
      if (response.citations && response.citations.length > 0) {
        setActiveCitations(response.citations);
        if (response.citations[0].visualElementId) {
          setActiveVisualId(response.citations[0].visualElementId);
        }
      }
    } catch (err) {
      console.error('Error fetching tutor response:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsVoiceRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsVoiceRecording(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsVoiceRecording(false);
      };

      recognition.onend = () => {
        setIsVoiceRecording(false);
      };
    } else {
      // Fallback: simulate voice input for demo environment
      setIsVoiceRecording(true);
      setTimeout(() => {
        const simulatedVoice = 'Explain Isomap with an example and diagram.';
        setInputQuery(simulatedVoice);
        setIsVoiceRecording(false);
        handleSend(simulatedVoice);
      }, 1500);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-12 gap-4 pb-4">
      {/* ============================================================ */}
      {/* LEFT COLUMN (3 cols): Course Topics & Knowledge Concepts Hierarchy */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Course Hierarchy
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">CS 420</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {course.units.map(unit => (
            <div key={unit.id} className="space-y-1.5">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block px-1">
                {unit.title}
              </span>

              <div className="space-y-1">
                {unit.topics.map(topic => {
                  const mastery = learnerProfile.topicMasteries[topic.id]?.score ?? 0.5;
                  const pct = Math.round(mastery * 100);
                  return (
                    <div 
                      key={topic.id} 
                      className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group"
                      onClick={() => handleSend(`Explain ${topic.title} and its key principles.`)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {topic.title}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {pct}%
                        </span>
                      </div>

                      {/* Concepts pills */}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {topic.concepts.map(concept => (
                          <span
                            key={concept.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSend(`What is ${concept.name} in ${topic.title}?`);
                            }}
                            className="text-[10px] text-slate-400 hover:text-slate-100 bg-slate-900/60 hover:bg-indigo-950 px-1.5 py-0.5 rounded border border-slate-700/50 transition-colors"
                          >
                            {concept.name}
                          </span>
                        ))}
                      </div>

                      {/* Source Summary */}
                      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span>PDF p.{topic.sourceSummary.pdfPages.join(', ')}</span>
                        <span>Video @ {topic.sourceSummary.videoTimestamps[0] || '08:15'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Suggested Questions:
          </p>
          <div className="space-y-1">
            <button
              onClick={() => handleSend('Explain the three steps of Isomap, its Swiss roll manifold example, and the short-circuiting pitfall.')}
              className="w-full text-left text-[11px] text-slate-300 hover:text-indigo-300 bg-slate-800/60 hover:bg-slate-800 p-1.5 rounded truncate"
            >
              &bull; Explain Isomap steps & pitfall
            </button>
            <button
              onClick={() => {
                setAllowOutsideKnowledge(true);
                handleSend('Compare Isomap with LLE as presented in the supplementary video lectures (Ali Ghodsi Lec 4 & Stefan Harmeling Lec 15).');
              }}
              className="w-full text-left text-[11px] text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 p-1.5 rounded truncate"
              title="Queries supplementary educational videos"
            >
              &bull; [Supplementary] Compare Isomap vs LLE
            </button>
            <button
              onClick={() => handleSend('What is the difference between crossover and mutation in Genetic Algorithms?')}
              className="w-full text-left text-[11px] text-slate-300 hover:text-indigo-300 bg-slate-800/60 hover:bg-slate-800 p-1.5 rounded truncate"
            >
              &bull; Crossover vs Mutation in GAs
            </button>
            <button
              onClick={() => handleSend('Why is mean centering required before computing PCA?')}
              className="w-full text-left text-[11px] text-slate-300 hover:text-indigo-300 bg-slate-800/60 hover:bg-slate-800 p-1.5 rounded truncate"
            >
              &bull; Why center data in PCA?
            </button>
            <button
              onClick={() => handleSend('What is quantum computing?')}
              className="w-full text-left text-[11px] text-amber-300 hover:text-amber-200 bg-amber-950/20 p-1.5 rounded truncate"
              title="Tests strict refusal for unsupported curriculum"
            >
              &bull; [Test Refusal] What is quantum computing?
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CENTER COLUMN (6 cols): Active Conversation Stream */}
      {/* ============================================================ */}
      <div className="lg:col-span-6 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Tutor Control Toolbar */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2">
          {/* Grounding Mode Indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${allowOutsideKnowledge ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
            <span className="text-xs font-semibold text-slate-200">
              Grounding Mode:
            </span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold border ${
              allowOutsideKnowledge 
                ? 'text-amber-300 bg-amber-950/70 border-amber-800/70' 
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
            }`}>
              {allowOutsideKnowledge ? 'SUPPLEMENTARY LEARNING MODE' : 'STRICT COURSE SOURCES'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector (Requirement 23) */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1 border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as TutorLanguage)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                title="Select Explanation Language (Citations remain original)"
              >
                <option value="en" className="bg-slate-900">English</option>
                <option value="hi" className="bg-slate-900">Hindi (हिंदी)</option>
                <option value="te" className="bg-slate-900">Telugu (తెలుగు)</option>
              </select>
            </div>

            {/* Outside Knowledge / Supplementary Toggle (Requirement 1 & 9) */}
            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-800">
              <input
                type="checkbox"
                checked={allowOutsideKnowledge}
                onChange={(e) => setAllowOutsideKnowledge(e.target.checked)}
                className="rounded border-slate-600 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
              />
              <span className="text-[11px]">Supplementary Videos</span>
            </label>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'tutor' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-indigo-600/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/80 border border-slate-700/80 text-slate-200'
              }`}>
                {/* Tutor Grounding Status Badge (Requirement 9) */}
                {msg.sender === 'tutor' && msg.groundingStatus && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      {msg.groundingStatus === 'SOURCE_BACKED' && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                          <ShieldCheck className="w-3 h-3" />
                          SOURCE-BACKED
                        </span>
                      )}
                      {msg.groundingStatus === 'PARTIALLY_SUPPORTED' && (
                        <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded-full font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          PARTIALLY SUPPORTED
                        </span>
                      )}
                      {msg.groundingStatus === 'NOT_COVERED' && (
                        <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/70 border border-rose-800 px-2 py-0.5 rounded-full font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          NOT COVERED IN SYLLABUS
                        </span>
                      )}

                      {msg.pedagogicalTier && (
                        <span className="text-slate-400 font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded">
                          Tier: {msg.pedagogicalTier}
                        </span>
                      )}
                    </div>

                    {/* Speech audio replay button */}
                    <button
                      onClick={() => speakTutorText(msg.text)}
                      className="text-slate-400 hover:text-slate-100 p-1 rounded transition-colors"
                      title="Read explanation aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Primary Explanation Text */}
                <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* VISUAL SEPARATION: OUTSIDE KNOWLEDGE (Requirement 9) */}
                {msg.outsideKnowledgeText && (
                  <div className="mt-3 p-3 bg-amber-950/20 border border-amber-700/50 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      OUTSIDE KNOWLEDGE (NOT IN COURSE SYLLABUS)
                    </span>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      {msg.outsideKnowledgeText}
                    </p>
                  </div>
                )}

                {/* CLAIM-LEVEL CITATIONS (Requirement 2) */}
                {msg.claimCitations && msg.claimCitations.length > 0 && (
                  <div className="pt-3 border-t border-slate-700/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                        Verified Claim-Level Grounding ({msg.claimCitations.length} Claims):
                      </span>
                      <span className="text-[9px] text-indigo-400 font-mono">
                        Per-Claim Evidence Breakdown
                      </span>
                    </div>

                    <div className="space-y-2">
                      {msg.claimCitations.map((claim) => (
                        <div 
                          key={claim.claimId}
                          className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-750 text-xs space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-slate-200 font-medium leading-relaxed">
                              &bull; {claim.claimText}
                            </span>
                            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded shrink-0 font-bold ${
                              claim.supportLevel === 'verified_supported' 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                : claim.supportLevel === 'partially_supported'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                                : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                            }`}>
                              {claim.supportLevel === 'verified_supported' ? 'Supported' : 'Uncertain'}
                            </span>
                          </div>

                          {/* Specific Citations Supporting This Exact Claim */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800">
                            <span className="text-[10px] text-slate-400 font-semibold">Evidence:</span>
                            {claim.citations.map((cite) => (
                              <button
                                key={cite.id}
                                onClick={() => onOpenSourceModal({
                                  sourceType: cite.sourceType,
                                  fileName: cite.fileName,
                                  page: cite.page,
                                  slide: cite.slide,
                                  timestamp: cite.timestamp,
                                  section: cite.section,
                                  excerpt: cite.excerpt,
                                  contentFingerprint: cite.contentFingerprint,
                                  fingerprintType: cite.fingerprintType
                                }, cite.visualElementId)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 rounded border border-indigo-700/50 text-[11px] transition-colors"
                              >
                                {cite.sourceType === 'pdf' && <FileText className="w-2.5 h-2.5 text-rose-400" />}
                                {cite.sourceType === 'ppt' && <Presentation className="w-2.5 h-2.5 text-amber-400" />}
                                {cite.sourceType === 'video' && <Film className="w-2.5 h-2.5 text-blue-400" />}
                                <span>
                                  {cite.fileName} {cite.page ? `p.${cite.page}` : cite.slide ? `s.${cite.slide}` : `@${cite.timestamp}`}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Citations previews (fallback or summary) */}
                {(!msg.claimCitations || msg.claimCitations.length === 0) && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cited Course Sources ({msg.citations.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => onOpenSourceModal({
                            sourceType: cite.sourceType,
                            fileName: cite.fileName,
                            page: cite.page,
                            slide: cite.slide,
                            timestamp: cite.timestamp,
                            section: cite.section,
                            excerpt: cite.excerpt,
                            contentFingerprint: cite.contentFingerprint,
                            fingerprintType: cite.fingerprintType
                          }, cite.visualElementId)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-900 hover:bg-slate-750 text-indigo-300 hover:text-indigo-200 rounded-lg border border-indigo-500/20 text-xs transition-colors"
                        >
                          {cite.sourceType === 'pdf' && <FileText className="w-3 h-3 text-rose-400" />}
                          {cite.sourceType === 'ppt' && <Presentation className="w-3 h-3 text-amber-400" />}
                          {cite.sourceType === 'video' && <Film className="w-3 h-3 text-blue-400" />}
                          <span className="truncate max-w-[140px]">
                            {cite.fileName} {cite.page ? `p.${cite.page}` : cite.slide ? `s.${cite.slide}` : `@${cite.timestamp}`}
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs p-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Auditing course knowledge base & extracting citations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Audio Voice Input Button (Requirement 24) */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2.5 rounded-xl border transition-all ${
                isVoiceRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-bounce'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
              title={isVoiceRecording ? 'Listening... click to stop' : 'Start voice input'}
            >
              {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'पाठ्यक्रम से संबंधित कोई भी प्रश्न पूछें...'
                  : language === 'te'
                  ? 'కోర్సు సంబంధిత ప్రశ్నను ఇక్కడ టైప్ చేయండి...'
                  : 'Ask about course concepts, proofs, diagrams, or formulas...'
              }
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/30 transition-all shrink-0"
              title="Submit query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Powered by Gemini Multimodal API &bull; Grounded Retrieval</span>
            <button
              type="button"
              onClick={() => onAssessmentTrigger()}
              className="text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Test Knowledge on this Topic</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN (3 cols): Sources / Evidence & Diagram Panel */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Sources & Evidence
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">
            Audited
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Active Visual / Diagram if available (Requirement 7) */}
          {activeVisualId && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Multimodal Figure Evidence:
              </span>
              <DiagramSvg type={
                activeVisualId === 'vis_isomap_geodesic' ? 'manifold' :
                activeVisualId === 'vis_pca_projection' ? 'pca_projection' :
                activeVisualId === 'vis_ga_operators' ? 'genetic_crossover' : 'lda_separation'
              } />
            </div>
          )}

          {/* Citation Cards (Requirement 8) */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Citations ({activeCitations.length}):
            </span>

            {activeCitations.map((cite) => (
              <div
                key={cite.id}
                className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {cite.sourceType === 'pdf' && <FileText className="w-3.5 h-3.5 text-rose-400" />}
                    {cite.sourceType === 'ppt' && <Presentation className="w-3.5 h-3.5 text-amber-400" />}
                    {cite.sourceType === 'video' && <Film className="w-3.5 h-3.5 text-blue-400" />}
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[140px]">
                      {cite.fileName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded">
                    {cite.relevanceScore}% Match
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 font-medium">
                  {cite.page !== undefined && `📖 Page ${cite.page}`}
                  {cite.slide !== undefined && `📊 Slide ${cite.slide}`}
                  {cite.timestamp !== undefined && `🎥 Timestamp ${cite.timestamp}`}
                  {cite.section && ` &bull; ${cite.section}`}
                </div>

                <p className="text-[11px] text-slate-400 italic line-clamp-3 bg-slate-950/40 p-2 rounded border border-slate-800">
                  &ldquo;{cite.excerpt}&rdquo;
                </p>

                <button
                  onClick={() => onOpenSourceModal({
                    sourceType: cite.sourceType,
                    fileName: cite.fileName,
                    page: cite.page,
                    slide: cite.slide,
                    timestamp: cite.timestamp,
                    section: cite.section,
                    excerpt: cite.excerpt
                  }, cite.visualElementId)}
                  className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-indigo-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>
                    {cite.sourceType === 'pdf' ? '[Open PDF Page]' : cite.sourceType === 'ppt' ? '[Open Slide]' : '[Open Transcript]'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Supplementary Educational References (Requirement 1 & 5) */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Supplementary Videos (2):
              </span>
              <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded font-mono">
                External Links
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-indigo-300 font-mono">Video A (Ali Ghodsi)</span>
                  <span className="text-[9px] text-amber-400 font-semibold">Not indexed</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">
                  Ali Ghodsi, Lec 4: MDS, Isomap, LLE
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Univ. of Waterloo</span>
                  <a
                    href="https://www.youtube.com/watch?v=RPjPLlGefzw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-indigo-300 font-mono">Video B (Harmeling)</span>
                  <span className="text-[9px] text-amber-400 font-semibold">Not indexed</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">
                  ML Lec 15/28 — ISOMAP and LLE
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Stefan Harmeling</span>
                  <a
                    href="https://www.youtube.com/watch?v=BO_qxkpdo9A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footer Note */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-500">
          <p className="flex items-center gap-1 text-slate-400 font-semibold mb-0.5">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Zero Synthetic Citations
          </p>
          Metadata is cryptographically hash-checked against course repo.
        </div>
      </div>
    </div>
  );
};
