import me from "math-expressions";
import type { Expression, Tree } from "math-expressions";

type RoundingDependencyValues = {
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
};

export function roundForDisplay({
    value,
    dependencyValues,
}: {
    value: Expression | Tree;
    dependencyValues: RoundingDependencyValues;
}): Expression {
    // Wrap a bare tree ourselves: the math engine reads a bare string argument
    // as text to parse, so the symbol tree "apple" would come back as the
    // product a*p*p*l*e.
    const expr = value instanceof me.class ? value : me.fromAst(value);

    let rounded = me.round_numbers_to_precision_plus_decimals(
        expr,
        dependencyValues.displayDigits,
        dependencyValues.displayDecimals,
    );

    if (
        dependencyValues.displayDigits > 0 &&
        dependencyValues.displaySmallAsZero > 0
    ) {
        rounded = me.set_small_zero(
            rounded,
            dependencyValues.displaySmallAsZero,
        );
    }

    return rounded;
}
