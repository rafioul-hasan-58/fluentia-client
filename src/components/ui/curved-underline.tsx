import React from "react";

export interface CurvedUnderlineProps {
  /** Optional custom CSS class name for positioning or sizing */
  className?: string;
  /** Stroke color or gradient (default: brand gradient from purple to fuchsia) */
  color?: string;
  /** Stroke thickness in pixels */
  strokeWidth?: number;
  /** Curve style variant: 'arc' (gentle curve), 'wave' (smooth hand-drawn wave), 'double' (double stroke) */
  variant?: "arc" | "wave" | "double";
}

export const CurvedUnderline: React.FC<CurvedUnderlineProps> = ({
  className = "",
  color,
  strokeWidth = 3.5,
  variant = "arc",
}) => {
  const gradientId = React.useId();

  return (
    <svg
      viewBox="0 0 260 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={`w-full h-2.5 sm:h-3.5 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary, #7c3aed)" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {variant === "arc" && (
        <path
          d="M 3 15 Q 130 3 257 15"
          stroke={color || `url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}

      {variant === "wave" && (
        <path
          d="M 3 14 Q 65 4, 130 14 T 257 14"
          stroke={color || `url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}

      {variant === "double" && (
        <>
          <path
            d="M 3 11 Q 130 2 257 11"
            stroke={color || `url(#${gradientId})`}
            strokeWidth={strokeWidth * 0.8}
            strokeLinecap="round"
          />
          <path
            d="M 12 17 Q 130 9 248 17"
            stroke={color || `url(#${gradientId})`}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
            opacity="0.8"
          />
        </>
      )}
    </svg>
  );
};

export interface HighlightTextProps {
  children: React.ReactNode;
  className?: string;
  underlineClassName?: string;
  variant?: "arc" | "wave" | "double";
  color?: string;
}

/**
 * Convenient wrapper component to highlight text with a curved swoosh underline.
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
  children,
  className = "",
  underlineClassName = "",
  variant = "arc",
  color,
}) => {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      <span>{children}</span>
      <CurvedUnderline
        variant={variant}
        color={color}
        className={`absolute -bottom-2 sm:-bottom-2.5 left-0 w-full ${underlineClassName}`}
      />
    </span>
  );
};

export default CurvedUnderline;
