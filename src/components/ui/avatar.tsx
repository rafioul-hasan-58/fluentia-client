import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Avatar({
  src,
  alt = "User Avatar",
  fallback = "U",
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [src]);

  const sizeClasses = {
    sm: "w-8 h-8 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] text-xs",
    md: "w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] max-w-[2.5rem] max-h-[2.5rem] text-sm",
    lg: "w-12 h-12 min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-[3rem] text-base",
    xl: "w-16 h-16 min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] text-xl",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 aspect-square border border-slate-200 dark:border-white/15 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold select-none shadow-sm",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center aspect-square rounded-[inherit] block pointer-events-none select-none"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <span className="uppercase tracking-wide font-display">{fallback}</span>
      )}
    </div>
  );
}
