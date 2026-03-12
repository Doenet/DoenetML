import { expose } from "comlink";
import { PreFigureCompiler } from "./compiler";

const compiler = new PreFigureCompiler();

export const api = {
    init: (...args: Parameters<PreFigureCompiler["init"]>) =>
        compiler.init(...args),
    compile: (...args: Parameters<PreFigureCompiler["compile"]>) =>
        compiler.compile(...args),
};

expose(api);
