import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = [];

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        dts({ rollupTypes: true }),
        viteStaticCopy({
            targets: [
                {
                    src: path.join(
                        require.resolve("@doenet/doenetml"),
                        "../fonts/*",
                    ),
                    dest: "fonts/",
                },
                {
                    src: "package.json",
                    dest: "./",
                    transform: transformPackageJson,
                },
            ],
        }),
    ],
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
    define: {
        "process.env.NODE_ENV": '"production"',
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
    delete pkg.wireit;

    pkg.private = false;

    // Everything that is externalized should be a peer dependency
    pkg.peerDependencies = {};
    for (const dep of EXTERNAL_DEPS) {
        if (!allDeps[dep]) {
            console.warn(
                dep,
                "is listed as a dependency for vite to externalize, but a version is not specified in package.json.",
            );
            continue;
        }
        pkg.peerDependencies[dep] = allDeps[dep];
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
