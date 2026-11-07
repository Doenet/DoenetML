import MathList from "../MathList";
import me from "math-expressions";
import { isValidVariable } from "../../utils/math";
import { codedDiagnostic } from "../../utils/diagnostics";
import { levelFromSource } from "../../utils/decidedByDoenetML";

export default class VariableNameList extends MathList {
    static componentType = "_variableNameList";

    // when another component has a attribute that is a _variableNameList,
    // use the variables state variable to populate that attribute
    static stateVariableToBeShadowed = "variables";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.variables = {
            description: "The list of variable names.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "_variableName",
            },
            isArray: true,
            entryPrefixes: ["var"],
            additionalStateVariablesDefined: ["validVariables"],
            returnArraySizeDependencies: () => ({
                numComponents: {
                    dependencyType: "stateVariable",
                    variableName: "numComponents",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numComponents];
            },

            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};

                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        math: {
                            dependencyType: "stateVariable",
                            variableName: "math" + (Number(arrayKey) + 1),
                        },
                    };
                }
                // whether the variables are written in the DoenetML, so one
                // that is not a variable is a warning, or come from values
                // that can change, so it is an info (DIAG-2)
                let globalDependencies = {
                    variablesDecidedByDoenetML: {
                        dependencyType: "decidedByDoenetML",
                        children: true,
                    },
                };
                return { dependenciesByKey, globalDependencies };
            },
            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
            }) {
                let variables = {};
                let validVariables = {};
                // reported for each key while it is not a variable (B33)
                let conditionDiagnosticsByKey = {};
                for (let arrayKey of arrayKeys) {
                    let variable = dependencyValuesByKey[arrayKey].math;
                    let validVariable = isValidVariable(variable);
                    conditionDiagnosticsByKey[arrayKey] = [];
                    if (!validVariable) {
                        conditionDiagnosticsByKey[arrayKey].push(
                            codedDiagnostic({
                                type: levelFromSource(
                                    globalDependencyValues.variablesDecidedByDoenetML,
                                ),
                                code: "doenet-w0017",
                                args: { value: variable.toString() },
                            }),
                        );
                        validVariable = false;
                    }
                    variables[arrayKey] = variable;
                    validVariables[arrayKey] = validVariable;
                }
                return {
                    setValue: { variables, validVariables },
                    conditionDiagnosticsByKey,
                };
            },
        };

        return stateVariableDefinitions;
    }
}
