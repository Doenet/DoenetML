import init, {
    build_from_string,
    set_host_api,
    version as wasmVersion,
} from "../pkg/prefig_wasm.js";

export type PrefigureMode = "svg" | "tactile";

export type PrefigureCompileResult = {
    svg: string;
    annotationsXml: string;
};

export type PrefigureCompileOptions = {
    mode?: PrefigureMode;
};

let initPromise: Promise<void> | null = null;

/**
 * Rough fallback text-measurement implementation, used by `set_host_api`'s
 * `measure_text` callback.
 *
 * PreFigure only uses this to lay out label text on diagrams, so an
 * approximate width based on character count is good enough when no real
 * canvas-based text measurement is available (e.g. in Node/test
 * environments). In a browser, `OffscreenCanvas`/`document.createElement`
 * canvas `measureText` is used instead for a real measurement.
 *
 * TODO: this fallback (and even the canvas-based measurement) does not
 * account for the font actually used to render the final SVG text, so
 * label layout may be approximate. Revisit if/when this package is wired
 * into the live renderer (Phase 4).
 */
function measureTextFallback(
    text: string,
    _font: string,
): [number, number, number] {
    // [width, height, descent] in the same units PreFigure's Python/cairo
    // implementation uses (points-ish). These constants are rough estimates
    // calibrated against typical 12-16px label text.
    const width = text.length * 8;
    const height = 10;
    const descent = 3;
    return [width, height, descent];
}

function makeMeasureText(): (
    text: string,
    font: string,
) => [number, number, number] {
    const g = globalThis as typeof globalThis & {
        OffscreenCanvas?: typeof OffscreenCanvas;
        document?: Document;
    };

    let ctx:
        OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null =
        null;
    try {
        if (typeof g.OffscreenCanvas !== "undefined") {
            ctx = new g.OffscreenCanvas(1, 1).getContext(
                "2d",
            ) as OffscreenCanvasRenderingContext2D | null;
        } else if (typeof g.document !== "undefined") {
            const canvas = g.document.createElement("canvas");
            ctx = canvas.getContext("2d");
        }
    } catch {
        ctx = null;
    }

    if (!ctx) {
        return measureTextFallback;
    }

    return (text: string, font: string) => {
        try {
            ctx.font = font || "12px sans-serif";
            const metrics = ctx.measureText(text);
            const width = metrics.width;
            const ascent =
                metrics.actualBoundingBoxAscent ??
                metrics.fontBoundingBoxAscent ??
                8;
            const descent =
                metrics.actualBoundingBoxDescent ??
                metrics.fontBoundingBoxDescent ??
                3;
            return [width, ascent + descent, descent];
        } catch {
            return measureTextFallback(text, font);
        }
    };
}

/**
 * Identity translation: this evaluation-only package does not yet implement
 * localized label translation. Revisit if this package is wired into the
 * live renderer (Phase 4).
 */
function translateTextFallback(text: string, _typeform: string): string {
    return text;
}

/**
 * Resolve the wasm-bindgen `init()` argument.
 *
 * We must always supply an explicit value here rather than relying on
 * wasm-bindgen's own "if module_or_path === undefined, default to
 * `new URL('prefig_wasm_bg.wasm', import.meta.url)`" fallback inside the
 * vendored glue: `preventWasmBundlingPlugin` (see vite.config.ts)
 * deliberately comments out that exact line to stop Vite from inlining the
 * multi-MB wasm file as a base64 asset, which also removes the fallback.
 * Without it, calling `init(undefined)` leaves wasm-bindgen with nothing to
 * fetch and `WebAssembly.instantiate` throws. This mirrors the pattern
 * already used for the same problem in
 * `packages/doenetml-worker/src/CoreWorker.ts` (explicit `module_or_path`,
 * never relying on the internal default).
 *
 * In a browser, we hand back the resolved wasm URL directly; the
 * wasm-bindgen glue detects the `URL` instance and fetches it itself. In
 * Node (e.g. this package's own vitest tests), Node's `fetch` does not
 * support `file:` URLs, so we read the wasm bytes directly via `node:fs`
 * and hand back the bytes instead.
 *
 * TODO: `../pkg/prefig_wasm_bg.wasm` resolves correctly today because both
 * `src/` and the built `dist/` sit one level below the package root next to
 * `pkg/`, and dev serves straight from `dist/`. This will break for a real
 * production deploy that ships only `dist/*` (not `pkg/`) to a CDN — revisit
 * when this package is actually wired into a production build (see plan
 * Phase 4 production-readiness follow-up), e.g. by switching to a Vite
 * `?url` asset import of the wasm file (as CoreWorker.ts does) so the
 * reference adapts automatically per build target.
 */
