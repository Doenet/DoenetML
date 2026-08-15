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
 * `user/repo`, optionally with a `#committish` — the one protocol-less spec with
 * a slash in it that is *not* a path. `hosted-git-info` reads it as a GitHub
 * shorthand and npm clones it, so it must not be caught below.
 *
 * Exactly one slash, and none of `@ : # \` before it: `@scope/pkg`,
 * `some/dir/pkg` and `math/` are all paths to npm, not repositories.
 *
 * Whitespace anywhere disqualifies it, and this is the one test that must run
 * against the *untrimmed* range — see [`isUnpublishableRange`].
 */
const GITHUB_SHORTHAND_RANGE =
    /^[^./\\@:#\s][^/\\@:#\s]*\/[^/\\@:#\s]+(?:#.+)?$/;

/**
 * A protocol-less range containing a separator is a path — the branch npm
 * reaches *after* `isFileSpec` and `hosted-git-info` have both declined:
 *
 * ```js
 * else if (spec && (hasSlashes.test(spec) || isFileType.test(spec))) { return fromFile(res, where) }
 * ```
 *
 * No leading `.`, no `~/`, no drive letter and no `.tgz` is needed. It is why
 * `"math-expressions": "vendor/math-expressions/packages/…"` — the most natural
 * spelling in *this* repo, where every real path starts `vendor/` or `packages/`
 * — installs as a local directory symlink, which was measured against npm
 * 11.12.1 rather than reasoned about.
 */
const BARE_PATH_RANGE = /[/\\]/;

/**
 * `git@github.com:user/repo.git` — an scp-style git URL, which carries no
 * `scheme:` for {@link HAS_PROTOCOL} to find but is a `git` spec to `npa` and
 * clonable by any consumer. Without this it fell to the bare-path test (a
 * slash, and the `@`/`:` keep it out of the GitHub shorthand) and would have
 * blocked a release over a perfectly resolvable dependency.
 */
const SCP_GIT_RANGE = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+:[^\s]+$/;

/**
 * Does this dependency range mean "resolve this from somewhere on this machine"
 * rather than "resolve this from the registry"? Such a range is the right thing
 * inside the monorepo and meaningless to an npm consumer: `file:../math` names a
 * directory that does not exist once the tarball is unpacked.
 *
 * The tests mirror npm's own classification — the ranges `npm-package-arg`
 * resolves to a `directory` or a local `file` — rather than a list of spellings
 * anyone thought of. Three review passes added to such a list after finding it
 * short (`../math`, then `~/src/math`, then `vendor/math-expressions`), which is
 * the argument for mirroring the definition instead. Reproducing it rather than
 * calling `npa.resolve` keeps the build free of a dependency it needs for one
 * predicate; the test file below encodes the outcome of diffing it against the
 * real `npm-package-arg@14`, over 173 spellings at the last sweep.
 *
 * It is deliberately stricter than `npa` in four places, all of them ranges no
 * consumer could install:
 *
 * - `link:`/`portal:`/`workspace:`/`catalog:` make `npa` *throw*
 *   (`EUNSUPPORTEDPROTOCOL`) rather than classify, so "not local" is not the
 *   same as "publishable" for them.
 * - `\\unc\path` is a `directory` to `npa` only when it runs on Windows; the
 *   platform union is the point.
 * - A one-slash spec ending in `.tgz`/`.tar.gz`/`.tar` (`vendor/math.tar.gz`) is
 *   a GitHub shorthand to `npa` — a repository literally named `math.tar.gz`.
 *   Anyone who writes that means a tarball, so the tarball test runs first.
 * - A range whose *prefix* tests only match after trimming (`" file:../math"`,
 *   `" C:/math"`) is local here and an invalid tag name to `npa`, which throws
 *   rather than classifying.
 */
function isUnpublishableRange(range: string): boolean {
    // Every *prefix* test below is run against the trimmed range, so a leading
    // space cannot smuggle `" ../math"` or `" file:../math"` past an anchored
    // pattern. npm itself does not trim — it rejects such a spec outright —
    // so being stricter here only ever blocks a release for a range no
    // consumer could install anyway.
    const trimmed = range.trim();
    if (LOCAL_PROTOCOL_RANGE.test(trimmed) || LOCAL_PATH_RANGE.test(trimmed)) {
        return true;
    }
    if (HAS_PROTOCOL.test(trimmed) || SCP_GIT_RANGE.test(trimmed)) {
        // A `remote` tarball or a git URL: resolvable from anywhere.
        return false;
    }
    if (TARBALL_RANGE.test(trimmed)) {
        return true;
    }
    // …but the GitHub shorthand is matched against the *raw* range, and this
    // asymmetry is the whole point. npm does not trim, and `hosted-git-info`
    // refuses any spec containing whitespace, so `"vendor/math "` never
    // becomes a repository to npm — it falls through to the bare-path branch
    // and installs as a directory. Trimming before this test turned it back
    // into a clean `user/repo` shape and called it publishable; measured
    // against npm 11.12.1, that range installs `node_modules/math-expressions`
    // as a *dangling* symlink to `vendor/math ` and exits 0, so the consumer's
    // `require` throws at run time.
    return BARE_PATH_RANGE.test(trimmed) && !GITHUB_SHORTHAND_RANGE.test(range);
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
