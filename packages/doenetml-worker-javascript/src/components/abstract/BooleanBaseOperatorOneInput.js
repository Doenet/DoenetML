import BooleanComponent from "../Boolean";
import { renameStateVariable } from "../../utils/stateVariables";

export default class BooleanOperatorOneInput extends BooleanComponent {
    static componentType = "_booleanOperatorOneInput";

    // Its children are operands, among which a missing one is a blank
    // (D37), so it is not missing for one
    // (`BaseComponent.missingWhenContentMissing`).
    static missingWhenContentMissing = false;
    static rendererType = "boolean";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let constructor = this;

        // rename value to valuePreOperator
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "value",
            newName: "valuePreOperator",
        });

        // create new version of value that applies operator
        stateVariableDefinitions.value = {
            description:
                "The boolean result of applying this operator to its single boolean input.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "valuePreOperator",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        value: constructor.applyBooleanOperator(
                            dependencyValues.value,
                        ),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
