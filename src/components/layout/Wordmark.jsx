import { site } from "../../content/site.js";

/** Supplied white logo on dark grounds. The surrounding home link owns its accessible name. */
export function Wordmark({ variant = "header" }) {
  const logo = site.logo[variant];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 align-middle whitespace-nowrap font-semibold text-text-inverse ${
        variant === "drawer" ? "text-base" : "text-h3"
      }`}
    >
      <picture className="block shrink-0">
        <source type="image/webp" srcSet={logo.srcSet} />
        <img
          src={logo.fallback}
          srcSet={logo.fallbackSrcSet}
          width={logo.width}
          height={logo.height}
          alt=""
          className="block"
        />
      </picture>
      {variant !== "header" ? (
        <>
          <span aria-hidden="true" className="text-accent">
            ·
          </span>
          <span>{site.productName}</span>
        </>
      ) : null}
    </span>
  );
}
