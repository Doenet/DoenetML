import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true })],
    build: {
        target: "node18",
        outDir: "out",
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/extension.ts",
            fileName: "extension",
            formats: ["cjs"],
        },
        rollupOptions: {
            external: [
                "vscode-languageserver/node",
                "vscode-languageclient/node",
                "vscode-languageserver-textdocument",
                "vscode",
                "path",
            ],
        },
    },
});
