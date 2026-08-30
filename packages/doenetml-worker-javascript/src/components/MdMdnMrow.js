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
import {
    latexToAst,
    stripAlignmentMarkers,
    superSubscriptsToUnicode,
} from "../utils/math";
import { convertLatexWithBlanks } from "../utils/embeddedMathInputs";

/**
 * The rows of an `<md>`, with the row variable `rowVariable` (`latex` or
 * `latexTemplate`) plus what deciding each row's prefix needs.
 */
function returnRowDependencies(rowVariable) {
    return {
        mrowChildren: {
            dependencyType: "child",
            childGroups: ["mrows"],
            variableNames: [rowVariable, "hide", "equationTag", "numbered"],
        },
    };
}

/**
 * Join the visible rows into one aligned display: `\\` between rows, and
 * each row prefixed with its `\tag{}` or with `\notag `.
 */
function composeRows(dependencyValues, rowVariable) {
    let composed = "";
    for (let child of dependencyValues.mrowChildren) {
        if (child.stateValues.hide) {
            continue;
        }
        if (composed.length > 0) {
            composed += "\\\\";
        }
        if (child.stateValues.numbered) {
            composed += `\\tag{${child.stateValues.equationTag}}`;
        } else {
            composed += `\\notag `;
        }
        composed += child.stateValues[rowVariable];
    }
    return composed;
}

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

    static componentDocs = {
        summary: "Display math with multiple aligned rows",
    };
    static rendererType = "math";

    // The rows themselves are rendered, so that any inputs embedded in them can
    // be drawn; `childIndicesToRender` narrows that to the rows that have any.
    static renderChildren = true;

    static canBeInList = false;

    // used when creating new component via adapter or copy prop
    static primaryStateVariableForDefinition = "latex";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.draggable = {
            description: "Whether the math display can be dragged on a graph.",
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.layer = {
            description: "Z-order layer index when shown on a graph.",
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

        stateVariableDefinitions.mrowChildIndices = {
            returnDependencies: () => ({
                mrowChildren: {
                    dependencyType: "child",
                    childGroups: ["mrows"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    mrowChildIndices: dependencyValues.mrowChildren.map(
                        (x) => x.componentIdx,
                    ),
                },
            }),
        };

        stateVariableDefinitions.mrowChildRendererIds = {
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["mrowChildIndices"],
            returnDependencies: ({ stateValues }) => {
                const dependencies = {
                    numChildren: {
                        dependencyType: "value",
                        value: stateValues.mrowChildIndices.length,
                    },
                };

                for (const [i, idx] of stateValues.mrowChildIndices.entries()) {
                    dependencies[`rendererId${i}`] = {
                        dependencyType: "rendererId",
                        componentIdx: idx,
                    };
                }
                return dependencies;
            },
            definition: ({ dependencyValues }) => {
                const mrowChildRendererIds = [];

                for (let i = 0; i < dependencyValues.numChildren; i++) {
                    mrowChildRendererIds.push(
                        dependencyValues[`rendererId${i}`],
                    );
                }

                return {
                    setValue: { mrowChildRendererIds },
                };
            },
        };

        stateVariableDefinitions.latex = {
            description: "The math content rendered as a LaTeX string.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            returnDependencies: () => returnRowDependencies("latex"),
            definition: ({ dependencyValues }) => ({
                setValue: { latex: composeRows(dependencyValues, "latex") },
            }),
        };

        /**
         * `latex` with each row's embedded-input markers left in.
         *
         * Composed exactly as `latex` is — same `\\` join, same `\tag{}` and
         * `\notag ` prefixes — because the whole display is typeset as one
         * expression and the rows must align the same way either variable is
         * used.
         */
        stateVariableDefinitions.latexTemplate = {
            forRenderer: true,
            returnDependencies: () => returnRowDependencies("latexTemplate"),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    latexTemplate: composeRows(
                        dependencyValues,
                        "latexTemplate",
                    ),
                },
            }),
        };

        /**
         * The inputs embedded in this display's rows, in row order, so the
         * renderer knows which markers in the template are its own — and, as
         * the same computation, which rows to render: only those holding one.
         * A display with no inputs therefore renders exactly as it did before
         * they were possible.
         */
        stateVariableDefinitions.embeddedInputComponentIndices = {
            forRenderer: true,
            additionalStateVariablesDefined: [
                { variableName: "childIndicesToRender" },
            ],
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
                mrowChildren: {
                    dependencyType: "child",
                    childGroups: ["mrows"],
                    variableNames: ["embeddedInputComponentIndices"],
                },
            }),
            definition({ dependencyValues }) {
                const embeddedInputComponentIndices = [];
                const rowsWithInputs = new Set();
                for (const row of dependencyValues.mrowChildren) {
                    const embedded =
                        row.stateValues.embeddedInputComponentIndices ?? [];
                    if (embedded.length > 0) {
                        rowsWithInputs.add(row.componentIdx);
                        embeddedInputComponentIndices.push(...embedded);
                    }
                }

                const childIndicesToRender = [];
                for (const [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (
                        typeof child === "object" &&
                        rowsWithInputs.has(child.componentIdx)
                    ) {
                        childIndicesToRender.push(ind);
                    }
                }

                return {
                    setValue: {
                        embeddedInputComponentIndices,
                        childIndicesToRender,
                    },
                };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        // The rendered children of an `<md>` are its rows, which hold the inputs;
        // the rows are what wrap them in positioned slots.
        stateVariableDefinitions.typesetsOwnChildren = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { typesetsOwnChildren: false } }),
        };

        stateVariableDefinitions.typesetByParent = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { typesetByParent: false } }),
        };

        stateVariableDefinitions.text = {
            description: "The math content rendered as a plain text string.",
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
                    // The whole pipeline below parses each row, so blanks go in
                    // as an ordinary symbol and come back out as a word.
                    expressionText = convertLatexWithBlanks(
                        dependencyValues.latex,
                        (latex) =>
                            stripAlignmentMarkers(
                                latex.replaceAll("\\notag", ""),
                            )
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
                                .join("\\\\\n"),
                    );
                } catch (e) {
                    // A row is not something math-expressions can read. Hand
                    // the display's LaTeX back as it is, markers and all --
                    // the same fallback `latexToText` makes for an `<m>`. It
                    // is silent, so an author sees only `text` returning
                    // LaTeX; a whole spelling landing here is a bug in what
                    // is stripped before the parse, as #1761 was.
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

    static componentDocs = {
        summary: "Numbered display math with multiple aligned rows",
    };
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

    static componentDocs = {
        summary: "A row of math within an aligned display",
    };
    static canBeInList = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.number = {
            createComponentOfType: "boolean",
            description: "Whether to attach an equation number to this row.",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.renderMode.definition = () => ({
            setValue: { renderMode: "display" },
        });

        /**
         * Inside an `<md>` the whole display is typeset as one expression, so a
         * row draws no math of its own — it exists only to place the inputs
         * embedded in it. An `<mrow>` written anywhere else is ordinary display
         * math and keeps typesetting itself.
         */
        stateVariableDefinitions.typesetByParent = {
            forRenderer: true,
            returnDependencies: () => ({
                mdParent: {
                    dependencyType: "parentIdentity",
                    parentComponentType: "md",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    typesetByParent: dependencyValues.mdParent !== null,
                },
            }),
        };

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
            description: "The equation number (when numbered).",
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
