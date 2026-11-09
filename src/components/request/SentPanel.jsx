import { CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { site } from "../../content/site.js";
import { Button } from "../ui/Button.jsx";

/** Replaces the form after a successful send. Focus moves to the heading. */
export function SentPanel({ reference, email, onAgain }) {
  const t = site.request.sent;
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div>
      <CircleCheck aria-hidden="true" size={32} strokeWidth={1.75} className="text-success-text" />
      <h2 ref={heading} tabIndex={-1} className="mt-4 text-h1 font-semibold">
        {t.title}
      </h2>
      <p className="mt-4 text-sm text-text-secondary">{t.reference}</p>
      <p className="mt-1 font-mono text-h2 font-bold tracking-normal text-primary-text">
        {reference}
      </p>
      <p className="mt-4 text-base text-text-secondary">{t.copy(email)}</p>
      <Button variant="secondary" onClick={onAgain} className="mt-8 w-full sm:w-auto">
        {t.again}
      </Button>
    </div>
  );
}
