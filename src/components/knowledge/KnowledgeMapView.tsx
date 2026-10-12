import React, { useState } from 'react';
import { 
  Network, 
  ArrowDown, 
  ExternalLink, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Play,
  FileText
} from 'lucide-react';
import { Course, SourceProvenance } from '../../types/course';
import { LearnerProfile } from '../../types/learner';

interface KnowledgeMapViewProps {
  course: Course;
  learnerProfile: LearnerProfile;
  onOpenSourceModal: (source: SourceProvenance, visualId?: string) => void;
  onAskTutorPrompt: (prompt: string) => void;
  onLaunchAssessment: (topicId?: string) => void;
}

interface MapNode {
  id: string;
  topicId: string;
  title: string;
  level: number;
  category: 'Foundation' | 'Linear' | 'Supervised' | 'Nonlinear' | 'Search Heuristics';
  description: string;
  prerequisites: string[];
  sources: { title: string; location: string; type: 'pdf' | 'ppt' | 'video' }[];
  recentQuestions: string[];
  actionRecommendation: string;
  visualId?: string;
}

export const KnowledgeMapView: React.FC<KnowledgeMapViewProps> = ({
  course,
  learnerProfile,
  onOpenSourceModal,
  onAskTutorPrompt,
  onLaunchAssessment
}) => {
  const NODES: MapNode[] = [
    {
      id: 'node_least_squares',
      topicId: 'topic_least_squares',
      title: 'Least Squares & Regularization',
      level: 1,
      category: 'Foundation',
      description: 'Normal equations, residual variance, condition numbers, and Ridge L2 lambda * I shift.',
      prerequisites: [],
      sources: [
        { title: 'Machine Learning Unit IV.pdf', location: 'Page 8', type: 'pdf' },
        { title: 'ML Unit IV.pptx', location: 'Slide 10', type: 'ppt' }
      ],
      recentQuestions: [
        'How does Ridge regression handle multicollinearity?',
        'What is the closed form solution for Normal Equations?'
      ],
      actionRecommendation: 'Review Ridge eigenvalue shift (5 min) to maintain foundational retention.'
    },
    {
      id: 'node_pca',
      topicId: 'topic_pca',
      title: 'Principal Component Analysis (PCA)',
      level: 2,
      category: 'Linear',
      description: 'Orthogonal variance maximization, sample covariance eigensystem, and data centering.',
      prerequisites: ['node_least_squares'],
      sources: [
        { title: 'Machine Learning Unit IV.pdf', location: 'Page 12', type: 'pdf' },
        { title: 'ML Unit IV.pptx', location: 'Slide 14', type: 'ppt' },
        { title: 'Lecture 4.mp4', location: '08:15', type: 'video' }
      ],
      recentQuestions: [
        'Why subtract feature mean vector before PCA?',
        'How do right singular vectors of SVD relate to principal components?'
      ],
      actionRecommendation: 'Mastery is strong (86%). Test advanced eigenvalue bounds.',
      visualId: 'vis_pca_projection'
    },
    {
      id: 'node_lda',
      topicId: 'topic_lda',
      title: 'Linear Discriminant Analysis (LDA)',
      level: 3,
      category: 'Supervised',
      description: 'Fisher criterion maximizing between-class scatter S_B relative to within-class scatter S_W.',
      prerequisites: ['node_pca'],
      sources: [
        { title: 'Machine Learning Unit IV.pdf', location: 'Page 18', type: 'pdf' },
        { title: 'ML Unit IV.pptx', location: 'Slide 21', type: 'ppt' }
      ],
      recentQuestions: [
        'What is the upper bound rank of between-class scatter matrix S_B?',
        'How does LDA utilize class categorical labels?'
      ],
      actionRecommendation: 'Practice 3 questions on Fisher scatter matrices.',
      visualId: 'vis_lda_scatter'
    },
    {
      id: 'node_isomap',
      topicId: 'topic_isomap',
      title: 'Isometric Feature Mapping (Isomap)',
      level: 4,
      category: 'Nonlinear',
      description: 'Nonlinear manifold learning, k-NN graph, geodesic shortest paths, and Classical MDS.',
      prerequisites: ['node_pca'],
      sources: [
        { title: 'Machine Learning Unit IV.pdf', location: 'Page 25', type: 'pdf' },
        { title: 'Lecture 4.mp4', location: '18:42', type: 'video' }
      ],
      recentQuestions: [
        'Why does Euclidean distance short-circuit on Swiss Roll?',
        'Which algorithm computes all-pairs geodesic paths?'
      ],
      actionRecommendation: 'Inspect Page 25 diagram & watch Lecture 4 at 18:42 on short-circuiting.',
      visualId: 'vis_isomap_geodesic'
    },
    {
      id: 'node_ga',
      topicId: 'topic_genetic_algorithms',
      title: 'Genetic Algorithms (GAs)',
      level: 5,
      category: 'Search Heuristics',
      description: 'Stochastic optimization: chromosome representation, fitness evaluation, crossover exploitation, and mutation exploration.',
      prerequisites: ['node_isomap'],
      sources: [
        { title: 'Machine Learning Unit IV.pdf', location: 'Page 31', type: 'pdf' },
        { title: 'ML Unit IV.pptx', location: 'Slide 29', type: 'ppt' },
        { title: 'Lecture 4.mp4', location: '31:05', type: 'video' }
      ],
      recentQuestions: [
        'What distinguishes crossover exploitation from mutation diversity?',
        'What causes premature convergence in genetic search?'
      ],
      actionRecommendation: 'Urgent: Clear misconception confusing mutation with crossover (37% mastery).',
      visualId: 'vis_ga_operators'
    }
  ];

  const [selectedNode, setSelectedNode] = useState<MapNode>(NODES[3]); // Default to Isomap or GA

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Course Prerequisite Knowledge Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Topological sequencing of topics with real-time mastery color-coding and evidence citations.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Mastered (&ge; 75%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-300">Developing (50-74%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-300">Needs Attention (&lt; 50%)</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Topological Map on Left, Node Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full max-w-lg space-y-4 py-2">
            {NODES.map((node, index) => {
              const mastery = learnerProfile.topicMasteries[node.topicId]?.score ?? 0.5;
              const pct = Math.round(mastery * 100);
              const isSelected = selectedNode.id === node.id;
              const isWeak = mastery < 0.60;

              return (
                <React.Fragment key={node.id}>
                  {/* Node card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-850 border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isWeak && (
                      <div className="absolute -top-2.5 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Weak Topic</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                          pct >= 75 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' :
                          pct >= 50 ? 'bg-amber-500 shadow-sm shadow-amber-500/50' :
                          'bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse'
                        }`} />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Level {node.level} &bull; {node.category}
                          </span>
                          <h3 className="text-sm font-bold text-white">
                            {node.title}
                          </h3>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-base font-bold font-mono ${
                          pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {pct}%
                        </span>
                        <span className="block text-[10px] text-slate-500">Mastery</span>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                      {node.description}
                    </p>
                  </div>

                  {/* Flow Arrow */}
                  {index < NODES.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-slate-700" />
                        <ArrowDown className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Node Detail Inspector Drawer (5 cols) (Requirement 20) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Selected Node Header */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  Topic Inspector
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Level {selectedNode.level} &bull; {selectedNode.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Current Mastery Metric */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Demonstrated Mastery</span>
                <p className="text-xl font-bold text-white mt-0.5">
                  {Math.round((learnerProfile.topicMasteries[selectedNode.topicId]?.score ?? 0.5) * 100)}%
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Questions Attempted</span>
                <p className="text-xl font-bold text-indigo-400 mt-0.5">
                  {learnerProfile.topicMasteries[selectedNode.topicId]?.attemptsCount ?? 0}
                </p>
              </div>
            </div>

            {/* Exact Sources & Provenance (Requirement 20) */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Primary Grounded Sources:
              </span>
              <div className="space-y-1.5">
                {selectedNode.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-200 font-medium">{src.title}</span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="font-mono text-slate-400">{src.location}</span>
                    </div>
                    <button
                      onClick={() => onOpenSourceModal({
                        sourceType: src.type,
                        fileName: src.title,
                        page: src.location.startsWith('Page') ? parseInt(src.location.replace('Page ', '')) : undefined,
                        slide: src.location.startsWith('Slide') ? parseInt(src.location.replace('Slide ', '')) : undefined,
                        timestamp: src.location.includes(':') ? src.location : undefined,
                      }, selectedNode.visualId)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Required Prerequisites:
              </span>
              {selectedNode.prerequisites.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.prerequisites.map(prereqId => {
                    const prereqNode = NODES.find(n => n.id === prereqId);
                    return (
                      <span
                        key={prereqId}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700 font-medium"
                      >
                        {prereqNode?.title || prereqId}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">None (Foundational Entry Point)</span>
              )}
            </div>

            {/* Recent Questions Tested */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Sample Verified Questions:
              </span>
              <div className="space-y-1 text-xs text-slate-300">
                {selectedNode.recentQuestions.map((q, i) => (
                  <p key={i} className="p-2 bg-slate-950/40 rounded border border-slate-800/80">
                    &bull; {q}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Action recommendation */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200">
              <span className="font-semibold block mb-0.5">Recommended Next Action:</span>
              {selectedNode.actionRecommendation}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAskTutorPrompt(`Explain ${selectedNode.title} in detail with sources.`)}
                className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ask AI Tutor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onLaunchAssessment(selectedNode.topicId)}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Topic</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
