/** Label, hint, error and optional icon around a form control. Shared by TextField/TextArea/Dropdown. */
export function FieldShell({
  id,
  labelId,
  label,
  optional,
  hint,
  error,
  icon: Icon,
  shake,
  className = "",
  children,
}) {
  return (
    <div className={className}>
      <label id={labelId} htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
        {optional ? <span className="font-normal text-text-muted"> (optional)</span> : null}
      </label>
      <div className={`relative mt-2 ${shake ? "shake" : ""}`}>
        {Icon ? (
          <Icon
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
          />
        ) : null}
        {children}
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** aria-describedby for a control: hint while valid, error when invalid. */
export function describedBy(id, { hint, error, extra } = {}) {
  const ids = [error ? `${id}-error` : hint ? `${id}-hint` : null, extra].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}
