import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    base: "./",
    plugins: [dts()],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./scripts/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // These scripts run in Node (as Next.js remark plugins), so keep
            // Node built-ins external rather than letting the lib build stub
            // them out (which leaves e.g. `fs.readdirSync` undefined).
            external: [/^node:/],
        },
    },
});
