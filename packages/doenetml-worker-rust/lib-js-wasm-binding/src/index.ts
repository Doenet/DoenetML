export * from "lib-doenetml-worker";
import init from "lib-doenetml-worker";
export default init;
import {
    evalWithMathExpressionsInScope,
    parseTextIntoMath,
    parseLatexIntoMath,
    toLatex,
    toText,
    substituteIntoMath,
    normalizeMath,
    evaluateToNumber,
    parseTextIntoNumber,
} from "./eval-math";
import { globalThis } from "./global-this";

// Keep typescript from complaining about adding properties to `Window`
declare global {
    interface Window {
        __forDoenetWorker: {
            evalWithMathExpressionsInScope: typeof evalWithMathExpressionsInScope;
            parseTextIntoMath: typeof parseTextIntoMath;
            parseLatexIntoMath: typeof parseLatexIntoMath;
            toLatex: typeof toLatex;
            toText: typeof toText;
            substituteIntoMath: typeof substituteIntoMath;
            normalizeMath: typeof normalizeMath;
            evaluateToNumber: typeof evaluateToNumber;
            parseTextIntoNumber: typeof parseTextIntoNumber;
        };
    }
}

// The Rust code assumes these global variables exist.
globalThis.__forDoenetWorker = (globalThis as any)._forDoenetWorker || {};
Object.assign(globalThis.__forDoenetWorker, {
    evalWithMathExpressionsInScope,
    parseTextIntoMath,
    parseLatexIntoMath,
    toLatex,
    toText,
    substituteIntoMath,
    normalizeMath,
    evaluateToNumber,
    parseTextIntoNumber,
});
