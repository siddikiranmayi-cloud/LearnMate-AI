import { Course, VisualElement, SourceChunk } from '../types/course';

export const DEMO_VISUALS: VisualElement[] = [
  {
    id: 'vis_isomap_geodesic',
    title: 'Geodesic vs Euclidean Distance on Swiss Roll Manifold',
    description: 'Diagram showing how Euclidean distance short-circuits across folds of a nonlinear manifold, whereas Isomap calculates true shortest path along a k-nearest neighbor adjacency graph (geodesic distance).',
    sourceType: 'pdf',
    fileName: 'Machine Learning Unit IV.pdf',
    location: 'Page 25',
    page: 25,
    svgType: 'manifold',
    keyInsights: [
      'Euclidean metric fails on curved submanifolds (e.g. Swiss Roll).',
      'Shortest paths are computed via Dijkstra/Floyd-Warshall on the neighborhood graph.',
      'Classical MDS is applied to the resulting geodesic distance matrix.'
    ],
    isOriginalPageInspected: true,
    actualDiagramPresent: true,
    caption: 'Figure 4.7: Swiss Roll Manifold Unfolding and Geodesic Paths',
    verificationNote: 'Page 25 inspected: Confirmed presence of Figure 4.7 manifold diagram and mathematical shortest-path formulation.'
  },
  {
    id: 'vis_pca_projection',
    title: 'Principal Component Analysis Variance Maximization',
    description: 'Scatter plot of 2D data rotated onto principal axes PC1 and PC2, showing PC1 captures maximum variance (eigenvector of covariance matrix with largest eigenvalue λ1), minimizing orthogonal reconstruction error.',
    sourceType: 'ppt',
    fileName: 'ML Unit IV.pptx',
    location: 'Slide 14',
    slide: 14,
    svgType: 'pca_projection',
    keyInsights: [
      'PC1 is the direction of maximum variance in the centered data matrix X.',
      'Subsequent components PC2...PCk are mutually orthogonal.',
      'Covariance matrix Σ = (1/n) X^T X; eigenvectors give principal directions.'
    ],
    isOriginalPageInspected: true,
    actualDiagramPresent: true,
    caption: 'Slide 14 Diagram: Orthogonal Variance Projection',
    verificationNote: 'Slide 14 inspected: Confirmed visual plot of orthogonal eigenvectors and variance maximization.'
  },
  {
    id: 'vis_lda_scatter',
    title: "Fisher's Linear Discriminant Projection",
    description: 'Comparison of PCA vs LDA projections on two classes, illustrating that LDA maximizes between-class variance (S_B) relative to within-class variance (S_W), whereas PCA solely considers total variance without labels.',
    sourceType: 'pdf',
    fileName: 'Machine Learning Unit IV.pdf',
    location: 'Page 18',
    page: 18,
    svgType: 'lda_separation',
    keyInsights: [
      "Criterion: J(w) = (w^T S_B w) / (w^T S_W w).",
      'Supervised technique utilizing class categorical labels.',
      'Maximum number of discriminant components is min(c - 1, d).'
    ],
    isOriginalPageInspected: true,
    actualDiagramPresent: true,
    caption: 'Figure 4.3: Fisher Linear Discriminant vs PCA Separation',
    verificationNote: 'Page 18 inspected: Confirmed presence of Figure 4.3 scatter matrix diagram.'
  },
  {
    id: 'vis_ga_operators',
    title: 'Genetic Algorithms: Crossover vs Mutation Operators',
    description: 'Schematic illustrating biological reproduction mechanics in genetic algorithms: single-point crossover exchanging chromosome segments between parents versus random bit-flip mutation maintaining population diversity.',
    sourceType: 'ppt',
    fileName: 'ML Unit IV.pptx',
    location: 'Slide 29',
    slide: 29,
    svgType: 'genetic_crossover',
    keyInsights: [
      'Crossover combines favorable sub-solutions (schemas) from fit individuals.',
      'Mutation introduces novel genetic variation preventing premature convergence.',
      'Fitness-proportionate roulette wheel or tournament selection picks mating pairs.'
    ],
    isOriginalPageInspected: true,
    actualDiagramPresent: true,
    caption: 'Slide 29 Diagram: Single-Point Crossover & Point Mutation',
    verificationNote: 'Slide 29 inspected: Confirmed visual chromosome crossover schematic.'
  }
];

