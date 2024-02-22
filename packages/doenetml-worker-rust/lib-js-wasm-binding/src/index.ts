import {
    evalWithMathExpressionsInScope,
    parseTextIntoMath,
    parseLatexIntoMath,
    toLatex,
    substituteIntoMath,
    normalizeMath,
} from "./eval-math";
import { globalThis } from "./global-this";

export * from "./CoreWorker";

// Keep typescript from complaining about adding properties to `Window`
declare global {
    interface Window {
        __forDoenetWorker: {
            evalWithMathExpressionsInScope: typeof evalWithMathExpressionsInScope;
            parseTextIntoMath: typeof parseTextIntoMath;
            parseLatexIntoMath: typeof parseLatexIntoMath;
            toLatex: typeof toLatex;
            substituteIntoMath: typeof substituteIntoMath;
            normalizeMath: typeof normalizeMath;
        };
    }
}

// The Rust code assumes these global variables exist.
globalThis.__forDoenetWorker = {
    evalWithMathExpressionsInScope,
    parseTextIntoMath,
    parseLatexIntoMath,
    toLatex,
    substituteIntoMath,
    normalizeMath,
};
