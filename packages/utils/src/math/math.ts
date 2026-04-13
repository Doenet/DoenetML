import me from "math-expressions";
import type { Expression, Tree } from "math-expressions";

export const mathjaxConfig = {
    tex: {
        tags: "ams",
        macros: {
            lt: "<",
            gt: ">",
            amp: "&",
            var: ["\\mathrm{#1}", 1],
            csch: "\\operatorname{csch}",
            sech: "\\operatorname{sech}",
            erf: "\\operatorname{erf}",
        },
        displayMath: [["\\[", "\\]"]],
    },
    output: {
        displayOverflow: "linebreak",
    },
};

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
