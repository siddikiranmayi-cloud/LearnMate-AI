import { RegistryTestCase } from '../types/evaluation';

export const INITIAL_REGISTRY_TEST_CASES: RegistryTestCase[] = [
  // 1. Supported questions with correct source citations
  {
    id: 'reg_supported_1',
    name: 'Isomap Swiss Roll Geodesic Distance Proof',
    category: 'supported_citation',
    description: 'Verifies in-curriculum question returns exact source citations and correctly maps to Machine Learning Unit IV.pdf Page 25.',
    inputPayload: 'How does Isomap approximate geodesic distance on the Swiss Roll manifold?',
    expectedBehavior: 'Returns Grounding = SOURCE_BACKED, >=1 verified citation from Machine Learning Unit IV.pdf page 25.',
    relevantSource: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25,
      section: 'Section 4.5: Isometric Feature Mapping'
    },
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_supported_2',
    name: 'PCA Covariance Eigenvector Variance Maximization',
    category: 'supported_citation',
    description: 'Verifies question on PCA mathematical objective matches Unit IV textbook derivation on Page 12.',
    inputPayload: 'What is the objective function optimized by Principal Component Analysis?',
    expectedBehavior: 'Returns Grounding = SOURCE_BACKED with citation from Machine Learning Unit IV.pdf page 12.',
    relevantSource: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 12,
      section: 'Section 4.1: Principal Component Analysis'
    },
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // 2. Questions that paraphrase concepts from the uploaded materials
  {
    id: 'reg_paraphrase_1',
    name: 'Paraphrase: Dimensionality Reduction for Curved Surface',
    category: 'paraphrase_concept',
    description: 'Paraphrases nonlinear manifold unfolding without using the keyword "Isomap" or "Swiss Roll".',
    inputPayload: 'What mathematical approach should be used to flatten a curved non-linear dataset without short-cutting through empty space?',
    expectedBehavior: 'Successfully resolves to Isomap geodesic shortest-path manifold concept with score >= 2.0 and cites Unit IV material.',
    relevantSource: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25,
      section: 'Section 4.5: Isometric Feature Mapping'
    },
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_paraphrase_2',
    name: 'Paraphrase: Fisher Supervised Separability',
    category: 'paraphrase_concept',
    description: 'Paraphrases between-class vs within-class scatter without naming "Fisher" explicitly.',
    inputPayload: 'How do we project labeled samples such that classes remain maximally compact internally while spreading far apart from each other?',
    expectedBehavior: 'Correctly matches LDA scatter matrices S_B and S_W on Page 18 / Slide 21.',
    relevantSource: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 18,
      section: 'Section 4.3: Linear Discriminant Analysis'
    },
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // 3. Unsupported or out-of-syllabus questions
  {
    id: 'reg_unsupported_1',
    name: 'Quantum Shor Algorithm Factorization (Out of Syllabus)',
    category: 'unsupported_out_of_syllabus',
    description: 'Inquires about quantum computing algorithms absent from the CS420 syllabus.',
    inputPayload: 'Explain how Shor algorithm uses quantum Fourier transform to achieve polynomial time prime factorization.',
    expectedBehavior: 'Strict refusal triggered (Status = NOT_COVERED). 0 fake citations hallucinated.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_unsupported_2',
    name: 'Transformer Multi-Head Attention (Out of Syllabus)',
    category: 'unsupported_out_of_syllabus',
    description: 'Inquires about NLP transformer architecture not present in CS420 Dimensionality Reduction & Search.',
    inputPayload: 'Explain the scaled dot-product attention formula in Transformer encoder blocks.',
    expectedBehavior: 'Status = NOT_COVERED. Transparent refusal without fabricated course references.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // 4. Questions containing fabricated or adversarial citation references
  {
    id: 'reg_fabricated_1',
    name: 'Adversarial Citation Trap: Fake Shor Algorithm Citation',
    category: 'fabricated_citation',
    description: 'User attempts to trick the engine by explicitly claiming a concept is on Page 12 of Unit IV.',
    inputPayload: 'As discussed in Section 4.1 on page 12 of Unit IV, what is the quantum Shor algorithm formula?',
    expectedBehavior: 'Knowledge base refuses to corroborate fabricated claim. Zero hallucinated citations returned.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_fabricated_2',
    name: 'Invalid Page Number Verification',
    category: 'fabricated_citation',
    description: 'Tests citation verifier against a non-existent page number 999 in Unit IV PDF.',
    inputPayload: '{"fileName": "Machine Learning Unit IV.pdf", "page": 999, "sourceType": "pdf"}',
    expectedBehavior: 'Citation verifier flags citation as UNVERIFIABLE / OUT_OF_BOUNDS (Page 999 > Max Page 36).',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // 5. Questions requiring a specific PDF page, presentation slide, or video timestamp
  {
    id: 'reg_specific_1',
    name: 'Video Timestamp Verification: Lecture 4 @ 08:15',
    category: 'specific_provenance',
    description: 'Requires identifying the exact video timestamp where mean centering pitfall is demonstrated.',
    inputPayload: 'Why is mean centering required before PCA according to Lecture 4 video?',
    expectedBehavior: 'Verified citation pointing specifically to Lecture 4.mp4 at timestamp 08:15.',
    relevantSource: {
      sourceType: 'video',
      fileName: 'Lecture 4.mp4',
      timestamp: '08:15',
      section: 'Lecture 4: 08:15 - Centering Data and Pitfalls'
    },
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_specific_2',
    name: 'Slide Provenance Verification: Slide 29 Crossover Mechanics',
    category: 'specific_provenance',
    description: 'Requires slide provenance for genetic algorithm single-point crossover diagram.',
    inputPayload: 'Where in the slide deck is the single-point crossover operator illustrated?',
    expectedBehavior: 'Verified citation pointing to ML Unit IV.pptx at Slide 29.',
    relevantSource: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 29,
      section: 'Slide 29: Genetic Operators - Crossover & Mutation'
    },
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // 6. Quiz answer-key correctness
  {
    id: 'reg_quiz_1',
    name: 'Answer Key Gate: Valid Assessment Question q_isomap_01',
    category: 'quiz_answer_key',
    description: 'Validates that a correctly formed question with answer present in options and source backing passes verification.',
    inputPayload: 'q_isomap_01',
    expectedBehavior: 'Verification passes with answerKeyVerified = true, answerableFromSource = true.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_quiz_2',
    name: 'Answer Key Gate: Flawed Question with Missing Option',
    category: 'quiz_answer_key',
    description: 'Candidate question lists correct answer as "Option Z", but options only contain A and B.',
    inputPayload: 'bad_question_test',
    expectedBehavior: 'Verification gate REJECTS question. answerKeyVerified = false.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // 7. Duplicate-question detection
  {
    id: 'reg_dup_1',
    name: 'Near-Duplicate Question Rejection (Similarity >= 0.70)',
    category: 'duplicate_detection',
    description: 'Tests duplicate suppression against an existing question in the bank.',
    inputPayload: 'In the Isomap algorithm, how is the geodesic distance between data points approximated?',
    expectedBehavior: 'Deduplication gate detects similarity >= 0.70 and rejects question (noveltyConfirmed = false).',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_dup_2',
    name: 'Novel Candidate Question Acceptance (Similarity < 0.70)',
    category: 'duplicate_detection',
    description: 'Tests genuinely novel question on a different aspect of genetic algorithms.',
    inputPayload: 'What termination condition is standard when fitness values plateau across consecutive generations?',
    expectedBehavior: 'Novelty check passes (similarityScore < 0.70, noveltyConfirmed = true).',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // 8. Topic-specific mastery updates
  {
    id: 'reg_bkt_1',
    name: 'BKT Regression Test: Prior=0.92, Incorrect Response',
    category: 'topic_mastery_bkt',
    description: 'Tests Corbett & Anderson update: Prior=0.92, pS=0.10, pG=0.20, pT=0.14 with incorrect response.',
    inputPayload: '{"prior": 0.92, "pS": 0.10, "pG": 0.20, "pT": 0.14, "obs": "INCORRECT", "topic": "topic_genetic_algorithms"}',
    expectedBehavior: 'Posterior ≈ 0.5897, Transition ≈ 0.6471 (~65%). Updates strictly Genetic Algorithms mastery.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_bkt_correct',
    name: 'BKT Positive Test: Prior=0.37, Correct Response',
    category: 'topic_mastery_bkt',
    description: 'Tests Corbett & Anderson update for a correct response: Prior=0.37, pS=0.10, pG=0.20, pT=0.14.',
    inputPayload: '{"prior": 0.37, "pS": 0.10, "pG": 0.20, "pT": 0.14, "obs": "CORRECT", "topic": "topic_genetic_algorithms"}',
    expectedBehavior: 'Posterior increases from 0.37 to ~0.7255, Post-Transition ≈ 0.7639 (~76%). Mastery increases monotonically.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_bkt_2',
    name: 'BKT Topic Isolation: GA attempt preserves Isomap & PCA',
    category: 'topic_mastery_bkt',
    description: 'Verifies updating Genetic Algorithms mastery does not alter Isomap or PCA scores in learner profile.',
    inputPayload: '{"priorGA": 0.37, "priorIsomap": 0.48, "priorPCA": 0.86, "targetTopic": "topic_genetic_algorithms"}',
    expectedBehavior: 'Genetic Algorithms updates from 0.37. Isomap strictly preserved at 0.48, PCA preserved at 0.86.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'reg_persistence_1',
    name: 'Storage Persistence After Refresh Verification',
    category: 'topic_mastery_bkt',
    description: 'Verifies updated topic mastery, question history, and test registry persist in localStorage and survive simulated refresh.',
    inputPayload: '{"testPersistence": true, "key": "learnmate_learner_v2"}',
    expectedBehavior: 'Storage reads back persisted learner mastery, question history, and registry items identical to written state.',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },

  // =========================================================================
  // AUTOMATED REGRESSION SUITE: TESTS A THROUGH J (Final Quality Audit)
  // =========================================================================
  {
    id: 'reg_test_a_pdf',
    name: 'Test A: Valid PDF Citation & Page Verification',
    category: 'supported_citation',
    description: 'Retrieves an existing Isomap passage. Confirms source and page exist (Page 25). Confirms citation viewer displays corresponding indexed evidence.',
    inputPayload: 'How does Isomap approximate geodesic distance on the Swiss Roll manifold?',
    expectedBehavior: 'Returns SOURCE_BACKED, targets Machine Learning Unit IV.pdf Page 25, evidence excerpt nonempty.',
    relevantSource: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25,
      section: 'Section 4.5: Isometric Feature Mapping (Isomap)'
    },
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_b_invalid_page',
    name: 'Test B: Incorrect / Out-of-Bounds Page Rejection',
    category: 'fabricated_citation',
    description: 'Supplies an invalid page reference (Page 999 > Document Max 36). Confirms citation verifier rejects reference without substituting an unrelated page.',
    inputPayload: '{"fileName": "Machine Learning Unit IV.pdf", "page": 999, "sourceType": "pdf"}',
    expectedBehavior: 'Citation verifier flags citation as OUT_OF_BOUNDS_PAGE (Page 999 > Max Page 36). Zero silent substitution.',
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_c_unsupported_claim',
    name: 'Test C: Unsupported Claim Refusal',
    category: 'unsupported_out_of_syllabus',
    description: 'Requests an out-of-syllabus claim (Shor quantum algorithm). Confirms strict-source mode refuses to present it as verified course knowledge.',
    inputPayload: 'Explain how Shor algorithm uses quantum Fourier transform to achieve polynomial time prime factorization in CS420.',
    expectedBehavior: 'Grounding = NOT_COVERED. Refusal triggered with 0 fabricated course citations.',
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_d_missing_video',
    name: 'Test D: Missing Video Media Handling',
    category: 'specific_provenance',
    description: 'Simulates unavailable original MP4 media. Confirms no playback is claimed and displays "Transcript reference available; original video unavailable".',
    inputPayload: '{"checkMediaAvailability": true, "fileName": "Lecture 4.mp4", "sourceType": "video", "timestamp": "18:42"}',
    expectedBehavior: 'Status reports original video unavailable; no playback attempted; transcript indexed confirmed.',
    relevantSource: {
      sourceType: 'video',
      fileName: 'Lecture 4.mp4',
      timestamp: '18:42'
    },
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_e_missing_transcript',
    name: 'Test E: Missing Transcript Handling',
    category: 'specific_provenance',
    description: 'Checks behavior when referencing unindexed lecture timestamps or missing transcripts. Confirms application reports transcript unavailable instead of fabricating excerpts.',
    inputPayload: '{"checkTranscriptExists": true, "fileName": "Lecture 99.mp4", "timestamp": "99:99"}',
    expectedBehavior: 'Correctly identifies that transcript is unavailable; zero fabricated verbatim excerpt.',
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_f_transcript_provenance',
    name: 'Test F: Transcript Provenance Verification',
    category: 'specific_provenance',
    description: 'Checks transcript provenance flag. Confirms that unless acoustic extraction was tested, status reflects "Transcript provenance unverified".',
    inputPayload: '{"checkTranscriptProvenance": true, "fileName": "Lecture 4.mp4", "timestamp": "08:15"}',
    expectedBehavior: 'Honest label: Transcript provenance unverified (never falsely claimed as acoustic audio-verified).',
    relevantSource: {
      sourceType: 'video',
      fileName: 'Lecture 4.mp4',
      timestamp: '08:15'
    },
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_g_diagram_verification',
    name: 'Test G: Physical Visual Inspection on Page',
    category: 'specific_provenance',
    description: 'Tests diagram verification on Page 25 (real diagram present) vs text-only Page 8. Confirms visual availability is reported honestly without fabrication.',
    inputPayload: '{"checkDiagramVerification": true, "pageValid": 25, "pageTextOnly": 8}',
    expectedBehavior: 'Page 25 verified with actual diagram; Page 8 recognized as text/equations without fabricated diagram.',
    relevantSource: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25
    },
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_h_claim_grounding',
    name: 'Test H: Claim-Level Grounding & Separate Citations',
    category: 'supported_citation',
    description: 'Asks a multi-aspect question spanning Isomap algorithm (Page 25) and short-circuiting pitfall (Lecture 4 18:42). Confirms answer breaks into claims with separate citations.',
    inputPayload: 'Explain the three steps of Isomap and its major pitfall.',
    expectedBehavior: 'Answer generates separate claim-level citations: Step 1-3 mapped to Page 25, pitfall mapped to Lecture 4 @ 18:42.',
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_i_hash_handling',
    name: 'Test I: Content Fingerprint & Hash Distinction',
    category: 'supported_citation',
    description: 'Tests hash handling: confirms fingerprint identifies extracted derivative passage, and does not conflate hash match with semantic truth proof.',
    inputPayload: '{"checkHashHandling": true, "chunkId": "chunk_isomap_1"}',
    expectedBehavior: 'Verified: Content fingerprint computed from extracted derivative text; hash distinction clearly labeled.',
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_j_navigation',
    name: 'Test J: UI Workflow & Navigation Regression',
    category: 'topic_mastery_bkt',
    description: 'Verifies core app state transitions across Tutor, Quiz, Judge Mode, Citation Viewer, and Post-assessment report.',
    inputPayload: '{"testNavigation": true, "components": ["Tutor", "Quiz", "Judge", "SourceModal"]}',
    expectedBehavior: 'All core view states and props instantiate cleanly without missing handlers.',
    createdAt: '2026-10-11T00:00:00Z',
    updatedAt: '2026-10-11T00:00:00Z'
  },
  {
    id: 'reg_test_k_answer_grading',
    name: 'Test K: Technical Synonym & Numerical Answer Grading',
    category: 'quiz_answer_key',
    description: 'Verifies that answer evaluator accurately recognizes technical synonyms (accepts "Classical MDS" for Multidimensional Scaling) and evaluates numerical bounds.',
    inputPayload: '{"checkAnswerGrading": true, "synonymProbe": "Classical MDS"}',
    expectedBehavior: 'Answer grading accepts valid technical synonyms and grades numerical answers within mathematical tolerance.',
    createdAt: '2026-10-11T12:00:00Z',
    updatedAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'reg_test_l_adaptive_selection',
    name: 'Test L: Adaptive Question Selection from Measured Weakness',
    category: 'topic_mastery_bkt',
    description: 'Verifies adaptive assessment generation selects questions tailored to measured weak topics and calibrates target difficulty accordingly.',
    inputPayload: '{"checkAdaptiveSelection": true, "weakTopic": "topic_genetic_algorithms", "priorScore": 0.35}',
    expectedBehavior: 'Builds 3-question diagnostic prioritizing weak topic (Genetic Algorithms) with calibrated difficulty EASY.',
    createdAt: '2026-10-11T12:00:00Z',
    updatedAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'reg_test_m_supplementary_videos',
    name: 'Test M: Supplementary Video Integration & Status Truthfulness',
    category: 'supported_citation',
    description: 'Verifies Video A (Ali Ghodsi) and Video B (Stefan Harmeling) are linked as external educational resources, URLs match, and neither is falsely relabeled as Lecture 4.mp4.',
    inputPayload: '{"checkSupplementaryVideos": true}',
    expectedBehavior: 'Verified: External video links preserved with truthful unindexed status; never relabeled as course lecture recordings.',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  }
];
