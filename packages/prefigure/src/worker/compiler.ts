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
import { decodeFillPatternColorToken, getFillPatternDef } from "@doenet/utils";
import { prefigBrowserApi } from "./compat-api";
import { PREFIG_WHEEL_FILENAME } from "./compiler-metadata";

type Options = Parameters<typeof loadPyodide>[0];
export { PREFIG_WHEEL_FILENAME };

function escapeSvgAttribute(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

/**
 * Scans the SVG string for `fill="url(#doenet-hatch-STYLE-COLORTOKEN)"` references
 * emitted by the PreFigure XML generator and injects the corresponding `<pattern>`
 * definitions into the SVG's `<defs>` section.
 *
 * Returns the SVG string unchanged when no pattern references are found.
 */
function injectHatchPatterns(svg: string): string {
    const patternRefRe = new RegExp(
        'fill="url\\(#(doenet-hatch-([a-z]+)-([0-9a-f]+))\\)"',
        "g",
    );

    const seen = new Set<string>();
    const patternDefs: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = patternRefRe.exec(svg)) !== null) {
        const [, id, style, colorToken] = match;
        if (seen.has(id)) {
            continue;
        }
        seen.add(id);

        const def = getFillPatternDef(style);
        if (!def) {
            continue;
        }

        const color = decodeFillPatternColorToken(colorToken);
        if (!color) {
            continue;
        }

        const patternAttrs = [
            `id="${id}"`,
            `width="${def.width}"`,
            `height="${def.height}"`,
            'patternUnits="userSpaceOnUse"',
            'overflow="visible"',
        ];
        const pathAttrs = [`d="${def.path}"`];

        if (def.useFill) {
            pathAttrs.push(
                `fill="${escapeSvgAttribute(color)}"`,
                'stroke="none"',
            );
        } else {
            pathAttrs.push(
                `stroke="${escapeSvgAttribute(color)}"`,
                `stroke-width="${def.strokeWidth ?? 1.5}"`,
                'fill="none"',
            );
            if (def.strokeLinecap) {
                pathAttrs.push(
                    `stroke-linecap="${escapeSvgAttribute(def.strokeLinecap)}"`,
                );
            }
        }

        patternDefs.push(
            `<pattern ${patternAttrs.join(" ")}><path ${pathAttrs.join(" ")}/></pattern>`,
        );
    }

    if (patternDefs.length === 0) {
        return svg;
    }

    const defsClose = svg.indexOf("</defs>");
    if (defsClose === -1) {
        const svgTagEnd = svg.indexOf(">") + 1;
        return (
            svg.slice(0, svgTagEnd) +
            `<defs>${patternDefs.join("")}</defs>` +
            svg.slice(svgTagEnd)
        );
    }

    return (
        svg.slice(0, defsClose) + patternDefs.join("") + svg.slice(defsClose)
    );
}

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

    _normalizeIndexUrl(pyodide: PyodideInterface): string {
        const rawIndexUrl = (pyodide as any)._api.config.indexURL as string;
        if (rawIndexUrl.endsWith("/")) {
            return rawIndexUrl;
        }
        return `${rawIndexUrl}/`;
    }

    async _loadPrefigureDependencies(
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

    async _initialize(options: Options) {
        const pyodide = (await this._pyodide) || (await loadPyodide(options));

        await prefigBrowserApi.initFinished;

        pyodide.registerJsModule("prefigBrowserApi", prefigBrowserApi);

        const indexURL = this._normalizeIndexUrl(pyodide);
        await this._loadPrefigureDependencies(pyodide, indexURL);

        this.pyodide = pyodide;
    }

    /**
     * Initialize the compiler runtime. This is idempotent and safe to call
     * multiple times with the same settings.
     */
    async init(options: Options = {}) {
        if (this.pyodideInitPromise) {
            await this.pyodideInitPromise;
        }

        if (this.pyodide) {
            return;
        }

        this.pyodideInitPromise = this._initialize(options).catch((error) => {
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
        const [rawSvg, annotations] = result;
        const svg = injectHatchPatterns(rawSvg);
        return { svg, annotations };
    }
}
