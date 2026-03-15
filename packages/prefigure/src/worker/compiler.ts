/*
 * Portions of this file were adapted from the PreFigure playground worker
 * runtime in https://github.com/davidaustinm/prefigure
 * (website/packages/playground/src/worker/compiler.ts).
 *
 * Upstream project website: https://prefigure.org
 * Distributed here under AGPL-3.0-or-later with package-specific
 * adaptations.
 */

import { PyodideInterface, loadPyodide } from "pyodide";
import { prefigBrowserApi } from "./compat-api";
import { PREFIG_WHEEL_FILENAME } from "./compiler-metadata";

type Options = Parameters<typeof loadPyodide>[0];
export { PREFIG_WHEEL_FILENAME };

/**
 * A class for compiling a PreFigure document file using a WASM implementation of python.
 */
export class PreFigureCompiler {
    pyodide: PyodideInterface | null = null;
    _pyodide: ReturnType<typeof loadPyodide> | null = null;
    pyodideInitPromise: Promise<void> | null = null;

    /**
     * @param pyodidePromise Optionally pass in an instance of `loadPyodide` to use a custom configuration.
     */
    constructor(pyodidePromise?: ReturnType<typeof loadPyodide>) {
        if (pyodidePromise) {
            this._pyodide = pyodidePromise;
        }
    }

    private normalizeIndexUrl(pyodide: PyodideInterface): string {
        // Accessing this internal field is currently required to align package
        // downloads with the runtime index URL.
        const rawIndexUrl = (pyodide as any)._api.config.indexURL as string;
        if (rawIndexUrl.endsWith("/")) {
            return rawIndexUrl;
        }
        return `${rawIndexUrl}/`;
    }

    private async loadPrefigureDependencies(
        pyodide: PyodideInterface,
        indexURL: string,
    ) {
        const prefigPath = indexURL + PREFIG_WHEEL_FILENAME;

        try {
            await pyodide.loadPackage(
                [
                    "micropip",
                    "packaging",
                    "lxml",
                    "numpy",
                    "scipy",
                    "shapely",
                    "click",
                    "networkx",
                    prefigPath,
                ],
                {
                    messageCallback: () => {
                        // Silence Pyodide package progress logs in production usage.
                    },
                },
            );

            // Pre-import during warmup so the first user-triggered compile is fast.
            await pyodide.runPythonAsync(`
import logging
import prefig

# prefig.engine.build_from_string() forces logger level to DEBUG.
# Clamp handler levels to ERROR so routine parsing logs stay silent.
_prefigure_logger = logging.getLogger("prefigure")
_prefigure_logger.propagate = False
for _handler in _prefigure_logger.handlers:
    _handler.setLevel(logging.ERROR)
`);
        } catch (e) {
            const error = new Error(
                `Failed to load PreFigure wheel (${PREFIG_WHEEL_FILENAME}) from ${indexURL}. Make sure the wheel is present under the pyodide asset directory.`,
            );
            (error as Error & { cause?: unknown }).cause = e;
            throw error;
        }
    }

    private async initialize(options: Options) {
        // Prefer `._pyodide` over creating a new pyodide instance since
        // `._pyodide` was provided by the user.
        const pyodide = (await this._pyodide) || (await loadPyodide(options));

        // There may be some MathJax etc. setup that needs to be done.
        await prefigBrowserApi.initFinished;

        // Set up our global compatibility API so it can be imported from
        // Python with `import prefigBrowserApi`.
        pyodide.registerJsModule("prefigBrowserApi", prefigBrowserApi);

        const indexURL = this.normalizeIndexUrl(pyodide);
        await this.loadPrefigureDependencies(pyodide, indexURL);

        this.pyodide = pyodide;
    }

    /**
     * Initialize the compiler runtime. This is idempotent and safe to call
     * multiple times with the same settings.
     */
    async init(options: Options = {}) {
        // Wait for an existing initialization only when there is one in flight.
        if (this.pyodideInitPromise) {
            await this.pyodideInitPromise;
        }

        if (this.pyodide) {
            return;
        }

        this.pyodideInitPromise = this.initialize(options).catch((error) => {
            // Allow retries after transient init failures.
            this.pyodideInitPromise = null;
            throw error;
        });

        await this.pyodideInitPromise;
    }

    _checkInit(): asserts this is { pyodide: PyodideInterface } {
        if (!this.pyodide) {
            throw new Error("Compiler not initialized");
        }
    }

    /**
     * Compile the given PreFigure source and return the SVG string
     */
    async compile(
        mode: "svg" | "tactile",
        source: string,
    ): Promise<{ svg: string; annotations: string }> {
        this._checkInit();

        const result = await this.pyodide.runPython(`
import prefig
prefig.engine.build_from_string("${mode}", ${JSON.stringify(source)})
        `);
        const [svg, annotations] = result;
        return { svg, annotations };
    }
}
