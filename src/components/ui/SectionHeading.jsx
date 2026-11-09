/** Section title (h2 by default) with an optional short intro. `tone="dark"` for dark bands. */
export function SectionHeading({
  id,
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
      <Tag
        id={id}
        className={`text-h2 font-semibold text-balance ${dark ? "text-text-inverse" : "text-text-primary"}`}
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
