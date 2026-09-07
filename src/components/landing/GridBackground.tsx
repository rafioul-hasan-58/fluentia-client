"use client";

import React from "react";

interface GridBackgroundProps {
  className?: string;
  /** Size of each square in pixels (larger values create a more spacious, elegant grid) */
  squareSize?: number;
  /** Whether to show subtle vertex dot intersections */
  showDots?: boolean;
}

export function GridBackground({
  className = "",
  squareSize = 72,
  showDots = true,
}: GridBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(124,58,237,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(139,92,246,0.12),transparent_70%)]" />

      {/* Spacious, Elegant Geometric Grid with Soft Radial Mask */}
      <svg
        className="absolute inset-0 h-full w-full stroke-slate-300/40 dark:stroke-white/[0.04] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_25%,#000_25%,transparent_90%)]"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-spacious-grid"
            width={squareSize}
            height={squareSize}
            patternUnits="userSpaceOnUse"
            x="50%"
            y={0}
          >
            {/* Crisp, fine grid lines */}
            <path
              d={`M.5 ${squareSize}V.5H${squareSize}`}
              fill="none"
              strokeWidth="0.8"
            />
            {/* Minimal, elegant intersection dots */}
            {showDots && (
              <circle
                cx="0.5"
                cy="0.5"
                r="1"
                className="fill-slate-400/50 dark:fill-white/20"
              />
            )}
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill="url(#hero-spacious-grid)"
        />
      </svg>
    </div>
  );
}

export default GridBackground;
