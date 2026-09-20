import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { ignoreWireitCachesPlugin } from "../../scripts/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [ignoreWireitCachesPlugin(), dts({ rollupTypes: true })],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./src/index.ts",
            },
            formats: ["es"],
            cssFileName: "style",
        },
        rollupOptions: {
            external: [
                "ariakit",
                "classnames",
                "react",
                "react-dom",
                "@fortawesome/free-solid-svg-icons",
                "@fortawesome/react-fontawesome",
                "better-react-mathjax",
            ],
        },
    },
});
