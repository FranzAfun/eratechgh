import { pageMeta } from "../lib/meta.js";

export const meta = () =>
  pageMeta("Page not found", "This page doesn't exist on ERA Tech Project Desk.");

export default function NotFound() {
  return (
    <main className="mx-auto max-w-text px-4 py-16">
      <h1 className="text-h1 font-semibold">Page not found</h1>
      <p className="mt-4 text-text-secondary">
        <a className="text-primary-text underline" href="/">
          Home
        </a>{" "}
        ·{" "}
        <a className="text-primary-text underline" href="/request">
          Start a request
        </a>
      </p>
    </main>
  );
}
