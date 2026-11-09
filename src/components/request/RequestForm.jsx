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
import { SideCard } from "./SideCard.jsx";
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
  consent: false,
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
/** Milliseconds since the form appeared (event handlers only). */
const elapsedSince = (start) => Date.now() - start;

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

    // Send is aria-disabled until consent is ticked; pressing it explains why.
    if (!values.consent) {
      setTouched((x) => ({ ...x, consent: true }));
      focusFirstError({ consent: true });
      return;
    }

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
    const wait = MIN_FILL_MS + 250 - elapsedSince(startedAt.current);
    if (wait > 0) await sleep(wait);

    const payload = { service };
    for (const name of [...SERVICE_FIELDS[service], ...DETAIL_FIELDS, "storeOptIn", "consent"]) {
      payload[name] = values[name];
    }
    payload.website = values.website;
    payload.fillMs = elapsedSince(startedAt.current);
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

  const busy = status === "sending";
  const consentError = errorFor("consent");

  return (
    <>
      <PageBand />
      <div className="mx-auto max-w-content px-4 pb-16 md:px-6 md:pb-24">
        <div className="relative -mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-card border border-border bg-surface p-5 shadow-(--shadow-resting) sm:p-8">
            {status === "sent" && sent ? (
              <SentPanel reference={sent.reference} email={sent.email} onAgain={sendAnother} />
            ) : (
              <form key={formKey} noValidate onSubmit={onSubmit} aria-busy={busy}>
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
                        <TextField
                          key={name}
                          icon={ICONS[name]}
                          {...INPUT_ATTRS[name]}
                          {...field(name)}
                        />
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
                    <div
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-px w-px overflow-hidden"
                    >
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
                      <SideCard
                        compact
                        service={service}
                        discountRequested={values.discountRequested}
                        className="mb-6 lg:hidden"
                      />
                      {formError ? (
                        <p
                          role="alert"
                          className="mb-4 rounded-card border border-danger-text/30 bg-surface p-4 text-sm text-danger-text"
                        >
                          {formError}
                        </p>
                      ) : null}
                      <Checkbox
                        id="f-consent"
                        name="consent"
                        required
                        label={<ConsentLabel />}
                        checked={values.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                        error={consentError}
                        shake={shake.field === "consent" ? shake.n : 0}
                        inputRef={(el) => {
                          refs.current.consent = el;
                        }}
                      />
                      <div className="mt-4">
                        <Button
                          type="submit"
                          busy={busy}
                          locked={!values.consent}
                          busyLabel={t.sending}
                          aria-describedby={!values.consent ? "send-hint" : undefined}
                          className="w-full sm:w-auto"
                        >
                          {t.send}
                        </Button>
                        {!values.consent ? (
                          <p id="send-hint" className="mt-2 text-sm text-text-muted">
                            {t.consent.hint}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : null}
              </form>
            )}
          </div>
          <aside className="sticky top-24 hidden lg:block">
            <SideCard service={service} discountRequested={values.discountRequested} />
          </aside>
        </div>
      </div>
    </>
  );
}

function PageBand() {
  return (
    <div className="on-dark hero-ground relative isolate overflow-hidden text-text-inverse">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
      <div className="mx-auto max-w-content px-4 pt-10 pb-20 md:px-6 md:pt-14 md:pb-24">
        <p className="text-xs font-semibold tracking-eyebrow text-accent uppercase">{t.eyebrow}</p>
        <h1 className="mt-3 text-h1 font-semibold">{t.title}</h1>
        <p className="mt-3 max-w-text text-base text-text-on-dark">{t.intro}</p>
      </div>
    </div>
  );
}

function ConsentLabel() {
  const c = t.consent;
  return (
    <>
      {c.before}
      <a
        href={site.privacyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary-text underline underline-offset-3"
      >
        {c.link}
        <span className="sr-only"> {c.newTab}</span>
      </a>
      {c.after}
    </>
  );
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
      <InfoNote>{t.notes.consultation}</InfoNote>
      <TextField {...field("projectTitle")} />
      <TextArea rows={7} {...field("abstract")} />
      <TextArea rows={4} {...field("guidance")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField type="date" min={addDays(today, 1)} {...field("preferredDate")} />
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
