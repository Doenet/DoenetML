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
import { PreFigureCompiler } from "./compiler";

const compiler = new PreFigureCompiler();

export const api = {
    init: async (...args: Parameters<PreFigureCompiler["init"]>) => {
        return compiler.init(...args);
    },
    compile: async (...args: Parameters<PreFigureCompiler["compile"]>) => {
        return compiler.compile(...args);
    },
};

expose(api);
