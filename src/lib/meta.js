import { siteTitle } from "../content/site.js";

/** Builds a route's <title> ("<Page> · ERA Tech · Project Desk", or "ERA Tech · Project Desk") and description. */
export function pageMeta(title, description) {
  return [
    { title: title ? `${title} · ${siteTitle}` : siteTitle },
    { name: "description", content: description },
  ];
}
