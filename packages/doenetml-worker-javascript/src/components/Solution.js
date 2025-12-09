import BlockComponent from "./abstract/BlockComponent";

export class Solution extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            revealSolution: this.revealSolution.bind(this),
            closeSolution: this.closeSolution.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "solution";
    static rendererType = "solution";
    static renderChildren = true;

    static sendToRendererEvenIfHidden = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.hide = {
            createComponentOfType: "boolean",
        };
        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "inlinesBlocks",
                componentTypes: ["_inline", "_block"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.hide = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            defaultValue: false,
            hasEssential: true,
            returnDependencies: () => ({
                hideAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "hide",
                    variableNames: ["value"],
                },
                displayMode: {
                    dependencyType: "flag",
                    flagName: "solutionDisplayMode",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.displayMode === "none") {
                    return { setValue: { hide: true } };
                } else if (dependencyValues.hideAttr !== null) {
                    return {
                        setValue: {
                            hide: dependencyValues.hideAttr.stateValues.value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            hide: true,
                        },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.displayMode === "none") {
                    return { success: false };
                } else if (dependencyValues.hideAttr !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "hideAttr",
                                desiredValue: desiredStateVariableValues.hide,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setSetVariable: "hide",
                                value: desiredStateVariableValues.hide,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.open = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            defaultValue: false,
            hasEssential: true,
            returnDependencies: () => ({
                displayMode: {
                    dependencyType: "flag",
                    flagName: "solutionDisplayMode",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.displayMode === "displayed") {
                    return { setValue: { open: true } };
                } else if (dependencyValues.displayMode === "none") {
                    return { setValue: { open: false } };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            open: true,
                        },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (
                    dependencyValues.displayMode === "displayed" ||
                    dependencyValues.displayMode === "none"
                ) {
                    // will always be open if displayMode is displayed
                    // or always closed if displayMode is none
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "open",
                            value: desiredStateVariableValues.open,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.rendered = {
            forRenderer: true,
            defaultValue: false,
            hasEssential: true,
            returnDependencies: () => ({
                displayMode: {
                    dependencyType: "flag",
                    flagName: "solutionDisplayMode",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.displayMode === "displayed") {
                    return { setValue: { rendered: true } };
                } else if (dependencyValues.displayMode === "none") {
                    return { setValue: { rendered: false } };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            rendered: true,
                        },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (
                    dependencyValues.displayMode === "displayed" ||
                    dependencyValues.displayMode === "none"
                ) {
                    // will always be rendered if displayMode is displayed
                    // or always closed if displayMode is none
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "rendered",
                            value: desiredStateVariableValues.rendered,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.canBeClosed = {
            forRenderer: true,
            returnDependencies: () => ({
                displayMode: {
                    dependencyType: "flag",
                    flagName: "solutionDisplayMode",
                },
            }),
            definition({ dependencyValues }) {
                if (
                    dependencyValues.displayMode === "button" ||
                    dependencyValues.displayMode === "buttonRequirePermission"
                ) {
                    return { setValue: { canBeClosed: true } };
                } else {
                    return { setValue: { canBeClosed: false } };
                }
            },
        };

        stateVariableDefinitions.sectionName = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { sectionName: "Solution" } }),
        };

        return stateVariableDefinitions;
    }

    async revealSolution({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        const displayMode = this.flags.solutionDisplayMode;

        let allowView = true;

        // If we require permission to view the solution,
        // then we must request the solution view before opening.
        // If a response with `allowView` equal to `false`
        // is not received, the solution will stay closed.
        if (displayMode === "buttonRequirePermission") {
            const requestResult = await this.coreFunctions.requestSolutionView(
                this.componentIdx,
            );
            allowView = requestResult.allowView;
        }

        let updateInstructions = [
            {
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "open",
                value: allowView,
            },
        ];

        let event;

        if (allowView) {
            event = {
                verb: "viewed",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
            };
        }

        await this.coreFunctions.performUpdate({
            updateInstructions,
            sourceInformation,
            skipRendererUpdate,
            event,
            overrideReadOnly: true,
        });

        return this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "rendered",
                    value: allowView,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
        });
    }

    async closeSolution({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "open",
                    value: false,
                },
            ],
            overrideReadOnly: true,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "closed",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
            },
        });
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }

    static includeBlankStringChildren = true;
}

export class GivenAnswer extends Solution {
    static componentType = "givenAnswer";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.sectionName.definition = () => ({
            setValue: { sectionName: "Answer" },
        });

        return stateVariableDefinitions;
    }
}
