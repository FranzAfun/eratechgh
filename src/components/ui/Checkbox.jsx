import { Check } from "lucide-react";
import { useId } from "react";

/** Checkbox with a 44 px tap row. The label is the whole row. */
export function Checkbox({ id: idProp, label, hint, className = "", inputRef, ...inputProps }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-3">
        <span className="relative mt-0.5 grid flex-none place-items-center">
          <input
            id={id}
            ref={inputRef}
            type="checkbox"
            className="checkbox-input peer"
            aria-describedby={hint ? `${id}-hint` : undefined}
            {...inputProps}
          />
          <Check
            aria-hidden="true"
            size={14}
            strokeWidth={3}
            className="pointer-events-none absolute text-on-primary opacity-0 peer-checked:opacity-100"
          />
        </span>
        <span className="text-base text-text-primary">{label}</span>
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-1 pl-8 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
