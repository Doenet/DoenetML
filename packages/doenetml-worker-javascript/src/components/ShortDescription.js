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

        stateVariableDefinitions.textLikeChildren = {
            returnDependencies: () => ({
                textLikeChildren: {
                    dependencyType: "child",
                    childGroups: ["textLike"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        textLikeChildren: dependencyValues.textLikeChildren,
                    },
                };
            },
        };

        stateVariableDefinitions.value = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
            },
            stateVariablesDeterminingDependencies: ["textLikeChildren"],
            returnDependencies: ({ stateValues }) => {
                const dependencies = {
                    valueOriginal: {
                        dependencyType: "stateVariable",
                        variableName: "valueOriginal",
                    },
                };

                const numChildren = stateValues.textLikeChildren.length;
                dependencies.numChildren = {
                    dependencyType: "value",
                    value: numChildren,
                };

                for (const [
                    idx,
                    child,
                ] of stateValues.textLikeChildren.entries()) {
                    dependencies[`adapterSource${idx}`] = {
                        dependencyType: "adapterSource",
                        componentIdx: child.componentIdx,
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, componentInfoObjects }) {
                let value = dependencyValues.valueOriginal;

                let foundAdaptedFromMath = false;
                let originalType;

                for (let i = 0; i < dependencyValues.numChildren; i++) {
                    const adapterSource = dependencyValues[`adapterSource${i}`];
                    if (adapterSource) {
                        if (
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType:
                                    adapterSource.componentType,
                                baseComponentType: "math",
                            }) ||
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType:
                                    adapterSource.componentType,
                                baseComponentType: "m",
                            })
                        ) {
                            foundAdaptedFromMath = true;
                            originalType = adapterSource.componentType;
                            break;
                        }
                    }
                }

                const warnings = [];
                if (foundAdaptedFromMath) {
                    warnings.push({
                        type: "warning",
                        message: `Short descriptions should not contain math components such as <${originalType}>. Spell out any math with words.`,
                        level: 1,
                    });
                }

                return { setValue: { value }, sendWarnings: warnings };
            },
        };

        return stateVariableDefinitions;
    }
}
