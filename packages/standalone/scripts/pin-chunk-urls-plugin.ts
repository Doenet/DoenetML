/**
 * Build half of chunk-URL pinning for the code-split bundle: rewrite every
 * emitted chunk reference to resolve, at load time, against the importing
 * module's version-pinned URL.
 *
 * `src/pinnedChunkUrlResolver.ts` holds the runtime logic and the account of
 * why the references need pinning (the floating-CDN-tag cache skew);
 * `src/pinPackageVersion.ts` holds the URL grammar. This plugin's job is
 * wiring those into the emitted output, which has two kinds of chunk
 * reference:
 *
 *  - **Lazy `import()`s between chunks.** `renderDynamicImport` wraps each
 *    statically-resolved in-bundle dynamic import so the emitted relative path
 *    passes through the resolver: `import(__doenetPinChunkUrl('./Foo-hash.js'))`.
 *    Every chunk containing such an import gets the resolver injected as a
 *    banner — the runtime functions stringified into module scope, so the
 *    chunk stays dependency-free (a banner cannot carry imports, and an
 *    imported helper would itself be a chunk whose URL needed pinning first).
 *
 *  - **The facade's static import of the eager chunk.** `doenet-standalone.js`
 *    is a re-export facade whose one static import names the eager chunk, and
 *    a static import's URL is fixed by the module loader before any code
 *    runs. `renderChunk` therefore rewrites the facade itself: each
 *    `import`/`export … from` becomes a top-level-awaited
 *    `await import(__doenetPinChunkUrl('./chunks/…'))` with the re-exports
 *    rebuilt from the awaited namespace. Pinning this first edge is what
 *    keeps the whole graph in one URL space: the eager chunk then evaluates
 *    at its exact-version URL, every lazy chunk resolves relative to *that*,
 *    and each shared chunk keeps a single module identity (one React, one
 *    loader registry) no matter which URL the facade itself was fetched from.
 *
 * Because the awaited import suspends the facade's evaluation — and a module
 * script's `load` event fires at that suspension — the facade also gets a
 * synchronous prologue installing queueing stubs for the render globals that
 * PreTeXt-style hosts call from `onload`, flushed once the eager chunk has
 * evaluated. `src/facadeRenderQueue.ts` holds that logic and its contract.
 *
 * The facade parser is deliberately strict: it recognizes exactly the
 * statement forms a Rollup re-export facade contains and fails the build
 * loudly on anything else, so a change to the output shape surfaces here at
 * build time instead of as a broken published bundle.
 *
 * Applied only in `vite.config.ts` (the code-split build). The single-file
 * inline variant has no chunk references, and the coordinator bundle is one
 * file too.
 */
import MagicString from "magic-string";
import type { Plugin } from "vite";
import { installFacadeRenderQueue } from "../src/facadeRenderQueue";
import { pinPackageVersion } from "../src/pinPackageVersion";
import { makePinnedChunkUrlResolver } from "../src/pinnedChunkUrlResolver";

/**
 * The module-scope name the injected resolver is bound to. Prefixed so it
 * cannot collide with anything Rollup generates; renamed freely (and
 * consistently, being chunk-local) by minification.
 */
export const PIN_HELPER_NAME = "__doenetPinChunkUrl";

/**
 * The code injected at the top of a chunk that references other chunks: the
 * two runtime functions, stringified, applied to the chunk's own
 * `import.meta.url` once at module evaluation.
 *
 * Self-containment is load-bearing — the text references only its own
 * bindings, standard globals, and `import.meta` — and it is what
 * `stringifiedRuntime` in the test file locks down.
 */
export function pinHelperBanner(packageName: string, version: string): string {
    return (
        `const ${PIN_HELPER_NAME} = (${makePinnedChunkUrlResolver.toString()})(` +
        `(${pinPackageVersion.toString()}), import.meta.url, ` +
        `${JSON.stringify(packageName)}, ${JSON.stringify(version)});\n`
    );
}

/** The facade-local name of the flush function the render-queue stub returns. */
export const FLUSH_RENDER_QUEUE_NAME = "__doenetFlushRenderQueue";

/**
 * The facade's synchronous prologue beyond the pin resolver: install the
 * queueing render-global stubs (see `src/facadeRenderQueue.ts` — a module
 * script's `load` event fires when the facade suspends at its first `await`,
 * and PreTeXt calls `window.renderDoenetViewerToContainer` from exactly that
 * event). `transformFacade` places this before the awaited import and a
 * `FLUSH_RENDER_QUEUE_NAME()` call after it.
 */
