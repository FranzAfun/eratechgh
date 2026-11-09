import { Info } from "lucide-react";

/** A calm note: icon + short text on the strong surface. */
export function InfoNote({ children, icon: Icon = Info, className = "" }) {
  return (
    <div
      className={`flex gap-3 rounded-card bg-surface-strong p-4 text-sm text-text-secondary ${className}`}
    >
      <Icon
        aria-hidden="true"
        size={18}
        strokeWidth={1.75}
        className="mt-px flex-none text-primary-text"
      />
      <div>{children}</div>
    </div>
  );
}
