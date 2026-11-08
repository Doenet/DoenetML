import me from "math-expressions";
import { isNumericConstant } from "./math";
import { returnGroupIntoListEntriesOfComponentType } from "../components/commonsugar/lists";

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
 * Sugar that splits the children into the entries of a list by the one rule
 * for lists (`returnGroupIntoListEntriesOfComponentType`, Doenet/DoenetML#2492)
 * and wraps each in a `<number>` when it is text that parses as a number and
 * a `<math>` otherwise, so that `<sum>1 2 x</sum>` and `<sum>1, 2, x + 1</sum>`
 * have three children rather than one string. A reference is an operand of
 * its own, wherever it is written (`<sum>$a$b</sum>` adds two).
 *
 * `componentName` is the component whose children these are, which a
 * warning about its text names (`<sum>`).
 */
export function returnBreakStringsIntoMathsBySpacesSugarInstruction(
    componentName,
) {
    const groupIntoListEntries = returnGroupIntoListEntriesOfComponentType({
        componentType: "math",
        componentsAreEntries: true,
        componentNameForDiagnostics: componentName,
        // An empty entry (`1,,2`) is a blank math, not the `0` that
        // `Number("")` is.
        componentTypeOfText: (text) =>
            text.trim() !== "" && Number.isFinite(Number(text))
                ? "number"
                : "math",
    });

    function breakStringsIntoMathsBySpaces({
        matchedChildren,
        componentInfoObjects,
        nComponents,
        stateIdInfo,
        parentComponentType,
    }) {
        return groupIntoListEntries({
            matchedChildren,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
            parentComponentType,
        });
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
            if (isNumberChild) {
                return child.stateValues.value;
            }
            // The numeric operators are mathjs functions, and they accept
            // `NaN` while rejecting anything that is not a number:
            // `median([1,4,5,null])` throws "unexpected type of argument" and
            // takes the whole document with it, where `median([1,4,5,NaN])`
            // returns `NaN` and the operator degrades quietly. A `Complex` is
            // the case this guard catches.
            const value = child.stateValues.value.evaluate_to_constant();
            return isNumericConstant(value) ? value : NaN;
        }

        return isNumberChild
            ? me.fromAst(child.stateValues.value)
            : child.stateValues.value;
    });
}

/**
 * The numeric value of each `<number>` or `<math>` child, in order.
 *
 * A `<number>` child's value is already a plain number; a `<math>` child's is a
 * math-expression, and one that is not constant evaluates to `NaN` — which is
 * what the charts read as a value they cannot draw, rather than as a zero.
 */
export function numericValuesFromValueChildren(children) {
    return children.map((child) => {
        const value = child?.stateValues.value;
        return typeof value?.evaluate_to_constant === "function"
            ? value.evaluate_to_constant()
            : value;
    });
}
