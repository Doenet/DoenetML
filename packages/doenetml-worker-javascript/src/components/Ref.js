import InlineComponent from "./abstract/InlineComponent";

export default class Ref extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            navigateToTarget: this.navigateToTarget.bind(this),
        });
    }
    static componentType = "ref";
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.to = {
            createReferences: true,
            // Since we allow more than just references in `to`,
            // we specify `allowStrings` to suppress a warning for non-references.
            allowStrings: true,
        };

        attributes.textType = {
            createComponentOfType: "text",
            createStateVariable: "textType",
            defaultValue: "type-global",
            public: true,
        };
        attributes.createButton = {
            createComponentOfType: "boolean",
            createStateVariable: "createButton",
            defaultValue: false,
            forRenderer: true,
        };
        return attributes;
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

        stateVariableDefinitions.targetComponentIdx = {
            additionalStateVariablesDefined: ["referenceFound"],
            returnDependencies: () => ({
                toAttr: {
                    dependencyType: "attributeRefResolutions",
                    attributeName: "to",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.toAttr?.length === 1) {
                    const toAttr = dependencyValues.toAttr[0];

                    if (toAttr.unresolvedPath === null) {
                        return {
                            setValue: {
                                targetComponentIdx: toAttr.componentIdx,
                                referenceFound: true,
                            },
                        };
                    }
                }

                return {
                    setValue: {
                        targetComponentIdx: null,
                        referenceFound: Boolean(
                            dependencyValues.toAttr?.length > 0,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.targetRendererId = {
            additionalStateVariablesDefined: [
                "targetInactive",
                "targetComponent",
            ],
            stateVariablesDeterminingDependencies: ["targetComponentIdx"],
            forRenderer: true,
            returnDependencies({ stateValues }) {
                if (stateValues.targetComponentIdx != null) {
                    return {
                        targetComponent: {
                            dependencyType: "stateVariable",
                            componentIdx: stateValues.targetComponentIdx,
                            variableName: "isInactiveCompositeReplacement",
                            returnAsComponentObject: true,
                        },
                        targetRendererId: {
                            dependencyType: "rendererId",
                            componentIdx: stateValues.targetComponentIdx,
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                if (dependencyValues.targetComponent) {
                    const targetComponent = dependencyValues.targetComponent;
                    if (
                        targetComponent.stateValues
                            .isInactiveCompositeReplacement
                    ) {
                        return {
                            setValue: {
                                targetComponent,
                                targetInactive: true,
                                targetRendererId: null,
                            },
                        };
                    } else {
                        return {
                            setValue: {
                                targetComponent,
                                targetInactive: false,
                                targetRendererId:
                                    dependencyValues.targetRendererId,
                            },
                        };
                    }
                } else {
                    return {
                        setValue: {
                            targetComponent: null,
                            targetInactive: false,
                            targetRendererId: null,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.url = {
            forRenderer: true,
            additionalStateVariablesDefined: [
                {
                    variableName: "activityId",
                    forRenderer: true,
                },
                {
                    variableName: "activityUrlPostfix",
                    forRenderer: true,
                },
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                stringsFromAttribute: {
                    dependencyType: "stringsFromReferenceAttribute",
                    attributeName: "to",
                },
                referenceFound: {
                    dependencyType: "stateVariable",
                    variableName: "referenceFound",
                },
                targetRendererId: {
                    dependencyType: "stateVariable",
                    variableName: "targetRendererId",
                },
            }),
            definition: function ({ dependencyValues }) {
                let url = "#";
                let activityId = "";
                let activityUrlPostfix = "";

                if (dependencyValues.targetRendererId) {
                    url = "#" + dependencyValues.targetRendererId;
                    return {
                        setValue: { url, activityId, activityUrlPostfix },
                    };
                } else if (
                    dependencyValues.referenceFound ||
                    dependencyValues.stringsFromAttribute?.length !== 1
                ) {
                    return {
                        setValue: { url, activityId, activityUrlPostfix },
                    };
                }

                url = dependencyValues.stringsFromAttribute[0] || "#";

                const result = url.match(/^doenet:([a-zA-Z0-9]+)((\?|#|$).*)/i);

                if (result) {
                    activityId = result[1];
                    activityUrlPostfix = result[2];
                }

                return {
                    setValue: { url, activityId, activityUrlPostfix },
                };
            },
        };

        stateVariableDefinitions.linkText = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            stateVariablesDeterminingDependencies: [
                "targetRendererId",
                "targetComponentIdx",
            ],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    allChildren: {
                        dependencyType: "child",
                        childGroups: ["anything"],
                        variableNames: ["text"],
                        variablesOptional: true,
                    },
                    url: {
                        dependencyType: "stateVariable",
                        variableName: "url",
                    },
                    targetRendererId: {
                        dependencyType: "stateVariable",
                        variableName: "targetRendererId",
                    },
                };

                if (stateValues.targetRendererId) {
                    dependencies.equationTag = {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.targetComponentIdx,
                        variableName: "equationTag",
                        variablesOptional: true,
                    };
                    dependencies.title = {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.targetComponentIdx,
                        variableName: "title",
                        variablesOptional: true,
                    };
                }

                return dependencies;
            },
            definition: function ({ dependencyValues }) {
                let linkText = "";
                if (dependencyValues.allChildren.length === 0) {
                    if (dependencyValues.targetRendererId) {
                        if (dependencyValues.title !== null) {
                            linkText = dependencyValues.title;
                        } else if (dependencyValues.equationTag !== null) {
                            linkText = "(" + dependencyValues.equationTag + ")";
                        }
                    } else if (dependencyValues.url !== null) {
                        linkText = dependencyValues.url;
                        if (linkText === "#") {
                            linkText = "";
                        }
                    }
                } else {
                    for (let child of dependencyValues.allChildren) {
                        if (typeof child !== "object") {
                            linkText += child.toString();
                        } else if (typeof child.stateValues.text === "string") {
                            linkText += child.stateValues.text;
                        }
                    }
                }

                if (!linkText) {
                    linkText = "???";
                }
                return { setValue: { linkText } };
            },
        };

        stateVariableDefinitions.text = {
            isAlias: true,
            targetVariableName: "linkText",
        };

        return stateVariableDefinitions;
    }

    async navigateToTarget({ actionId }) {
        if (await this.stateValues.disabled) {
            return;
        }

        let url = await this.stateValues.url;
        let activityId = await this.stateValues.activityId;
        let activityUrlPostfix = await this.stateValues.activityUrlPostfix;
        let targetRendererId = await this.stateValues.targetRendererId;

        let effectiveIdx = this.componentOrAdaptedIdx;

        this.coreFunctions.navigateToTarget({
            url,
            activityId,
            activityUrlPostfix,
            targetRendererId,
            actionId,
            componentIdx: this.componentIdx,
            effectiveIdx,
        });
    }
}
