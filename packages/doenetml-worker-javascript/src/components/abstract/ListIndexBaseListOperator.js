import CompositeComponent from "./CompositeComponent";
import me from "math-expressions";
import {
    returnBreakStringsIntoTypeSugarInstruction,
    returnListValueStateVariableDefinitions,
} from "../../utils/listValues";
import {
    diagnosticsForNoIndices,
    locateEachTarget,
    returnComparableTargetsStateVariableDefinition,
    returnListTypeAttribute,
    returnTargetAttribute,
} from "../../utils/listIndexOperators";
import {
    addReplacementRendererType,
    calculateValueListReplacementChanges,
    createValueListReplacements,
    returnPassThroughAttributeDeclarations,
    returnPassThroughAttributes,
} from "../../utils/valueListReplacements";

/**
 * Base class for the index-returning operators that search the list for a
 * value the author supplies: `<indexOf>` and `<searchSorted>`.
 *
 * These take a *list* of targets and report one 1-based index per target, in
 * the manner of `np.searchsorted(a, v)` with an array `v` and R's `match()`.
 * One target in, one index out, so the common scalar reading still works; a
 * hundred targets in, a hundred indices out of one operator rather than a
 * hundred operators. The hundred indices are themselves a hundred `<math>`
 * replacements — what one operator saves is the searching, not the results.
 *
 * Returning a list is what makes these composites rather than `<math>`
 * components, so they follow `MathBaseListOperator` (fresh `<math>`
 * replacements, in the manner of `<sequence>`) rather than
 * `ListIndexBaseOperator`, which stays the home of the operators that report a
 * single position and need no target — `<argMin>` and `<argMax>`.
 *
 * Being a composite is what makes `$which[2]`, `<sum>$which</sum>` and
 * `<numberList>$which</numberList>` all work on the result, and a single-target
 * operator still reads as one math wherever one is expected — including as a
 * path index, so `$pop[$which]` keeps working now that `<searchSorted>` is a
 * composite rather than a `<math>`.
 *
 * The replacements are `<math>` rather than the `<number>` that `<sortIndices>`
 * creates: an index is an integer either way, but these operators rendered as
 * `<math>` before they returned a list, and their `<argMin>` / `<argMax>` /
 * `<count>` siblings still do, so `<math>` keeps one family rendering one way.
 *
 * Like `<sort>`, these accept anything with a comparable value, not only maths
 * and numbers: finding the position of a name in a `<textList>` is at least as
 * common as finding a value in a `<numberList>`. The shared extraction in
 * `utils/listValues` is what keeps those comparisons identical to `<sort>`'s.
 *
 * Indices are 1-based, matching `$list[1]`, and `0` means "no such element" —
 * consistent with `$list[0]` being empty.
 *
 * Subclasses supply `locate`, which receives `{ values, target, numeric }` for
 * one target and returns `{ index, reason? }`.
 */
export default class ListIndexBaseListOperator extends CompositeComponent {
    static componentType = "_listIndexListOperator";

    static takesIndex = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static allowInSchemaAsComponent = ["math"];

    // Since the operator treats each child as a separate argument,
    // composites with no replacement should be ignored.
    static descendantCompositesMustHaveAReplacement = false;

    // The reference pages show this text, and the two operators do not mean
    // the same thing by `target`: `<indexOf>` looks its target up in the list,
    // which is the wording below, while `<searchSorted>` places a target that
    // need not be in the list at all and overrides it.
    static targetDescription = "The value, or list of values, to look for.";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // `createStateVariable` matters here in a way it does not for the
        // scalar operators. The `target` attribute is a
        // `_componentListWithSelectableType`, whose own `type` falls back to a
        // `parentStateVariable` named `type` — so without a `type` state
        // variable on the operator, `<indexOf type="text" target="Cal">` would
        // convert its target with the default numeric reading and compare NaN.
        attributes.type = {
            ...returnListTypeAttribute({ readsTarget: true }),
            createStateVariable: "type",
            defaultValue: null,
        };

        attributes.target = returnTargetAttribute(this.targetDescription);

        // Not used by the composite itself; forwarded to each `<math>` it
        // creates, so `displayDigits` on the operator rounds every index.
        Object.assign(attributes, returnPassThroughAttributeDeclarations());

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
            highlighted: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
        };

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

        Object.assign(
            stateVariableDefinitions,
            returnListValueStateVariableDefinitions({
                componentName: this.componentType,
                supportProps: false,
            }),
            returnComparableTargetsStateVariableDefinition(),
        );

        // Overridden by subclasses. Searches `values` for one `target` and
        // returns `{ index, reason? }`; `reason` explains a zero so the base
        // can raise the right diagnostic.
        stateVariableDefinitions.locate = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { locate: () => ({ index: 0 }) },
            }),
        };

        stateVariableDefinitions.operatorResults = {
            returnDependencies: () => ({
                listValues: {
                    dependencyType: "stateVariable",
                    variableName: "listValues",
                },
                allAreNumeric: {
                    dependencyType: "stateVariable",
                    variableName: "allAreNumeric",
                },
                comparableTargets: {
                    dependencyType: "stateVariable",
                    variableName: "comparableTargets",
                },
                locate: {
                    dependencyType: "stateVariable",
                    variableName: "locate",
                },
            }),
            definition({ dependencyValues }) {
                const results = locateEachTarget({
                    values: dependencyValues.listValues,
                    targets: dependencyValues.comparableTargets,
                    numeric: dependencyValues.allAreNumeric,
                    locate: dependencyValues.locate,
                });

                return {
                    setValue: {
                        operatorResults: results.map((result) =>
                            me.fromAst(result.index),
                        ),
                    },
                    sendDiagnostics: diagnosticsForNoIndices(
                        results,
                        componentType,
                    ),
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                operatorResults: {
                    dependencyType: "stateVariable",
                    variableName: "operatorResults",
                },
            }),
            // When this state variable is marked stale it indicates we should
            // update replacements. For this to work, we must get its value in
            // the replacement functions so that the variable is marked fresh.
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        return createValueListReplacements({
            component,
            values: await component.stateValues.operatorResults,
            componentType: "math",
            attributesToConvert: returnPassThroughAttributes(component),
            componentInfoObjects,
            workspace,
            nComponents,
        });
    }

    static async calculateReplacementChanges({
        component,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        return calculateValueListReplacementChanges({
            component,
            values: await component.stateValues.operatorResults,
            componentType: "math",
            attributesToConvert: returnPassThroughAttributes(component),
            componentInfoObjects,
            workspace,
            nComponents,
        });
    }

    addOwnPotentialRendererTypes(rendererTypes, visited) {
        super.addOwnPotentialRendererTypes(rendererTypes, visited);

        // The replacements are `<math>` components whatever the children are.
        addReplacementRendererType({
            component: this,
            componentType: "math",
            rendererTypes,
        });
    }
}
