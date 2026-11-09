import { CircleCheck } from "lucide-react";
import { site } from "../../content/site.js";
import { SERVICE_ICONS } from "../serviceIcons.js";

/**
 * Service picker: three selectable cards (icon, name, price) on native radios.
 * Choosing one changes the URL to /request/<service>.
 */
export function ServicePicker({ value, onChange }) {
  const t = site.request;
  return (
    <fieldset>
      <legend className="text-h3 font-semibold">{t.pickerLabel}</legend>
      {!value ? <p className="mt-1 text-sm text-text-muted">{t.pickerHint}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {site.services.map((s) => {
          const id = `service-${s.slug}`;
          const checked = value === s.slug;
          const Icon = SERVICE_ICONS[s.icon];
          return (
            <label
              key={s.slug}
              htmlFor={id}
              className={`picker-card relative flex cursor-pointer gap-3 rounded-card p-4 sm:flex-col sm:gap-4 ${
                checked ? "is-checked" : ""
              }`}
            >
              <input
                id={id}
                type="radio"
                name="service"
                value={s.slug}
                checked={checked}
                onChange={() => onChange(s.slug)}
                className="sr-only"
              />
              <span
                className={`grid size-11 flex-none place-items-center rounded-card ${
                  checked ? "bg-primary text-on-primary" : "bg-surface-strong text-primary-text"
                }`}
              >
                <Icon aria-hidden="true" size={22} strokeWidth={1.75} />
              </span>
              <span className="flex min-w-0 flex-col gap-1 pr-6">
                <span className="text-base font-semibold text-text-primary">{s.name}</span>
                <span className="text-sm font-semibold text-primary-text">{s.price}</span>
              </span>
              <CircleCheck
                aria-hidden="true"
                size={20}
                strokeWidth={2}
                className={`absolute top-4 right-4 text-primary-text transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
