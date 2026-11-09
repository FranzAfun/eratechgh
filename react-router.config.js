import { finalizeBuild } from "./scripts/finalize-build.js";

/** Static site: every page is prerendered to HTML at build time. */
export const PRERENDERED_PATHS = [
  "/",
  "/request",
  "/request/sourcing",
  "/request/assessment",
  "/request/consultation",
  "/404",
];

/** @type {import("@react-router/dev/config").Config} */
export default {
  appDirectory: "src",
  buildDirectory: "build",
  ssr: false,
  prerender: PRERENDERED_PATHS,
  async buildEnd({ reactRouterConfig }) {
    await finalizeBuild(reactRouterConfig.buildDirectory, PRERENDERED_PATHS);
  },
};
