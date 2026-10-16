import ValueListComponent from "./ValueListComponent";
import { returnListValueStateVariableDefinitions } from "../../utils/listValues";

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
 * rather than by coincidence. The output is a list component of numbers
 * (`ValueListComponent`), which a parent sees as one `<number>` per count, so
 * `$counts[2]`, `<sum>$counts</sum>` and `<numberList>$counts</numberList>`
 * all work.
 *
 * The entries are numbers, not the maths that
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
export default class CountingBaseListOperator extends ValueListComponent {
    static componentType = "_countingListOperator";

    static listEntryComponentType = "number";

    static listEntryValuesVariable = "countingResults";

    // Since the operator treats each child as a separate argument,
    // composites with no replacement should be ignored.
    static descendantCompositesMustHaveAReplacement = false;

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

        return stateVariableDefinitions;
    }
}
