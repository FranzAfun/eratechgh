import { defineConfig } from "vitest/config";

// Separate from vite.config.js so tests don't load the React Router plugin.
export default defineConfig({
  test: {
    include: ["src/**/*.test.js", "netlify/**/*.test.js", "scripts/**/*.test.js"],
    environment: "node",
  },
});
