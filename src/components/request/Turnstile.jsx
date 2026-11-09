import { useEffect, useImperativeHandle, useRef } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise = null;

function loadScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(window.turnstile);
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Turnstile failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * Cloudflare Turnstile (Managed). Calls onToken(token) when solved, onToken(null) when the
 * token expires or the check errors. `controlRef.current.reset()` asks for a fresh token
 * (tokens are single-use, so the form resets after every send attempt).
 * The box reserves the widget's 65 px height so nothing shifts when it appears.
 */
export function Turnstile({ siteKey, onToken, onError, controlRef, describedBy }) {
  const boxRef = useRef(null);
  const widgetRef = useRef(null);
  const handlers = useRef({ onToken, onError });
  useEffect(() => {
    handlers.current = { onToken, onError };
  });

  useImperativeHandle(controlRef, () => ({
    reset() {
      handlers.current.onToken(null);
      if (widgetRef.current != null) window.turnstile?.reset(widgetRef.current);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then((turnstile) => {
        if (cancelled || !boxRef.current) return;
        widgetRef.current = turnstile.render(boxRef.current, {
          sitekey: siteKey,
          theme: "light",
          size: "flexible",
          appearance: "always",
          "response-field": false,
          callback: (token) => handlers.current.onToken(token),
          "expired-callback": () => handlers.current.onToken(null),
          "timeout-callback": () => handlers.current.onToken(null),
          "error-callback": () => {
            handlers.current.onToken(null);
            handlers.current.onError?.();
            return true; // handled: Turnstile retries on its own
          },
        });
      })
      .catch(() => handlers.current.onError?.());
    return () => {
      cancelled = true;
      if (widgetRef.current != null) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [siteKey]);

  return <div ref={boxRef} className="min-h-[65px] w-full" aria-describedby={describedBy} />;
}
