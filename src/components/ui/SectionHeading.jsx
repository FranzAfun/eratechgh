/** Section title (h2 by default) with an optional short intro. */
export function SectionHeading({
  id,
  title,
  intro,
  as: Tag = "h2",
  align = "left",
  className = "",
}) {
  const centered = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-text ${centered} ${className}`}>
      <Tag id={id} className="text-h2 font-semibold text-balance">
        {title}
      </Tag>
      {intro ? <p className="mt-3 text-base text-text-secondary">{intro}</p> : null}
    </div>
  );
}
