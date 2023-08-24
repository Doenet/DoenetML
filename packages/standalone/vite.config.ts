import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true,  })],
    build: {
        minify: true,
        sourcemap: true,
        assetsInlineLimit: 0,
        lib: {
            entry: { "doenet-standalone": "./src/index.tsx" },
            fileName: "doenet-standalone",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                // Make sure everything is bundled as a single file
                inlineDynamicImports: true,
            },
        },
    },
});
