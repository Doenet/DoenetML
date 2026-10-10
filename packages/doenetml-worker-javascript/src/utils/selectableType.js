import me from "math-expressions";
import { convertValueToMathExpression } from "@doenet/utils";
import { evaluateToNumber, textToAst } from "./math";

/**
 * `value` as a value of `type` (`number`, `math`, `text`, `letters` or
 * `boolean`), as a component of selectable type holds it; the first of an
 * array.
 */
export function convertValueToType(value, type) {
    if (Array.isArray(value)) {
        value = value[0];
    }
    if (type === "number") {
        // Both branches have to spell "not a number" the same way, and for a
        // `number`-typed value that spelling is `NaN`. The sibling
        // `Number(value)` already gives `NaN` for anything unconvertible. The
        // engine used to report an expression it cannot evaluate as `null`,
        // which is `0` to arithmetic and which `Number.isNaN` answers `false`
        // for; it answers `NaN` now, and `evaluateToNumber` still maps the
        // `Complex` arm onto the same spelling.
        if (value instanceof me.class) {
            return evaluateToNumber(value);
        }
        return Number(value);
    } else if (type === "math") {
        if (typeof value === "string") {
            try {
                return me.fromAst(textToAst.convert(value));
            } catch (e) {}
        }
        return convertValueToMathExpression(value);
    } else if (type === "boolean") {
        return Boolean(value);
    } else {
        // type is letters or text
        return String(value);
    }
}
