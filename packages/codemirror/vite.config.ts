import { visualizer } from "rollup-plugin-visualizer";
import { PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true }), visualizer() as PluginOption],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/CodeMirror.tsx",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "react-dom/server"],
        },
    },
});
