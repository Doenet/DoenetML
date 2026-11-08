import { isValidVariable } from "../../utils/math";
import { renameStateVariable } from "../../utils/stateVariables";
import MathComponent from "../Math";
import { codedDiagnostic } from "../../utils/diagnostics";
import { levelFromSource } from "../../utils/decidedByDoenetML";

export default class Variable extends MathComponent {
    static componentType = "_variableName";
    static rendererType = "math";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // we need to add validVariable as an additional state variable of value
        // so that we get the diagnostic any time the value is calculated

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
                // whether the variable is written in the DoenetML, so one
                // that is not a variable is a warning, or comes from values
                // that can change, so it is an info (DIAG-2)
                valueDecidedByDoenetML: {
                    dependencyType: "decidedByDoenetML",
                    children: true,
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
                            type: levelFromSource(
                                dependencyValues.valueDecidedByDoenetML,
                            ),
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
                    // reported while it is not a variable (B33)
                    conditionDiagnostics: diagnostics,
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
