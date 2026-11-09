import { useId } from "react";
import { describedBy, FieldShell } from "./FieldShell.jsx";

/** Multi-line input with an optional character count (shown when maxLength is set). */
export function TextArea({
  id: idProp,
  label,
  optional = false,
  hint,
  error,
  shake,
  className,
  inputRef,
  rows = 5,
  value = "",
  maxLength,
  ...inputProps
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const count = maxLength ? (
    <p id={`${id}-count`} className="mt-1 text-right text-xs text-text-muted">
      {value.length.toLocaleString("en-GB")} / {maxLength.toLocaleString("en-GB")}
    </p>
  ) : null;
  return (
    <div className={className}>
      <FieldShell id={id} label={label} optional={optional} hint={hint} error={error} shake={shake}>
        <textarea
          id={id}
          ref={inputRef}
          rows={rows}
          value={value}
          maxLength={maxLength}
          className="field-control"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy(id, { hint, error })}
          required={!optional || undefined}
          {...inputProps}
        />
      </FieldShell>
      {count}
    </div>
  );
}