export function renderQueuePrologue(): string {
    return `const ${FLUSH_RENDER_QUEUE_NAME} = (${installFacadeRenderQueue.toString()})(globalThis);\n`;
}

/** One parsed facade statement: [start, end) in the source plus its rewrite. */
type FacadeRewrite = { start: number; end: number; replacement: string };

/**
 * Statement forms of a Rollup re-export facade. Whitespace-tolerant so the
 * same grammar accepts pretty or compact rendering; `[^}]*` spans newlines
 * inside a binding list.
 */
const FACADE_STATEMENTS: {
    re: RegExp;
    rewrite: (match: RegExpExecArray, nsIndex: number) => string | null;
}[] = [
    {
        // import defaultName, { a as b } from './chunk.js';
        // (default-only, named-only, or both)
        re: /^import\s*(?:([A-Za-z_$][\w$]*)\s*(?:,\s*)?)?(?:\{([^}]*)\})?\s*from\s*(["'])([^"']+)\3\s*;/,
        rewrite: (m) => {
            const bindings: string[] = [];
            if (m[1]) {
                bindings.push(`default: ${m[1]}`);
            }
            bindings.push(...parseBindingList(m[2] ?? ""));
            return `const { ${bindings.join(", ")} } = await import(${PIN_HELPER_NAME}(${quoted(m[4])}));`;
        },
    },
    {
        // import * as ns from './chunk.js';
        re: /^import\s*\*\s*as\s+([A-Za-z_$][\w$]*)\s+from\s*(["'])([^"']+)\2\s*;/,
        rewrite: (m) =>
            `const ${m[1]} = await import(${PIN_HELPER_NAME}(${quoted(m[3])}));`,
    },
    {
        // import './chunk.js';
        re: /^import\s*(["'])([^"']+)\1\s*;/,
        rewrite: (m) => `await import(${PIN_HELPER_NAME}(${quoted(m[2])}));`,
    },
    {
        // export { a as b, c } from './chunk.js';
        re: /^export\s*\{([^}]*)\}\s*from\s*(["'])([^"']+)\2\s*;/,
        rewrite: (m, nsIndex) => {
            const ns = `__doenetFacadeNs${nsIndex}`;
            const lines = [
                `const ${ns} = await import(${PIN_HELPER_NAME}(${quoted(m[3])}));`,
            ];
            for (const binding of splitBindingList(m[1])) {
                const { local, exported } = parseReexport(binding);
                lines.push(
                    exported === "default"
                        ? `export default ${ns}.${local};`
                        : `export const ${exported} = ${ns}.${local};`,
                );
            }
            return lines.join(" ");
        },
    },
    {
        // export { a as b, c };  — locals bound by the rewrites above.
        re: /^export\s*\{([^}]*)\}\s*;/,
        rewrite: () => null, // kept verbatim
    },
];

function quoted(path: string): string {
    if (!path.startsWith("./") && !path.startsWith("../")) {
        throw new Error(
            `chunk-URL pinning: the facade imports non-relative specifier ` +
                `"${path}", which the pinning rewrite has no URL to resolve ` +
                `against. This build bundles everything, so a bare specifier ` +
                `in the facade means the output shape changed; revisit ` +
                `scripts/pin-chunk-urls-plugin.ts.`,
        );
    }
    return JSON.stringify(path);
}

/** Split `a as b, c` into its comma-separated entries, dropping blanks. */
function splitBindingList(list: string): string[] {
    return list
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
}

/**
 * Turn an import binding list (`a as b, c`) into destructuring entries
 * (`a: b, c`). String-literal binding names would need different handling and
 * do not occur in this build's facade, so they fail the strict match below.
 */
function parseBindingList(list: string): string[] {
    return splitBindingList(list).map((entry) => {
        const m = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(
            entry,
        );
        if (!m) {
            throw new Error(
                `chunk-URL pinning: unrecognized import binding "${entry}" ` +
                    `in the facade; revisit scripts/pin-chunk-urls-plugin.ts.`,
            );
        }
        return m[2] ? `${m[1]}: ${m[2]}` : m[1];
    });
}

/** Parse one `local as exported` (or bare) re-export entry. */
function parseReexport(entry: string): { local: string; exported: string } {
    const m = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(entry);
    if (!m) {
        throw new Error(
            `chunk-URL pinning: unrecognized re-export binding "${entry}" ` +
                `in the facade; revisit scripts/pin-chunk-urls-plugin.ts.`,
        );
    }
    return { local: m[1], exported: m[2] ?? m[1] };
}

/**
 * Rewrite a re-export facade so its chunk imports are pinned at load time:
 * the banner's resolver and `prologue` are prepended, each
 * `import`/`export … from` becomes a top-level-awaited dynamic import through
 * the resolver (in statement order, preserving evaluation order), plain
 * `export { … }` statements stay as they are, and — when a prologue installed
 * the render-queue stubs — a `FLUSH_RENDER_QUEUE_NAME()` call is appended,
 * which runs once every awaited import has settled.
 *
 * Pure and synchronous so the test file can drive it with synthetic facades;
 * the plugin calls it from `renderChunk`. Throws (failing the build) on any
 * statement outside the facade grammar — see the module doc for why strict.
 */
export function transformFacade(
    code: string,
    banner: string,
    prologue = "",
): { code: string; map: ReturnType<MagicString["generateMap"]> } {
    const rewrites: FacadeRewrite[] = [];
    let position = 0;
    let nsIndex = 0;
    while (position < code.length) {
        const rest = code.slice(position);
        const whitespace = /^\s+/.exec(rest);
        if (whitespace) {
            position += whitespace[0].length;
            continue;
        }
        let matched = false;
        for (const { re, rewrite } of FACADE_STATEMENTS) {
            const m = re.exec(rest);
            if (!m) {
                continue;
            }
            const replacement = rewrite(m, nsIndex);
            if (replacement !== null) {
                rewrites.push({
                    start: position,
                    end: position + m[0].length,
                    replacement,
                });
                if (replacement.includes("__doenetFacadeNs")) {
                    nsIndex += 1;
                }
            }
            position += m[0].length;
            matched = true;
            break;
        }
        if (!matched) {
            throw new Error(
                `chunk-URL pinning: the entry facade contains a statement ` +
                    `outside the re-export grammar this rewrite understands ` +
                    `(at offset ${position}: ${JSON.stringify(
                        rest.slice(0, 80),
                    )}). The build's output shape changed; revisit ` +
                    `scripts/pin-chunk-urls-plugin.ts.`,
            );
        }
    }
    const s = new MagicString(code);
    for (const { start, end, replacement } of rewrites) {
        s.overwrite(start, end, replacement);
    }
    s.prepend(banner + prologue);
    if (prologue !== "") {
        s.append(`\n${FLUSH_RENDER_QUEUE_NAME}();`);
    }
    return { code: s.toString(), map: s.generateMap({ hires: true }) };
}

/** Options for {@link pinChunkUrlsPlugin}. */
export type PinChunkUrlsOptions = {
    /** The npm package a CDN URL for this bundle names. */
    packageName: string;
    /** The exact version being built — the release every reference pins to. */
    version: string;
    /** The emitted entry facade's file name, e.g. `"doenet-standalone.js"`. */
    facadeFileName: string;
};

/** The plugin. See the module doc for the two rewrites it performs. */
export function pinChunkUrlsPlugin(options: PinChunkUrlsOptions): Plugin {
    const banner = pinHelperBanner(options.packageName, options.version);
    return {
        name: "doenet-pin-chunk-urls",
        apply: "build",
        outputOptions(outputOptions) {
            const priorBanner = outputOptions.banner;
            outputOptions.banner = async (chunk) => {
                const prior =
                    typeof priorBanner === "function"
                        ? await priorBanner(chunk)
                        : (priorBanner ?? "");
                // Only chunks that reference other chunks carry the resolver;
                // `dynamicImports` lists the in-bundle chunks this one lazily
                // imports. (The facade is not among these — its reference is
                // a static import, injected along with its own copy of the
                // banner by the `renderChunk` rewrite below.)
                return chunk.dynamicImports.length > 0 ? banner + prior : prior;
            };
            return outputOptions;
        },
        renderDynamicImport({ format, targetModuleId, targetChunk }) {
            // Only statically-resolved imports of another in-bundle chunk have
            // an emitted relative path to pin. Same-chunk imports never reach
            // this hook, and runtime-variable specifiers (`targetModuleId`
            // null) keep their default rendering.
            if (format !== "es" || !targetChunk || !targetModuleId) {
                return null;
            }
            return { left: `import(${PIN_HELPER_NAME}(`, right: `))` };
        },
        renderChunk(code, chunk) {
            if (!chunk.isEntry || chunk.fileName !== options.facadeFileName) {
                return null;
            }
            return transformFacade(code, banner, renderQueuePrologue());
        },
    };
}
