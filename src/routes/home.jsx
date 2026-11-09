import { pageMeta } from "../lib/meta.js";

export const meta = () =>
  pageMeta(
    null,
    "Component sourcing, project assessments and expert consultations for students, makers and innovators in Ghana. Send one request to the ERA Tech team.",
  );

export default function Home() {
  return (
    <main className="mx-auto max-w-content px-4 py-16">
      <h1 className="text-h1 font-semibold">ERA Tech · Project Desk</h1>
      <p className="mt-4 text-text-secondary">Home page placeholder.</p>
    </main>
  );
}
