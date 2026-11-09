import { pageMeta } from "../lib/meta.js";

const META = {
  "request-index": [
    "Start a request",
    "Start a Project Desk request: component sourcing, a project assessment or an expert consultation from the ERA Tech team.",
  ],
  "request-sourcing": [
    "Request component sourcing",
    "Tell Project Desk the parts you need and get a free itemised quote from the ERA Tech team.",
  ],
  "request-assessment": [
    "Request a project assessment",
    "A Project Desk assessment: the ERA Tech team reviews your project idea, recommends parts and quotes them. GH₵50.",
  ],
  "request-consultation": [
    "Request an expert consultation",
    "Book a Project Desk consultation with an ERA Tech expert for guidance on your project. GH₵250.",
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