export const DEMO_SOURCE_CHUNKS: SourceChunk[] = [
  // PCA Chunks
  {
    id: 'chunk_pca_1',
    topicId: 'topic_pca',
    title: 'PCA Mathematical Formulation & Objective',
    content: 'Principal Component Analysis (PCA) is an unsupervised linear dimensionality reduction technique. Given centered data matrix X (n x d), PCA finds an orthogonal projection matrix W (d x k) that maximizes the variance of projected points W^T X while minimizing the mean squared reconstruction error ||X - X W W^T||^2. The columns of W are the top-k orthonormal eigenvectors of the sample covariance matrix Σ = (1/n) X^T X, ordered by decreasing eigenvalues λ_1 ≥ λ_2 ≥ ... ≥ λ_k.',
    provenance: {
      sourceType: 'pdf',
      sourceId: 'mat_pdf_unit4',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 12,
      section: 'Section 4.1: Principal Component Analysis',
      excerpt: 'PCA seeks a linear transformation that projects high-dimensional data onto an orthogonal subspace maximizing preserved variance.',
      contentFingerprint: 'sha256:d8a201f92e340c4a758e5e890b3b4f6e1a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true
    },
    keywords: ['pca', 'eigenvectors', 'eigenvalues', 'covariance', 'variance', 'unsupervised', 'orthogonal']
  },
  {
    id: 'chunk_pca_2',
    topicId: 'topic_pca',
    title: 'PCA Computation via SVD & Limitations',
    content: 'In practice, Singular Value Decomposition (SVD) of X = U S V^T is computationally preferable over explicitly forming the covariance matrix. The right singular vectors V correspond directly to the principal eigenvectors. A fundamental limitation of standard PCA is linearity: if the underlying data manifold is nonlinearly curved (such as a Swiss Roll or sphere), PCA conflates geometric distance with manifold distance, leading to poor low-dimensional embeddings.',
    provenance: {
      sourceType: 'ppt',
      sourceId: 'mat_ppt_unit4',
      fileName: 'ML Unit IV.pptx',
      slide: 14,
      section: 'Slide 14: Computational SVD & Nonlinear Limitations',
      excerpt: 'SVD computes principal components without squaring condition number. Standard PCA fails when data lies along nonlinear submanifolds.',
      contentFingerprint: 'sha256:b5e7149a1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true,
      speakerNotes: 'Remind students: SVD avoids condition number squaring associated with forming X^T X directly.'
    },
    visualElementId: 'vis_pca_projection',
    keywords: ['svd', 'singular value decomposition', 'nonlinear limitations', 'variance', 'pca']
  },
  {
    id: 'chunk_pca_3',
    topicId: 'topic_pca',
    title: 'Lecture 4: PCA Intuition & Center of Mass',
    content: 'Prof. Miller explains: "Before calculating eigenvectors, centering the dataset by subtracting the mean feature vector μ is strictly mandatory. If you forget to center the data, the first principal component will point directly toward the center of mass rather than the direction of greatest variance."',
    provenance: {
      sourceType: 'video',
      sourceId: 'mat_video_lec4',
      fileName: 'Lecture 4.mp4',
      timestamp: '08:15',
      section: 'Lecture 4: 08:15 - Centering Data and Pitfalls',
      excerpt: 'Always subtract the mean feature vector. Otherwise PC1 points straight to the center of mass!',
      contentFingerprint: 'sha256:7c3b9e1a2f4d6c8b0e2a4f6d8b0e2a4f6d8b0e2a4f6d8b0e2a4f6d8b0e2a4f6d',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: false,
      hasTranscriptRecord: true,
      transcriptProvenanceVerified: false
    },
    keywords: ['centering', 'mean', 'pca', 'pitfall', 'first principal component']
  },

  // LDA Chunks
  {
    id: 'chunk_lda_1',
    topicId: 'topic_lda',
    title: 'Linear Discriminant Analysis (LDA) Supervised Projection',
    content: "Unlike PCA, Linear Discriminant Analysis (Fisher's LDA) is a supervised method that explicitly utilizes class labels. LDA searches for a projection vector w that maximizes the Fisher criterion: J(w) = (w^T S_B w) / (w^T S_W w), where S_B is the between-class scatter matrix measuring separation of class means, and S_W is the within-class scatter matrix measuring compactness of individual clusters.",
    provenance: {
      sourceType: 'pdf',
      sourceId: 'mat_pdf_unit4',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 18,
      section: 'Section 4.3: Linear Discriminant Analysis',
      excerpt: 'LDA maximizes between-class scatter S_B while minimizing within-class scatter S_W.',
      contentFingerprint: 'sha256:3a1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true
    },
    visualElementId: 'vis_lda_scatter',
    keywords: ['lda', 'fisher', 'supervised', 'scatter matrix', 's_b', 's_w', 'classification']
  },
  {
    id: 'chunk_lda_2',
    topicId: 'topic_lda',
    title: 'LDA Dimensionality Bound & Generalized Eigenvalue Problem',
    content: 'The optimal projection vectors w are given by the generalized eigenvectors satisfying S_B w = λ S_W w, which reduces to S_W^-1 S_B w = λ w when S_W is non-singular. Crucially, the rank of S_B is at most C - 1 where C is the number of distinct classes. Therefore, LDA can project data to at most C - 1 dimensions. For binary classification (C = 2), LDA projects data down to a single 1D line.',
    provenance: {
      sourceType: 'ppt',
      sourceId: 'mat_ppt_unit4',
      fileName: 'ML Unit IV.pptx',
      slide: 21,
      section: 'Slide 21: Rank Bounds & Generalized Eigenproblem',
      excerpt: 'Rank(S_B) <= C - 1, meaning maximum LDA projection dimension is C - 1.',
      contentFingerprint: 'sha256:4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true,
      speakerNotes: 'Emphasize: For binary classes C=2, S_B has rank 1, projecting to 1D regardless of d.'
    },
    keywords: ['rank', 'c-1', 'generalized eigenvalue', 'classes', 'lda bound']
  },

  // Isomap Chunks
  {
    id: 'chunk_isomap_1',
    topicId: 'topic_isomap',
    title: 'Isometric Feature Mapping (Isomap) Algorithm',
    content: 'Isomap (Tenenbaum et al., 2000) is a nonlinear dimensionality reduction method that preserves global geodesic distances on Riemannian manifolds. The algorithm executes in three distinct steps:\nStep 1: Construct a neighborhood graph G where vertices are data points and edges connect k-nearest neighbors (or ε-balls) with Euclidean weights.\nStep 2: Compute all-pairs shortest paths d_G(i, j) across graph G using Dijkstra\'s or Floyd-Warshall algorithm to approximate true geodesic distances.\nStep 3: Apply Classical Multidimensional Scaling (MDS) to the resulting geodesic distance matrix D_G to construct low-dimensional coordinates Y.',
    provenance: {
      sourceType: 'pdf',
      sourceId: 'mat_pdf_unit4',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25,
      section: 'Section 4.5: Isometric Feature Mapping (Isomap)',
      excerpt: 'Isomap replaces Euclidean distances with shortest graph paths approximating geodesic distance along the manifold.',
      contentFingerprint: 'sha256:8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true
    },
    visualElementId: 'vis_isomap_geodesic',
    keywords: ['isomap', 'geodesic', 'shortest path', 'dijkstra', 'floyd-warshall', 'mds', 'multidimensional scaling', 'manifold', 'swiss roll']
  },
  {
    id: 'chunk_isomap_2',
    topicId: 'topic_isomap',
    title: 'Short-Circuiting Pitfall in Isomap',
    content: 'A critical vulnerability of Isomap is topological instability called "short-circuiting". If parameter k (or ε) is chosen too large, or if noise bridges adjacent folds of a manifold (like layers of a Swiss roll), the neighborhood graph inserts spurious shortcuts across Euclidean space. This corrupts all subsequent shortest-path calculations and collapses the recovered geometry.',
    provenance: {
      sourceType: 'video',
      sourceId: 'mat_video_lec4',
      fileName: 'Lecture 4.mp4',
      timestamp: '18:42',
      section: 'Lecture 4: 18:42 - Short Circuiting & Epsilon Selection',
      excerpt: 'If k is too big or you have noise between folds, edges short-circuit across the empty space and ruin geodesic distance.',
      contentFingerprint: 'sha256:5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: false,
      hasTranscriptRecord: true,
      transcriptProvenanceVerified: false
    },
    keywords: ['short-circuiting', 'k-neighbors', 'noise', 'swiss roll', 'epsilon', 'pitfall']
  },

  // Least Squares & Ridge Regression
  {
    id: 'chunk_least_squares_1',
    topicId: 'topic_least_squares',
    title: 'Ordinary Least Squares & Normal Equations',
    content: 'Ordinary Least Squares (OLS) minimizes the residual sum of squares RSS(w) = ||y - X w||^2. Setting the gradient ∇RSS = -2 X^T (y - X w) = 0 yields the famous Normal Equations: X^T X w = X^T y. If X has full column rank, the unique analytical closed-form solution is w_OLS = (X^T X)^-1 X^T y.',
    provenance: {
      sourceType: 'pdf',
      sourceId: 'mat_pdf_unit4',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 8,
      section: 'Section 3.2: Ordinary Least Squares Estimation',
      excerpt: 'The normal equation solution w = (X^T X)^-1 X^T y minimizes squared Euclidean residuals.',
      contentFingerprint: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true
    },
    keywords: ['least squares', 'ols', 'normal equations', 'residuals', 'regression']
  },
  {
    id: 'chunk_least_squares_2',
    topicId: 'topic_least_squares',
    title: 'Collinearity & Ridge Regression Regularization',
    content: 'When feature columns in X are highly correlated (multicollinearity) or when d > n, the matrix X^T X becomes singular or ill-conditioned. Ridge Regression (L2 regularization) remedies this by penalizing coefficient magnitudes: min ||y - X w||^2 + λ ||w||^2. This gives the regularized solution w_ridge = (X^T X + λ I)^-1 X^T y. Adding λ I shifts all eigenvalues by λ > 0, guaranteeing strict invertibility.',
    provenance: {
      sourceType: 'ppt',
      sourceId: 'mat_ppt_unit4',
      fileName: 'ML Unit IV.pptx',
      slide: 10,
      section: 'Slide 10: Multicollinearity and Ridge Tikhonov Regularization',
      excerpt: 'Ridge adds lambda * I to X^T X, guaranteeing positive definiteness and preventing exploding variance.',
      contentFingerprint: 'sha256:2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true,
      speakerNotes: 'Slide notes: Explain why singular value decomposition of X provides immediate calculation of w_ridge.'
    },
    keywords: ['ridge regression', 'l2', 'regularization', 'multicollinearity', 'invertibility', 'lambda']
  },

  // Genetic Algorithms
  {
    id: 'chunk_ga_1',
    topicId: 'topic_genetic_algorithms',
    title: 'Genetic Algorithms Foundations & Cycle',
    content: 'Genetic Algorithms (GAs) are population-based stochastic global optimization heuristics inspired by Darwinian natural selection. A GA maintains a population of candidate solutions represented as chromosomes (typically bitstrings or real vectors). The fundamental iterative evolutionary cycle consists of:\n1. Fitness Evaluation: Evaluating each candidate against objective function f(x).\n2. Selection: Probabilistic selection favoring higher fitness (Roulette Wheel, Tournament selection).\n3. Crossover (Recombination): Exchanging genetic material between parent chromosomes.\n4. Mutation: Random perturbation of alleles with small probability p_m.\n5. Replacement: Forming the next generation.',
    provenance: {
      sourceType: 'pdf',
      sourceId: 'mat_pdf_unit4',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 31,
      section: 'Section 5.1: Evolutionary Computation & Genetic Algorithms',
      excerpt: 'Genetic algorithms iterate fitness evaluation, parent selection, crossover recombination, and mutation.',
      contentFingerprint: 'sha256:9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true
    },
    keywords: ['genetic algorithms', 'ga', 'chromosome', 'fitness', 'selection', 'crossover', 'mutation', 'population']
  },
  {
    id: 'chunk_ga_2',
    topicId: 'topic_genetic_algorithms',
    title: 'Crossover vs Mutation: Mechanics & Common Misconceptions',
    content: 'Students frequently confuse the distinct roles of Crossover and Mutation. Crossover is an exploitation/recombination operator: it takes sub-patterns (building blocks) that already proved successful in parents and recombines them to discover synergistic combinations. Mutation is an exploration/diversity operator: it randomly flips bits or adds Gaussian noise with low probability (e.g. 0.001 - 0.05). Mutation exists primarily to restore lost genetic diversity and escape local optima. High mutation rates turn GAs into aimless random search.',
    provenance: {
      sourceType: 'ppt',
      sourceId: 'mat_ppt_unit4',
      fileName: 'ML Unit IV.pptx',
      slide: 29,
      section: 'Slide 29: Crossover vs Mutation Mechanics',
      excerpt: 'Crossover recombines proven building blocks (exploitation); mutation restores lost diversity and prevents stagnation (exploration).',
      contentFingerprint: 'sha256:6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: true,
      speakerNotes: 'Slide notes: Emphasize schema theorem: short, low-order, above-average schemas receive exponentially increasing trials.'
    },
    visualElementId: 'vis_ga_operators',
    keywords: ['crossover', 'mutation', 'misconception', 'exploitation', 'exploration', 'building blocks', 'diversity']
  },
  {
    id: 'chunk_ga_3',
    topicId: 'topic_genetic_algorithms',
    title: 'Lecture 4: Premature Convergence & Selection Pressure',
    content: 'Prof. Miller emphasizes: "If selection pressure is too aggressive, a moderately fit individual will rapidly overwhelm the entire mating pool within a few generations. The population loses diversity and converges prematurely to a suboptimal local peak. Maintaining mutation and using rank/tournament selection combats this."',
    provenance: {
      sourceType: 'video',
      sourceId: 'mat_video_lec4',
      fileName: 'Lecture 4.mp4',
      timestamp: '31:05',
      section: 'Lecture 4: 31:05 - Premature Convergence & Selection',
      excerpt: 'Aggressive selection leads to premature convergence. Maintain diversity through mutation and rank selection.',
      contentFingerprint: 'sha256:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      fingerprintType: 'extracted_derivative',
      indexingStatus: 'indexed',
      lastIndexedAt: '2026-10-10T14:30:00Z',
      hasOriginalFile: false,
      hasTranscriptRecord: true,
      transcriptProvenanceVerified: false
    },
    keywords: ['premature convergence', 'selection pressure', 'diversity', 'local optima']
  }
];

