import { ThinkingOrb } from "thinking-orbs";
import { Link } from "react-router";

const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
};

/**
 * Button or link styled as a button.
 * - `to` renders a router Link, `href` a plain anchor, otherwise a <button>.
 * - `busy` locks the button (stays focusable, ignores presses) and shows the loader + `busyLabel`.
 * - `locked` looks disabled and sets aria-disabled but stays focusable and still receives presses
 *   (the form explains what's missing).
 * - `block` makes it full width (main actions on phones: pass `className="w-full sm:w-auto"`).
 */
export function Button({
  variant = "primary",
  to,
  href,
  busy = false,
  locked = false,
  busyLabel = "Sending…",
  type = "button",
  className = "",
  children,
  onClick,
  ...rest
}) {
  const classes =
    `btn ${VARIANTS[variant]} ${locked && !busy ? "is-locked" : ""} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      aria-disabled={busy || locked || undefined}
      onClick={(event) => {
        if (busy) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {busy ? (
        <>
          <ThinkingOrb
            state="working"
            size={20}
            theme={variant === "primary" ? "dark" : "light"}
            aria-hidden="true"
          />
          <span>{busyLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
