import MathComponent from "../Math";
import me from "math-expressions";
import { renameStateVariable } from "../../utils/stateVariables";
import { holdsBlank, holdsNaN } from "../../utils/missing";

export default class MathOperatorOneInput extends MathComponent {
    static componentType = "_mathOperatorOneInput";
    static rendererType = "math";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.mathOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { mathOperator: (x) => me.fromAst("\uff3f") },
            }),
        };

        stateVariableDefinitions.inverseMathOperator = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { inverseMathOperator: null } }),
        };

        // rename unnormalizedValue to unnormalizedValuePreOperator
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "unnormalizedValue",
            newName: "unnormalizedValuePreOperator",
        });

        // create new version of unnormalizedValue that applies operator
        stateVariableDefinitions.unnormalizedValue = {
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "unnormalizedValuePreOperator",
                },
                mathOperator: {
                    dependencyType: "stateVariable",
                    variableName: "mathOperator",
                },
                inverseMathOperator: {
                    dependencyType: "stateVariable",
                    variableName: "inverseMathOperator",
                },
            }),
            definition: function ({ dependencyValues }) {
                const unnormalizedValue = dependencyValues.mathOperator(
                    dependencyValues.value,
                );
                // A `NaN` caused by a missing or blank input is missing (D40,
                // VAL-5, #2460): `<clampNumber>$nothing</clampNumber>` is
                // `＿`. A `NaN` from a present input
                // (`<clampNumber>x</clampNumber>`) stays.
                if (
                    holdsBlank(dependencyValues.value) &&
                    holdsNaN(unnormalizedValue)
                ) {
                    return {
                        setValue: { unnormalizedValue: me.fromAst("\uff3f") },
                    };
                }
                return { setValue: { unnormalizedValue } };
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
                componentIdx,
            }) {
                if (dependencyValues.inverseMathOperator) {
                    let newValue = dependencyValues.inverseMathOperator(
                        desiredStateVariableValues.unnormalizedValue,
                    );
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "value",
                                desiredValue: newValue,
                            },
                        ],
                    };
                } else {
                    return { success: false };
                }
            },
        };

        // rename canBeModified to canBeModifiedPreOperator
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "canBeModified",
            newName: "canBeModifiedPreOperator",
        });

        // create new version on canBeModified that is false
        // if don't have inverseMathOperator
        stateVariableDefinitions.canBeModified = {
            returnDependencies: () => ({
                canBeModifiedPreOperator: {
                    dependencyType: "stateVariable",
                    variableName: "canBeModifiedPreOperator",
                },
                inverseMathOperator: {
                    dependencyType: "stateVariable",
                    variableName: "mathOperator",
                },
            }),
            definition: function ({ dependencyValues }) {
                let canBeModified = dependencyValues.canBeModifiedPreOperator;

                if (!dependencyValues.inverseMathOperator) {
                    canBeModified = false;
                }

                return { setValue: { canBeModified } };
            },
        };

        return stateVariableDefinitions;
    }
}
