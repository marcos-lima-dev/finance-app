// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.js",
        css: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
        },
    },
});
