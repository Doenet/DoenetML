import CompositeComponent from "./CompositeComponent";
import { returnListValueStateVariableDefinitions } from "../../utils/listValues";
import {
    addReplacementRendererType,
    calculateValueListReplacementChanges,
    createValueListReplacements,
    returnPassThroughAttributeDeclarations,
    returnPassThroughAttributes,
} from "../../utils/valueListReplacements";

/**
 * Base class for the operators that answer *how many*: `<tally>` and
 * `<binCounts>`.
 *
 * These are the missing corner of the list-operator families. `MathBaseOperator`
 * reduces a list to one value, `MathBaseListOperator` maps a list of maths to a
 * list of maths, and `ListIndexBaseListOperator` reports positions. None of them
 * fits an operator whose *input* is a list of arbitrary comparable values and
 * whose *output* is a list of counts — one per category or per bin, with no
 * relationship to the length of the input.
 *
 * Like `<sort>`, the input is read through `utils/listValues`, so what counts as
 * "the same value" here is what `<sort>` would call equal — by construction
 * rather than by coincidence. The output is created fresh, so these are
 * composites that build replacements in the manner of `<sequence>`, which is
 * what makes `$counts[2]`, `<sum>$counts</sum>` and
 * `<numberList>$counts</numberList>` all work.
 *
 * Those replacements are `<number>` components, not the `<math>` that
 * `MathBaseListOperator` creates. A count is a non-negative integer whatever
 * the input is: a `<tally>` of a `<textList>` counts names and still answers in
 * integers, so unlike a cumulative sum — which is genuinely symbolic when its
 * children are — there is no input at all for which a count could be a math
 * expression. `<math>` would advertise a capability that cannot occur, give
 * `$counts[1].latex` a meaning nobody wants, and send every count through
 * MathJax. `<sortIndices>` settled on `<number>` for the same reason.
 *
 * Subclasses supply `countValues`, which receives `{ values, numeric }` and
 * returns `{ counts, labels, diagnostics }`. `labels` is what the counts are
 * counts *of*; a subclass that has nothing useful to say may return `null` and
 * simply not declare a state variable for them. `diagnostics` is optional, and
 * is raised from here rather than from the subclass so that a message about the
 * data — as opposed to one about the attributes — is raised once the values are
 * in hand.
 */
export default class CountingBaseListOperator extends CompositeComponent {
    static componentType = "_countingListOperator";

    static takesIndex = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static allowInSchemaAsComponent = ["number"];

    // Since the operator treats each child as a separate argument,
    // composites with no replacement should be ignored.
    static descendantCompositesMustHaveAReplacement = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // Not used by the composite itself; forwarded to each `<number>` it
        // creates.
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

    // Include children that can be added due to sugar. What bare strings are
    // read *as* is left to the subclass: `<binCounts>` can only ever count
    // numbers, so it reads them the way `<sum>` does, while `<tally>` counts
    // values of any comparable type and so has to be told which.
    static additionalSchemaChildren = ["string"];

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

        Object.assign(
            stateVariableDefinitions,
            returnListValueStateVariableDefinitions({
                componentName: this.componentType,
                supportProps: false,
            }),
        );

        // Overridden by subclasses. Receives `{ values, numeric }` and returns
        // `{ counts, labels, diagnostics }`, the last two optional.
        stateVariableDefinitions.countValues = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: {
                    countValues: () => ({ counts: [], labels: null }),
                },
            }),
        };

        stateVariableDefinitions.countingResults = {
            additionalStateVariablesDefined: ["countLabels"],
            returnDependencies: () => ({
                listValues: {
                    dependencyType: "stateVariable",
                    variableName: "listValues",
                },
                allAreNumeric: {
                    dependencyType: "stateVariable",
                    variableName: "allAreNumeric",
                },
                countValues: {
                    dependencyType: "stateVariable",
                    variableName: "countValues",
                },
            }),
            definition({ dependencyValues }) {
                const { counts, labels, diagnostics } =
                    dependencyValues.countValues({
                        values: dependencyValues.listValues,
                        numeric: dependencyValues.allAreNumeric,
                    });

                return {
                    setValue: {
                        countingResults: counts,
                        countLabels: labels ?? null,
                    },
                    sendDiagnostics: diagnostics ?? [],
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                countingResults: {
                    dependencyType: "stateVariable",
                    variableName: "countingResults",
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
            values: await component.stateValues.countingResults,
            componentType: "number",
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
            values: await component.stateValues.countingResults,
            componentType: "number",
            attributesToConvert: returnPassThroughAttributes(component),
            componentInfoObjects,
            workspace,
            nComponents,
        });
    }

    addOwnPotentialRendererTypes(rendererTypes, visited) {
        super.addOwnPotentialRendererTypes(rendererTypes, visited);

        // The replacements are `<number>` components whatever the children are.
        addReplacementRendererType({
            component: this,
            componentType: "number",
            rendererTypes,
        });
    }
}
