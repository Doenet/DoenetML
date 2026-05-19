import TextOrInline from "./abstract/TextOrInline";
import { renameStateVariable } from "../utils/stateVariables";

export default class ShortDescription extends TextOrInline {
    static componentType = "shortDescription";

    static componentDocs = {
        summary:
            "A short accessibility description for an enclosing component.",
    };
    // A short description is never rendered visually (it is consumed only by
    // assistive technology, through its `text` state variable). The `text`
    // renderer produces no visible output here, since `text` is not
    // `forRenderer`.
    static rendererType = "text";

    static inSchemaOnlyInheritAs = [];

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Rename the inherited `value` (the combined text of the children) to
        // `valueOriginal` so that the public `value` can be redefined below to
        // additionally emit an accessibility diagnostic.
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "value",
            newName: "valueOriginal",
        });

        stateVariableDefinitions.inlineChildren = {
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlines"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        inlineChildren: dependencyValues.inlineChildren,
                    },
                };
            },
        };

        stateVariableDefinitions.value = {
            description: "The short description text.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
            },
            stateVariablesDeterminingDependencies: ["inlineChildren"],
            returnDependencies: ({ stateValues }) => {
                const dependencies = {
                    valueOriginal: {
                        dependencyType: "stateVariable",
                        variableName: "valueOriginal",
                    },
                    inlineChildren: {
                        dependencyType: "stateVariable",
                        variableName: "inlineChildren",
                    },
                };

                for (const [
                    idx,
                    child,
                ] of stateValues.inlineChildren.entries()) {
                    if (typeof child !== "object") {
                        continue;
                    }
                    dependencies[`adapterSource${idx}`] = {
                        dependencyType: "adapterSource",
                        componentIdx: child.componentIdx,
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, componentInfoObjects }) {
                const value = dependencyValues.valueOriginal;

                // A short description should be read verbatim by assistive
                // technology, so it should not contain math components. A math
                // component placed in a `shortDescription` is either a direct
                // child (e.g. `<m>`) or adapted into a text-like child (e.g.
                // `<math>`, `<interval>`); check both forms.
                let foundMathType;
                for (
                    let idx = 0;
                    idx < dependencyValues.inlineChildren.length;
                    idx++
                ) {
                    const child = dependencyValues.inlineChildren[idx];
                    if (typeof child !== "object") {
                        continue;
                    }
                    const adapterSource =
                        dependencyValues[`adapterSource${idx}`];
                    const effectiveType =
                        adapterSource?.componentType ?? child.componentType;
                    if (
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: effectiveType,
                            baseComponentType: "math",
                        }) ||
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: effectiveType,
                            baseComponentType: "m",
                        })
                    ) {
                        foundMathType = effectiveType;
                        break;
                    }
                }

                const diagnostics = [];
                if (foundMathType) {
                    diagnostics.push({
                        type: "accessibility",
                        level: 2,
                        message: `Short descriptions should not contain math components such as \`<${foundMathType}>\`. Spell out any math with words.`,
                    });
                }

                return { setValue: { value }, sendDiagnostics: diagnostics };
            },
        };

        return stateVariableDefinitions;
    }
}
