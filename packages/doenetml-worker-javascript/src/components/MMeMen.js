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
import { latexToMathFactory, latexToText } from "../utils/math";
import { MATH_BLANK_LATEX } from "@doenet/utils";
import { createInputStringFromChildren } from "../utils/parseMath";
import {
    convertLatexWithBlanks,
    embeddedChildContent,
    latexWithBlanksAsPlaceholders,
    slotToken,
} from "../utils/embeddedMathInputs";
import { codedDiagnostic } from "../utils/diagnostics";

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

    static componentDocs = {
        summary: "Inline math rendered with LaTeX",
    };
    static rendererType = "math";

    // Only the embedded inputs are rendered; `childIndicesToRender` selects them
    // and leaves every other child to be typeset as part of the LaTeX.
    static renderChildren = true;

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

        stateVariableDefinitions.latex = {
            description: "The math content rendered as a LaTeX string.",
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
                    variableNames: ["latex", "text", "selectedValues"],
                    variablesOptional: true,
                },
                embeddedInputComponentIndices: {
                    dependencyType: "stateVariable",
                    variableName: "embeddedInputComponentIndices",
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

                const embedded = new Set(
                    dependencyValues.embeddedInputComponentIndices,
                );

                let latex = createInputStringFromChildren({
                    children: dependencyValues.inlineChildren,
                    codePre: "",
                    format: "latex",
                    createDisplayedMathString: true,
                    // An embedded input that has been filled in contributes its
                    // value — a choice input its selected choices, which the
                    // string builder would not otherwise see. One left empty
                    // contributes a blank rather than nothing, so that the
                    // expression keeps the shape the author wrote instead of
                    // quietly losing a term.
                    displayedMathSlotForChild: (child) => {
                        if (!embedded.has(child.componentIdx)) {
                            return null;
                        }
                        return embeddedChildContent(child) || MATH_BLANK_LATEX;
                    },
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

        /**
         * The inputs to render inside the typeset expression, by component
         * index, in child order — and, as the same computation, the child
         * indices the renderer should be given.
         *
         * An input qualifies when its class opts in (`canBeEmbeddedInMath`) and
         * its shape suits an expression: a choice input must be `inline`, since
         * a block of radio buttons has no place inside an equation, and a text
         * input must have an absolute width, since a relative one (`%` or
         * `em`, which the renderer draws as a percentage) would resolve against
         * the absolutely-positioned wrapper rather than the page. Math
         * drawn on a graph is a single picture of the expression, with nowhere
         * to put a control, so nothing is embedded there. An input that opts in
         * but cannot be embedded warns and falls back to being flattened into
         * `latex`, which is what it did before it could be embedded at all.
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
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inline"],
                    variableNames: ["inline", "expanded", "width", "hidden"],
                    variablesOptional: true,
                },
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                // Shape state variables come from the `inline` child group,
                // which is matched separately from `allChildren`; index by
                // component so the two can be read together.
                const shapeByIdx = new Map(
                    dependencyValues.inlineChildren
                        .filter((child) => typeof child === "object")
                        .map((child) => [
                            child.componentIdx,
                            child.stateValues,
                        ]),
                );

                const embeddedInputComponentIndices = [];
                const childIndicesToRender = [];
                const diagnostics = [];

                for (const [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (typeof child !== "object") {
                        continue;
                    }
                    const componentClass =
                        componentInfoObjects.allComponentClasses[
                            child.componentType
                        ];
                    if (!componentClass?.canBeEmbeddedInMath) {
                        continue;
                    }

                    const shape = shapeByIdx.get(child.componentIdx) ?? {};
                    // A hidden child is not handed to the renderer at all, so
                    // no control could ever report a size for its marker; it
                    // is flattened into `latex` as it was before, silently,
                    // since hiding an input is a choice rather than a mistake.
                    if (shape.hidden === true) {
                        continue;
                    }
                    // A component without one of these state variables is
                    // unconstrained by it, so only an explicit mismatch rejects.
                    let reason = null;
                    if (dependencyValues.graphAncestor) {
                        reason = "on-graph";
                    } else if (shape.inline === false) {
                        reason = "not-inline";
                    } else if (shape.expanded === true) {
                        reason = "expanded";
                    } else if (shape.width?.isAbsolute === false) {
                        reason = "relative-width";
                    }

                    if (reason !== null) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0125",
                                args: {
                                    component: child.componentType,
                                    reason,
                                },
                                position: child.position || undefined,
                            }),
                        );
                        continue;
                    }

                    embeddedInputComponentIndices.push(child.componentIdx);
                    childIndicesToRender.push(ind);
                }

                return {
                    setValue: {
                        embeddedInputComponentIndices,
                        childIndicesToRender,
                    },
                    sendDiagnostics: diagnostics,
                };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        /**
         * `latex` with a marker in place of each embedded input, for the
         * renderer to substitute a measured box into.
         *
         * Deliberately independent of what the reader has typed: `latex`
         * interpolates a text input's value and so changes on every keystroke,
         * while this changes only when the *structure* does. That is what keeps
         * MathJax from re-typesetting the expression under a reader's cursor.
         */
        stateVariableDefinitions.latexTemplate = {
            forRenderer: true,
            returnDependencies: () => ({
                latex: {
                    dependencyType: "stateVariable",
                    variableName: "latex",
                },
                embeddedInputComponentIndices: {
                    dependencyType: "stateVariable",
                    variableName: "embeddedInputComponentIndices",
                },
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inline"],
                    variableNames: ["latex", "text"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                const embedded = new Set(
                    dependencyValues.embeddedInputComponentIndices,
                );

                if (embedded.size === 0) {
                    // The overwhelming majority of math: no second pass, and the
                    // renderer takes a path identical to the one it took before
                    // inputs could be embedded at all.
                    return {
                        setValue: { latexTemplate: dependencyValues.latex },
                    };
                }

                const latexTemplate = createInputStringFromChildren({
                    children: dependencyValues.inlineChildren,
                    codePre: "",
                    format: "latex",
                    createDisplayedMathString: true,
                    displayedMathSlotForChild: (child) =>
                        embedded.has(child.componentIdx)
                            ? slotToken(child.componentIdx)
                            : null,
                }).string;

                return { setValue: { latexTemplate } };
            },
        };

        // Whether an ancestor typesets this component's LaTeX as part of its
        // own. True only for an `<mrow>` inside an `<md>`; see `Mrow` below.
        stateVariableDefinitions.typesetByParent = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { typesetByParent: false } }),
        };

        // Whether this component's rendered children are the embedded inputs
        // themselves (`<m>`) rather than rows that hold them (`<md>`).
        stateVariableDefinitions.typesetsOwnChildren = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { typesetsOwnChildren: true } }),
        };

        stateVariableDefinitions.renderMode = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { renderMode: "inline" } }),
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
                return {
                    setValue: {
                        text: convertLatexWithBlanks(
                            dependencyValues.latex,
                            latexToText,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.math = {
            description: "The math content as a math expression.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
            },
            returnDependencies: () => ({
                latex: {
                    dependencyType: "stateVariable",
                    variableName: "latex",
                },
            }),
            definition: function ({ dependencyValues }) {
                const latexToMath = latexToMathFactory();

                try {
                    return {
                        setValue: {
                            // Blanks go in as placeholders so the expression
                            // keeps its structure — `x = ＿ + 3` rather than
                            // failing to parse and collapsing to `＿`.
                            math: latexToMath(
                                latexWithBlanksAsPlaceholders(
                                    dependencyValues.latex,
                                ),
                            ),
                        },
                    };
                } catch (e) {
                    return { setValue: { math: me.fromAst("\uff3f") } };
                }
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "latex",
                            desiredValue:
                                desiredStateVariableValues.math.toLatex(),
                        },
                    ],
                };
            },
        };

        return stateVariableDefinitions;
    }

    static adapters = ["math", "text"];

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

    static componentDocs = {
        summary: "Display math rendered with LaTeX",
    };
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

    static componentDocs = {
        summary: "Numbered display math rendered with LaTeX",
    };
    static canBeInList = false;

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.renderMode.definition = () => ({
            setValue: { renderMode: "numbered" },
        });

        stateVariableDefinitions.equationTag = {
            description: "The equation number (when numbered).",
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