export const DEMO_COURSE: Course = {
  id: 'course_ml_420',
  code: 'CS 420',
  title: 'Machine Learning: Dimensionality Reduction & Search',
  instructor: 'Prof. Robert Miller',
  term: 'Fall 2026',
  description: 'Advanced course covering linear/nonlinear dimensionality reduction, manifold learning, regression regularization, and heuristic evolutionary optimization.',
  units: [
    {
      id: 'unit_opt_reg',
      number: 3,
      title: 'Unit III: Regression, Norms & Optimization',
      description: 'Loss formulation, normal equations, multicollinearity, and regularized estimators.',
      topics: [
        {
          id: 'topic_least_squares',
          unitId: 'unit_opt_reg',
          title: 'Least Squares & Ridge Regression',
          code: 'ML-301',
          description: 'Ordinary least squares estimation, normal equations derivation, condition numbers, and L2 Tikhonov regularization.',
          difficulty: 'Intermediate',
          prerequisites: [],
          concepts: [
            {
              id: 'c_ols_normal',
              name: 'Normal Equations',
              topicId: 'topic_least_squares',
              description: 'Analytical minimizer (X^T X)^-1 X^T y for Euclidean residual sum of squares.',
              sourceChunkIds: ['chunk_least_squares_1']
            },
            {
              id: 'c_ridge_reg',
              name: 'Ridge L2 Regularization',
              topicId: 'topic_least_squares',
              description: 'Tikhonov regularization shifting eigenvalues by lambda * I to invert ill-conditioned matrices.',
              sourceChunkIds: ['chunk_least_squares_2']
            }
          ],
          sourceSummary: {
            pdfPages: [8, 9],
            slides: [10, 11],
            videoTimestamps: ['04:12', '07:30']
          }
        }
      ]
    },
    {
      id: 'unit_dim_reduction',
      number: 4,
      title: 'Unit IV: Dimensionality Reduction & Manifold Learning',
      description: 'Linear projections (PCA, LDA) and nonlinear manifold unwrapping (Isomap, LLE).',
      topics: [
        {
          id: 'topic_pca',
          unitId: 'unit_dim_reduction',
          title: 'Principal Component Analysis (PCA)',
          code: 'ML-401',
          description: 'Unsupervised linear variance maximization, covariance eigenspectrum, SVD, and mean centering.',
          difficulty: 'Intermediate',
          prerequisites: ['topic_least_squares'],
          concepts: [
            {
              id: 'c_pca_var',
              name: 'Variance Maximization',
              topicId: 'topic_pca',
              description: 'Projecting data onto eigenvectors corresponding to largest eigenvalues of covariance matrix.',
              sourceChunkIds: ['chunk_pca_1', 'chunk_pca_2'],
              visualElementIds: ['vis_pca_projection']
            },
            {
              id: 'c_pca_center',
              name: 'Mean Centering Requirement',
              topicId: 'topic_pca',
              description: 'Mandatory subtraction of feature means so PC1 does not point to the dataset centroid.',
              sourceChunkIds: ['chunk_pca_3']
            }
          ],
          sourceSummary: {
            pdfPages: [12, 13, 14],
            slides: [14, 15],
            videoTimestamps: ['08:15', '12:40']
          }
        },
        {
          id: 'topic_lda',
          unitId: 'unit_dim_reduction',
          title: 'Linear Discriminant Analysis (LDA)',
          code: 'ML-402',
          description: "Supervised dimensionality reduction maximizing between-class scatter while minimizing within-class scatter.",
          difficulty: 'Intermediate',
          prerequisites: ['topic_pca'],
          concepts: [
            {
              id: 'c_fisher_crit',
              name: "Fisher's Criterion",
              topicId: 'topic_lda',
              description: 'Maximization of ratio J(w) = (w^T S_B w) / (w^T S_W w).',
              sourceChunkIds: ['chunk_lda_1'],
              visualElementIds: ['vis_lda_scatter']
            },
            {
              id: 'c_lda_bound',
              name: 'C - 1 Dimensionality Upper Bound',
              topicId: 'topic_lda',
              description: 'Between-class scatter matrix S_B has rank at most C - 1 for C classes.',
              sourceChunkIds: ['chunk_lda_2']
            }
          ],
          sourceSummary: {
            pdfPages: [18, 19, 20],
            slides: [21, 22],
            videoTimestamps: ['14:20', '16:50']
          }
        },
        {
          id: 'topic_isomap',
          unitId: 'unit_dim_reduction',
          title: 'Isometric Feature Mapping (Isomap)',
          code: 'ML-403',
          description: 'Nonlinear manifold learning combining k-NN graph construction, Dijkstra shortest paths for geodesic approximation, and Classical MDS.',
          difficulty: 'Advanced',
          prerequisites: ['topic_pca'],
          concepts: [
            {
              id: 'c_geodesic_dist',
              name: 'Geodesic vs Euclidean Distance',
              topicId: 'topic_isomap',
              description: 'Shortest path over neighborhood adjacency graph approximating manifold metric.',
              sourceChunkIds: ['chunk_isomap_1'],
              visualElementIds: ['vis_isomap_geodesic']
            },
            {
              id: 'c_isomap_shortcircuit',
              name: 'Graph Short-Circuiting',
              topicId: 'topic_isomap',
              description: 'Topology collapse when oversized k or noise causes artificial bridges between manifold folds.',
              sourceChunkIds: ['chunk_isomap_2']
            }
          ],
          sourceSummary: {
            pdfPages: [25, 26, 27],
            slides: [26, 27],
            videoTimestamps: ['18:42', '22:15']
          }
        }
      ]
    },
    {
      id: 'unit_evolutionary',
      number: 5,
      title: 'Unit V: Heuristic Search & Evolutionary Computation',
      description: 'Population-based optimization, genetic operators, selection mechanics, and diversity management.',
      topics: [
        {
          id: 'topic_genetic_algorithms',
          unitId: 'unit_evolutionary',
          title: 'Genetic Algorithms (GAs)',
          code: 'ML-501',
          description: 'Stochastic optimization inspired by natural selection: chromosome representations, fitness landscapes, crossover exploitation, mutation exploration, and premature convergence prevention.',
          difficulty: 'Intermediate',
          prerequisites: [],
          concepts: [
            {
              id: 'c_ga_cycle',
              name: 'Evolutionary Cycle',
              topicId: 'topic_genetic_algorithms',
              description: 'Evaluation -> Selection -> Recombination (Crossover) -> Mutation -> Replacement.',
              sourceChunkIds: ['chunk_ga_1']
            },
            {
              id: 'c_ga_crossover_mutation',
              name: 'Crossover vs Mutation Operators',
              topicId: 'topic_genetic_algorithms',
              description: 'Crossover performs structural exploitation of fit building blocks; mutation sustains population diversity (exploration).',
              sourceChunkIds: ['chunk_ga_2'],
              visualElementIds: ['vis_ga_operators']
            },
            {
              id: 'c_ga_premature_conv',
              name: 'Premature Convergence',
              topicId: 'topic_genetic_algorithms',
              description: 'Excessive selection pressure causing entire population to collapse into suboptimal local peak.',
              sourceChunkIds: ['chunk_ga_3']
            }
          ],
          sourceSummary: {
            pdfPages: [31, 32, 33],
            slides: [29, 30],
            videoTimestamps: ['31:05', '35:20']
          }
        }
      ]
    }
  ],
  materials: [
    {
      id: 'mat_pdf_unit4',
      title: 'Machine Learning Unit IV: Dimensionality & Search (Textbook)',
      type: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      pagesOrLength: '36 Pages',
      chunksCount: 86,
      visualsCount: 18
    },
    {
      id: 'mat_ppt_unit4',
      title: 'ML Unit IV Lecture Slide Deck',
      type: 'ppt',
      fileName: 'ML Unit IV.pptx',
      pagesOrLength: '32 Slides',
      chunksCount: 42,
      visualsCount: 12
    },
    {
      id: 'mat_video_lec4',
      title: 'Lecture 4: Manifolds, SVD & Evolutionary Search (Video & Audio)',
      type: 'video',
      fileName: 'Lecture 4.mp4',
      pagesOrLength: '52:18 Minutes',
      chunksCount: 54,
      visualsCount: 8
    }
  ]
};
