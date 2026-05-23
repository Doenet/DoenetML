import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import { version } from "./package.json";

const EXTERNAL_DEPS = ["react", "react-dom"];

export default defineConfig(({ mode }) => {
    // Development mode builds should include HTML assets for demos.
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
            DOENETML_PRINT_VERSION: JSON.stringify(version),
        },
        build: {
            minify: false,
            lib: !devBuild && {
                entry: {
                    index: "./src/index.ts",
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
