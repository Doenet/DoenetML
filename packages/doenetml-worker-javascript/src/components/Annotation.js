import BaseComponent from "./abstract/BaseComponent";

export default class Annotation extends BaseComponent {
    static componentType = "annotation";
    static rendererType = undefined;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();

        attributes.ref = {
            createReferences: true,
        };

        attributes.text = {
            createComponentOfType: "text",
            createStateVariable: "text",
            defaultValue: "",
            public: true,
        };

        attributes.speech = {
            createComponentOfType: "text",
            createStateVariable: "speech",
            defaultValue: "",
            public: true,
        };

        attributes.sonify = {
            createComponentOfType: "boolean",
            createStateVariable: "sonify",
            defaultValue: false,
            public: true,
        };

        attributes.circular = {
            createComponentOfType: "boolean",
            createStateVariable: "circular",
            defaultValue: false,
            public: true,
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
