import React from 'react';

interface DiagramSvgProps {
  type: 'manifold' | 'pca_projection' | 'genetic_crossover' | 'lda_separation' | 'neighborhood_graph';
  className?: string;
}

export const DiagramSvg: React.FC<DiagramSvgProps> = ({ type, className = 'w-full h-48' }) => {
  if (type === 'manifold') {
    return (
      <div className={`relative bg-slate-950 rounded-xl p-3 border border-slate-800 flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 200" className="w-full h-full max-h-48">
          <defs>
            <linearGradient id="swissRollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {/* Manifold spiral curve (Swiss Roll) */}
          <path
            d="M 60,150 C 40,80 120,40 180,40 C 260,40 320,80 320,130 C 320,170 260,180 200,180 C 140,180 100,150 100,110 C 100,80 140,70 170,70"
            fill="none"
            stroke="url(#swissRollGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            className="opacity-70"
          />
          {/* Point A */}
          <circle cx="100" cy="110" r="6" fill="#38bdf8" />
          <text x="82" y="105" fill="#38bdf8" fontSize="12" fontWeight="bold">Point A</text>

          {/* Point B */}
          <circle cx="320" cy="130" r="6" fill="#ec4899" />
          <text x="330" y="135" fill="#ec4899" fontSize="12" fontWeight="bold">Point B</text>

          {/* Erroneous Euclidean shortcut (straight red line through air) */}
          <line
            x1="100"
            y1="110"
            x2="320"
            y2="130"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="5,5"
          />
          <text x="175" y="112" fill="#ef4444" fontSize="11" fontWeight="600">
            Euclidean Shortcut (Fails)
          </text>

          {/* Correct Geodesic path along curve */}
          <path
            d="M 100,110 C 100,80 140,70 170,70"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
          />
          <text x="130" y="55" fill="#10b981" fontSize="11" fontWeight="600">
            Geodesic Path (Isomap)
          </text>
        </svg>
        <span className="text-[11px] text-slate-400 mt-1">Figure 4.5: Geodesic vs Euclidean Distance on Swiss Roll Manifold (Page 25)</span>
      </div>
    );
  }

  if (type === 'pca_projection') {
    return (
      <div className={`relative bg-slate-950 rounded-xl p-3 border border-slate-800 flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 200" className="w-full h-full max-h-48">
          {/* Center axes */}
          <line x1="50" y1="170" x2="350" y2="170" stroke="#334155" strokeWidth="1" />
          <line x1="200" y1="30" x2="200" y2="180" stroke="#334155" strokeWidth="1" />
          
          {/* Scatter points rotated at 35 deg */}
          {[
            [120, 150], [140, 135], [160, 125], [175, 140], [185, 110],
            [195, 105], [210, 95], [225, 80], [240, 90], [260, 70],
            [275, 60], [215, 115], [170, 120], [230, 100]
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#64748b" opacity="0.8" />
          ))}

          {/* PC1 Principal Axis (Vector of Max Variance) */}
          <line x1="90" y1="165" x2="310" y2="45" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
          <text x="315" y="45" fill="#38bdf8" fontSize="12" fontWeight="bold">PC1 (Max Variance λ₁)</text>

          {/* PC2 Orthogonal Axis */}
          <line x1="160" y1="50" x2="240" y2="155" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
          <text x="245" y="160" fill="#f59e0b" fontSize="11" fontWeight="600">PC2 (Orthogonal λ₂)</text>

          {/* Center of Mass point */}
          <circle cx="200" cy="105" r="5" fill="#ef4444" />
          <text x="145" y="100" fill="#ef4444" fontSize="10">Mean Centroid (μ)</text>
        </svg>
        <span className="text-[11px] text-slate-400 mt-1">Figure 4.1: Variance Maximization & Orthonormal Eigenvectors (Slide 14)</span>
      </div>
    );
  }

  if (type === 'genetic_crossover') {
    return (
      <div className={`relative bg-slate-950 rounded-xl p-3 border border-slate-800 flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 200" className="w-full h-full max-h-48">
          {/* Parent 1 */}
          <text x="20" y="40" fill="#38bdf8" fontSize="11" fontWeight="bold">Parent 1</text>
          <g transform="translate(80, 25)">
            <rect x="0" y="0" width="40" height="20" fill="#0284c7" />
            <rect x="40" y="0" width="40" height="20" fill="#0284c7" />
            <rect x="80" y="0" width="40" height="20" fill="#0284c7" />
            <rect x="120" y="0" width="40" height="20" fill="#0284c7" />
            <text x="15" y="14" fill="#ffffff" fontSize="10">1</text>
            <text x="55" y="14" fill="#ffffff" fontSize="10">1</text>
            <text x="95" y="14" fill="#ffffff" fontSize="10">0</text>
            <text x="135" y="14" fill="#ffffff" fontSize="10">1</text>
          </g>

          {/* Parent 2 */}
          <text x="20" y="75" fill="#ec4899" fontSize="11" fontWeight="bold">Parent 2</text>
          <g transform="translate(80, 60)">
            <rect x="0" y="0" width="40" height="20" fill="#be185d" />
            <rect x="40" y="0" width="40" height="20" fill="#be185d" />
            <rect x="80" y="0" width="40" height="20" fill="#be185d" />
            <rect x="120" y="0" width="40" height="20" fill="#be185d" />
            <text x="15" y="14" fill="#ffffff" fontSize="10">0</text>
            <text x="55" y="14" fill="#ffffff" fontSize="10">0</text>
            <text x="95" y="14" fill="#ffffff" fontSize="10">1</text>
            <text x="135" y="14" fill="#ffffff" fontSize="10">0</text>
          </g>

          {/* Crossover point line */}
          <line x1="160" y1="15" x2="160" y2="90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
          <text x="165" y="20" fill="#f59e0b" fontSize="10" fontWeight="bold">Crossover Split</text>

          {/* Arrow */}
          <path d="M 270,55 L 295,55" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="295,51 303,55 295,59" fill="#94a3b8" />

          {/* Offspring 1 (Crossover) */}
          <text x="310" y="40" fill="#10b981" fontSize="11" fontWeight="bold">Child (Crossover)</text>
          <g transform="translate(310, 48)">
            <rect x="0" y="0" width="40" height="18" fill="#0284c7" />
            <rect x="40" y="0" width="40" height="18" fill="#be185d" />
            <text x="15" y="13" fill="#ffffff" fontSize="9">1 1</text>
            <text x="55" y="13" fill="#ffffff" fontSize="9">1 0</text>
          </g>

          {/* Mutation Operation row */}
          <line x1="20" y1="115" x2="380" y2="115" stroke="#1e293b" strokeWidth="1" />
          <text x="20" y="145" fill="#f43f5e" fontSize="11" fontWeight="bold">Mutation Operator:</text>
          <g transform="translate(140, 130)">
            <rect x="0" y="0" width="30" height="20" fill="#334155" />
            <rect x="30" y="0" width="30" height="20" fill="#334155" />
            <rect x="60" y="0" width="30" height="20" fill="#f43f5e" className="animate-pulse" />
            <rect x="90" y="0" width="30" height="20" fill="#334155" />
            <text x="12" y="14" fill="#fff" fontSize="10">1</text>
            <text x="42" y="14" fill="#fff" fontSize="10">0</text>
            <text x="72" y="14" fill="#fff" fontSize="10">1*</text>
            <text x="102" y="14" fill="#fff" fontSize="10">1</text>
          </g>
          <text x="270" y="145" fill="#94a3b8" fontSize="10">Bit-flip (restores diversity)</text>
        </svg>
        <span className="text-[11px] text-slate-400 mt-1">Figure 5.2: Crossover (Recombination) vs Mutation (Diversity) (Slide 29)</span>
      </div>
    );
  }

  // Default LDA or generic
  return (
    <div className={`relative bg-slate-950 rounded-xl p-3 border border-slate-800 flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 200" className="w-full h-full max-h-48">
        {/* Class 1 cluster */}
        <circle cx="120" cy="80" r="35" fill="#38bdf8" opacity="0.15" />
        <circle cx="110" cy="75" r="4" fill="#38bdf8" />
        <circle cx="130" cy="85" r="4" fill="#38bdf8" />
        <circle cx="120" cy="90" r="4" fill="#38bdf8" />
        <text x="100" y="55" fill="#38bdf8" fontSize="11" fontWeight="bold">Class 1 (S_W1)</text>

        {/* Class 2 cluster */}
        <circle cx="280" cy="130" r="35" fill="#ec4899" opacity="0.15" />
        <circle cx="270" cy="125" r="4" fill="#ec4899" />
        <circle cx="290" cy="135" r="4" fill="#ec4899" />
        <circle cx="280" cy="140" r="4" fill="#ec4899" />
        <text x="260" y="105" fill="#ec4899" fontSize="11" fontWeight="bold">Class 2 (S_W2)</text>

        {/* Between-class scatter vector S_B */}
        <line x1="120" y1="80" x2="280" y2="130" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
        <text x="180" y="95" fill="#f59e0b" fontSize="11" fontWeight="bold">Between-Class S_B</text>

        {/* Optimal LDA Projection Line */}
        <line x1="60" y1="170" x2="340" y2="50" stroke="#10b981" strokeWidth="3" />
        <text x="310" y="40" fill="#10b981" fontSize="11" fontWeight="bold">w_LDA (Max J(w))</text>
      </svg>
      <span className="text-[11px] text-slate-400 mt-1">Figure 4.3: Fisher's LDA Projection Maximizing S_B / S_W (Page 18)</span>
    </div>
  );
};
