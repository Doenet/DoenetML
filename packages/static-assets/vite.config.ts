import { defineConfig, Plugin } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        dts(),
        viteStaticCopy({
            targets: [
                {
                    src: "./src/generated/*",
                    dest: "./generated/",
                },
            ],
        }),
    ],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es"],
        },
    },
});
