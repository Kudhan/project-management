import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],

  /* ✅ FIX sourcemap SSR error */
  build: {
    sourcemap: false,
  },

  /* ✅ Prevent Radix SSR issues */
  ssr: {
    noExternal: ["@radix-ui/react-label"],
  },
});
