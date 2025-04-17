import InlineComponent from "./abstract/InlineComponent";
import { M } from "./MMeMen";
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
import { latexToAst, superSubscriptsToUnicode } from "../utils/math";

export class Md extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveMath: this.moveMath.bind(this),
            mathClicked: this.mathClicked.bind(this),
            mathFocused: this.mathFocused.bind(this),
        });
    }
    static componentType = "md";
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
                group: "mrows",
                componentTypes: ["mrow"],
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

        stateVariableDefinitions.mrowChildNames = {
            forRenderer: true,
            returnDependencies: () => ({
                mrowChildren: {
                    dependencyType: "child",
                    childGroups: ["mrows"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    mrowChildNames: dependencyValues.mrowChildren.map(
                        (x) => x.componentIdx,
                    ),
                },
            }),
        };

        stateVariableDefinitions.latex = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            returnDependencies: () => ({
                mrowChildren: {
                    dependencyType: "child",
                    childGroups: ["mrows"],
                    variableNames: ["latex", "hide", "equationTag", "numbered"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let latex = "";
                if (dependencyValues.mrowChildren.length > 0) {
                    for (let child of dependencyValues.mrowChildren) {
                        if (child.stateValues.hide) {
                            continue;
                        }
                        if (latex.length > 0) {
                            latex += "\\\\";
                        }
                        if (child.stateValues.numbered) {
                            latex += `\\tag{${child.stateValues.equationTag}}`;
                        } else {
                            latex += `\\notag `;
                        }
                        latex += child.stateValues.latex;
                    }
                }

                return { setValue: { latex } };
            },
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
                let expressionText;
                try {
                    expressionText = dependencyValues.latex
                        .replaceAll("\\notag", "")
                        .replaceAll("\\amp", "")
                        .split("\\\\")
                        .map((x) => {
                            let result = x.match(/\\tag\{(\w+)\}(.*)/);
                            if (result) {
                                x = result[2];
                            }
                            let text = me
                                .fromAst(latexToAst.convert(x))
                                .toString();
                            if (result) {
                                text += ` (${result[1]})`;
                            }
                            return text;
                        })
                        .join("\\\\\n");
                } catch (e) {
                    // just return latex if can't parse with math-expressions
                    return { setValue: { text: dependencyValues.latex } };
                }
                return {
                    setValue: {
                        text: superSubscriptsToUnicode(
                            expressionText.toString(),
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.renderMode = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { renderMode: "align" } }),
        };

        stateVariableDefinitions.numbered = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numbered: false } }),
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

export class Mdn extends Md {
    static componentType = "mdn";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numbered = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numbered: true } }),
        };

        return stateVariableDefinitions;
    }
}

export class Mrow extends M {
    static componentType = "mrow";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.number = {
            createComponentOfType: "boolean",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.renderMode.definition = () => ({
            setValue: { renderMode: "display" },
        });

        stateVariableDefinitions.numbered = {
            forRenderer: true,
            returnDependencies: () => ({
                parentNumbered: {
                    dependencyType: "parentStateVariable",
                    variableName: "numbered",
                },
                numberAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "number",
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                let numbered;
                if (dependencyValues.numberAttr !== null) {
                    numbered = dependencyValues.numberAttr.stateValues.value;
                } else {
                    numbered = dependencyValues.parentNumbered;
                }

                return {
                    setValue: { numbered },
                };
            },
        };

        stateVariableDefinitions.equationTag = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["numbered"],
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies({ stateValues }) {
                if (stateValues.numbered) {
                    return {
                        equationCounter: {
                            dependencyType: "counter",
                            counterName: "equation",
                        },
                    };
                } else {
                    return {};
                }
            },
            definition({ dependencyValues }) {
                if (dependencyValues.equationCounter !== undefined) {
                    return {
                        setValue: {
                            equationTag: String(
                                dependencyValues.equationCounter,
                            ),
                        },
                    };
                } else {
                    return { setValue: { equationTag: null } };
                }
            },
        };

        return stateVariableDefinitions;
    }
}
