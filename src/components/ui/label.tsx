import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-xs font-bold text-ink-soft uppercase tracking-wider peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };
