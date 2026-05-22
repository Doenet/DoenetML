//import { PluginOption, defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import { version } from "./package.json";

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = ["react", "react-dom"];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // If we call vite build --mode="development", we want to deactivate `lib` mode so that html assets get built.
    // This is so we can copy them into our `demos` package for inclusion in the website.
    const devBuild = mode === "development";
    return {
        base: "./",
        plugins: [dts({ rollupTypes: true })],
        worker: {
            format: "es",
        },
        server: {
            host: "0.0.0.0",
            port: 8012,
        },
        define: {
            DOENETML_VERSION: JSON.stringify(version),
        },
        build: {
            minify: false,
            lib: !devBuild && {
                entry: {
                    index: "./src/index.ts",
                    "pretext-xml": "./src/pretext-xml.ts",
                },
                formats: ["es"],
                cssFileName: "style",
            },
            rollupOptions: devBuild
                ? undefined
                : {
                      external: EXTERNAL_DEPS,
                      output: {
                          globals: Object.fromEntries(
                              EXTERNAL_DEPS.map((dep) => [dep, dep]),
                          ),
                      },
                  },
        },
        test: {
            setupFiles: ["@vitest/web-worker"],
        },
    };
});
