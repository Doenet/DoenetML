import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const core = resolve(__dirname, "../cells-core");

/** The generated fixtures' names, for the dev page's Fixture menu. */
function fixtureNames(): string[] {
    try {
        return readdirSync(resolve(core, "fixtures"))
            .filter((f) => f.endsWith(".cdast"))
            .map((f) => f.slice(0, -".cdast".length))
            .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    } catch {
        return [];
    }
}

export default defineConfig({
    plugins: [react()],
    // The generated fixtures, served at /<spec>.cdast, .json and .doenet.
    publicDir: resolve(core, "fixtures"),
    define: { __CELLS_FIXTURES__: JSON.stringify(fixtureNames()) },
    // The core is a workspace package whose wasm must not be pre-bundled.
    optimizeDeps: { exclude: ["@doenet/cells-core"] },
    server: { port: 5173 },
    build: { target: "esnext" },
});
