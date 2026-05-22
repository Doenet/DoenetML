import BaseComponent from "./abstract/BaseComponent";

export default class Annotation extends BaseComponent {
    static componentType = "annotation";

    static componentDocs = {
        summary: "An annotation for screen reader navigation of a graph.",
    };
    static rendererType = undefined;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();

        attributes.ref = {
            createReferences: true,
            description:
                "Reference to the component this annotation is attached to.",
        };

        attributes.text = {
            createComponentOfType: "text",
            createStateVariable: "text",
            defaultValue: "",
            public: true,
            description: "The annotation text read by screen readers.",
        };

        attributes.speech = {
            createComponentOfType: "text",
            createStateVariable: "speech",
            defaultValue: "",
            public: true,
            description:
                "More detailed spoken text used by screen readers; used if expert mode is activated or extra details are requested.",
        };

        attributes.sonify = {
            createComponentOfType: "boolean",
            createStateVariable: "sonify",
            defaultValue: false,
            public: true,
            description:
                "Whether to play a tone when this annotation is focused and it references a function.",
        };

        attributes.circular = {
            createComponentOfType: "boolean",
            createStateVariable: "circular",
            defaultValue: false,
            public: true,
            description:
                "Whether navigation through this annotation's children wraps around.",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "annotations",
                componentTypes: ["annotation"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.refData = {
            returnDependencies: () => ({
                refResolutions: {
                    dependencyType: "attributeRefResolutions",
                    attributeName: "ref",
                },
            }),
            definition({ dependencyValues }) {
                const refResolutions = dependencyValues.refResolutions ?? [];

                return {
                    setValue: {
                        refData: {
                            hasRefAttribute: refResolutions.length > 0,
                            refResolutions,
                        },
                    },
                };
            },
        };

        stateVariableDefinitions.prefigureAnnotationNode = {
            returnDependencies: () => ({
                text: {
                    dependencyType: "stateVariable",
                    variableName: "text",
                },
                speech: {
                    dependencyType: "stateVariable",
                    variableName: "speech",
                },
                sonify: {
                    dependencyType: "stateVariable",
                    variableName: "sonify",
                },
                circular: {
                    dependencyType: "stateVariable",
                    variableName: "circular",
                },
                refData: {
                    dependencyType: "stateVariable",
                    variableName: "refData",
                },
                annotationChildren: {
                    dependencyType: "child",
                    childGroups: ["annotations"],
                    variableNames: ["prefigureAnnotationNode"],
                },
            }),
            definition({ dependencyValues, componentIdx, componentName }) {
                return {
                    setValue: {
                        prefigureAnnotationNode: {
                            componentIdx,
                            componentName,
                            text: dependencyValues.text,
                            speech: dependencyValues.speech,
                            sonify: Boolean(dependencyValues.sonify),
                            circular: Boolean(dependencyValues.circular),
                            hasRefAttribute:
                                dependencyValues.refData.hasRefAttribute,
                            refResolutions:
                                dependencyValues.refData.refResolutions,
                            children: dependencyValues.annotationChildren
                                .map(
                                    (child) =>
                                        child?.stateValues
                                            ?.prefigureAnnotationNode,
                                )
                                .filter((x) => x !== null && x !== undefined),
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
