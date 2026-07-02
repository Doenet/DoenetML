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
    let rounded = me.round_numbers_to_precision_plus_decimals(
        value,
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
