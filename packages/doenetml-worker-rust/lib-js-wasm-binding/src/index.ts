import { evalWithMathExpressionsInScope } from "./eval-math";
import { globalThis } from "./global-this";

export * from "./CoreWorker";

// Keep typescript from complaining about adding properties to `Window`
declare global {
    interface Window {
        __forDoenetWorker: {
            evalWithMathExpressionsInScope: typeof evalWithMathExpressionsInScope;
        };
    }
}

// The Rust code assumes a global variable called `evalWithMathExpressionsInScope` exists.
globalThis.__forDoenetWorker = { evalWithMathExpressionsInScope };
