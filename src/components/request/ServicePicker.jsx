import { site } from "../../content/site.js";

/** Service picker: three radio cards. Choosing one changes the URL to /request/<service>. */
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
          return (
            <label
              key={s.slug}
              htmlFor={id}
              className={`relative flex min-h-11 cursor-pointer flex-col gap-1 rounded-card border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-focus-ring ${
                checked
                  ? "border-primary bg-surface-strong"
                  : "border-ui-border bg-surface hover:bg-surface-hover"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  id={id}
                  type="radio"
                  name="service"
                  value={s.slug}
                  checked={checked}
                  onChange={() => onChange(s.slug)}
                  className="size-5 flex-none accent-primary focus-visible:outline-none"
                />
                <span className="text-base font-semibold text-text-primary">{s.name}</span>
              </span>
              <span className="pl-8 text-sm font-medium text-primary-text">{s.price}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
