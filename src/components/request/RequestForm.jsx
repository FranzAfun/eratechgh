import { Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { site } from "../../content/site.js";
import {
  addDays,
  DETAIL_FIELDS,
  fieldOrder,
  MAX_LENGTHS,
  MIN_FILL_MS,
  PREFERRED_TIMES,
  priceLine,
  PROJECT_AREAS,
  SERVICE_FIELDS,
  todayGhana,
  validateField,
} from "../../lib/request-rules.js";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Dropdown } from "../ui/Dropdown.jsx";
import { InfoNote } from "../ui/InfoNote.jsx";
import { TextArea } from "../ui/TextArea.jsx";
import { TextField } from "../ui/TextField.jsx";
import { ServicePicker } from "./ServicePicker.jsx";
import { SentPanel } from "./SentPanel.jsx";
import { Turnstile } from "./Turnstile.jsx";

const t = site.request;
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  town: "",
  components: "",
  neededBy: "",
  projectTitle: "",
  projectArea: "",
  description: "",
  abstract: "",
  guidance: "",
  preferredDate: "",
  preferredTime: "",
  discountRequested: false,
  storeOptIn: false,
  website: "", // honeypot: people never see or fill it
};

const ICONS = { fullName: User, email: Mail, phone: Phone, town: MapPin };
const INPUT_ATTRS = {
  fullName: { autoComplete: "name" },
  email: { type: "email", autoComplete: "email", inputMode: "email", spellCheck: false },
  phone: { type: "tel", autoComplete: "tel", inputMode: "tel" },
  town: { autoComplete: "address-level2" },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function RequestForm({ service }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [shake, setShake] = useState({ field: null, n: 0 });
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [formError, setFormError] = useState(null);
  const [checkError, setCheckError] = useState(null);
  const [token, setToken] = useState(null);
  const [sent, setSent] = useState(null); // { reference, email }
  const [formKey, setFormKey] = useState(0);
  const startedAt = useRef(0);
  const refs = useRef({});
  const turnstile = useRef(null);
  const today = todayGhana();

  // Form start time is set in the browser (the page itself is prerendered).
  useEffect(() => {
    startedAt.current = Date.now();
  }, [formKey]);

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setServerErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const errorFor = (name) =>
    serverErrors[name] ?? (touched[name] ? validateField(name, values[name], { today }) : null);

  const field = (name) => ({
    id: `f-${name}`,
    name,
    label: t.labels[name],
    value: values[name],
    onChange: (event) => set(name, event.target.value),
    onBlur: () => setTouched((x) => (x[name] ? x : { ...x, [name]: true })),
    error: errorFor(name),
    shake: shake.field === name ? shake.n : 0,
    inputRef: (el) => {
      refs.current[name] = el;
    },
    maxLength: MAX_LENGTHS[name],
    hint: t.hints[name],
  });

  const focusFirstError = (errors) => {
    const first = fieldOrder(service).find((name) => errors[name]);
    if (!first) return;
    const el = refs.current[first];
    el?.focus();
    el?.scrollIntoView?.({ block: "center" });
    setShake((s) => ({ field: first, n: s.n + 1 }));
    // Clear it after the animation so the next failed send can shake again.
    setTimeout(() => setShake((s) => ({ ...s, field: null })), 450);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending" || !service) return;
    setFormError(null);
    setCheckError(null);

    const names = fieldOrder(service);
    const errors = {};
    for (const name of names) {
      const error = validateField(name, values[name], { today });
      if (error) errors[name] = error;
    }
    setTouched(Object.fromEntries(names.map((n) => [n, true])));
    if (Object.keys(errors).length > 0) {
      focusFirstError(errors);
      return;
    }
    if (!token) {
      setCheckError(SITE_KEY ? t.errors.check : t.errors.checkMissing);
      return;
    }

    setStatus("sending");
    // Min fill time is soft: a fast human just waits a moment instead of getting an error.
    const wait = startedAt.current + MIN_FILL_MS + 250 - Date.now();
    if (wait > 0) await sleep(wait);

    const payload = { service };
    for (const name of [...SERVICE_FIELDS[service], ...DETAIL_FIELDS, "storeOptIn"]) {
      payload[name] = values[name];
    }
    payload.website = values.website;
    payload.startedAt = startedAt.current;
    payload.turnstileToken = token;

    let response = null;
    let body = null;
    try {
      response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      body = await response.json().catch(() => null);
    } catch {
      // Network error: handled below with the generic message.
    }

    if (response?.ok && body?.reference) {
      setSent({ reference: body.reference, email: values.email.trim() });
      setStatus("sent");
      return;
    }

    // Every token is single-use: get a fresh one before the next try.
    turnstile.current?.reset();
    setStatus("idle");

    if (response?.status === 429) {
      setFormError(t.errors.tooMany);
    } else if (body?.error === "turnstile") {
      setCheckError(t.errors.check);
    } else if (body?.error === "validation" && body.fields) {
      setServerErrors(body.fields);
      focusFirstError(body.fields);
    } else {
      setFormError(t.errors.server + (site.teamEmail ? t.errors.serverEmail(site.teamEmail) : "."));
    }
  };

  const sendAnother = () => {
    setValues({ ...EMPTY });
    setTouched({});
    setServerErrors({});
    setFormError(null);
    setCheckError(null);
    setToken(null);
    setSent(null);
    setStatus("idle");
    setFormKey((k) => k + 1);
  };

  const pickService = (slug) => {
    setServerErrors({});
    setFormError(null);
    navigate(`/request/${slug}`, { preventScrollReset: true });
  };

  if (status === "sent" && sent) {
    return (
      <Shell>
        <SentPanel reference={sent.reference} email={sent.email} onAgain={sendAnother} />
      </Shell>
    );
  }

  const busy = status === "sending";

  return (
    <Shell>
      <h1 className="text-h1 font-semibold">{t.title}</h1>
      <p className="mt-3 text-base text-text-secondary">{t.intro}</p>

      <form key={formKey} noValidate onSubmit={onSubmit} className="mt-8" aria-busy={busy}>
        <ServicePicker value={service} onChange={pickService} />

        {service ? (
          <>
            <Group title={site.services.find((s) => s.slug === service).name}>
              <ServiceFields
                service={service}
                field={field}
                values={values}
                set={set}
                today={today}
              />
            </Group>

            <Group title={t.detailsTitle}>
              {DETAIL_FIELDS.map((name) => (
                <TextField key={name} icon={ICONS[name]} {...INPUT_ATTRS[name]} {...field(name)} />
              ))}
            </Group>

            <Group title={t.extrasTitle}>
              <Checkbox
                id="f-storeOptIn"
                name="storeOptIn"
                label={t.labels.storeOptIn}
                checked={values.storeOptIn}
                onChange={(e) => set("storeOptIn", e.target.checked)}
              />
            </Group>

            {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="f-website">Website</label>
              <input
                id="f-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>

            <Group title={t.checkTitle}>
              <p id="check-hint" className="-mt-2 text-sm text-text-muted">
                {t.checkHint}
              </p>
              {SITE_KEY ? (
                <Turnstile
                  key={formKey}
                  siteKey={SITE_KEY}
                  controlRef={turnstile}
                  describedBy="check-hint"
                  onToken={setToken}
                />
              ) : null}
              {checkError ? (
                <p role="alert" className="text-sm text-danger-text">
                  {checkError}
                </p>
              ) : null}
            </Group>

            <div className="mt-8 border-t border-border pt-6">
              {formError ? (
                <p
                  role="alert"
                  className="mb-4 rounded-card border border-danger-text/30 bg-surface p-4 text-sm text-danger-text"
                >
                  {formError}
                </p>
              ) : null}
              <Button type="submit" busy={busy} busyLabel={t.sending} className="w-full sm:w-auto">
                {t.send}
              </Button>
              <p className="mt-4 text-sm text-text-muted">
                {t.consent}
                {site.privacyUrl ? (
                  <>
                    {" "}
                    <a
                      className="text-primary-text underline underline-offset-3"
                      href={site.privacyUrl}
                      rel="noopener"
                    >
                      {t.privacy}
                    </a>
                    .
                  </>
                ) : null}
              </p>
            </div>
          </>
        ) : null}
      </form>
    </Shell>
  );
}

function Shell({ children }) {
  return <section className="mx-auto max-w-form px-4 py-10 md:py-14">{children}</section>;
}

function Group({ title, children }) {
  return (
    <fieldset className="mt-8 border-t border-border pt-6">
      <legend className="float-left mb-4 w-full text-h3 font-semibold">{title}</legend>
      <div className="clear-left flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}

function ServiceFields({ service, field, values, set, today }) {
  const area = field("projectArea");
  const time = field("preferredTime");
  if (service === "sourcing") {
    return (
      <>
        <InfoNote>{t.notes.sourcing}</InfoNote>
        <TextArea rows={6} {...field("components")} />
        <TextField type="date" optional min={today} {...field("neededBy")} />
      </>
    );
  }
  if (service === "assessment") {
    return (
      <>
        <PriceRow price={priceLine("assessment")} />
        <InfoNote>{t.notes.assessment}</InfoNote>
        <TextField {...field("projectTitle")} />
        <Dropdown
          id={area.id}
          label={area.label}
          optional
          placeholder={t.placeholders.choose}
          options={PROJECT_AREAS}
          value={values.projectArea}
          onChange={(v) => set("projectArea", v)}
          onBlur={area.onBlur}
          error={area.error}
          shake={area.shake}
          buttonRef={area.inputRef}
        />
        <TextArea optional rows={4} {...field("description")} />
      </>
    );
  }
  return (
    <>
      <PriceRow price={priceLine("consultation", values.discountRequested)} />
      <InfoNote>{t.notes.consultation}</InfoNote>
      <TextField {...field("projectTitle")} />
      <TextArea rows={7} {...field("abstract")} />
      <TextArea rows={4} {...field("guidance")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          type="date"
          min={addDays(today, 1)}

          {...field("preferredDate")}
        />
        <Dropdown
          id={time.id}
          label={time.label}
          placeholder={t.placeholders.choose}
          options={PREFERRED_TIMES}
          value={values.preferredTime}
          onChange={(v) => set("preferredTime", v)}
          onBlur={time.onBlur}
          error={time.error}
          shake={time.shake}
          buttonRef={time.inputRef}
        />
      </div>
      <Checkbox
        id="f-discountRequested"
        name="discountRequested"
        label={t.labels.discountRequested}
        checked={values.discountRequested}
        onChange={(e) => set("discountRequested", e.target.checked)}
      />
    </>
  );
}

function PriceRow({ price }) {
  return (
    <p className="flex items-baseline justify-between gap-4 rounded-card bg-surface-soft px-4 py-3">
      <span className="text-sm text-text-secondary">{t.priceLabel}</span>
      <span aria-live="polite" className="text-h3 font-bold text-primary-text">
        {price}
      </span>
    </p>
  );
}
