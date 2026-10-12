import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  Database, 
  ExternalLink, 
  HelpCircle,
  RotateCcw,
  Info,
  Clock,
  Sparkles,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { 
  RegistryTestCase, 
  RegistryTestCategory, 
  HonestMetricsSummary 
} from '../../types/evaluation';
import { SourceProvenance } from '../../types/course';
import { StorageService } from '../../services/storageService';
import { 
  INITIAL_REGISTRY_TEST_CASES 
} from '../../data/initialTestRegistry';
import { 
  executeRegistryTest, 
  calculateHonestMetrics, 
  verifyCitationAgainstIndexedSources 
} from '../../services/testRegistryEngine';
import { EditTestCaseModal } from './EditTestCaseModal';
import { BENCHMARK_TEST_SUITE, SIMULATED_STUDENTS_DATA, SYSTEM_METRICS } from '../../data/evaluationBenchmarks';

interface EvaluationCenterViewProps {
  onAskTutorPrompt: (prompt: string) => void;
  onOpenSourceModal?: (source: SourceProvenance, visualId?: string) => void;
}

export const EvaluationCenterView: React.FC<EvaluationCenterViewProps> = ({
  onAskTutorPrompt,
  onOpenSourceModal
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'honest_metrics' | 'grounding_metrics' | 'students'>('registry');

  // Test Case Registry State
  const [testCases, setTestCases] = useState<RegistryTestCase[]>(() => {
    const loaded = StorageService.loadTestRegistry();
    if (loaded && Array.isArray(loaded) && loaded.length > 0) {
      const existingIds = new Set(loaded.map((t: any) => t.id));
      const missing = INITIAL_REGISTRY_TEST_CASES.filter(t => !existingIds.has(t.id));
      return missing.length > 0 ? [...loaded, ...missing] : loaded;
    }
    return INITIAL_REGISTRY_TEST_CASES;
  });

  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State for creating / editing test cases
  const [editingTestCase, setEditingTestCase] = useState<RegistryTestCase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selected Student for Longitudinal Tab
  const [selectedStudentId, setSelectedStudentId] = useState<'student_a' | 'student_b' | 'student_c'>('student_c');

  // Honest metrics recalculated directly from executed test cases
  const honestMetrics: HonestMetricsSummary = calculateHonestMetrics(testCases);

  // Synchronize to StorageService whenever testCases change
  useEffect(() => {
    StorageService.saveTestRegistry(testCases);
  }, [testCases]);

  // Execute a single test case
  const handleRunSingleTest = async (testCaseId: string) => {
    setRunningTestId(testCaseId);
    const target = testCases.find(t => t.id === testCaseId);
    if (!target) {
      setRunningTestId(null);
      return;
    }

    try {
      const result = await executeRegistryTest(target);
      setTestCases(prev => prev.map(t => t.id === testCaseId ? {
        ...t,
        lastResult: result,
        updatedAt: new Date().toISOString()
      } : t));
    } catch (e) {
      console.error('Test run failed', e);
    } finally {
      setRunningTestId(null);
    }
  };

  // Run all filtered or all registry test cases
  const handleRunAllTests = async () => {
    setIsRunningAll(true);
    const toRun = testCases.filter(t => categoryFilter === 'all' || t.category === categoryFilter);

    for (const testCase of toRun) {
      setRunningTestId(testCase.id);
      try {
        const result = await executeRegistryTest(testCase);
        setTestCases(prev => prev.map(t => t.id === testCase.id ? {
          ...t,
          lastResult: result,
          updatedAt: new Date().toISOString()
        } : t));
      } catch (err) {
        console.error('Error executing test', testCase.id, err);
      }
      // Small tick for realistic visual feedback
      await new Promise(r => setTimeout(r, 120));
    }

    setRunningTestId(null);
    setIsRunningAll(false);
  };

  // Reset to initial baseline test cases
  const handleResetToBaseline = () => {
    if (window.confirm('Reset test case registry back to default Hackathon Track D baseline test cases?')) {
      setTestCases(INITIAL_REGISTRY_TEST_CASES);
      StorageService.saveTestRegistry(INITIAL_REGISTRY_TEST_CASES);
    }
  };

  // Delete a test case
  const handleDeleteTestCase = (id: string) => {
    setTestCases(prev => prev.filter(t => t.id !== id));
  };

  // Save (create or update) test case from modal
  const handleSaveTestCase = (savedCase: RegistryTestCase) => {
    setTestCases(prev => {
      const idx = prev.findIndex(t => t.id === savedCase.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedCase;
        return updated;
      }
      return [savedCase, ...prev];
    });
  };

  // Open modal to create new test
  const handleOpenCreateModal = () => {
    setEditingTestCase(null);
    setIsModalOpen(true);
  };

  // Open modal to edit existing test
  const handleOpenEditModal = (testCase: RegistryTestCase) => {
    setEditingTestCase(testCase);
    setIsModalOpen(true);
  };

  // Filter test cases
  const filteredTestCases = testCases.filter(t => {
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.inputPayload.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const executedCount = testCases.filter(t => t.lastResult !== undefined).length;
  const passedCount = testCases.filter(t => t.lastResult?.passed).length;
  const failedCount = testCases.filter(t => t.lastResult !== undefined && !t.lastResult.passed).length;

  const selectedStudent = SIMULATED_STUDENTS_DATA.find(s => s.studentId === selectedStudentId) || SIMULATED_STUDENTS_DATA[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Test Case Registry & Honest Evaluation Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal AI Hackathon Track D: Manually inspect, create, edit, run, and review reproducible test cases.
            All metrics calculated honest-to-execution with zero fabricated benchmark scores.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'registry' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Test Case Registry ({testCases.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('honest_metrics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'honest_metrics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Honest Evaluation Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('grounding_metrics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'grounding_metrics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Benchmarks</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'students' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Longitudinal BKT</span>
          </button>
        </div>
      </div>

      {/* Storage Persistence & Scope Banner (Requirement 4) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Storage Scope: <strong className="text-slate-200">Local Browser Storage (localStorage)</strong>.
            All test edits, manual additions, and execution outcomes persist across refreshes.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-400">
            Executed: <span className="text-white font-bold">{executedCount}</span> / {testCases.length}
            {executedCount > 0 && ` (${passedCount} passed, ${failedCount} failed)`}
          </span>
          <button
            onClick={handleResetToBaseline}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline flex items-center gap-1"
            title="Reset test registry back to 16 default Hackathon Track D test cases"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: TEST CASE REGISTRY (Requirement 1, 3, 4, 5, 6) */}
      {/* ============================================================ */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Category Filter, Create Button, Run All */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search test name, query, or prompt..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All 8 Hackathon Categories ({testCases.length})</option>
                  <option value="supported_citation">1. Supported Questions</option>
                  <option value="paraphrase_concept">2. Paraphrased Concepts</option>
                  <option value="unsupported_out_of_syllabus">3. Unsupported / Out-of-Syllabus</option>
                  <option value="fabricated_citation">4. Fabricated Citation Check</option>
                  <option value="specific_provenance">5. Specific Page / Slide / Timestamp</option>
                  <option value="quiz_answer_key">6. Quiz Answer-Key Correctness</option>
                  <option value="duplicate_detection">7. Duplicate-Question Detection</option>
                  <option value="topic_mastery_bkt">8. Topic-Specific BKT Updates</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreateModal}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test Case</span>
              </button>

              <button
                onClick={handleRunAllTests}
                disabled={isRunningAll}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                {isRunningAll ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Tests...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run All Tests ({filteredTestCases.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Cases Table / Cards */}
          <div className="space-y-3">
            {filteredTestCases.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No test cases match your search criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the filter or add a new test case.</p>
              </div>
            ) : (
              filteredTestCases.map((tc) => {
                const isRunning = runningTestId === tc.id;
                const res = tc.lastResult;
                const hasRun = res !== undefined;

                // Validate source provenance bounds if a source is attached
                const sourceVerification = tc.relevantSource 
                  ? verifyCitationAgainstIndexedSources(tc.relevantSource)
                  : null;

                return (
                  <div
                    key={tc.id}
                    className={`bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-3 transition-colors ${
                      hasRun
                        ? res.passed
                          ? 'border-emerald-800/60 bg-slate-900'
                          : 'border-rose-800/70 bg-rose-950/10'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Top Row: Category, Name, Status Badge, Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/70">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border font-mono ${
                          tc.category === 'supported_citation' ? 'bg-blue-950/80 text-blue-300 border-blue-800/50' :
                          tc.category === 'paraphrase_concept' ? 'bg-purple-950/80 text-purple-300 border-purple-800/50' :
                          tc.category === 'unsupported_out_of_syllabus' ? 'bg-amber-950/80 text-amber-300 border-amber-800/50' :
                          tc.category === 'fabricated_citation' ? 'bg-rose-950/80 text-rose-300 border-rose-800/50' :
                          tc.category === 'specific_provenance' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50' :
                          tc.category === 'quiz_answer_key' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' :
                          tc.category === 'duplicate_detection' ? 'bg-orange-950/80 text-orange-300 border-orange-800/50' :
                          'bg-indigo-950/80 text-indigo-300 border-indigo-800/50'
                        }`}>
                          {tc.category.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {tc.name}
                          {tc.isCustom && (
                            <span className="text-[10px] font-normal px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">
                              User Created
                            </span>
                          )}
                        </h3>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status badge */}
                        {isRunning ? (
                          <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Running...</span>
                          </span>
                        ) : hasRun ? (
                          res.passed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>PASSED ({res.executionTimeMs}ms)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>FAILED ({res.executionTimeMs}ms)</span>
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">Not executed yet</span>
                        )}

                        {/* Run single button */}
                        <button
                          onClick={() => handleRunSingleTest(tc.id)}
                          disabled={isRunning || isRunningAll}
                          className="p-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="Run this test case"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit button */}
                        <button
                          onClick={() => handleOpenEditModal(tc)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Edit test case"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button (for custom or allowed) */}
                        <button
                          onClick={() => handleDeleteTestCase(tc.id)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded-lg transition-colors"
                          title="Delete test case"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Content: Input, Description, Expected */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
                          Test Input Payload:
                        </span>
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-300 break-words">
                          {tc.inputPayload}
                        </div>
                        {tc.description && (
                          <p className="text-slate-400 text-[11px] italic">
                            Objective: {tc.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
                          Expected Behavior:
                        </span>
                        <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-slate-300">
                          {tc.expectedBehavior}
                        </div>

                        {/* Attached Source Provenance & Inspection Button */}
                        {tc.relevantSource && (
                          <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-800/80 text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span className="text-slate-400">Target Source:</span>
                              <strong className="text-indigo-300 font-mono">
                                {tc.relevantSource.fileName}
                              </strong>
                              <span className="text-slate-400">
                                {tc.relevantSource.page ? `(Page ${tc.relevantSource.page})` :
                                 tc.relevantSource.slide ? `(Slide ${tc.relevantSource.slide})` :
                                 tc.relevantSource.timestamp ? `(@${tc.relevantSource.timestamp})` : ''}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Source Verification Tag */}
                              {sourceVerification && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                  sourceVerification.isValid 
                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50' 
                                    : 'bg-rose-950/40 text-rose-400 border-rose-800/50'
                                }`}>
                                  {sourceVerification.isValid ? 'Grounding Indexed' : 'Invalid Provenance'}
                                </span>
                              )}

                              {onOpenSourceModal && (
                                <button
                                  type="button"
                                  onClick={() => onOpenSourceModal(tc.relevantSource!)}
                                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline flex items-center gap-0.5"
                                >
                                  <span>Open Source</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Result Log (When executed) */}
                    {hasRun && (
                      <div className="mt-2 pt-2 border-t border-slate-800/60 text-xs space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
                          <div>
                            <span className="font-semibold text-slate-400">Actual Output:</span>{' '}
                            <span className="font-mono text-slate-200">{res.actualOutput}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Executed: {new Date(res.executionTimestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        {res.log && (
                          <div className="text-[11px] font-mono text-indigo-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                            {res.log}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: HONEST EVALUATION METRICS DASHBOARD (Requirement 2) */}
      {/* ============================================================ */}
      {activeTab === 'honest_metrics' && (
        <div className="space-y-6">
          {/* Executive Overview Notice */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Honest Evaluation Metrics & Strict Empirical Accounting
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In adherence to Hackathon Track D rules, every metric below is derived exclusively from executed test cases in the registry.
              Numerators and denominators are displayed explicitly. If a metric has no executed test cases or sample size is zero,
              it is strictly marked as <strong className="text-amber-300">&ldquo;Not enough data&rdquo;</strong> rather than displaying an unverified benchmark score.
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Overall Pass Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Overall Test Pass Rate</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    All Categories
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  {honestMetrics.overallPassRate.status === 'sufficient' ? (
                    <>
                      <span className="text-3xl font-extrabold text-white">
                        {honestMetrics.overallPassRate.percentage}%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({honestMetrics.overallPassRate.passed} / {honestMetrics.overallPassRate.total})
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
                      Not enough data ({honestMetrics.overallPassRate.total} runs)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Numerator:</strong> Successfully passed test runs ({honestMetrics.overallPassRate.passed})</p>
                <p><strong>Denominator:</strong> Total executed test runs ({honestMetrics.overallPassRate.total})</p>
              </div>
            </div>

            {/* 2. Citation Correctness Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Citation Correctness Rate</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Grounding Provenance
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  {honestMetrics.citationCorrectnessRate.status === 'sufficient' ? (
                    <>
                      <span className="text-3xl font-extrabold text-emerald-400">
                        {honestMetrics.citationCorrectnessRate.percentage}%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({honestMetrics.citationCorrectnessRate.correct} / {honestMetrics.citationCorrectnessRate.total})
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
                      Not enough data ({honestMetrics.citationCorrectnessRate.total} runs)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Numerator:</strong> Citations matching exact indexed file & page/slide/timestamp ({honestMetrics.citationCorrectnessRate.correct})</p>
                <p><strong>Denominator:</strong> Executed citation-based tests ({honestMetrics.citationCorrectnessRate.total})</p>
              </div>
            </div>

            {/* 3. Unsupported Rejection Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Unsupported Question Rejection</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Zero Hallucination
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  {honestMetrics.unsupportedRejectionRate.status === 'sufficient' ? (
                    <>
                      <span className="text-3xl font-extrabold text-indigo-400">
                        {honestMetrics.unsupportedRejectionRate.percentage}%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({honestMetrics.unsupportedRejectionRate.rejected} / {honestMetrics.unsupportedRejectionRate.total})
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
                      Not enough data ({honestMetrics.unsupportedRejectionRate.total} runs)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Numerator:</strong> Successfully refused off-syllabus / fake queries with 0 citations ({honestMetrics.unsupportedRejectionRate.rejected})</p>
                <p><strong>Denominator:</strong> Executed out-of-syllabus and adversarial tests ({honestMetrics.unsupportedRejectionRate.total})</p>
              </div>
            </div>

            {/* 4. Quiz Answer-Key Accuracy */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Quiz Answer-Key Accuracy</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Verification Pipeline
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  {honestMetrics.quizKeyAccuracy.status === 'sufficient' ? (
                    <>
                      <span className="text-3xl font-extrabold text-white">
                        {honestMetrics.quizKeyAccuracy.percentage}%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({honestMetrics.quizKeyAccuracy.verified} / {honestMetrics.quizKeyAccuracy.total})
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
                      Not enough data ({honestMetrics.quizKeyAccuracy.total} runs)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Numerator:</strong> Correctly accepted valid keys & rejected flawed keys ({honestMetrics.quizKeyAccuracy.verified})</p>
                <p><strong>Denominator:</strong> Executed quiz verification tests ({honestMetrics.quizKeyAccuracy.total})</p>
              </div>
            </div>

            {/* 5. Duplicate Detection Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Duplicate Question Detection</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Jaccard &gt;= 70%
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  {honestMetrics.duplicateDetectionRate.status === 'sufficient' ? (
                    <>
                      <span className="text-3xl font-extrabold text-emerald-400">
                        {honestMetrics.duplicateDetectionRate.percentage}%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({honestMetrics.duplicateDetectionRate.caught} / {honestMetrics.duplicateDetectionRate.total})
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
                      Not enough data ({honestMetrics.duplicateDetectionRate.total} runs)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Numerator:</strong> Accurately identified duplicates and novelty candidates ({honestMetrics.duplicateDetectionRate.caught})</p>
                <p><strong>Denominator:</strong> Executed duplicate detection tests ({honestMetrics.duplicateDetectionRate.total})</p>
              </div>
            </div>

            {/* 6. Retrieval Relevance Average */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Average Retrieval Relevance</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Semantic Overlap Score
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  {honestMetrics.retrievalRelevanceAvg.status === 'sufficient' ? (
                    <>
                      <span className="text-3xl font-extrabold text-indigo-400">
                        {honestMetrics.retrievalRelevanceAvg.avgScore}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (Threshold &gt;= 2.0)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
                      Not enough data ({honestMetrics.retrievalRelevanceAvg.count} scored runs)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Numerator:</strong> Cumulative TF-IDF/BM25 overlap score sum ({honestMetrics.retrievalRelevanceAvg.totalScore.toFixed(2)})</p>
                <p><strong>Denominator:</strong> Scored retrieval test cases ({honestMetrics.retrievalRelevanceAvg.count})</p>
              </div>
            </div>
          </div>

          {/* Quick Action Prompt to Run Tests */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              <strong className="text-slate-200">Want to generate fresh empirical metric data?</strong>
              <p className="mt-0.5">Run all test cases in the Registry to evaluate your current indexed materials live.</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('registry');
                handleRunAllTests();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute All Registry Tests</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: CURATED RAG GROUNDING BENCHMARKS (Pre-configured) */}
      {/* ============================================================ */}
      {activeTab === 'grounding_metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SYSTEM_METRICS.map((metric) => (
              <div key={metric.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 truncate max-w-[170px]">
                      {metric.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                      {metric.type}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-white">
                      {metric.value}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Target: {metric.benchmarkTarget}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {metric.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-indigo-300">
                    Formula: {metric.formula}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Denominator: {metric.denominator}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Static Benchmark Suite list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Standard Reference Benchmark Cases (CS420 Ground Truth)
            </h3>
            <div className="space-y-3">
              {BENCHMARK_TEST_SUITE.map(tc => (
                <div key={tc.id} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{tc.name}</span>
                    <span className="font-mono text-slate-400 uppercase text-[10px]">{tc.expectedStatus}</span>
                  </div>
                  <p className="text-slate-400 font-mono">&ldquo;{tc.query}&rdquo;</p>
                  <p className="text-[11px] text-slate-500">{tc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: LONGITUDINAL BKT GAINS (Requirement 4) */}
      {/* ============================================================ */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Student Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Longitudinal Cohort Study:
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {SIMULATED_STUDENTS_DATA.map((student) => (
                  <button
                    key={student.studentId}
                    onClick={() => setSelectedStudentId(student.studentId)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedStudentId === student.studentId
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {student.studentName}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 max-w-md">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{selectedStudent.archetype}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                <span className="font-semibold text-white">Evaluation Takeaway:</span> {selectedStudent.keyTakeaway}
              </p>
            </div>
          </div>

          {/* Session Cards comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedStudent.sessions.map((session) => (
              <div key={session.sessionNumber} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Step {session.sessionNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">{session.date}</h4>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 font-bold">
                    {session.accuracy}% Accuracy
                  </span>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    BKT Topic Mastery Probabilities:
                  </span>
                  {Object.entries(session.topicScores).map(([topic, score]) => (
                    <div key={topic} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{topic}</span>
                        <span className={`font-mono font-bold ${
                          score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {score}% (P(L)={ (score / 100).toFixed(2) })
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Questions Tested:</span>
                    <span className="font-semibold text-slate-200">{session.questionsAttempted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repetition Rate:</span>
                    <span className="font-mono text-emerald-400">{session.repetitionRate}%</span>
                  </div>
                  <div className="mt-2 p-2.5 bg-slate-950/60 rounded-lg text-[11px] text-slate-300 leading-relaxed border border-slate-800">
                    {session.notableGains}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Creating / Editing Test Cases */}
      <EditTestCaseModal
        testCase={editingTestCase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTestCase}
      />
    </div>
  );
};
