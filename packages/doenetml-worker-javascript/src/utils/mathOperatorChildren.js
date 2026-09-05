import me from "math-expressions";

/**
 * Shared machinery for the two families of math operators: the ones that
 * reduce their children to a single value (`<sum>`, `<min>`, … — see
 * `abstract/MathBaseOperator`) and the ones that map them to another list
 * (`<cumulativeSum>`, `<differences>`, … — see
 * `abstract/MathBaseListOperator`).
 *
 * The two families differ only in the shape of their result. They accept the
 * same children and read them the same way, so both read them from here; that
 * is what keeps `<cumulativeSum>a b c</cumulativeSum>` splitting its argument
 * exactly as `<sum>a b c</sum>` does.
 */

/**
 * Sugar that splits bare string children on whitespace and wraps each piece in
 * a `<number>` when it parses as a number and a `<math>` otherwise, so that
 * `<sum>1 2 x</sum>` has three children rather than one string.
 */
export function returnBreakStringsIntoMathsBySpacesSugarInstruction() {
    function breakStringsIntoMathsBySpaces({
        matchedChildren,
        nComponents,
        stateIdInfo,
    }) {
        let newChildren = matchedChildren.reduce(function (a, c) {
            if (typeof c === "string") {
                return [
                    ...a,
                    ...c
                        .split(/\s+/)
                        .filter((s) => s)
                        .map((s) => ({
                            type: "serialized",
                            componentType: Number.isFinite(Number(s))
                                ? "number"
                                : "math",
                            componentIdx: nComponents++,
                            stateId: stateIdInfo
                                ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                : undefined,
                            children: [s],
                            attributes: {},
                            doenetAttributes: {},
                            state: {},
                        })),
                ];
            } else {
                return [...a, c];
            }
        }, []);

        return { success: true, newChildren, nComponents };
    }

    return { replacementFunction: breakStringsIntoMathsBySpaces };
}

/**
 * The arguments an operator should be handed, given its math and number
 * children. When `isNumeric`, every child becomes a plain number (a math child
 * that is not a constant becomes `NaN`); otherwise every child becomes a
 * math-expression.
 */
export function mathOperatorInputsFromChildren({
    children,
    isNumeric,
    componentInfoObjects,
}) {
    return children.map((child) => {
        const isNumberChild = componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "number",
        });

        if (isNumeric) {
            return isNumberChild
                ? child.stateValues.value
                : child.stateValues.value.evaluate_to_constant();
        }

        return isNumberChild
            ? me.fromAst(child.stateValues.value)
            : child.stateValues.value;
    });
}
