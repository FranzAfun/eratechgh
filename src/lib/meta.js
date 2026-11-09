const SITE = "ERA Tech Project Desk";

/** Builds a route's <title> and description. */
export function pageMeta(title, description) {
  return [
    { title: title ? `${title} · ${SITE}` : SITE },
    { name: "description", content: description },
  ];
}
