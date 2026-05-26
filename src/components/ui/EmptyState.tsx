import * as React from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  emoji = "📭",
  title = "Nenhum registro",
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center",
        "px-4 py-16 text-center",
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center",
          "rounded-2xl bg-slate-100 text-2xl",
          "dark:bg-slate-800"
        )}
      >
        {icon ?? <span>{emoji}</span>}
      </div>

      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </h3>

      {message && (
        <p
          className={cn(
            "mt-1 max-w-xs text-xs leading-relaxed",
            "text-slate-400 dark:text-slate-500"
          )}
        >
          {message}
        </p>
      )}

      {action && (
        <div className="mt-5 flex items-center justify-center">
          {action}
        </div>
      )}
    </div>
  );
}

EmptyState.displayName = "EmptyState";