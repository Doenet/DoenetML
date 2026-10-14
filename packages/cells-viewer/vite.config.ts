import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const core = resolve(__dirname, "../cells-core");

export default defineConfig({
    plugins: [react()],
    // The generated fixtures, served at /<spec>.cdast and /<spec>.json.
    publicDir: resolve(core, "fixtures"),
    // The core is a workspace package whose wasm must not be pre-bundled.
    optimizeDeps: { exclude: ["@doenet/cells-core"] },
    server: { port: 5173 },
    build: { target: "esnext" },
});
