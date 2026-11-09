import { useId } from "react";
import { describedBy, FieldShell } from "./FieldShell.jsx";

/** Single-line input. Label always visible; only optional fields say "(optional)". */
export function TextField({
  id: idProp,
  label,
  optional = false,
  hint,
  error,
  icon,
  shake,
  className,
  inputRef,
  ...inputProps
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell
      id={id}
      label={label}
      optional={optional}
      hint={hint}
      error={error}
      icon={icon}
      shake={shake}
      className={className}
    >
      <input
        id={id}
        ref={inputRef}
        className={`field-control ${icon ? "has-icon" : ""}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, { hint, error })}
        required={!optional || undefined}
        {...inputProps}
      />
    </FieldShell>
  );
}
