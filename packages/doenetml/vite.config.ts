import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy, TransformOption } from "vite-plugin-static-copy";
import * as path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dts from "vite-plugin-dts";

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = ["react", "react-dom", "styled-components"];

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        dts({ rollupTypes: true }),
        viteStaticCopy({
            targets: [
                {
                    // Copy everything from the same directory as `CoreWorker.js`. This will include
                    // `CoreWorker.js.map`
                    src: path.join(
                        require.resolve(
                            "@doenet/doenetml-worker/CoreWorker.js",
                        ),
                        "../*",
                    ),
                    dest: "doenetml-worker/",
                },
                {
                    src: "package.json",
                    dest: "./",
                    transform: transformPackageJson,
                },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
    build: {
        minify: false,
        lib: {
            entry: {
                doenetml: "./src/index.js",
                "doenetml-inline-worker": "./src/index-inline-worker.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: EXTERNAL_DEPS,
            output: {
                globals: Object.fromEntries(
                    EXTERNAL_DEPS.map((dep) => [dep, dep]),
                ),
            },
        },
    },
});

/**
 * Trim and modify the `package.json` file so that it is suitable for publishing.
 */
function transformPackageJson(contents: string, filePath: string) {
    const pkg = JSON.parse(contents);
    const allDeps = {
        ...pkg.dependencies,
        ...pkg.peerDependencies,
        ...pkg.devDependencies,
    };
    // Delete unneeded entries
    delete pkg.private;
    delete pkg.scripts;
    delete pkg.devDependencies;
    delete pkg.peerDependencies;
    delete pkg.dependencies;
    delete pkg.prettier;

    // Everything that is externalized should be a peer dependency
    pkg.devDependencies = {};
    for (const dep of EXTERNAL_DEPS) {
        if (!allDeps[dep]) {
            console.warn(
                dep,
                "is listed as a dependency for vite to externalize, but a version is not specified in package.json.",
            );
            continue;
        }
        pkg.devDependencies[dep] = allDeps[dep];
    }

    // Fix up the paths. The existing package.json refers to files in the `./dist` directory. But
    // the new package.json will be in the ./dist directory itself, so we need to remove any `./dist`
    // prefix from the paths.
    const outputPackageJsonPath = path.join(
        path.dirname(filePath),
        "./dist/package.json",
    );
    if (Array.isArray(pkg.files)) {
        pkg.files = pkg.files.map((file) =>
            getPathRelativeToPackageJson(file, outputPackageJsonPath),
        );
    }
    for (const exp of Object.values(pkg.exports ?? {}) as Record<
        string,
        string
    >[]) {
        for (const [format, path] of Object.entries(exp)) {
            exp[format] = getPathRelativeToPackageJson(
                path,
                outputPackageJsonPath,
            );
        }
    }

    return JSON.stringify(pkg, null, 4);
}

function getPathRelativeToPackageJson(
    relPath: string,
    packageJsonPath: string,
) {
    const packageJsonDir = path.dirname(packageJsonPath);
    return "./" + path.relative(packageJsonDir, path.join(__dirname, relPath));
}
