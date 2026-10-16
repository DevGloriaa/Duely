import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { APP_NAME } from "./src/config.js";

const appName = {
  name: "app-name",
  transformIndexHtml: (html) => html.replaceAll("%APP_NAME%", APP_NAME),
};

export default defineConfig({
  plugins: [react(), appName],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
