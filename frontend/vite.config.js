import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:8004",
        changeOrigin: true,
      },
    },
  },

  plugins: [react()],
  build: {
    rollupOptions: {
      external: [/^node:.*/],
    },
  },
});
