import TextComponent from "./Text";
import { renameStateVariable } from "../utils/stateVariables";

export default class ShortDescription extends TextComponent {
    static componentType = "shortDescription";
    static rendererType = "text";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // rename value to valueOriginal
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "value",
            newName: "valueOriginal",
        });

        stateVariableDefinitions.value = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
            },
            returnDependencies: () => ({
                valueOriginal: {
                    dependencyType: "stateVariable",
                    variableName: "valueOriginal",
                },
                mathDescendant: {
                    dependencyType: "descendant",
                    componentTypes: ["math", "m"],
                    includeNonActiveChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                const warnings = [];
                if (dependencyValues.mathDescendant.length > 0) {
                    warnings.push({
                        type: "warning",
                        message: `Short descriptions should not contain math components such as <${dependencyValues.mathDescendant[0].componentType}>. Spell out any math with words.`,
                        level: 1,
                    });
                }

                return {
                    setValue: { value: dependencyValues.valueOriginal },
                    sendWarnings: warnings,
                };
            },
        };

        return stateVariableDefinitions;
    }
}
