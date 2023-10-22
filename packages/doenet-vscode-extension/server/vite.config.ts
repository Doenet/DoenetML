import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts()],
    build: {
        outDir: "out",
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/server.ts",
            fileName: "server",
            formats: ["cjs"],
        },
        rollupOptions: {
            external: [
                "vscode-languageserver/node",
                "vscode-languageserver-textdocument",
            ],
        },
    },
});
