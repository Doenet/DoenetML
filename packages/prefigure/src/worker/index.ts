/*
 * Portions of this file were adapted from the PreFigure playground worker
 * runtime in https://github.com/davidaustinm/prefigure
 * (website/packages/playground/src/worker/index.ts).
 *
 * Upstream project website: https://prefigure.org
 * Distributed here under AGPL-3.0-or-later with package-specific
 * adaptations.
 */

import { expose } from "comlink";
import type { PreFigureCompiler } from "./compiler";

// Some third-party libs inspect worker globals and branch on
// DedicatedWorkerGlobalScope. Keep parity with other worker contexts by
// ensuring this symbol exists before loading the heavy compiler module.
if (
    typeof (globalThis as any).DedicatedWorkerGlobalScope === "undefined" &&
    typeof (globalThis as any).SharedWorkerGlobalScope !== "undefined"
) {
    (globalThis as any).DedicatedWorkerGlobalScope = (
        globalThis as any
    ).SharedWorkerGlobalScope;
}

let compilerPromise: Promise<PreFigureCompiler> | null = null;

async function getCompiler(): Promise<PreFigureCompiler> {
    if (!compilerPromise) {
        compilerPromise = import("./compiler").then(
            ({ PreFigureCompiler }) => new PreFigureCompiler(),
        );
    }

    return compilerPromise;
}

export const api = {
    init: async (...args: Parameters<PreFigureCompiler["init"]>) => {
        const compiler = await getCompiler();
        return compiler.init(...args);
    },
    compile: async (...args: Parameters<PreFigureCompiler["compile"]>) => {
        const compiler = await getCompiler();
        return compiler.compile(...args);
    },
};

expose(api);
