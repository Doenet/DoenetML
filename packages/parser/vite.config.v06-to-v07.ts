import { defineConfig, Plugin, PluginOption } from "vite";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";
import arraybuffer from "vite-plugin-arraybuffer";
import { pegjsLoader } from "./vite.config";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        arraybuffer(),
        dts(),
        //{ rollupTypes: true }
        pegjsLoader(),
        visualizer() as PluginOption,
    ],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                [`v06-to-v07`]: "./src/v06-to-v07/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // This is needed for building the `v06-to-v07` converter.
            // We don't want to add a build dep on `@doenet/doenetml-worker-javascript` just for this.
            external: [
                "@doenet/doenetml-worker-javascript",
                "lib-doenetml-worker",
            ],
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
    },
});
