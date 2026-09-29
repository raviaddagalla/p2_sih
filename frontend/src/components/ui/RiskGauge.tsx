'use client';

import React from 'react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  size?: number;
  showLabels?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 180,
  showLabels = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  // Angle: 0 score = -90 deg, 100 score = +90 deg (total 180 deg)
  const angle = (clampedScore / 100) * 180 - 90;

  const getScoreColor = () => {
    if (clampedScore >= 85) return '#EF4444';
    if (clampedScore >= 65) return '#F97316';
    if (clampedScore >= 35) return '#F59E0B';
    return '#10B981';
  };

  const getScoreLabel = () => {
    if (clampedScore >= 85) return 'CRITICAL RISK';
    if (clampedScore >= 65) return 'HIGH SUSPICION';
    if (clampedScore >= 35) return 'MODERATE RISK';
    return 'CLEAN / LOW';
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Background track arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#EEF2F9"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored gradient arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - clampedScore / 100)}
            className="transition-all duration-700 ease-out"
          />

          {/* Needle pivot circle */}
          <circle cx="100" cy="100" r="7" fill="#0B1220" />
          <circle cx="100" cy="100" r="3" fill="#FFFFFF" />

          {/* Needle line with rotation */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="32"
              stroke="#0B1220"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-2xl font-black font-display tracking-tight text-primary">
            {clampedScore}
          </span>
          <span className="text-[10px] font-mono text-muted -mt-1 font-semibold">
            / 100
          </span>
        </div>
      </div>

      {showLabels && (
        <div className="mt-2 text-center">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase inline-block font-mono"
            style={{
              backgroundColor: `${getScoreColor()}15`,
              color: getScoreColor(),
              border: `1px solid ${getScoreColor()}40`,
            }}
          >
            {getScoreLabel()}
          </span>
        </div>
      )}
    </div>
  );
};
