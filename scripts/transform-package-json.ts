import path from "node:path";
import fs from "node:fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/**
 * Dependency ranges that mean "resolve this from somewhere on this machine"
 * rather than "resolve this from the registry". They are the right thing inside
 * the monorepo and meaningless to an npm consumer: `file:../math` names a
 * directory that does not exist once the tarball is unpacked.
 */
const UNPUBLISHABLE_RANGE = /^(?:file|link|portal|workspace):/;

/**
 * Create a transformer that will modify the contents of a package.json file
 * so that it is suitable for publishing. This function returns a `transformer`
 * that can be used by `viteStaticCopy` to transform a `package.json` file.
 *
 * Externalized dependencies become `peerDependencies` of the published package,
 * because the bundle keeps a bare `import ... from "<dep>"` that the consumer's
 * installer has to satisfy. If any of them cannot be satisfied from the
 * registry — it is missing a version, or its range is a local one such as
 * `file:` — the built package is *not* publishable, and the transformer says so
 * by leaving `"private": true` in the emitted manifest. `npm publish` refuses a
 * private package, so a release that would otherwise ship an unresolvable
 * import fails loudly instead of shipping.
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

        const pkgRootDir = path.dirname(findPackageJsonPath(pkg.name));

        // Everything that is externalized should be a peer dependency, since
        // the bundle imports it by name and the consumer has to provide it.
        const unpublishable: string[] = [];
        pkg.peerDependencies = {};
        for (const dep of externalDeps) {
            const range = allDeps[dep];
            if (!range) {
                unpublishable.push(
                    `${dep}: externalized by vite, but no version is specified in package.json`,
                );
                continue;
            }
            pkg.peerDependencies[dep] = range;
            if (UNPUBLISHABLE_RANGE.test(range)) {
                unpublishable.push(
                    `${dep}: "${range}" is a local range that an npm consumer cannot resolve`,
                );
            }
        }

        // Publishable unless one of the externalized imports cannot be
        // satisfied from the registry. See the doc comment above: a private
        // manifest is what stops `npm publish` from shipping a tarball whose
        // imports do not resolve.
        pkg.private = unpublishable.length > 0;
        if (pkg.private) {
            console.warn(
                [
                    `${pkg.name}: marking the built package private — it is not publishable:`,
                    ...unpublishable.map((reason) => `  - ${reason}`),
                    "  `npm publish` will refuse this package until every externalized",
                    "  dependency has a registry-resolvable version.",
                ].join("\n"),
            );
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
