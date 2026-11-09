import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { describedBy } from "./FieldShell.jsx";

/**
 * Custom select (never a native <select>), following the WAI-ARIA "select-only combobox" pattern.
 * Keyboard: Enter/Space/↓/↑ open · ↑/↓/Home/End move · Enter/Space pick · Esc closes · Tab picks
 * the highlighted option and moves on · typing a letter jumps to the next option starting with it.
 *
 * options: [{ value, label }]. value: the selected option's value or "" for none.
 */
export function Dropdown({
  id: idProp,
  label,
  optional = false,
  placeholder = "Choose…",
  options,
  value,
  onChange,
  onBlur,
  hint,
  error,
  shake,
  className = "",
  buttonRef,
  name,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [active, setActive] = useState(Math.max(selectedIndex, 0));
  const rootRef = useRef(null);
  const typeahead = useRef({ text: "", time: 0 });

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  const openList = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActive(index);
    setOpen(true);
  };
  const pick = (index) => {
    const option = options[index];
    if (option) onChange?.(option.value);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    const last = options.length - 1;
    const key = event.key;
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(key)) {
        event.preventDefault();
        openList(key === "ArrowUp" && selectedIndex < 0 ? last : undefined);
        return;
      }
    } else {
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          setActive((i) => Math.min(i + 1, last));
          return;
        case "ArrowUp":
          event.preventDefault();
          if (event.altKey) pick(active);
          else setActive((i) => Math.max(i - 1, 0));
          return;
        case "Home":
        case "PageUp":
          event.preventDefault();
          setActive(0);
          return;
        case "End":
        case "PageDown":
          event.preventDefault();
          setActive(last);
          return;
        case "Enter":
        case " ":
          event.preventDefault();
          pick(active);
          return;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          return;
        case "Tab":
          pick(active);
          return;
      }
    }
    // Typeahead: printable characters jump to a matching option.
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      const t = typeahead.current;
      t.text = now - t.time > 500 ? key.toLowerCase() : t.text + key.toLowerCase();
      t.time = now;
      const start = open ? active : Math.max(selectedIndex, 0);
      const order = [...options.keys()].map((k) => (start + 1 + k) % options.length);
      const match = order.find((i) => options[i].label.toLowerCase().startsWith(t.text));
      if (match !== undefined) {
        if (open) setActive(match);
        else onChange?.(options[match].value);
      }
    }
  };

  const selected = options[selectedIndex];

  return (
    <div className={className} ref={rootRef}>
      <span id={labelId} className="block text-sm font-medium text-text-primary">
        {label}
        {optional ? <span className="font-normal text-text-muted"> (optional)</span> : null}
      </span>
      <div className={`relative mt-2 ${shake ? "shake" : ""}`}>
        <button
          id={id}
          ref={buttonRef}
          name={name}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${id}`}
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy(id, { hint, error })}
          aria-required={!optional || undefined}
          className="field-control flex cursor-pointer items-center justify-between gap-2 text-left"
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget)) {
              setOpen(false);
              onBlur?.(event);
            }
          }}
        >
          <span className={selected ? "text-text-primary" : "text-text-muted"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            className={`flex-none text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          hidden={!open}
          className="dropdown-list absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-control border border-border bg-surface p-1 shadow-(--shadow-overlay)"
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            return (
              // Options are picked with the mouse here; the keyboard is handled on the combobox.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-control px-3 text-base ${
                  index === active ? "bg-surface-hover" : ""
                } ${isSelected ? "font-medium text-primary-text" : "text-text-primary"}`}
                onPointerMove={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => pick(index)}
              >
                {option.label}
                {isSelected ? <Check aria-hidden="true" size={16} strokeWidth={2} /> : null}
              </li>
            );
          })}
        </ul>
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
