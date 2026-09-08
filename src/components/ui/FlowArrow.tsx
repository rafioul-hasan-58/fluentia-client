import React from "react";

export interface FlowArrowProps {
  className?: string;
  color?: string;
  direction?: "right" | "down" | "left" | "up";
  animated?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export const FlowArrow: React.FC<FlowArrowProps> = ({
  className,
  color,
  direction = "right",
  animated = true,
  speed = "normal",
}) => {
  const reactId = React.useId();
  const id = reactId.replace(/[^a-zA-Z0-9]/g, "");

  const isVertical = direction === "down" || direction === "up";
  const duration = speed === "fast" ? "1.2s" : speed === "slow" ? "2.6s" : "1.8s";
  const sizeClass = className || (isVertical ? "w-6 h-10" : "w-12 h-6 sm:w-14 sm:h-7");

  if (isVertical) {
    return (
      <div
        className={`inline-flex items-center justify-center select-none pointer-events-none ${
          direction === "up" ? "rotate-180" : ""
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 28 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClass}
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Top-to-Bottom Moving Shimmer Gradient */}
            <linearGradient
              id={`shimmerGradV_${id}`}
              x1="0%"
              y1="-100%"
              x2="0%"
              y2="200%"
            >
              <stop offset="0%" stopColor="#059669" />
              <stop offset="25%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#6EE7B7" />
              <stop offset="75%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
              {animated && (
                <>
                  <animate
                    attributeName="y1"
                    from="-100%"
                    to="100%"
                    dur={duration}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y2"
                    from="0%"
                    to="200%"
                    dur={duration}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </linearGradient>

            {animated && (
              <style>{`
                @keyframes flowBodyV_${id} {
                  0%, 100% { opacity: 0.9; transform: translateY(0px); }
                  25% { opacity: 1; transform: translateY(2px); filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.9)); }
                  50% { opacity: 0.9; transform: translateY(0px); }
                }
                @keyframes flowChevron1V_${id} {
                  0%, 100% { opacity: 0.5; transform: translateY(0px); }
                  45% { opacity: 1; transform: translateY(2.5px); filter: drop-shadow(0 0 7px rgba(52, 211, 153, 1)); }
                  70% { opacity: 0.5; transform: translateY(0px); }
                }
                @keyframes flowChevron2V_${id} {
                  0%, 100% { opacity: 0.25; transform: translateY(0px); }
                  65% { opacity: 1; transform: translateY(3px); filter: drop-shadow(0 0 8px rgba(110, 231, 183, 1)); }
                  90% { opacity: 0.25; transform: translateY(0px); }
                }
                .arrow-body-v-${id} {
                  animation: flowBodyV_${id} ${duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  transform-origin: top center;
                }
                .arrow-chev1-v-${id} {
                  animation: flowChevron1V_${id} ${duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  transform-origin: top center;
                }
                .arrow-chev2-v-${id} {
                  animation: flowChevron2V_${id} ${duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  transform-origin: top center;
                }
              `}</style>
            )}
          </defs>

          {/* Solid Block Arrow (Top) */}
          <path
            className={animated ? `arrow-body-v-${id}` : ""}
            d="M8 3C8 1.89543 8.89543 1 10 1H18C19.1046 1 20 1.89543 20 3V15H25.2C26.15 15 26.65 16.14 25.98 16.82L17.98 24.82C15.85 26.95 12.15 26.95 10.02 24.82L2.02 16.82C1.35 16.14 1.85 15 2.8 15H8V3Z"
            fill={color ? color : `url(#shimmerGradV_${id})`}
          />

          {/* 1st Chevron Trail (Middle) */}
          <path
            className={animated ? `arrow-chev1-v-${id}` : ""}
            d="M3 26L14 37L25 26"
            stroke={color ? color : `url(#shimmerGradV_${id})`}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={animated ? "0.85" : "0.7"}
          />

          {/* 2nd Chevron Trail (Bottom) */}
          <path
            className={animated ? `arrow-chev2-v-${id}` : ""}
            d="M3 38L14 49L25 38"
            stroke={color ? color : `url(#shimmerGradV_${id})`}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={animated ? "0.65" : "0.35"}
          />
        </svg>
      </div>
    );
  }

  // Horizontal (Right / Left)
  return (
    <div
      className={`inline-flex items-center justify-center select-none pointer-events-none transition-transform duration-300 ${
        direction === "left" ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 56 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClass}
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

          {animated && (
            <style>{`
              @keyframes flowBody_${id} {
                0%, 100% { opacity: 0.9; transform: translateX(0px); }
                25% { opacity: 1; transform: translateX(2px); filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.9)); }
                50% { opacity: 0.9; transform: translateX(0px); }
              }
              @keyframes flowChevron1_${id} {
                0%, 100% { opacity: 0.5; transform: translateX(0px); }
                45% { opacity: 1; transform: translateX(2.5px); filter: drop-shadow(0 0 7px rgba(52, 211, 153, 1)); }
                70% { opacity: 0.5; transform: translateX(0px); }
              }
              @keyframes flowChevron2_${id} {
                0%, 100% { opacity: 0.25; transform: translateX(0px); }
                65% { opacity: 1; transform: translateX(3px); filter: drop-shadow(0 0 8px rgba(110, 231, 183, 1)); }
                90% { opacity: 0.25; transform: translateX(0px); }
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

        {/* 1. Heavy Solid Block Arrow (Left) */}
        <path
          className={animated ? `arrow-body-${id}` : ""}
          d="M3 8C1.89543 8 1 8.89543 1 10V18C1 19.1046 1.89543 20 3 20H15V25.2C15 26.15 16.14 26.65 16.82 25.98L24.82 17.98C26.95 15.85 26.95 12.15 24.82 10.02L16.82 2.02C16.14 1.35 15 1.85 15 2.8V8H3Z"
          fill={color ? color : `url(#shimmerGrad_${id})`}
        />

        {/* 2. Heavy 1st Chevron Trail (Middle) */}
        <path
          className={animated ? `arrow-chev1-${id}` : ""}
          d="M26 3L37 14L26 25"
          stroke={color ? color : `url(#shimmerGrad_${id})`}
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={animated ? "0.85" : "0.7"}
        />

        {/* 3. Heavy 2nd Chevron Trail (Right) */}
        <path
          className={animated ? `arrow-chev2-${id}` : ""}
          d="M38 3L49 14L38 25"
          stroke={color ? color : `url(#shimmerGrad_${id})`}
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={animated ? "0.65" : "0.35"}
        />
      </svg>
    </div>
  );
};

export default FlowArrow;
