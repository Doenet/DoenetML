import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
import { version } from "./package.json";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

// Bare package names that will not be bundled into the library. These become
// peerDependencies in the published dist/component/package.json.
const EXTERNAL_PACKAGES = ["react", "react-dom", "better-react-mathjax"];

// Rollup `external` predicate. Unlike a plain string array, this also matches
// subpath imports (e.g. react/jsx-runtime, react/jsx-dev-runtime, react-dom/client),
// which must be externalized too so the consuming app provides a single React
// instance. Bundling them causes a duplicate-React "dispatcher" mismatch.
function isExternal(id: string): boolean {
    return EXTERNAL_PACKAGES.some(
        (pkg) => id === pkg || id.startsWith(pkg + "/"),
    );
}

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        dts({ rollupTypes: true }),
        viteStaticCopy({
            targets: [
                {
                    src: "package.json",
                    dest: "./",
                    transform: createPackageJsonTransformer({
                        externalDeps: EXTERNAL_PACKAGES,
                        targetDir: "dist/component",
                    }),
                },
                { src: "README.md", dest: "./" },
            ],
        }),
        suppressLogPlugin(),
    ],
    build: {
        minify: false,
        outDir: "dist/component",
        sourcemap: true,
        assetsInlineLimit: 0,
        lib: {
            entry: "./src/index.tsx",
            fileName: "index",
            formats: ["es"],
            cssFileName: "style",
        },
        rollupOptions: {
            external: isExternal,
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
        IFRAME_VERSION: JSON.stringify(version),
    },
});
