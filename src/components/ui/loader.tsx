import React from "react";
import Image from "next/image";

export interface LoaderProps {
  /** Size variant of the loader */
  size?: "sm" | "md" | "lg" | "xl";
  /** Layout presentation variant */
  variant?: "fullScreen" | "page" | "inline" | "overlay";
  /** Optional loading text displayed underneath the progress bar */
  text?: string;
  /** Determinate progress percentage (0-100). If omitted, displays indeterminate sliding animation */
  progress?: number;
  /** Whether to show the breathing animation on the Fluentia logo */
  animatedLogo?: boolean;
  /** Additional CSS class for the root container */
  className?: string;
  /** Custom logo size in pixels if overriding default */
  logoSize?: number;
}

const sizeConfig = {
  sm: {
    logo: 36,
    barWidth: "w-28",
    barHeight: "h-1",
    gap: "gap-3",
    textSize: "text-xs",
  },
  md: {
    logo: 48,
    barWidth: "w-40 sm:w-48",
    barHeight: "h-1",
    gap: "gap-4",
    textSize: "text-sm",
  },
  lg: {
    logo: 64,
    barWidth: "w-52 sm:w-64",
    barHeight: "h-1.5",
    gap: "gap-5",
    textSize: "text-base",
  },
  xl: {
    logo: 80,
    barWidth: "w-64 sm:w-72",
    barHeight: "h-1.5",
    gap: "gap-6",
    textSize: "text-lg",
  },
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "page",
  text,
  progress,
  animatedLogo = true,
  className = "",
  logoSize,
}) => {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  const computedLogoSize = logoSize ?? currentSize.logo;

  // Robust container styling per variant without broken opacity classes
  const variantStyles = {
    fullScreen:
      "fixed inset-0 z-50 bg-[#faf5ff]/95 dark:bg-[#070510]/95 backdrop-blur-md flex items-center justify-center min-h-screen",
    page: "flex-1 min-h-[50vh] w-full flex items-center justify-center p-6",
    inline: "w-full py-6 flex items-center justify-center",
    overlay:
      "absolute inset-0 z-40 bg-[#faf5ff]/90 dark:bg-[#070510]/90 backdrop-blur-sm flex items-center justify-center rounded-[inherit]",
  };

  const isDeterminate = typeof progress === "number" && !isNaN(progress);
  const clampedProgress = isDeterminate
    ? Math.min(100, Math.max(0, progress))
    : 0;

  return (
    <div
      role="status"
      aria-label={text || "Loading..."}
      aria-live="polite"
      className={`${variantStyles[variant]} ${className}`}
    >
      <div
        className={`flex flex-col items-center justify-center ${currentSize.gap} select-none`}
      >
        {/* Fluentia Logo Mark */}
        <div
          className={`relative flex items-center justify-center ${
            animatedLogo ? "animate-logo-breathe" : ""
          }`}
          style={{ width: `${computedLogoSize}px`, height: `${computedLogoSize}px` }}
        >
          <Image
            src="/logo.png"
            alt="Fluentia"
            width={computedLogoSize}
            height={computedLogoSize}
            className="object-contain w-full h-full"
            priority
          />
        </div>

        {/* Horizontal Loader Bar */}
        <div
          className={`relative ${currentSize.barWidth} ${currentSize.barHeight} rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800`}
        >
          {isDeterminate ? (
            <div
              className="h-full bg-slate-900 dark:bg-white transition-all duration-300 ease-out rounded-full"
              style={{ width: `${clampedProgress}%` }}
            />
          ) : (
            <div className="fluentia-loader-bar h-full rounded-full bg-slate-900 dark:bg-white" />
          )}
        </div>

        {/* Optional Subtext */}
        {text && (
          <p
            className={`${currentSize.textSize} font-medium text-slate-600 dark:text-slate-400 tracking-tight animate-pulse`}
          >
            {text}
          </p>
        )}

        <span className="sr-only">{text || "Loading..."}</span>
      </div>
    </div>
  );
};

export default Loader;
