/**
 * The value logic of the one-input math operators `<abs>` and `<round>` as
 * functions of plain values. Each component calls them from its
 * `mathOperator` and `inverseMathOperator`, and a list that evaluates a
 * template holding one at each index (Doenet/DoenetML#2163) calls the same
 * functions. See `./math.js` for the pattern.
 */
import me from "math-expressions";

/**
 * The absolute value of `value`: a number when it evaluates to one, and the
 * symbolic absolute value otherwise.
 */
export function absValue(value) {
    // TODO: is this the right behavior?
    // or should <abs>log(5)</abs> yield |log(5)|?
    let numericValue = value.evaluate_to_constant();

    // if don't have a number, just return symbolic absolute value
    if (!Number.isFinite(numericValue)) {
        return me.fromAst(["apply", "abs", value.tree]);
    }

    return me.fromAst(Math.abs(numericValue));
}

/**
 * What `<abs>` writes to its content so that its value becomes `value`: `0`
 * for a negative number, the argument of a symbolic absolute value, and
 * `value` itself otherwise.
 */
export function absInverse(value) {
    let desiredValue = value;
    let valueNumeric = value.evaluate_to_constant();
    if (Number.isFinite(valueNumeric)) {
        if (valueNumeric < 0) {
            desiredValue = me.fromAst(0);
        }
    } else if (
        Array.isArray(value.tree) &&
        value.tree[0] === "apply" &&
        value.tree[1] === "abs"
    ) {
        desiredValue = me.fromAst(value.tree[2]);
    }
    return desiredValue;
}

/**
 * `value` rounded to `numDigits` significant digits, or, when that is `null`,
 * to `numDecimals` decimal places.
 */
export function roundValue(value, { numDecimals, numDigits }) {
    // First convert all numbers and constants (such as pi)
    // to floating point numbers. `max_digits: Infinity` is
    // what does that: it is the only setting under which an
    // exact rational floats, and rounding is the whole
    // point here — without it `<round numDecimals="3">1/3
    // </round>` answers `1/3`.
    //
    // The cost is that a decimal literal carrying more than
    // ~17 significant digits goes through an f64 on the way
    // in, so `35203423.02352343201` rounds to
    // `…523435` rather than the exact `…523432`. Accepted:
    // the alternative loses rounding for every fraction.
    let valueWithNumbers = value.evaluate_numbers({
        max_digits: Infinity,
        evaluate_functions: true,
    });

    if (numDigits !== null) {
        return valueWithNumbers.round_numbers_to_precision(numDigits);
    } else {
        return valueWithNumbers.round_numbers_to_decimals(numDecimals);
    }
}

/** What `<round>` writes to its content: the value itself. */
export function roundInverse(value) {
    return value;
}
