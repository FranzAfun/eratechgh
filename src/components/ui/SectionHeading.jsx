/**
 * Section heading (DESIGN-DIRECTION.md §4): eyebrow (xs, uppercase, tracked) + h2 + short lead.
 * `tone="dark"` for dark bands (lilac eyebrow, white title, #EBE7F1 lead).
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  align = "left",
  tone = "light",
  className = "",
}) {
  const centered = align === "center" ? "mx-auto text-center" : "";
  const dark = tone === "dark";
  return (
    <div className={`max-w-text ${centered} ${className}`}>
      {eyebrow ? (
        <p
          className={`text-xs font-semibold tracking-eyebrow uppercase ${dark ? "text-accent" : "text-primary-text"}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={`text-h2 font-semibold text-balance ${eyebrow ? "mt-3" : ""} ${dark ? "text-text-inverse" : "text-text-primary"}`}
      >
        {title}
      </Tag>
      {intro ? (
        <p className={`mt-3 text-base ${dark ? "text-text-on-dark" : "text-text-secondary"}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
