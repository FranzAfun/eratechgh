import { Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  InfoNote,
  SectionHeading,
  TextArea,
  TextField,
} from "../components/ui/index.js";
import { pageMeta } from "../lib/meta.js";

const TITLES = {
  request: [
    "Start a request",
    "Request component sourcing, a project assessment or an expert consultation from ERA Tech.",
  ],
  "request-sourcing": [
    "Request component sourcing",
    "Tell us the parts you need. ERA Tech sends a free itemised quote.",
  ],
  "request-assessment": [
    "Request a project assessment",
    "ERA Tech reviews your project idea, recommends parts and quotes them. GH₵50.",
  ],
  "request-consultation": [
    "Request an expert consultation",
    "Book time with an ERA Tech expert for guidance on your project. GH₵250.",
  ],
};

export const meta = ({ matches }) => {
  const id = matches.at(-1)?.id;
  const [title, description] = TITLES[id] ?? TITLES.request;
  return pageMeta(title, description);
};

// Placeholder until stage 4: shows the base components so they can be reviewed on the preview build.
export default function Request() {
  const [area, setArea] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="mx-auto max-w-form px-4 py-12 md:py-16">
      <SectionHeading
        as="h1"
        title="Start a request"
        intro="Form coming in the next stage. Component preview:"
      />
      <div className="mt-8 flex flex-col gap-4">
        <TextField label="Full name" icon={User} autoComplete="name" />
        <TextField label="Email" icon={Mail} type="email" error="Enter a valid email address." />
        <TextField
          label="Phone / WhatsApp"
          icon={Phone}
          type="tel"
          hint="Digits, spaces and + only."
        />
        <Dropdown
          label="Project area"
          optional
          value={area}
          onChange={setArea}
          options={[
            { value: "iot", label: "IoT & embedded" },
            { value: "robotics", label: "Robotics & automation" },
            { value: "electronics", label: "Electronics" },
            { value: "energy", label: "Energy & power" },
            { value: "other", label: "Other" },
          ]}
        />
        <TextArea
          label="What should it do?"
          optional
          maxLength={1000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Checkbox label="Tell me when ERA Store opens" />
        <InfoNote>We send GH₵50 payment details first, then ask for your full abstract.</InfoNote>
        <div className="flex flex-wrap gap-3">
          <Button busy={busy} onClick={() => setBusy(true)}>
            Send request
          </Button>
          <Button variant="secondary" onClick={() => setBusy(false)}>
            Secondary
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </section>
  );
}
