import { Check } from "lucide-react";
import { useId } from "react";

/**
 * Checkbox with a 44 px tap row. The label is the whole row (it may contain a link).
 * `error` shows under it (red box border + message); `shake` plays the one-off shake.
 */
export function Checkbox({
  id: idProp,
  label,
  hint,
  error,
  shake,
  required,
  className = "",
  inputRef,
  ...inputProps
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={className}>
      <div className={`flex min-h-11 items-start gap-3 py-3 ${shake ? "shake" : ""}`}>
        <span className="relative mt-0.5 grid flex-none place-items-center">
          <input
            id={id}
            ref={inputRef}
            type="checkbox"
            className={`checkbox-input peer ${error ? "is-invalid" : ""}`}
            aria-invalid={error ? "true" : undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy || undefined}
            {...inputProps}
          />
          <Check
            aria-hidden="true"
            size={14}
            strokeWidth={3}
            className="pointer-events-none absolute text-on-primary opacity-0 peer-checked:opacity-100"
          />
        </span>
        <label htmlFor={id} className="cursor-pointer text-base text-text-primary">
          {label}
        </label>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-1 pl-8 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="-mt-1 pl-8 text-sm text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
