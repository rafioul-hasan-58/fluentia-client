import React from "react";

export interface FlowArrowProps {
  className?: string;
  color?: string;
  direction?: "right" | "down" | "left" | "up";
  animated?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export const FlowArrow: React.FC<FlowArrowProps> = ({
  className = "w-10 h-6",
  color,
  direction = "right",
  animated = true,
  speed = "normal",
}) => {
  const reactId = React.useId();
  const id = reactId.replace(/[^a-zA-Z0-9]/g, "");

  const rotationClass =
    direction === "down"
      ? "rotate-90"
      : direction === "left"
      ? "rotate-180"
      : direction === "up"
      ? "-rotate-90"
      : "";

  const duration = speed === "fast" ? "1.2s" : speed === "slow" ? "2.6s" : "1.8s";

  return (
    <div
      className={`inline-flex items-center justify-center select-none pointer-events-none transition-transform duration-300 ${rotationClass}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 46 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Flowing Left-to-Right Gradient Shimmer */}
          <linearGradient
            id={`shimmerGrad_${id}`}
            x1="-100%"
            y1="0%"
            x2="200%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#059669" />
            <stop offset="25%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#6EE7B7" />
            <stop offset="75%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
            {animated && (
              <>
                <animate
                  attributeName="x1"
                  from="-100%"
                  to="100%"
                  dur={duration}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  from="0%"
                  to="200%"
                  dur={duration}
                  repeatCount="indefinite"
                />
              </>
            )}
          </linearGradient>

          {/* Fallback Static Gradient */}
          <linearGradient
            id={`baseGrad_${id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>

          {animated && (
            <style>{`
              @keyframes flowBody_${id} {
                0%, 100% {
                  opacity: 0.88;
                  transform: translateX(0px);
                }
                25% {
                  opacity: 1;
                  transform: translateX(1.5px);
                  filter: drop-shadow(0 0 4px rgba(52, 211, 153, 0.8));
                }
                50% {
                  opacity: 0.88;
                  transform: translateX(0px);
                }
              }

              @keyframes flowChevron1_${id} {
                0%, 100% {
                  opacity: 0.45;
                  transform: translateX(0px);
                }
                45% {
                  opacity: 1;
                  transform: translateX(2px);
                  filter: drop-shadow(0 0 5px rgba(52, 211, 153, 0.9));
                }
                70% {
                  opacity: 0.45;
                  transform: translateX(0px);
                }
              }

              @keyframes flowChevron2_${id} {
                0%, 100% {
                  opacity: 0.22;
                  transform: translateX(0px);
                }
                65% {
                  opacity: 0.95;
                  transform: translateX(2.5px);
                  filter: drop-shadow(0 0 6px rgba(110, 231, 183, 1));
                }
                90% {
                  opacity: 0.22;
                  transform: translateX(0px);
                }
              }

              .arrow-body-${id} {
                animation: flowBody_${id} ${duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;
                transform-origin: center left;
              }

              .arrow-chev1-${id} {
                animation: flowChevron1_${id} ${duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;
                transform-origin: center left;
              }

              .arrow-chev2-${id} {
                animation: flowChevron2_${id} ${duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;
                transform-origin: center left;
              }
            `}</style>
          )}
        </defs>

        {/* 1. Main Solid Block Arrow (Left) */}
        <path
          className={animated ? `arrow-body-${id}` : ""}
          d="M3 8.5C1.89543 8.5 1 9.39543 1 10.5V15.5C1 16.6046 1.89543 17.5 3 17.5H15V23.5C15 24.45 16.14 24.94 16.82 24.28L25.32 15.78C26.15 14.95 26.15 13.05 25.32 12.22L16.82 3.72C16.14 3.06 15 3.55 15 4.5V8.5H3Z"
          fill={color ? color : `url(#shimmerGrad_${id})`}
        />

        {/* 2. 1st Chevron Trail (Middle) */}
        <path
          className={animated ? `arrow-chev1-${id}` : ""}
          d="M24 3.5L33.5 13L24 22.5"
          stroke={color ? color : `url(#shimmerGrad_${id})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={animated ? "0.8" : "0.65"}
        />

        {/* 3. 2nd Chevron Trail (Right) */}
        <path
          className={animated ? `arrow-chev2-${id}` : ""}
          d="M32.5 3.5L42 13L32.5 22.5"
          stroke={color ? color : `url(#shimmerGrad_${id})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={animated ? "0.6" : "0.32"}
        />
      </svg>
    </div>
  );
};

export default FlowArrow;
