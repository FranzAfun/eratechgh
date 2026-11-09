import { pageMeta } from "../lib/meta.js";

const META = {
  "request-index": [
    "Start a request",
    "Request component sourcing, a project assessment or an expert consultation from ERA Tech.",
  ],
  "request-sourcing": [
    "Request component sourcing",
    "Tell ERA Tech the parts you need and get a free itemised quote.",
  ],
  "request-assessment": [
    "Request a project assessment",
    "ERA Tech reviews your project idea, recommends parts and quotes them. GH₵50.",
  ],
  "request-consultation": [
    "Request an expert consultation",
    "Ask for a session with an ERA Tech expert for guidance on your project. GH₵250.",
  ],
};

export const meta = ({ matches }) => {
  const [title, description] = META[matches.at(-1)?.id] ?? META["request-index"];
  return pageMeta(title, description);
};

// The form is rendered by the parent route (routes/request.jsx).
export default function RequestService() {
  return null;
}
