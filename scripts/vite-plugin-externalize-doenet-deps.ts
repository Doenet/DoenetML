import path, { join } from "node:path";
import type { Plugin } from "vite";
import glob from "glob";

const CWD = path.dirname(new URL(import.meta.url).pathname);
const PACKAGE_ROOT = join(CWD, "..");

/**
 * Search `/packages/*` for all packages in this workspace and return
 * `@doenet/*` dependencies for each package.
 */
function getDoenetDeps() {
    const packages = glob.sync(join(PACKAGE_ROOT, "packages/*")).map((dir) => {
        const packageName = path.basename(dir);
        return `@doenet/${packageName}`;
    });
    return packages;
}

interface UserOptions {
    /**
     * Whether to externalize a specific dependency.
     */
    filter?: (packageName: string) => boolean;
}

/**
 * Returns a Vite plugin to exclude `@doenet/*` dependencies from the bundle.
 */
export const externalizeDoenetDeps = (
    options: Partial<UserOptions> = {},
): Plugin => {
    const optionsResolved: UserOptions = {
        ...options,
    };

    return {
        name: "vite-plugin-externalize-doenet-deps",
        config: (_config, _env) => {
            const depsArray = optionsResolved.filter
                ? getDoenetDeps().filter(optionsResolved.filter)
                : getDoenetDeps();

            return {
                build: {
                    rollupOptions: {
                        external: depsArray,
                    },
                },
            };
        },
    };
};
