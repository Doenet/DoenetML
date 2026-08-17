import path from "node:path";
import fs from "node:fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/**
 * Create a transformer that will modify the contents of a package.json file
 * so that it is suitable for publishing. This function returns a `transformer`
 * that can be used by `viteStaticCopy` to transform a `package.json` file.
 *
 * Externalized dependencies become `peerDependencies` of the published package,
 * because the bundle keeps a bare `import ... from "<dep>"` that the consumer's
 * installer has to satisfy. Whatever range the source manifest declares for such
 * a dependency is the range that ships, so it has to be one an npm consumer can
 * resolve — the release order in `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md` is
 * about exactly that.
 *
 * @param externalDeps An array of dependencies that should be externalized.
 * @param targetDir The directory where the `package.json` file will be written. This is usually `./dist`, but it may be a different subdirectory. Any paths in the exports field of package.json are rewritten to be relative to this directory instead.
 */
export function createPackageJsonTransformer({
    externalDeps = [],
    targetDir = "./dist",
}: {
    /**
     * A list of external dependencies. These dependencies will be listed as peer dependencies in the final package.json file.
     */
    externalDeps?: string[];
    /**
     * The directory where the final `package.json` file will be placed. Default is `./dist`.
     */
    targetDir?: string;
} = {}) {
    /**
     * Trim and modify the `package.json` file so that it is suitable for publishing.
     */
    return function transformPackageJson(contents: string, filePath: string) {
        const pkg = JSON.parse(contents);
        // Resolution order matters, and it runs *lowest* precedence first.
        // `dependencies` and `peerDependencies` are the ranges a consumer's
        // installer would act on; `devDependencies` is only a fallback for a
        // package that declares an externalized dependency nowhere else.
        // Spreading `devDependencies` last would publish the range from the one
        // field a consumer's installer never sees.
        const allDeps = {
            ...pkg.devDependencies,
            ...pkg.peerDependencies,
            ...pkg.dependencies,
        };
        // Delete unneeded entries
        delete pkg.private;
        delete pkg.scripts;
        delete pkg.devDependencies;
        delete pkg.peerDependencies;
        delete pkg.dependencies;
        delete pkg.prettier;
        delete pkg.wireit;

        const pkgRootDir = path.dirname(findPackageJsonPath(pkg.name));

        // Everything that is externalized should be a peer dependency, since
        // the bundle imports it by name and the consumer has to provide it.
        pkg.peerDependencies = {};
        for (const dep of externalDeps) {
            const range = allDeps[dep];
            if (!range) {
                // Nothing to emit — there is no range to copy. Warn rather than
                // throw: the emitted manifest is still valid, it just leaves
                // the consumer to supply the import on their own.
                console.warn(
                    `${pkg.name}: "${dep}" is externalized by vite but no version is declared in package.json, so it will not appear in peerDependencies`,
                );
                continue;
            }
            pkg.peerDependencies[dep] = range;
        }

        // Fix up the paths. The existing package.json refers to files in the `./dist` directory. But
        // the new package.json will be in the ./dist directory itself, so we need to remove any `./dist`
        // prefix from the paths.
        const outputPackageJsonPath = path.join(
            path.dirname(filePath),
            targetDir,
            "/package.json",
        );
        if (Array.isArray(pkg.files)) {
            pkg.files = pkg.files.map((file) => {
                let filePath = getPathRelativeToPackageJson(
                    file,
                    outputPackageJsonPath,
                    pkgRootDir,
                );

                // Make sure we don't try to escape our current directory
                // We do this by resolving our path relative to `/` and then trimming the excess slash.
                filePath = path.resolve("/", filePath);
                filePath = path.relative("/", filePath);
                if (filePath === "") {
                    filePath = "./";
                }
                return filePath;
            });
        }
        for (const exp of Object.values(pkg.exports ?? {}) as Record<
            string,
            string
        >[]) {
            for (const [format, filePath] of Object.entries(exp)) {
                exp[format] = getPathRelativeToPackageJson(
                    filePath,
                    outputPackageJsonPath,
                    pkgRootDir,
                );
            }
        }

        return JSON.stringify(pkg, null, 4);
    };
}

/**
 * Find the location of the package.json file for a given package name.
 * @param pkgName
 */
function findPackageJsonPath(pkgName: string): string {
    const MAX_WALK = 10;

    let basePath = path.dirname(import.meta.url);
    try {
        basePath = path.dirname(import.meta.resolve(pkgName));
    } catch (e) {
        basePath = require.resolve(pkgName);
    }
    if (basePath.startsWith("file://")) {
        basePath = basePath.slice("file://".length);
    }

    // Walk up the directory structure looking for the first package.json file.
    // We assume there aren't more than MAX_WALK directories we walk up.
    for (let i = 0; i < MAX_WALK; i++) {
        if (fs.existsSync(path.join(basePath, "package.json"))) {
            return path.join(basePath, "package.json");
        }
        basePath = path.join(basePath, "..");
    }
    throw new Error("Could not find package.json for " + pkgName);
}

function getPathRelativeToPackageJson(
    relPath: string,
    packageJsonPath: string,
    rootPackagePath: string,
) {
    const packageJsonDir = path.dirname(packageJsonPath);
    return (
        "./" +
        path.relative(packageJsonDir, path.join(rootPackagePath, relPath))
    );
}
