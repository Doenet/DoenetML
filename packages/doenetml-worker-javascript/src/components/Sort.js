import CompositeComponent from "./abstract/CompositeComponent";
import { postProcessCopy } from "../utils/copy";
import { createNewComponentIndices } from "../utils/componentIndices";
import {
    compareExtractedValues,
    returnBreakStringsIntoTypeSugarInstruction,
    returnListValueStateVariableDefinitions,
} from "../utils/listValues";

export default class Sort extends CompositeComponent {
    static componentType = "sort";

    static componentDocs = {
        summary: "Sorts a list according to a comparison function",
    };
    static takesIndex = true;

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.sortVectorsBy = {
            groupName: "sorting",
            description:
                "Whether to sort vectors by component or by magnitude.",
            createComponentOfType: "text",
            createStateVariable: "sortVectorsBy",
            defaultValue: "displacement",
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "displacement",
                    description:
                        "Sort vectors by their displacement components.",
                },
                {
                    value: "tail",
                    description:
                        "Sort vectors by the position of their tail point.",
                },
            ],
        };

        attributes.sortByComponent = {
            groupName: "sorting",
            description:
                "Index of the component to sort by (when sorting vectors).",
            createComponentOfType: "integer",
            createStateVariable: "sortByComponent",
            defaultValue: "1",
            public: true,
        };

        attributes.sortByProp = {
            createPrimitiveOfType: "string",
            highlighted: true,
            groupName: "sorting",
            description:
                'Name of a property to sort by (e.g. "x" for sorting points by x-coordinate).',
        };

        attributes.type = {
            createPrimitiveOfType: "string",
            highlighted: true,
            description: "Component type to sort children as.",
            validValues: [
                {
                    value: "number",
                    description:
                        "Read bare strings as numbers, ordered by value.",
                },
                {
                    value: "math",
                    description:
                        "Read bare strings as math expressions, ordered by value.",
                },
                {
                    value: "text",
                    description:
                        "Read bare strings as text, ordered alphabetically.",
                },
                {
                    value: "boolean",
                    description:
                        "Read bare strings as booleans, ordered with false before true.",
                },
            ],
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
            highlighted: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoTypeSugarInstruction(this.componentType),
        );

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnListValueStateVariableDefinitions({
                componentName: this.componentType,
                supportProps: true,
            }),
        );

        stateVariableDefinitions.sortedValues = {
            returnDependencies: () => ({
                listValues: {
                    dependencyType: "stateVariable",
                    variableName: "listValues",
                },
                allAreNumeric: {
                    dependencyType: "stateVariable",
                    variableName: "allAreNumeric",
                },
            }),
            definition({ dependencyValues }) {
                let sortedValues = [...dependencyValues.listValues];

                sortedValues.sort((a, b) =>
                    compareExtractedValues(
                        a,
                        b,
                        dependencyValues.allAreNumeric,
                    ),
                );

                return { setValue: { sortedValues } };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                sortedValues: {
                    dependencyType: "stateVariable",
                    variableName: "sortedValues",
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        let diagnostics = [];

        let replacements = [];

        let componentsCopied = [];

        for (let valueObj of await component.stateValues.sortedValues) {
            let replacementSource;

            if (valueObj.listInd === undefined) {
                replacementSource = components[valueObj.componentIdx];
            } else {
                let listComponent = components[valueObj.componentIdx];
                replacementSource =
                    listComponent.activeChildren[valueObj.listInd];
            }

            if (replacementSource) {
                componentsCopied.push(replacementSource.componentIdx);

                const serializedComponent = await replacementSource.serialize();

                const res = createNewComponentIndices(
                    [serializedComponent],
                    nComponents,
                );
                nComponents = res.nComponents;
                replacements.push(res.components[0]);
            }
        }

        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentIdx: component.componentIdx,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        workspace.componentsCopied = componentsCopied;

        return {
            replacements,
            diagnostics,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        let diagnostics = [];

        let componentsToCopy = [];

        for (let valueObj of await component.stateValues.sortedValues) {
            let replacementSource;

            if (valueObj.listInd === undefined) {
                replacementSource = components[valueObj.componentIdx];
            } else {
                let listComponent = components[valueObj.componentIdx];
                replacementSource =
                    listComponent.activeChildren[valueObj.listInd];
            }

            if (replacementSource) {
                componentsToCopy.push(replacementSource.componentIdx);
            }
        }

        if (
            componentsToCopy.length == workspace.componentsCopied.length &&
            workspace.componentsCopied.every(
                (x, i) => x === componentsToCopy[i],
            )
        ) {
            return { replacementChanges: [], diagnostics, nComponents };
        }

        // for now, just recreated
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            componentInfoObjects,
            workspace,
            nComponents,
        });

        let replacements = replacementResults.replacements;
        diagnostics.push(...replacementResults.diagnostics);
        nComponents = replacementResults.nComponents;

        let replacementChanges = [
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: replacements,
            },
        ];

        return { replacementChanges, diagnostics, nComponents };
    }
}