async function resolveWasmInitInput() {
    // Deliberately not written as `new URL('../pkg/...wasm', import.meta.url)`
    // (a single expression): Vite's build-time import-analysis plugin
    // statically recognizes exactly that shape as an asset reference and
    // inlines the wasm file as a base64 data URI, which we don't want here
    // (see the `preventWasmBundlingPlugin` workaround in vite.config.ts for
    // the analogous problem in the wasm-bindgen glue file itself). Splitting
    // `import.meta.url` into a separate variable avoids that static match.
    const moduleUrl = import.meta.url;
    const wasmUrl = new URL("../pkg/prefig_wasm_bg.wasm", moduleUrl);

    if (wasmUrl.protocol !== "file:") {
        return wasmUrl;
    }

    const { readFile } = await import(/* @vite-ignore */ "node:fs/promises");
    const bytes = await readFile(wasmUrl);
    return bytes;
}

/**
 * Initialize the prefig-wasm module (loads and instantiates the WASM binary,
 * then registers the host API callbacks it needs: text measurement and
 * translation).
 *
 * Idempotent: subsequent calls resolve to the same initialization.
 */
export async function initPrefigure(): Promise<void> {
    if (!initPromise) {
        initPromise = (async () => {
            await init(await resolveWasmInitInput());
            set_host_api({
                measure_text: makeMeasureText(),
                translate_text: translateTextFallback,
            });
        })().catch((error) => {
            // Allow retries after transient initialization failures.
            initPromise = null;
            throw error;
        });
    }
    return initPromise;
}

/**
 * Compile PreFigure XML into SVG and annotations XML using the Rust/WASM
 * `prefig-wasm` (RaTeX/native) backend.
 *
 * This ensures the wasm module is initialized before delegating to
 * `build_from_string`.
 *
 * Note: label `<text>` elements without an explicit `color` attribute on
 * the source PreFigure XML render with no `fill` (SVG's actual default is
 * opaque black, not "inherit the page's CSS color"), so they can be
 * invisible against a dark canvas. This is upstream `prefig-wasm`/`prefig`
 * (Python) behavior, not specific to this backend — see
 * `packages/doenetml-worker-javascript/src/utils/prefigure/label.ts` for
 * where DoenetML should supply a theme-aware `color` attribute in the
 * generated XML, matching the pattern `graph.ts` already uses for axis
 * strokes. Do not patch it here; that would diverge this package's output
 * from what `prefig-wasm` actually produces.
 */
export async function compilePrefigure(
    source: string,
    options: PrefigureCompileOptions = {},
): Promise<PrefigureCompileResult> {
    const mode = options.mode ?? "svg";

    await initPrefigure();
    const result = build_from_string(mode, source) as {
        svg: string;
        annotations: string | null;
    };

    return {
        svg: result.svg,
        annotationsXml: result.annotations ?? "",
    };
}

/**
 * The prefig-wasm crate version. Only valid after `initPrefigure()` has
 * resolved (the wasm module must be instantiated before any exported
 * function, including `version()`, can be called) — call `initPrefigure()`
 * first, then read this, or call the wasm-exported `wasmVersion()` directly.
 */
export function version(): string {
    return wasmVersion();
}
