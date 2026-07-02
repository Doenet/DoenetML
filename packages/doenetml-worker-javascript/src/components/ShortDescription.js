import TextOrInline from "./abstract/TextOrInline";
import { textFromChildren } from "../utils/text";

export default class ShortDescription extends TextOrInline {
    static componentType = "shortDescription";

    static componentDocs = {
        summary:
            "A short accessibility description (e.g. for a `<graph>`) read by screen readers",
    };
    // A short description is never rendered visually — it is consumed only
    // by assistive technology, through its `text` state variable.
    static rendererType = undefined;

    static inSchemaOnlyInheritAs = [];

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // `inlineChildren` is a thin pass-through of the `inlines` child
        // group, exposed as a state variable so that `value` can use it in
        // `stateVariablesDeterminingDependencies` (to enumerate per-child
        // adapter-source dependencies for the math diagnostic below) while
        // also feeding `textFromChildren`. It carries `text` and `hidden` for
        // `textFromChildren` and the bare child references for the adapter
        // loop in a single child read.
        stateVariableDefinitions.inlineChildren = {
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlines"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { inlineChildren: dependencyValues.inlineChildren },
            }),
        };

        // Override the inherited `value` (the combined text of the children)
        // so that, in addition to computing the text, it emits an
        // accessibility diagnostic when the description contains math.
        stateVariableDefinitions.value = {
            description: "The short description text.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: this.componentType,
            },
            stateVariablesDeterminingDependencies: ["inlineChildren"],
            returnDependencies: ({ stateValues }) => {
                const dependencies = {
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
                const value = textFromChildren(dependencyValues.inlineChildren);

                // A short description should be read verbatim by assistive
                // technology, so it should not contain math components. A math
                // component placed in a `shortDescription` appears either
                // directly as an inline child (e.g. `<m>`, `<math>`,
                // `<interval>`, all of which inherit from `_inline`) or via an
                // adapter; check both forms.
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
                    const effectiveType =
                        dependencyValues[`adapterSource${idx}`]
                            ?.componentType ?? child.componentType;
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
