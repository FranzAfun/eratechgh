import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("request", "routes/request.jsx", { id: "request" }),
  route("request/sourcing", "routes/request.jsx", { id: "request-sourcing" }),
  route("request/assessment", "routes/request.jsx", { id: "request-assessment" }),
  route("request/consultation", "routes/request.jsx", { id: "request-consultation" }),
  route("*", "routes/not-found.jsx"),
];
