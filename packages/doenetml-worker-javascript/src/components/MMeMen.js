import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";
import {
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
} from "@doenet/utils";
import {
    moveGraphicalObjectWithAnchorAction,
    returnAnchorAttributes,
    returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import { latexToText } from "../utils/math";
import { createInputStringFromChildren } from "../utils/parseMath";

export class M extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveMath: this.moveMath.bind(this),
            mathClicked: this.mathClicked.bind(this),
            mathFocused: this.mathFocused.bind(this),
        });
    }
    static componentType = "m";
    static rendererType = "math";

    // used when creating new component via adapter or copy prop
    static primaryStateVariableForDefinition = "latex";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.draggable = {
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.layer = {
            createComponentOfType: "number",
            createStateVariable: "layer",
            defaultValue: 0,
            public: true,
            forRenderer: true,
        };

        Object.assign(attributes, returnAnchorAttributes());

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "inline",
                componentTypes: ["_inline"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition();
        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        let styleDescriptionDefinitions =
            returnTextStyleDescriptionDefinitions();
        Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

        let anchorDefinition = returnAnchorStateVariableDefinition();
        Object.assign(stateVariableDefinitions, anchorDefinition);

        let componentClass = this;

        stateVariableDefinitions.latex = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            defaultValue: "",
            hasEssential: true,
            forRenderer: true,
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inline"],
                    variableNames: ["latex", "text"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.inlineChildren.length === 0) {
                    return {
                        useEssentialOrDefaultValue: {
                            latex: true,
                        },
                    };
                }

                let latex = createInputStringFromChildren({
                    children: dependencyValues.inlineChildren,
                    codePre: "",
                    format: "latex",
                    createDisplayedMathString: true,
                }).string;

                return { setValue: { latex } };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (typeof desiredStateVariableValues.latex !== "string") {
                    return { success: false };
                }

                if (dependencyValues.inlineChildren.length === 0) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "latex",
                                value: desiredStateVariableValues.latex,
                            },
                        ],
                    };
                } else if (dependencyValues.inlineChildren.length === 1) {
                    let child = dependencyValues.inlineChildren[0];
                    if (typeof child !== "object") {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "inlineChildren",
                                    desiredValue:
                                        desiredStateVariableValues.latex,
                                    childIndex: 0,
                                },
                            ],
                        };
                    } else if (typeof child.stateValues.latex === "string") {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "inlineChildren",
                                    desiredValue:
                                        desiredStateVariableValues.latex,
                                    childIndex: 0,
                                    variableIndex: 0, // "latex" state variable
                                },
                            ],
                        };
                    } else if (typeof child.stateValues.text === "string") {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "inlineChildren",
                                    desiredValue:
                                        desiredStateVariableValues.latex,
                                    childIndex: 0,
                                    variableIndex: 1, // "text" state variable
                                },
                            ],
                        };
                    } else {
                        return { success: false };
                    }
                } else {
                    // more than one inline child
                    return { success: false };
                }
            },
        };

        stateVariableDefinitions.renderMode = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { renderMode: "inline" } }),
        };

        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                latex: {
                    dependencyType: "stateVariable",
                    variableName: "latex",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: { text: latexToText(dependencyValues.latex) },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async moveMath({
        x,
        y,
        z,
        transient,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return await moveGraphicalObjectWithAnchorAction({
            x,
            y,
            z,
            transient,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            componentIdx: this.componentIdx,
            componentType: this.componentType,
            coreFunctions: this.coreFunctions,
        });
    }

    async mathClicked({
        actionId,
        name,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "click",
                componentIdx: name, // use name rather than this.componentIdx to get original name if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async mathFocused({
        actionId,
        name,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "focus",
                componentIdx: name, // use name rather than this.componentIdx to get original name if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }
}

export class Me extends M {
    static componentType = "me";

    static canBeInList = false;

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.renderMode.definition = () => ({
            setValue: { renderMode: "display" },
        });
        return stateVariableDefinitions;
    }
}

export class Men extends M {
    static componentType = "men";

    static canBeInList = false;

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.renderMode.definition = () => ({
            setValue: { renderMode: "numbered" },
        });

        stateVariableDefinitions.equationTag = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies: () => ({
                equationCounter: {
                    dependencyType: "counter",
                    counterName: "equation",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        equationTag: String(dependencyValues.equationCounter),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
