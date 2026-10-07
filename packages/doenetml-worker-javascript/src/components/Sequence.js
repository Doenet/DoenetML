import ValueListComponent from "./abstract/ValueListComponent";
import {
    returnSequenceValues,
    returnStandardSequenceAttributes,
    returnStandardSequenceStateVariableDefinitions,
    returnSequenceWriteBasis,
    sequenceEntryComponentType,
} from "../utils/sequence";

/**
 * A sequence of numbers, maths or letters. It is a list component
 * (`ValueListComponent`): it holds its values in one array, and a parent sees
 * one `<number>`, `<math>` or `<text>` per value. Which of the three is fixed
 * by its `type`, a primitive attribute, so a `<sequence type="letters">` is
 * created as the list of texts (`classForSerializedComponent`).
 */
export default class Sequence extends ValueListComponent {
    static componentType = "sequence";

    static componentDocs = {
        summary:
            "Generates a sequence of numbers, math expressions, or letters",
    };

    static allowInSchemaAsComponent = ["number", "math", "text"];

    static listEntryComponentType = "number";

    static listEntryValuesVariable = "sequenceValues";

    static listEntriesTakeWrites = true;

    static listEntryTypeAttribute = "type";

    // A value written to an entry (`fixed="false"`) stands until the values
    // are recomputed from another `from`, `step`, `type` or `exclude`, as the
    // composite gave its replacements new values then and kept them when only
    // its length changed.
    static listEntryWriteBasisVariable = "sequenceWriteBasis";

    static listEntryTypeFromAttribute(attribute) {
        return sequenceEntryComponentType(attribute);
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnStandardSequenceAttributes());

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnStandardSequenceStateVariableDefinitions(),
        );

        // An invalid sequence has no values.
        stateVariableDefinitions.sequenceValues = {
            returnDependencies: () => ({
                validSequence: {
                    dependencyType: "stateVariable",
                    variableName: "validSequence",
                },
                from: {
                    dependencyType: "stateVariable",
                    variableName: "from",
                },
                length: {
                    dependencyType: "stateVariable",
                    variableName: "length",
                },
                step: {
                    dependencyType: "stateVariable",
                    variableName: "step",
                },
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
                lowercase: {
                    dependencyType: "stateVariable",
                    variableName: "lowercase",
                },
            }),
            definition({ dependencyValues }) {
                if (!dependencyValues.validSequence) {
                    return { setValue: { sequenceValues: [] } };
                }
                return {
                    setValue: {
                        sequenceValues: returnSequenceValues(dependencyValues),
                    },
                };
            },
        };

        stateVariableDefinitions.sequenceWriteBasis = {
            returnDependencies: () => ({
                from: {
                    dependencyType: "stateVariable",
                    variableName: "from",
                },
                step: {
                    dependencyType: "stateVariable",
                    variableName: "step",
                },
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    sequenceWriteBasis:
                        returnSequenceWriteBasis(dependencyValues),
                },
            }),
        };

        return stateVariableDefinitions;
    }
}
