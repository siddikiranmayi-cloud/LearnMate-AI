# LearnMate AI — Source-Grounded AI Tutor & Adaptive Assessment Engine
> **Multimodal AI Hackathon 2026 — Track D Submission**
> Demo:https://youtube.com/shorts/z_9HDM20YbI?si=jmplAloKkgnxI1ox
> Course-Grounded Retrieval-Augmented Generation (RAG), Claim-Level Citation Verification, Bayesian Knowledge Tracing (BKT), and Honest Multimodal Provenance.

---

## 1. Project Purpose & Core Features

**LearnMate AI** is an academic AI tutor and adaptive assessment engine that operates on uploaded multimodal course materials (PDF textbooks, PPT lecture slides, and lecture audio transcriptions). It addresses critical failure modes in generative AI for education: hallucinated citations, loose source attribution, fake playback controls, and unprincipled student mastery tracking.

### Core Capabilities:
1. **Source-Grounded AI Tutor**: Answers student questions strictly from course documents. When out-of-curriculum questions arise (e.g., Shor's quantum algorithm or Transformer attention mechanisms), it triggers an explicit refusal (`NOT_COVERED`) or isolates outside knowledge in a clearly demarcated warning card.
2. **Claim-Level Grounded Citations**: Instead of appending a loose bibliography to an answer, explanations are decomposed into verifiable factual claims. Each claim links directly to its supporting excerpt, exact page number, slide index, or audio timestamp.
3. **Honest Multimodal Provenance**:
   - **PDFs**: Links to exact textbook pages (e.g., `Machine Learning Unit IV.pdf`, Page 25 for Isomap; Page 12 for PCA).
   - **PPT Slides**: Identifies slide indices (e.g., Slide 29 for genetic crossover; Slide 21 for LDA bounds) and displays instructor speaker notes.
   - **Lecture Audio & Transcripts**: Distinguishes between transcript indexing, citation verification, media availability, and audio extraction provenance. When original video binaries are not hosted, it honestly states: *"Transcript available; original video unavailable"* and provides verbatim indexed transcript navigation without misleading playback scrubber controls.
   - **Visual Diagrams**: Physically inspects source pages (e.g., Page 25 contains Figure 4.7 Swiss Roll; Page 8 contains only text/derivations) before rendering diagrams. Text-only pages never claim a diagram is present.
4. **Bayesian Knowledge Tracing (BKT)**:
   - Uses the Corbett & Anderson (1995) cognitive modeling framework with prior $P(L)$, learning transition $P(T)$, guessing $P(G)$, and slip $P(S)$.
   - Enforces **strict topic isolation**: attempts on Genetic Algorithms ($0.37$) update only the GA latent knowledge state without corrupting or inheriting mastery from Isomap ($0.48$) or Least Squares ($0.68$).
5. **Adaptive Assessment Engine & Deduplication Gate**:
   - Generates MCQs, short-answer questions, and numerical problems tailored to learner weakness.
   - Rejects candidate questions with similarity $\ge 0.70$ against cross-session question history.
   - 6-point verification gate prevents malformed answer keys from ever reaching students.
6. **Reproducible Test Case Registry & Honest Evaluation Center**:
   - Stores manual and automated test cases with inputs, expected behavior, actual output, timestamps, and pass/fail status.
   - Computes metrics strictly from executed test runs with real numerators and denominators (no hardcoded benchmark cards).

---

## 2. Ingestion & Retrieval Architecture

- **Document Parsing (`src/services/documentParser.ts`)**:
  - Ingests PDFs, slide decks, and transcripts with extracted derivative hashing.
  - Computes content fingerprints (`sha256:...`) and records indexing status (`indexed`, `degraded`, `indexing_failed`).
- **Retrieval Engine (`src/services/retrievalEngine.ts`)**:
  - Tokenizes queries and applies BM25 / TF-IDF keyword overlap scoring with length normalization.
  - Applies strict policy thresholds:
    - $\text{Score} \ge 3.8 \implies \text{SOURCE\_BACKED}$
    - $2.0 \le \text{Score} < 3.8 \implies \text{PARTIALLY\_SUPPORTED}$
    - $\text{Score} < 2.0$ or off-curriculum trigger match $\implies \text{NOT\_COVERED}$ (Strict refusal).
- **Claim-Level Decomposer (`src/services/geminiService.ts`)**:
  - Breaks generated responses into factual assertions.
  - Binds each claim to its primary source chunk, verified citation, and evidence reasoning.

---

## 3. Verification Status Definitions

LearnMate AI enforces clear, non-contradictory evidence states:

| Status Identifier | Meaning | When Triggered |
|:---|:---|:---|
| `SOURCE_INDEXED` | Source file metadata and derivative chunks exist in index | Document parsed successfully |
| `SOURCE_UNAVAILABLE` | File is referenced or requested but absent from storage | Missing document probe |
| `CITATION_TARGET_VERIFIED` | Document, page, slide, or timestamp exists within valid bounds | Validated by `verifyCitationAgainstIndexedSources` |
| `EVIDENCE_SUPPORTS_CLAIM` | Passage text semantically corroborates the specific assertion | Relevance score $\ge 3.8$ & chunk match |
| `EVIDENCE_INSUFFICIENT` | Topic is discussed but does not fully establish the assertion | Relevance score between $2.0$ and $3.8$ |
| `TRANSCRIPT_AVAILABLE` | Timestamped transcript segment exists in repository | Video lecture offset indexed |
| `TRANSCRIPT_PROVENANCE_UNVERIFIED` | Transcript is indexed, but raw audio acoustic sync was not tested | Standard indexed transcript mode |
| `ORIGINAL_VIDEO_UNAVAILABLE` | MP4 video binary is not hosted in environment | No raw media stream available |
| `VISUAL_REFERENCE_VERIFIED` | Original page was inspected and diagram presence confirmed | Page contains diagram (e.g., Page 25) |
| `VISUAL_REFERENCE_UNAVAILABLE` | Page was inspected and contains text/equations only | Text-only page (e.g., Page 8) |

---

## 4. Automated Regression Tests & Actual Results

LearnMate AI includes automated regression suites in `src/services/testRegistryEngine.ts` and `src/components/judge/JudgeModeView.tsx`.

### Test Suite Execution Summary:

| Test ID | Test Category & Description | Actual Outcome | Status |
|:---|:---|:---|:---:|
| **Test A** | **Valid PDF Citation & Page Verification**: Retrieves Isomap passage from Unit IV. | Targets Page 25, non-empty excerpt, score 6.16 | **PASS** |
| **Test B** | **Incorrect Page Rejection**: Probes Unit IV with invalid page 999. | Out-of-bounds detected (Page 999 > Max 36). Rejected. | **PASS** |
| **Test C** | **Unsupported Claim Refusal**: Off-curriculum query (Quantum Shor algorithm). | Grounding = NOT_COVERED. 0 fake citations returned. | **PASS** |
| **Test D** | **Missing Video Media Handling**: Probes Lecture 4 MP4 availability. | Reports "Transcript available; original video unavailable". | **PASS** |
| **Test E** | **Missing Transcript Handling**: Probes unindexed Lecture 99 @ 99:99. | Detected missing transcript; reports unavailable. | **PASS** |
| **Test F** | **Transcript Provenance Verification**: Inspects transcript provenance label. | Labeled "Transcript provenance unverified". No false audio claim. | **PASS** |
| **Test G** | **Physical Visual Inspection**: Compares Page 25 (diagram) vs Page 8 (text). | Page 25 verified diagram; Page 8 correctly omits visual. | **PASS** |
| **Test H** | **Claim-Level Grounding**: Multi-part Isomap + pitfall question. | Generated 2 distinct claim citations (Page 25 & @18:42). | **PASS** |
| **Test I** | **Content Fingerprint & Hash Distinction**: Evaluates SHA-256 derivative hash. | Content hash verified as extracted derivative fingerprint. | **PASS** |
| **Test J** | **UI Workflow & Navigation Regression**: Transitions across Tutor, Quiz, Judge. | All modal states, props, and views execute cleanly. | **PASS** |
| **Test K** | **Answer Grading & Technical Synonyms**: Grades free-text and numerical answers. | Accepts "Classical MDS" -> MDS; validates numerical tolerance. | **PASS** |
| **Test L** | **Adaptive Question Selection**: Targets measured weak topics ($P(L)=0.35$). | Prioritizes Genetic Algorithms with calibrated difficulty EASY. | **PASS** |
| **Test M** | **Supplementary Video Status & Transparency**: Validates Video A & B external links. | Verified external resources; URLs match; unindexed status truthful. | **PASS** |
| **BKT-1** | **BKT Regression (Incorrect)**: Prior 0.92, Incorrect observation. | Posterior = 0.5897, Transition = 0.6471 (~65%). | **PASS** |
| **BKT-2** | **BKT Regression (Correct)**: Prior 0.37, Correct observation. | Posterior = 0.7255, Transition = 0.7639 (~76%). | **PASS** |
| **BKT-3** | **BKT Topic Isolation**: GA quiz attempt with Isomap & PCA priors. | GA updates to 0.59; Isomap remains 0.48, PCA 0.86. | **PASS** |
| **PERSIST** | **Storage Persistence**: Roundtrip probe through browser `localStorage`. | State identical after simulated session refresh. | **PASS** |

---

## 5. Known Limitations & Future Work

1. **Native Video Stream Playback**: Video lecture citations are grounded in indexed audio transcripts and bounded timestamps (`08:15`, `18:42`, `31:05`). Native HTML5 video streaming requires hosting the raw video binaries on an external CDN.
2. **Offline Vocabulary Scope**: In browser-offline mode without external API calls, technical synonym mapping operates on indexed curriculum synonym matrices and token overlap rather than high-dimensional remote vector embeddings.

---

## 6. Build & Deployment Instructions

### Prerequisites
- Node.js $\ge 18$
- npm or bun

### Commands
```bash
# Install dependencies
npm install

# Verify TypeScript compilation and linting
npm run lint

# Compile production bundle
npm run build

# Start development server on port 3000
npm run dev
```
