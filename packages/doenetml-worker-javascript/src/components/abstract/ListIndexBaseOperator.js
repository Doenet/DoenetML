import MathComponent from "../Math";
import me from "math-expressions";
import { codedDiagnostic } from "../../utils/diagnostics";
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
/**
 * The reasons an index operator can come back with 0 — no position at all —
 * and the diagnostic each one deserves.
 *
 * 0 is deliberately not a valid index (list indices start at 1), so an author
 * who gets one has usually made one of these three mistakes, and the result on
 * its own does not say which. Omitting `target` is a warning: nothing about
 * that document can ever produce an answer. The other two are info, because
 * both arise legitimately while a page is still settling — a list driven by an
 * input can be momentarily empty, and a target can be absent from a list that
 * is about to change.
 */
function diagnosticsForNoIndex(result, componentType) {
    switch (result.reason) {
        case "noTarget":
            return [
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0134",
                    args: { component: componentType },
                }),
            ];
        case "notFound":
            return [
                codedDiagnostic({
                    type: "info",
                    code: "doenet-i0049",
                    args: {
                        component: componentType,
                        target: result.target ?? "",
                    },
                }),
            ];
        case "noValues":
            return [
                codedDiagnostic({
                    type: "info",
                    code: "doenet-i0050",
                    args: { component: componentType },
                }),
            ];
        default:
            return [];
    }
}

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
            highlighted: true,
        };

        // `<math>` highlights these because they shape the expression it parses
        // and renders. The value here is an integer index, so how the input is
        // parsed as latex, whether the result is simplified, and how many digits
        // it shows are all beside the point; leave them to the other sections.
        for (const attrName of ["format", "simplify", "displayDigits"]) {
            if (attributes[attrName]) {
                const { highlighted: _highlighted, ...rest } =
                    attributes[attrName];
                attributes[attrName] = rest;
            }
        }

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoTypeSugarInstruction(this.componentType),
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

        // `this` is the class here, so a subclass names itself in its own
        // diagnostics; inside a `definition` it would not be.
        const componentType = this.componentType;

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
        // the same set `<periodicSet>` drops, for the same reason.
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
        // Overridden by subclasses. Returns `{ index, reason?, target? }`;
        // `reason` explains a zero so the base can raise the right diagnostic.
        stateVariableDefinitions.indexOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { indexOperator: () => ({ index: 0 }) },
            }),
        };

        // `<math>` describes `value` generically; for these components it is the
        // index the operator found, which is the one output worth surfacing.
        stateVariableDefinitions.value = {
            ...stateVariableDefinitions.value,
            description:
                "The 1-based index the operator found, or 0 if there is none.",
            highlighted: true,
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
                const result = dependencyValues.indexOperator({
                    values: dependencyValues.listValues,
                    numeric: dependencyValues.allAreNumeric,
                });

                const index = result.index;

                return {
                    setValue: { unnormalizedValue: me.fromAst(index) },
                    sendDiagnostics: diagnosticsForNoIndex(
                        result,
                        componentType,
                    ),
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
        highlighted: true,
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
            return { index: 0, reason: "noTarget" };
        }
        if (values.length === 0) {
            return { index: 0, reason: "noValues" };
        }
        return locate({
            values,
            target,
            numeric: numeric && target.isNumeric,
        });
    };
}
