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
        };

        attributes.textType = {
            createComponentOfType: "text",
            createStateVariable: "textType",
            defaultValue: "type-global",
            public: true,
        };
        attributes.uri = {
            createPrimitiveOfType: "string",
            createStateVariable: "uri",
            defaultValue: null,
            public: true,
            forRenderer: true,
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
                            },
                        };
                    }
                }

                return {
                    setValue: {
                        targetComponentIdx: null,
                    },
                };
            },
        };

        stateVariableDefinitions.targetComponent = {
            stateVariablesDeterminingDependencies: ["targetComponentIdx"],
            returnDependencies({ stateValues }) {
                if (stateValues.targetComponentIdx != null) {
                    return {
                        targetComponent: {
                            dependencyType: "componentIdentity",
                            componentIdx: stateValues.targetComponentIdx,
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                let targetComponent = null;
                if (dependencyValues.targetComponent) {
                    targetComponent = dependencyValues.targetComponent;
                }

                return {
                    setValue: { targetComponent },
                };
            },
        };

        stateVariableDefinitions.targetInactive = {
            stateVariablesDeterminingDependencies: ["targetComponent"],
            returnDependencies({ stateValues }) {
                if (stateValues.targetComponent) {
                    return {
                        targetIsInactiveCompositeReplacement: {
                            dependencyType: "stateVariable",
                            componentIdx:
                                stateValues.targetComponent.componentIdx,
                            variableName: "isInactiveCompositeReplacement",
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        targetInactive: Boolean(
                            dependencyValues.targetIsInactiveCompositeReplacement,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.targetIdx = {
            forRenderer: true,
            returnDependencies: () => ({
                targetComponent: {
                    dependencyType: "stateVariable",
                    variableName: "targetComponent",
                },
                uri: {
                    dependencyType: "stateVariable",
                    variableName: "uri",
                },
                targetInactive: {
                    dependencyType: "stateVariable",
                    variableName: "targetInactive",
                },
                targetAttribute: {
                    dependencyType: "doenetAttribute",
                    attributeName: "target",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.uri) {
                    return { setValue: { targetIdx: -1 } };
                } else if (
                    dependencyValues.targetComponent === null ||
                    dependencyValues.targetInactive
                ) {
                    return { setValue: { targetIdx: -1 } };
                } else {
                    return {
                        setValue: {
                            targetIdx:
                                dependencyValues.targetComponent.componentIdx,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.cid = {
            forRenderer: true,
            additionalStateVariablesDefined: [
                {
                    variableName: "activityId",
                    forRenderer: true,
                },
                {
                    variableName: "variantIndex",
                    forRenderer: true,
                },
                {
                    variableName: "edit",
                    forRenderer: true,
                },
                {
                    variableName: "draft",
                    forRenderer: true,
                },
                {
                    variableName: "hash",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                uri: {
                    dependencyType: "stateVariable",
                    variableName: "uri",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (
                    !dependencyValues.uri ||
                    dependencyValues.uri.substring(0, 7).toLowerCase() !==
                        "doenet:"
                ) {
                    return {
                        setValue: {
                            cid: null,
                            activityId: null,
                            variantIndex: null,
                            edit: null,
                            draft: null,
                            hash: null,
                        },
                    };
                }

                let cid = null,
                    activityId = null,
                    variantIndex = null;
                let draft = null,
                    edit = null,
                    hash = null;

                let warnings = [];

                let result = dependencyValues.uri.match(/[:&]cid=([^&^#]+)/i);
                if (result) {
                    cid = result[1];
                }
                result = dependencyValues.uri.match(
                    /[:&]activityId=([^&^#]+)/i,
                );
                if (result) {
                    activityId = result[1];
                }
                result = dependencyValues.uri.match(/[:&]doenetId=([^&^#]+)/i);
                if (result) {
                    if (activityId) {
                        warnings.push({
                            message:
                                "The deprecated URI parameter doenetId is ignored as activityId is present.",
                            level: 1,
                        });
                    } else {
                        warnings.push({
                            message:
                                "The doenetId URI parameters is deprecated. Use activityId instead. Its will be ignored starting with the next major version (0.7). Version 0.6 will be phased out in summer 2025.",
                            level: 1,
                        });
                        activityId = result[1];
                    }
                }
                result = dependencyValues.uri.match(/[:&]variant=([^&^#]+)/i);
                if (result) {
                    variantIndex = Number(result[1]);
                    if (!Number.isInteger(variantIndex) && variantIndex >= 1) {
                        variantIndex = 1;
                    }
                }
                result = dependencyValues.uri.match(/[:&]edit=([^&^#]+)/i);
                if (result) {
                    if (result[1].toLowerCase() === "true") {
                        edit = true;
                    } else {
                        edit = false;
                    }
                }
                result = dependencyValues.uri.match(/[:&]draft=([^&^#]+)/i);
                if (result) {
                    if (result[1].toLowerCase() === "true") {
                        draft = true;
                    } else {
                        draft = false;
                    }
                }
                result = dependencyValues.uri.match(/(#.+)/i);
                if (result) {
                    hash = result[1];
                }

                return {
                    setValue: {
                        cid,
                        activityId,
                        variantIndex,
                        edit,
                        draft,
                        hash,
                    },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.linkText = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["targetIdx"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    allChildren: {
                        dependencyType: "child",
                        childGroups: ["anything"],
                        variableNames: ["text"],
                        variablesOptional: true,
                    },
                    uri: {
                        dependencyType: "stateVariable",
                        variableName: "uri",
                    },
                    targetInactive: {
                        dependencyType: "stateVariable",
                        variableName: "targetInactive",
                    },
                };

                if (stateValues.targetIdx) {
                    dependencies.equationTag = {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.targetIdx,
                        variableName: "equationTag",
                        variablesOptional: true,
                    };
                    dependencies.title = {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.targetIdx,
                        variableName: "title",
                        variablesOptional: true,
                    };
                }

                return dependencies;
            },
            definition: function ({ dependencyValues }) {
                let linkText = "";
                if (dependencyValues.allChildren.length === 0) {
                    if (dependencyValues.uri !== null) {
                        linkText = dependencyValues.uri;
                    } else if (!dependencyValues.targetInactive) {
                        if (dependencyValues.title !== null) {
                            linkText = dependencyValues.title;
                        } else if (dependencyValues.equationTag !== null) {
                            linkText = "(" + dependencyValues.equationTag + ")";
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

        let cid = await this.stateValues.cid;
        let activityId = await this.stateValues.activityId;
        let variantIndex = await this.stateValues.variantIndex;
        let edit = await this.stateValues.edit;
        let hash = await this.stateValues.hash;
        let uri = await this.stateValues.uri;
        let targetIdx = await this.stateValues.targetIdx;

        let effectiveName = this.componentOrAdaptedName;

        this.coreFunctions.navigateToTarget({
            cid,
            activityId,
            variantIndex,
            edit,
            hash,
            uri,
            targetIdx,
            actionId,
            componentIdx: this.componentIdx,
            effectiveName,
        });
    }
}
