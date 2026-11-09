import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  // The form lives in the parent so its values survive switching service (the URL changes,
  // the form stays mounted). Children only set the page title and description.
  route("request", "routes/request.jsx", [
    index("routes/request-service.jsx", { id: "request-index" }),
    route("sourcing", "routes/request-service.jsx", { id: "request-sourcing" }),
    route("assessment", "routes/request-service.jsx", { id: "request-assessment" }),
    route("consultation", "routes/request-service.jsx", { id: "request-consultation" }),
  ]),
  route("*", "routes/not-found.jsx"),
];
