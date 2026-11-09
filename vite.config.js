import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  // Pre-bundle these up front so the first dev load isn't reloaded mid-hydration.
  optimizeDeps: { include: ["lucide-react", "thinking-orbs"] },
});
