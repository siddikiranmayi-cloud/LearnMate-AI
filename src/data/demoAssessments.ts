import { Question } from '../types/assessment';

export const VERIFIED_QUESTION_BANK: Question[] = [
  // ISOMAP QUESTIONS
  {
    id: 'q_isomap_01',
    topicId: 'topic_isomap',
    topicTitle: 'Isomap',
    difficulty: 'medium',
    type: 'mcq',
    prompt: 'In the Isomap algorithm, how is the geodesic distance between two distant data points on a manifold approximated?',
    options: [
      'By computing direct Euclidean straight-line distance in high-dimensional space',
      'By finding the shortest graph path (e.g., Dijkstra/Floyd-Warshall) along a k-nearest neighbor adjacency graph',
      'By calculating the orthogonal projection onto the first two principal eigenvectors',
      'By measuring the cosine angle between class scatter centroid vectors'
    ],
    correctAnswer: 'By finding the shortest graph path (e.g., Dijkstra/Floyd-Warshall) along a k-nearest neighbor adjacency graph',
    explanation: 'Step 2 of Isomap calculates all-pairs shortest paths over a k-NN graph to approximate true geodesic distances across the curved manifold before applying MDS.',
    conceptTested: 'Geodesic vs Euclidean Distance in Isomap',
    source: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25,
      section: 'Section 4.5: Isometric Feature Mapping',
      excerpt: 'Step 2: Compute all-pairs shortest paths d_G(i, j) across graph G using Dijkstra\'s or Floyd-Warshall algorithm to approximate true geodesic distances.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.02,
      verifiedAt: '2026-10-05T06:00:00Z',
      notes: 'Passes 5-stage verification; directly corroborated by Section 4.5.'
    },
    relatedVisualId: 'vis_isomap_geodesic'
  },
  {
    id: 'q_isomap_02',
    topicId: 'topic_isomap',
    topicTitle: 'Isomap',
    difficulty: 'hard',
    type: 'mcq',
    prompt: 'What severe failure mode occurs in Isomap if parameter k is set excessively large or if noise points lie between folds of the manifold?',
    options: [
      'Singular matrix inversion in Ordinary Least Squares',
      'Short-circuiting, where spurious edges bridge manifold folds and corrupt geodesic distances',
      'Overfitting caused by too many genetic crossover operations',
      'Premature convergence to a zero-variance principal component'
    ],
    correctAnswer: 'Short-circuiting, where spurious edges bridge manifold folds and corrupt geodesic distances',
    explanation: 'Short-circuiting occurs when noise or large k connects adjacent layers of a curved manifold directly through Euclidean space, creating false shortcut edges that distort the geodesic metric.',
    conceptTested: 'Short-circuiting & Graph Topology in Isomap',
    source: {
      sourceType: 'video',
      fileName: 'Lecture 4.mp4',
      timestamp: '18:42',
      section: 'Lecture 4: 18:42 - Short Circuiting & Epsilon Selection',
      excerpt: 'If k is too big or you have noise between folds, edges short-circuit across the empty space and ruin geodesic distance.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.03,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_isomap_03',
    topicId: 'topic_isomap',
    topicTitle: 'Isomap',
    difficulty: 'easy',
    type: 'short_answer',
    prompt: 'Name the classical linear dimension reduction method that Isomap applies in its final step to the geodesic distance matrix.',
    correctAnswer: 'Multidimensional Scaling',
    acceptableSynonyms: ['MDS', 'Classical MDS', 'multidimensional scaling', 'classical multidimensional scaling', 'metric MDS', 'CMD'],
    partialMatchKeywords: ['scaling', 'multidimensional'],
    explanation: 'Step 3 of Isomap applies Classical Multidimensional Scaling (MDS) to construct coordinates that preserve the pairwise geodesic distances.',
    conceptTested: 'Isomap Algorithm Steps',
    source: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25,
      section: 'Section 4.5: Isometric Feature Mapping',
      excerpt: 'Step 3: Apply Classical Multidimensional Scaling (MDS) to the resulting geodesic distance matrix D_G.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.01,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },

  // GENETIC ALGORITHMS QUESTIONS
  {
    id: 'q_ga_01',
    topicId: 'topic_genetic_algorithms',
    topicTitle: 'Genetic Algorithms',
    difficulty: 'easy',
    type: 'mcq',
    prompt: 'In a genetic algorithm, what is the primary role of the mutation operator compared to the crossover operator?',
    options: [
      'To swap large contiguous chromosome blocks between top parents',
      'To maintain genetic diversity and prevent premature convergence into local optima',
      'To strictly evaluate the objective fitness score of each individual',
      'To ensure deterministic convergence in polynomial time'
    ],
    correctAnswer: 'To maintain genetic diversity and prevent premature convergence into local optima',
    explanation: 'While crossover recombines existing building blocks (exploitation), mutation introduces random exploratory perturbations to restore diversity and escape local optima.',
    conceptTested: 'Crossover vs Mutation Mechanics',
    source: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 29,
      section: 'Slide 29: Crossover vs Mutation Mechanics',
      excerpt: 'Crossover recombines proven building blocks (exploitation); mutation restores lost diversity and prevents stagnation (exploration).'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.04,
      verifiedAt: '2026-10-05T06:00:00Z'
    },
    relatedVisualId: 'vis_ga_operators'
  },
  {
    id: 'q_ga_02',
    topicId: 'topic_genetic_algorithms',
    topicTitle: 'Genetic Algorithms',
    difficulty: 'medium',
    type: 'mcq',
    prompt: 'What phenomenon occurs when selection pressure is excessively high in early generations of a Genetic Algorithm?',
    options: [
      'The population undergoes premature convergence because a moderately fit individual quickly dominates the pool',
      'The mutation rate automatically doubles to compensate for fitness drop',
      'The covariance matrix becomes non-invertible',
      'The crossover operator fails to produce valid child strings'
    ],
    correctAnswer: 'The population undergoes premature convergence because a moderately fit individual quickly dominates the pool',
    explanation: 'Aggressive selection pressure lets super-individuals monopolize reproduction before the solution space is explored, locking the GA into a suboptimal local peak.',
    conceptTested: 'Selection Pressure and Premature Convergence',
    source: {
      sourceType: 'video',
      fileName: 'Lecture 4.mp4',
      timestamp: '31:05',
      section: 'Lecture 4: 31:05 - Premature Convergence & Selection',
      excerpt: 'Aggressive selection leads to premature convergence. Maintain diversity through mutation and rank selection.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.02,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_ga_03',
    topicId: 'topic_genetic_algorithms',
    topicTitle: 'Genetic Algorithms',
    difficulty: 'hard',
    type: 'mcq',
    prompt: 'If a Genetic Algorithm utilizes a mutation rate that is set too high (e.g., p_m > 0.5 on a binary chromosome), how does its search behavior deteriorate?',
    options: [
      'It degrades into an unguided random walk, destroying beneficial schemas faster than selection can preserve them',
      'It perfectly solves any NP-hard problem through exhaustive branch and bound',
      'It collapses the population into identical clone bitstrings',
      'It forces the crossover operator into single-point mode exclusively'
    ],
    correctAnswer: 'It degrades into an unguided random walk, destroying beneficial schemas faster than selection can preserve them',
    explanation: 'A very high mutation rate disrupts good genetic building blocks (schemas) before selection can accumulate them, effectively degenerating into pure random search.',
    conceptTested: 'Exploration vs Exploitation Trade-off in GAs',
    source: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 29,
      section: 'Slide 29: Crossover vs Mutation Mechanics',
      excerpt: 'High mutation rates turn GAs into aimless random search.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.05,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },

  // PCA QUESTIONS
  {
    id: 'q_pca_01',
    topicId: 'topic_pca',
    topicTitle: 'PCA',
    difficulty: 'easy',
    type: 'mcq',
    prompt: 'Why must a dataset be centered by subtracting the feature means before computing Principal Component Analysis?',
    options: [
      'To prevent the first principal component from merely pointing from origin toward the center of mass',
      'To convert categorical labels into numeric one-hot vectors',
      'To guarantee that all eigenvalues are negative',
      'To double the rank of the between-class scatter matrix'
    ],
    correctAnswer: 'To prevent the first principal component from merely pointing from origin toward the center of mass',
    explanation: 'Without mean centering, the vector of maximum variance will simply be dominated by the offset of the dataset mean from the origin rather than the internal data spread.',
    conceptTested: 'Data Centering in PCA',
    source: {
      sourceType: 'video',
      fileName: 'Lecture 4.mp4',
      timestamp: '08:15',
      section: 'Lecture 4: 08:15 - Centering Data and Pitfalls',
      excerpt: 'Always subtract the mean feature vector. Otherwise PC1 points straight to the center of mass!'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.03,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_pca_02',
    topicId: 'topic_pca',
    topicTitle: 'PCA',
    difficulty: 'medium',
    type: 'mcq',
    prompt: 'In PCA, what mathematical property relates the principal component directions to the sample covariance matrix Σ?',
    options: [
      'They are orthonormal eigenvectors of Σ sorted in descending order of their corresponding eigenvalues',
      'They are the inverse matrix coordinates of the residual sum of squares',
      'They are random orthogonal bases generated via Gram-Schmidt without regard to data variance',
      'They maximize the within-class scatter S_W divided by between-class scatter S_B'
    ],
    correctAnswer: 'They are orthonormal eigenvectors of Σ sorted in descending order of their corresponding eigenvalues',
    explanation: 'The directions of maximum variance correspond to the eigenvectors with largest eigenvalues of the sample covariance matrix Σ.',
    conceptTested: 'Covariance Eigensystem in PCA',
    source: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 12,
      section: 'Section 4.1: Principal Component Analysis',
      excerpt: 'The columns of W are the top-k orthonormal eigenvectors of the sample covariance matrix Σ, ordered by decreasing eigenvalues.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.01,
      verifiedAt: '2026-10-05T06:00:00Z'
    },
    relatedVisualId: 'vis_pca_projection'
  },

  // LDA QUESTIONS
  {
    id: 'q_lda_01',
    topicId: 'topic_lda',
    topicTitle: 'LDA',
    difficulty: 'medium',
    type: 'numerical',
    prompt: 'Given a classification problem with C = 4 classes and feature dimension d = 10, what is the maximum number of dimensions LDA can project data to?',
    correctAnswer: '3',
    acceptableNumericTolerance: 0,
    explanation: 'The between-class scatter matrix S_B is constructed from C class mean vectors minus the global mean, limiting its rank to at most C - 1. For C = 4, rank(S_B) <= 3.',
    conceptTested: 'LDA Dimensionality Bound (C - 1)',
    source: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 21,
      section: 'Slide 21: Rank Bounds & Generalized Eigenproblem',
      excerpt: 'Rank(S_B) <= C - 1, meaning maximum LDA projection dimension is C - 1.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.02,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_lda_02',
    topicId: 'topic_lda',
    topicTitle: 'LDA',
    difficulty: 'hard',
    type: 'mcq',
    prompt: "What is the primary difference in optimization objective between PCA and Fisher's Linear Discriminant Analysis (LDA)?",
    options: [
      'PCA maximizes total variance in an unsupervised manner, whereas LDA maximizes the ratio of between-class scatter to within-class scatter using class labels',
      'PCA requires class labels while LDA is purely unsupervised clustering',
      'PCA operates only on 1D vectors while LDA works on nonlinear Riemannian manifolds',
      'PCA minimizes L2 regularization penalties while LDA performs genetic mutation'
    ],
    correctAnswer: 'PCA maximizes total variance in an unsupervised manner, whereas LDA maximizes the ratio of between-class scatter to within-class scatter using class labels',
    explanation: "Fisher's LDA is supervised and maximizes J(w) = (w^T S_B w)/(w^T S_W w) to separate class clusters, whereas PCA maximizes overall spread without considering labels.",
    conceptTested: "Fisher's Criterion vs Unsupervised Variance",
    source: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 18,
      section: 'Section 4.3: Linear Discriminant Analysis',
      excerpt: 'LDA maximizes between-class scatter S_B while minimizing within-class scatter S_W.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.04,
      verifiedAt: '2026-10-05T06:00:00Z'
    },
    relatedVisualId: 'vis_lda_scatter'
  },

  // LEAST SQUARES & RIDGE QUESTIONS
  {
    id: 'q_ls_01',
    topicId: 'topic_least_squares',
    topicTitle: 'Least Squares',
    difficulty: 'medium',
    type: 'mcq',
    prompt: 'In Ridge Regression (L2 regularization), how does the addition of λ I to the matrix X^T X mathematically resolve the problem of multicollinearity?',
    options: [
      'It shifts all eigenvalues of X^T X upward by λ > 0, ensuring the matrix is strictly positive definite and invertible',
      'It forces all regression coefficients to zero regardless of training data',
      'It removes all correlated features by performing an internal PCA rotation',
      'It converts the quadratic loss into an absolute L1 Lasso penalty'
    ],
    correctAnswer: 'It shifts all eigenvalues of X^T X upward by λ > 0, ensuring the matrix is strictly positive definite and invertible',
    explanation: 'If X^T X is ill-conditioned or has zero eigenvalues, adding λ I shifts every eigenvalue to λ_i + λ > 0, guaranteeing invertibility and stabilizing coefficient variance.',
    conceptTested: 'Ridge Regularization & Condition Number',
    source: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 10,
      section: 'Slide 10: Multicollinearity and Ridge Tikhonov Regularization',
      excerpt: 'Ridge adds lambda * I to X^T X, guaranteeing positive definiteness and preventing exploding variance.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.02,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_ls_02',
    topicId: 'topic_least_squares',
    topicTitle: 'Least Squares',
    difficulty: 'easy',
    type: 'short_answer',
    prompt: 'What classical linear algebra matrix equation gives the closed-form Ordinary Least Squares estimator w = (X^T X)^(-1) X^T y?',
    correctAnswer: 'Normal Equations',
    acceptableSynonyms: [
      'normal equations',
      'normal equation',
      'OLS normal equations',
      'least squares normal equations',
      'X^T X w = X^T y',
      'XT X w = XT y',
      'closed-form normal equation'
    ],
    partialMatchKeywords: ['normal', 'equations'],
    explanation: 'Setting the gradient of the residual sum of squares loss to zero yields the Normal Equations X^T X w = X^T y.',
    conceptTested: 'Normal Equations Formulation',
    source: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 10,
      section: 'Slide 10: Multicollinearity and Ridge Tikhonov Regularization',
      excerpt: 'Normal equations: X^T X w = X^T y solves unconstrained least squares.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.01,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_ls_03',
    topicId: 'topic_least_squares',
    topicTitle: 'Least Squares',
    difficulty: 'hard',
    type: 'mcq',
    prompt: 'As the Ridge regularization penalty parameter λ increases toward infinity, how do the bias and variance of the estimated parameter vector behave?',
    options: [
      'Bias increases toward a constant while variance shrinks monotonically toward zero',
      'Both bias and variance increase exponentially',
      'Variance increases while bias drops to zero',
      'Both bias and variance remain completely unchanged'
    ],
    correctAnswer: 'Bias increases toward a constant while variance shrinks monotonically toward zero',
    explanation: 'As λ -> ∞, parameters are shrunk toward zero, introducing bias by restricting model complexity but drastically reducing variance.',
    conceptTested: 'Bias-Variance Tradeoff in Regularization',
    source: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 10,
      section: 'Slide 10: Multicollinearity and Ridge Tikhonov Regularization',
      excerpt: 'Regularization trades a small increase in bias for a massive reduction in estimator variance.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.03,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_pca_03',
    topicId: 'topic_pca',
    topicTitle: 'PCA',
    difficulty: 'hard',
    type: 'mcq',
    prompt: 'Which dual optimization formulation is mathematically equivalent to maximizing the projected sample variance in PCA?',
    options: [
      'Minimizing the mean squared orthogonal reconstruction error ||X - X W W^T||^2',
      'Maximizing the ratio of between-class scatter to within-class scatter',
      'Minimizing the L1 sparsity penalty ||W||_1',
      'Finding the all-pairs shortest paths over a nearest neighbor graph'
    ],
    correctAnswer: 'Minimizing the mean squared orthogonal reconstruction error ||X - X W W^T||^2',
    explanation: 'By the Pythagorean theorem of projections, maximizing variance along subspace W is identical to minimizing squared reconstruction residuals.',
    conceptTested: 'Dual Formulations of PCA',
    source: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 12,
      section: 'Section 4.1: Principal Component Analysis',
      excerpt: 'Maximizing preserved variance is algebraically equivalent to minimizing the mean squared reconstruction error.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.02,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_lda_03',
    topicId: 'topic_lda',
    topicTitle: 'LDA',
    difficulty: 'easy',
    type: 'mcq',
    prompt: "In Fisher's Linear Discriminant criterion J(w) = (w^T S_B w) / (w^T S_W w), what do the matrices S_B and S_W represent?",
    options: [
      'S_B is between-class scatter; S_W is within-class scatter',
      'S_B is singular values; S_W is sample weights',
      'S_B is baseline bias; S_W is weight variance',
      'S_B is geodesic distance; S_W is Euclidean distance'
    ],
    correctAnswer: 'S_B is between-class scatter; S_W is within-class scatter',
    explanation: 'Fisher discriminant analysis seeks directions that maximize separation between classes (S_B) while minimizing scatter within individual classes (S_W).',
    conceptTested: 'Scatter Matrices Definition in LDA',
    source: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 18,
      section: 'Section 4.3: Linear Discriminant Analysis',
      excerpt: 'S_B is between-class scatter measuring separation of means; S_W is within-class scatter measuring cluster compactness.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.03,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_ga_04',
    topicId: 'topic_genetic_algorithms',
    topicTitle: 'Genetic Algorithms',
    difficulty: 'medium',
    type: 'short_answer',
    prompt: 'Name the widely used selection scheme where an individual\'s probability of selection is proportional to its fitness score relative to total population fitness.',
    correctAnswer: 'Roulette Wheel Selection',
    acceptableSynonyms: [
      'roulette wheel',
      'roulette wheel selection',
      'fitness proportionate selection',
      'fitness-proportionate selection',
      'fitness proportional selection',
      'roulette selection',
      'proportionate selection',
      'roulette-wheel'
    ],
    partialMatchKeywords: ['roulette', 'fitness proportionate'],
    explanation: 'Fitness-proportionate selection (Roulette Wheel selection) assigns each chromosome a probability slot proportional to f_i / sum(f_j).',
    conceptTested: 'Selection Mechanics in Genetic Algorithms',
    source: {
      sourceType: 'ppt',
      fileName: 'ML Unit IV.pptx',
      slide: 29,
      section: 'Slide 29: Crossover vs Mutation Mechanics',
      excerpt: 'Fitness-proportionate roulette wheel or tournament selection picks mating pairs.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.01,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  },
  {
    id: 'q_isomap_04',
    topicId: 'topic_isomap',
    topicTitle: 'Isomap',
    difficulty: 'medium',
    type: 'mcq',
    prompt: 'Which graph algorithm is typically used in Step 2 of Isomap to calculate all-pairs shortest paths across the k-nearest neighbor adjacency graph?',
    options: [
      'Floyd-Warshall or Dijkstra algorithm',
      'Backpropagation with gradient descent',
      'Gram-Schmidt orthogonalization',
      'Nelder-Mead simplex search'
    ],
    correctAnswer: 'Floyd-Warshall or Dijkstra algorithm',
    explanation: 'Step 2 computes shortest path distances d_G(i, j) along graph edges using Dijkstra or Floyd-Warshall to estimate manifold geodesic distance.',
    conceptTested: 'Graph Geodesic Algorithms in Isomap',
    source: {
      sourceType: 'pdf',
      fileName: 'Machine Learning Unit IV.pdf',
      page: 25,
      section: 'Section 4.5: Isometric Feature Mapping',
      excerpt: 'Step 2: Compute all-pairs shortest paths d_G(i, j) across graph G using Dijkstra\'s or Floyd-Warshall algorithm.'
    },
    verification: {
      answerableFromSource: true,
      answerKeyVerified: true,
      explanationAgreesWithSource: true,
      difficultyAppropriate: true,
      noveltyConfirmed: true,
      similarityScore: 0.02,
      verifiedAt: '2026-10-05T06:00:00Z'
    }
  }
];
