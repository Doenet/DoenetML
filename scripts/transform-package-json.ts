import path from "node:path";
import fs from "node:fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/**
 * Ranges npm's own `link:`/`portal:`/`workspace:`/`catalog:` peers write to mean
 * "resolve this from this workspace". npm itself rejects them outright
 * (`EUNSUPPORTEDPROTOCOL`), which makes them unpublishable for a second reason,
 * but they are worth naming because they are what a pnpm/yarn-shaped edit to a
 * manifest in this repo would leave behind. `git+file:` is a git spec whose
 * remote is a path on this machine.
 */
const LOCAL_PROTOCOL_RANGE =
    /^(?:file|link|portal|workspace|catalog|git\+file):/i;

/**
 * The paths npm accepts *without* a protocol, taken from `npm-package-arg`'s
 * `isFileSpec` (its `isPosixFile`/`isWindowsFile` unioned, so the answer does
 * not depend on which platform runs the build). `"math-expressions": "../math"`
 * installs the sibling directory exactly as `file:../math` does.
 *
 * The awkward-looking alternatives are all load-bearing and none of them catches
 * anything legitimate: `~[/]` is a home-relative path and is written as `~/` so
 * that the tilde *range* `~1.2.3` is not caught; `[a-zA-Z]:` is a drive letter,
 * which npm treats as a path on POSIX too, and no semver range or dist-tag is a
 * single letter followed by a colon (`npm:` is three); `\\` is a Windows or UNC
 * path.
 */
const LOCAL_PATH_RANGE = /^(?:[.\\/]|~[/]|[a-zA-Z]:)/;

/**
 * A tarball, which npm installs from disk when the range carries no protocol —
 * `"math-expressions": "math.tgz"` is a local file. The protocol test is what
 * keeps a perfectly resolvable `https://…/math.tgz` out of this: that one is
 * `remote` to npm and a consumer can fetch it.
 */
const TARBALL_RANGE = /[.](?:tgz|tar\.gz|tar)$/i;
const HAS_PROTOCOL = /^(?:git\+)?[a-z]+:/i;

/**
 * Does this dependency range mean "resolve this from somewhere on this machine"
 * rather than "resolve this from the registry"? Such a range is the right thing
 * inside the monorepo and meaningless to an npm consumer: `file:../math` names a
 * directory that does not exist once the tarball is unpacked.
 *
 * The three tests together are npm's own classification — a range `npm-package-arg`
 * resolves to a `directory` or a local `file` — rather than a list of spellings
 * anyone thought of. Two review passes added to such a list after finding it
 * short (the bare path `../math`, then `~/src/math`), which is the argument for
 * mirroring the definition instead.
 */
function isUnpublishableRange(range: string): boolean {
    return (
        LOCAL_PROTOCOL_RANGE.test(range) ||
        LOCAL_PATH_RANGE.test(range) ||
        (TARBALL_RANGE.test(range) && !HAS_PROTOCOL.test(range))
    );
}

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
 * The check is a *shape* test on the range, not a resolution: the build does no
 * network I/O, so it cannot tell a registry-shaped range apart from one naming
 * a version — or a package — that nobody ever published. `^3.0.0` for a
 * `math-expressions@3.x` that is not on npm yet, or the `"*"` this repo uses for
 * private workspace packages, both read as publishable here. It catches the
 * range the monorepo actually writes when it means "resolve this from a sibling
 * directory", which is the mistake that is easy to make and invisible until a
 * consumer installs the tarball.
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
        //
        // One range per dep is read out of this, and it both decides the guard
        // and becomes the emitted peer range — so whichever field wins here is
        // the one that ships. Spreading `devDependencies` last would hand both
        // jobs to the field a consumer's installer never sees: adding a
        // `"math-expressions": "^3.0.0"` devDependency to `packages/doenetml`
        // would clear the guard below *and* publish `^3.0.0` as the peer range,
        // while the build was still resolving `file:../math` from the sibling
        // directory. (Measured through this transformer with the old order.
        // The two cannot come apart — the tested range and the emitted one are
        // the same lookup — so it is the *field* that must be right.)
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
            if (isUnpublishableRange(range)) {
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
