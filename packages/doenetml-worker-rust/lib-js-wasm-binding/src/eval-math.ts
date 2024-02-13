// @ts-ignore
import me from "math-expressions";
import { globalThis } from "./global-this";

/**
 * Evaluate the Javascript source code with `MathExpressions` and `window` in scope.
 * Return the `JSON.stringify`ed results.
 */
export function evalWithMathExpressionsInScope(source: string) {
    function _eval(MathExpressions: any, window: Window) {
        // This is a hack to make sure that `MathExpressions` and `window` are
        // not eliminated by tree shaking. The body of the if statement should never
        // execute, but the code compilers/minifiers shouldn't be smart enough to
        // eliminate it.
        // XXX: Is there a better way to prevent these from being eliminated?
        if (Math.random() < -1) {
            console.log(
                "Running with MathExpressions in scope",
                MathExpressions,
                window,
            );
        }
        return JSON.stringify(eval(source));
    }
    return _eval(me, globalThis);
}
