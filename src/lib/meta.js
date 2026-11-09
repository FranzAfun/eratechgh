import { shareImage, siteBaseUrl, siteTitle } from "../content/site.js";

/** Builds a route's <title> ("<Page> · ERA Tech · Project Desk", or "ERA Tech · Project Desk") and description. */
export function pageMeta(title, description, pathname = "/", { noindex = false } = {}) {
  const fullTitle = title ? `${title} · ${siteTitle}` : siteTitle;
  // Canonicals never include query strings, fragments or trailing-slash variants.
  const route = `/${pathname.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "")}`;
  const url = `${siteBaseUrl}${route === "/" ? "" : route}`;
  const image = `${siteBaseUrl}${shareImage.path}`;
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteTitle },
    { property: "og:image", content: image },
    { property: "og:image:width", content: String(shareImage.width) },
    { property: "og:image:height", content: String(shareImage.height) },
    { property: "og:image:alt", content: shareImage.alt },
    { property: "og:locale", content: "en_GB" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    ...(noindex
      ? [{ name: "robots", content: "noindex" }]
      : [{ tagName: "link", rel: "canonical", href: url }]),
  ];
}
