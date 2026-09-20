import MathComponent from "../Math";
import me from "math-expressions";
import { returnNumberDisplayStateVariableDefinitions } from "../../utils/numberDisplay";
import {
    returnBreakStringsIntoTypeSugarInstruction,
    returnListValueStateVariableDefinitions,
} from "../../utils/listValues";
import {
    diagnosticsForNoIndex,
    returnListTypeAttribute,
} from "../../utils/listIndexOperators";

/**
 * Base class for operators that report a single *position* within a list
 * rather than a value from it: `<argMin>` and `<argMax>`.
 *
 * The result is one index, so — like `<count>` — these are math components
 * whose value is computed from their children. The operators that search for a
 * *target* report one index per target and so are composites; they live in
 * `ListIndexBaseListOperator`. What the two bases share is in
 * `utils/listIndexOperators`.
 *
 * Unlike `MathBaseOperator`, which only accepts math and number children, these
 * accept anything `<sort>` accepts. Ordering comparisons on text are perfectly
 * well defined, and the shared extraction in `utils/listValues` is what keeps
 * those comparisons identical to `<sort>`'s.
 *
 * Indices are 1-based, matching `$list[1]`, and `0` means "no such element" —
 * consistent with `$list[0]` being empty.
 *
 * Subclasses supply `indexOperator`, which receives `{ values, numeric }` and
 * returns `{ index, reason? }`.
 */
export default class ListIndexBaseOperator extends MathComponent {
    static componentType = "_listIndexOperator";

    static rendererType = "math";

    // Since the operator treats each child as a separate argument,
    // composites with no replacement should be ignored.
    static descendantCompositesMustHaveAReplacement = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.type = returnListTypeAttribute();

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

        // Overridden by subclasses. Returns `{ index, reason? }`; `reason`
        // explains a zero so the base can raise the right diagnostic.
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

                return {
                    setValue: { unnormalizedValue: me.fromAst(result.index) },
                    sendDiagnostics: diagnosticsForNoIndex(
                        result.reason,
                        componentType,
                    ),
                };
            },
        };

        return stateVariableDefinitions;
    }
}
