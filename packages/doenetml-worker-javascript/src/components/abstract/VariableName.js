import { isValidVariable } from "../../utils/math";
import { renameStateVariable } from "../../utils/stateVariables";
import MathComponent from "../Math";
import { codedDiagnostic } from "../../utils/diagnostics";

export default class Variable extends MathComponent {
    static componentType = "_variableName";
    static rendererType = "math";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // we need to add validVariable as an additional state variable of value
        // so that we get the warning any time the value is calculate

        renameStateVariable({
            stateVariableDefinitions,
            oldName: "value",
            newName: "valuePreValidate",
        });

        // Still specify the value of an _variableName with the essential variable value
        // Needed so that can creating an integer component from serialized state as:
        // {componentType: "_variableName", state: {value: me.fromAst("x")}}
        stateVariableDefinitions.valuePreValidate.essentialVarName = "value";

        stateVariableDefinitions.value = {
            description: "The variable as a math expression.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "_variableName",
            },
            additionalStateVariablesDefined: ["validVariable"],
            returnDependencies: () => ({
                valuePreValidate: {
                    dependencyType: "stateVariable",
                    variableName: "valuePreValidate",
                },
            }),
            definition({ dependencyValues }) {
                let diagnostics = [];
                let validVariable = isValidVariable(
                    dependencyValues.valuePreValidate,
                );

                if (!validVariable) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0017",
                            args: {
                                value: dependencyValues.valuePreValidate.toString(),
                            },
                        }),
                    );
                }

                return {
                    setValue: {
                        value: dependencyValues.valuePreValidate,
                        validVariable,
                    },
                    sendDiagnostics: diagnostics,
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "valuePreValidate",
                            desiredValue: desiredStateVariableValues.value,
                        },
                    ],
                };
            },
        };

        return stateVariableDefinitions;
    }
}
