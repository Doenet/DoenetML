import MathComponent from "../Math";
import me from "math-expressions";
import { returnNumberDisplayStateVariableDefinitions } from "../../utils/numberDisplay";
import {
    comparableValueFromRaw,
    returnBreakStringsIntoTypeSugarInstruction,
    returnListValueStateVariableDefinitions,
} from "../../utils/listValues";

/**
 * Base class for operators that report a *position* within a list rather than
 * a value from it: `<argMin>`, `<argMax>`, `<indexOf>`, `<searchSorted>`.
 *
 * The result is an index, so — like `<count>` — these are math components whose
 * value is computed from their children. But unlike `MathBaseOperator`, which
 * only accepts math and number children, these accept anything `<sort>` accepts.
 * Finding the position of a name in a `<textList>` is at least as common as
 * finding a value in a `<numberList>`, and ordering comparisons on text are
 * perfectly well defined; the shared extraction in `utils/listValues` is what
 * keeps those comparisons identical to `<sort>`'s.
 *
 * Indices are 1-based, matching `$list[1]`, and `0` means "no such element" —
 * consistent with `$list[0]` being empty.
 *
 * Subclasses supply `indexOperator`, which receives `{ values, numeric }` and
 * returns the index.
 */
export default class ListIndexBaseOperator extends MathComponent {
    static componentType = "_listIndexOperator";

    static rendererType = "math";

    // Since the operator treats each child as a separate argument,
    // composites with no replacement should be ignored.
    static descendantCompositesMustHaveAReplacement = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.type = {
            createPrimitiveOfType: "string",
            description:
                "Component type to interpret bare string children as (math, number, text, or boolean).",
        };

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoTypeSugarInstruction(this.componentType, {
                requireStringChild: true,
            }),
        );

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // The result is an index, so there is no single child whose rounding
        // settings should be inherited.
        Object.assign(
            stateVariableDefinitions,
            returnNumberDisplayStateVariableDefinitions(),
        );

        // `<math>` reads its children as pieces of one expression, parsing
        // strings and tracking which children can be modified. This component
        // reads them as a list of independent values instead, so all of that
        // machinery goes — and with it every dependency on the `maths` and
        // `strings` child groups, which this component does not have. This is
        // the same set `<evaluate>` and `<matrix>` drop for the same reason.
        delete stateVariableDefinitions.codePre;
        delete stateVariableDefinitions.expressionWithCodes;
        delete stateVariableDefinitions.mathChildrenFunctionSymbols;
        delete stateVariableDefinitions.codesAdjacentToStrings;
        delete stateVariableDefinitions.mathChildrenByVectorComponent;
        delete stateVariableDefinitions.mathChildrenWithCanBeModified;
        delete stateVariableDefinitions.unordered;

        // The result is a computed index; there is nothing to invert.
        stateVariableDefinitions.canBeModified = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { canBeModified: false } }),
        };

        Object.assign(
            stateVariableDefinitions,
            returnListValueStateVariableDefinitions({
                componentName: this.componentType,
                supportProps: false,
            }),
        );

        // Overridden by subclasses.
        stateVariableDefinitions.indexOperator = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { indexOperator: () => 0 } }),
        };

        stateVariableDefinitions.unnormalizedValue = {
            returnDependencies: () => ({
                listValues: {
                    dependencyType: "stateVariable",
                    variableName: "listValues",
                },
                allAreNumeric: {
                    dependencyType: "stateVariable",
                    variableName: "allAreNumeric",
                },
                indexOperator: {
                    dependencyType: "stateVariable",
                    variableName: "indexOperator",
                },
            }),
            definition({ dependencyValues }) {
                let index = dependencyValues.indexOperator({
                    values: dependencyValues.listValues,
                    numeric: dependencyValues.allAreNumeric,
                });

                return {
                    setValue: { unnormalizedValue: me.fromAst(index) },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

/**
 * Shared pieces for the two operators that compare the list against a value
 * supplied by the author: `<indexOf>` and `<searchSorted>`.
 *
 * The target is a `_componentWithSelectableType`, so it follows the component's
 * own `type` attribute: `<indexOf type="text" target="Carol">` compares text.
 */
export function returnTargetAttribute(description) {
    return {
        createComponentOfType: "_componentWithSelectableType",
        createStateVariable: "target",
        defaultValue: null,
        description,
    };
}

export function returnTargetStateVariableDefinition() {
    return {
        comparableTarget: {
            returnDependencies: () => ({
                target: {
                    dependencyType: "stateVariable",
                    variableName: "target",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        comparableTarget: comparableValueFromRaw(
                            dependencyValues.target,
                        ),
                    },
                };
            },
        },
    };
}

/**
 * Turn `locate`, which searches `values` for `target`, into an `indexOperator`,
 * supplying the two things both target-taking operators need: no target means
 * no answer, so the result is 0; and the comparison is numeric only when the
 * target is numeric as well as the list, so that
 * `<indexOf target="b">a b c</indexOf>` compares as text.
 */
export function returnTargetSearchingIndexOperator(target, locate) {
    return ({ values, numeric }) => {
        if (target === null) {
            return 0;
        }
        return locate({
            values,
            target,
            numeric: numeric && target.isNumeric,
        });
    };
}
