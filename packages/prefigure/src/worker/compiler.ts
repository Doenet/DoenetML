/*
 * Portions of this file were adapted from the PreFigure playground worker
 * runtime in https://github.com/davidaustinm/prefigure
 * (website/packages/playground/src/worker/compiler.ts).
 *
 * Upstream project website: https://prefigure.org
 * Distributed here under AGPL-3.0-or-later with DoenetML-specific
 * modifications.
 */

import { PyodideInterface, loadPyodide } from "pyodide";
import { prefigBrowserApi } from "./compat-api";

type Options = Parameters<typeof loadPyodide>[0];
export const PREFIG_WHEEL_FILENAME = "prefig-0.5.11-py3-none-any.whl";

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

    /**
     * Initialize the compiler. This is safe to call multiple times.
     */
    async init(options: Options = {}) {
        // Wait for any other initialization to finish
        await this.pyodideInitPromise;
        // Don't accidentally initialize a second time!
        if (this.pyodide) {
            return;
        }

        this.pyodideInitPromise = new Promise(async (resolve, reject) => {
            try {
                // Prefer `._pyodide` over creating a new pyodide instance
                // since `._pyodide` was provided by the user.
                this.pyodide =
                    (await this._pyodide) || (await loadPyodide(options));

                // There may be some MathJax etc. setup that needs to be done
                await prefigBrowserApi.initFinished;

                // Set up our global compatibility API so it can be imported from Python with `import prefigBrowserApi`
                this.pyodide.registerJsModule(
                    "prefigBrowserApi",
                    prefigBrowserApi,
                );

                // We want to make sure to load the prefig package from the same location that we are loading all
                // the other packages from. This is accessing the internal `._api` from pyodide and might break in the
                // future.
                let indexURL = (this.pyodide as any)._api.config
                    .indexURL as string;
                if (!indexURL.endsWith("/")) {
                    indexURL += "/";
                }

                const prefigPath = indexURL + PREFIG_WHEEL_FILENAME;

                // Load all the dependencies
                try {
                    await this.pyodide.loadPackage(
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
                    await this.pyodide.runPythonAsync(`
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
            } catch (e) {
                reject(e);
            }

            resolve();
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
