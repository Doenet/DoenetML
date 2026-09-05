import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
import {
    orderedPercentWidthMidpoints,
    orderedWidthMidpoints,
    widthsBySize,
    sizePossibilities,
} from "@doenet/utils";
import {
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";
import {
    GRAPH_CONTROL_COMPONENT_TYPES,
    GRAPH_CONTROL_DESCENDANT_CONFIGS,
    GRAPH_CONTROL_VARIABLE_NAMES,
} from "../utils/graphControls";
import { returnListItemChildStateVariableDefinitions } from "../utils/listItemChild";
import {
    addChildrenToDynamicChild,
    deleteChildrenFromDynamicChild,
} from "../utils/dynamicChildren";
// PreFigure conversion architecture and extension guide:
// see src/utils/prefigure/README.md
import { returnGraphPrefigureStateVariableDefinitions } from "../utils/prefigure/stateVariable";
import { codedDiagnostic } from "../utils/diagnostics";

/**
 * Evaluates one whitespace-separated group of the `grid` attribute to the
 * positive spacing it stands for, or null when it does not stand for one.
 *
 * A group can hold more than one piece: `grid="2$a 3$b"` puts `2` and `$a` in
 * the same group, and their product is the spacing.
 *
 * `me.fromText` throws on text it cannot parse — `grid="(1, 2)"` splits on the
 * space into `(1,` and `2)`, neither of which parses — so every parse is
 * guarded. An unparseable piece makes its group unusable rather than taking
 * the whole document down with it.
 *
 * A non-string piece is read out of `dependencyValues`, which carries both the
 * attribute's children (`gridAttrCompChildren`, whose order gives each piece
 * its index) and one `childAdapter<index>` per child.
 */
function gridSpacingFromGroup(group, dependencyValues) {
    let spacing = 1;

    for (let piece of group) {
        let factor;

        if (typeof piece === "string") {
            try {
                factor = me.fromText(piece).evaluate_to_constant();
            } catch {
                return null;
            }
        } else {
            // A non-string piece was adapted from a number or math component.
            let childInd = dependencyValues.gridAttrCompChildren.indexOf(piece);
            factor = dependencyValues["childAdapter" + childInd];
            if (factor instanceof me.class) {
                factor = factor.evaluate_to_constant();
            }
        }

        spacing *= factor;
    }

    // Rejects zero and negatives, and the null or NaN that an expression
    // without a constant value evaluates to.
    return spacing > 0 ? spacing : null;
}

/**
 * Splits the `grid` attribute's children into whitespace-separated groups.
 *
 * Whitespace only ever appears inside string children, so a group runs until a
 * string child contributes a space. Non-string children join whatever group is
 * open around them.
 */
function groupGridAttrChildren(attrChildren) {
    const groupedChildren = [];
    let pieces = [];

    // Closes the group being built, if anything is in it.
    const endGroup = () => {
        if (pieces.length > 0) {
            groupedChildren.push(pieces);
            pieces = [];
        }
    };

    for (const child of attrChildren) {
        if (typeof child !== "string") {
            pieces.push(child);
            continue;
        }

        for (const [ind, piece] of child.split(/\s+/).entries()) {
            // A space preceded every piece but the first, and an empty first
            // piece means the child led with one. Either way the group that
            // was open ends at that space.
            if (ind > 0 || piece === "") {
                endGroup();
            }
            if (piece !== "") {
                pieces.push(piece);
            }
        }
    }

    endGroup();

    return groupedChildren;
}

export default class Graph extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            changeAxisLimits: this.changeAxisLimits.bind(this),
            addChildren: this.addChildren.bind(this),
            deleteChildren: this.deleteChildren.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "graph";

    static componentDocs = {
        summary: "A 2D coordinate-axis graph",
    };
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.xMin = {
            createComponentOfType: "number",
            createStateVariable: "xminPrelim",
            defaultValue: -10,
            description: "Minimum value displayed on the x axis.",
        };
        attributes.xMax = {
            createComponentOfType: "number",
            createStateVariable: "xmaxPrelim",
            defaultValue: 10,
            description: "Maximum value displayed on the x axis.",
        };
        attributes.yMin = {
            createComponentOfType: "number",
            createStateVariable: "yminPrelim",
            defaultValue: -10,
            description: "Minimum value displayed on the y axis.",
        };
        attributes.yMax = {
            createComponentOfType: "number",
            createStateVariable: "ymaxPrelim",
            defaultValue: 10,
            description: "Maximum value displayed on the y axis.",
        };
        attributes.width = {
            createComponentOfType: "componentSize",
            description: "Explicit width of the graph (overrides size).",
        };
        attributes.size = {
            createComponentOfType: "text",
            createStateVariable: "specifiedSize",
            defaultValue: "medium",
            toLowerCase: true,
            validValues: [
                { value: "tiny", description: "About 1/12 the full width." },
                { value: "small", description: "About 30% of the full width." },
                { value: "medium", description: "About half the full width." },
                { value: "large", description: "About 70% of the full width." },
                { value: "full", description: "The full available width." },
            ],
            description: "Named size preset for the graph.",
        };
        attributes.aspectRatio = {
            createComponentOfType: "number",
            description: "Aspect ratio (width / height) for the graph.",
        };

        attributes.displayMode = {
            description: "How to size the graph.",
            createComponentOfType: "text",
            createStateVariable: "displayMode",
            validValues: [
                {
                    value: "block",
                    description: "Display as a block element on its own line.",
                },
                {
                    value: "inline",
                    description: "Render inline with surrounding text.",
                },
            ],
            defaultValue: "block",
            toLowerCase: true,
            forRenderer: true,
            public: true,
        };

        attributes.horizontalAlign = {
            description:
                "Horizontal alignment of the graph within its container.",
            createComponentOfType: "text",
            createStateVariable: "horizontalAlign",
            validValues: [
                {
                    value: "center",
                    description: "Center the graph horizontally.",
                },
                {
                    value: "left",
                    description: "Align the graph to the left edge.",
                },
                {
                    value: "right",
                    description: "Align the graph to the right edge.",
                },
            ],
            defaultValue: "center",
            toLowerCase: true,
            forRenderer: true,
            public: true,
        };

        attributes.identicalAxisScales = {
            description:
                "Whether to force the x and y axis scales to be equal.",
            createPrimitiveOfType: "boolean",
            createStateVariable: "identicalAxisScales",
            defaultValue: false,
            public: true,
        };
        attributes.displayXAxis = {
            description: "Whether to display the x axis.",
            createComponentOfType: "text",
            createStateVariable: "displayXAxis",
            defaultValue: "full",
            public: true,
            toLowerCase: true,
            validValues: [
                { value: "full", description: "Display the full x axis." },
                { value: "none", description: "Hide the x axis." },
                {
                    value: "positiveOnly",
                    description:
                        "Display only the positive half of the x axis.",
                },
                {
                    value: "negativeOnly",
                    description:
                        "Display only the negative half of the x axis.",
                },
            ],
            valueForTrue: "full",
            valueForFalse: "none",
            forRenderer: true,
        };
        attributes.displayYAxis = {
            description: "Whether to display the y axis.",
            createComponentOfType: "text",
            createStateVariable: "displayYAxis",
            defaultValue: "full",
            public: true,
            toLowerCase: true,
            validValues: [
                { value: "full", description: "Display the full y axis." },
                { value: "none", description: "Hide the y axis." },
                {
                    value: "positiveOnly",
                    description:
                        "Display only the positive half of the y axis.",
                },
                {
                    value: "negativeOnly",
                    description:
                        "Display only the negative half of the y axis.",
                },
            ],
            valueForTrue: "full",
            valueForFalse: "none",
            forRenderer: true,
        };
        attributes.addControls = {
            description: "Whether to render interactive zoom/pan controls.",
            createComponentOfType: "text",
            createStateVariable: "addControls",
            defaultValue: "none",
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "all",
                    description: "Render both sliders and input boxes.",
                },
                {
                    value: "slidersOnly",
                    description: "Render only slider controls.",
                },
                {
                    value: "inputsOnly",
                    description: "Render only input-box controls.",
                },
                {
                    value: "none",
                    description: "Render no interactive controls.",
                },
            ],
            valueForTrue: "all",
            valueForFalse: "none",
            forRenderer: true,
        };
        attributes.controlsPosition = {
            description: "Position of the graph controls.",
            createComponentOfType: "text",
            createStateVariable: "controlsPosition",
            defaultValue: "left",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "bottom",
                    description: "Place controls below the graph.",
                },
                {
                    value: "left",
                    description: "Place controls to the left of the graph.",
                },
                {
                    value: "right",
                    description: "Place controls to the right of the graph.",
                },
                {
                    value: "top",
                    description: "Place controls above the graph.",
                },
            ],
        };
        attributes.displayXAxisTicks = {
            description: "Whether to display tick marks on the x axis.",
            createComponentOfType: "boolean",
            createStateVariable: "displayXAxisTicks",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.displayYAxisTicks = {
            description: "Whether to display tick marks on the y axis.",
            createComponentOfType: "boolean",
            createStateVariable: "displayYAxisTicks",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.displayXAxisTickLabels = {
            createComponentOfType: "boolean",
            createStateVariable: "displayXAxisTickLabelsPrelim",
            defaultValue: true,
            description: "Whether to display labels on x-axis ticks.",
        };
        attributes.displayYAxisTickLabels = {
            createComponentOfType: "boolean",
            createStateVariable: "displayYAxisTickLabelsPrelim",
            defaultValue: true,
            description: "Whether to display labels on y-axis ticks.",
        };
        attributes.xLabelPosition = {
            description: "Position of the x-axis label.",
            createComponentOfType: "text",
            createStateVariable: "xLabelPosition",
            defaultValue: "right",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "right",
                    description:
                        "Place the x-axis label at the right end of the axis.",
                },
                {
                    value: "left",
                    description:
                        "Place the x-axis label at the left end of the axis.",
                },
            ],
        };
        attributes.xTickScaleFactor = {
            description: "Scale factor applied to x-axis tick spacing.",
            createComponentOfType: "math",
            createStateVariable: "xTickScaleFactor",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.yLabelPosition = {
            description: "Position of the y-axis label.",
            createComponentOfType: "text",
            createStateVariable: "yLabelPosition",
            defaultValue: "top",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "top",
                    description:
                        "Place the y-axis label at the top of the axis.",
                },
                {
                    value: "bottom",
                    description:
                        "Place the y-axis label at the bottom of the axis.",
                },
            ],
        };
        attributes.yLabelAlignment = {
            description: "Alignment of the y-axis label.",
            createComponentOfType: "text",
            createStateVariable: "yLabelAlignment",
            defaultValue: "left",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "left",
                    description:
                        "Align the y-axis label to the left of the axis.",
                },
                {
                    value: "right",
                    description:
                        "Align the y-axis label to the right of the axis.",
                },
            ],
        };
        attributes.yTickScaleFactor = {
            description: "Scale factor applied to y-axis tick spacing.",
            createComponentOfType: "math",
            createStateVariable: "yTickScaleFactor",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.showNavigation = {
            description: "Whether to show navigation controls (pan/zoom).",
            createComponentOfType: "boolean",
            createStateVariable: "showNavigation",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.fixAxes = {
            createComponentOfType: "boolean",
            createStateVariable: "fixAxesPreliminary",
            defaultValue: false,
            description:
                "Whether the axis limits are locked (preventing zoom/pan).",
        };
        // `suggestedValues`, not `validValues`: the named spacings are only
        // part of what this attribute takes — two positive numbers are equally
        // valid — so the list is offered rather than enforced. (The `grid`
        // state variable below already matches the names case-insensitively.)
        attributes.grid = {
            createComponentOfType: "text",
            valueForTrue: "medium",
            suggestedValues: [
                { value: "none", description: "Draw no grid lines." },
                {
                    value: "medium",
                    description:
                        "Draw grid lines at the major tick marks. Used when `grid` is given with no value.",
                },
                {
                    value: "dense",
                    description:
                        "Draw grid lines at the major and minor tick marks.",
                },
                // Two examples of the numeric form, which the named spacings
                // would otherwise hide: an author scanning a list of three
                // words has no reason to guess that spacings can be given
                // explicitly.
                {
                    value: "1 1",
                    description:
                        "Draw grid lines every 1 unit in x and every 1 unit in y. Any two positive numbers can be given this way.",
                },
                {
                    value: "2 2",
                    description:
                        "Draw grid lines every 2 units in x and every 2 units in y.",
                },
            ],
            description:
                'Grid line spacing on the graph: none, medium, dense, or two positive numbers giving the x and y spacing, such as grid="1 0.5".',
        };

        Object.assign(attributes, returnNumberDisplayAttributes());

        attributes.showBorder = {
            description: "Whether to render a border around the graph.",
            createComponentOfType: "boolean",
            createStateVariable: "showBorder",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.hideOffGraphIndicators = {
            description:
                "Whether to suppress indicators for objects outside the visible region.",
            createComponentOfType: "boolean",
            createStateVariable: "hideOffGraphIndicators",
            defaultValue: false,
            public: true,
        };

        attributes.decorative = {
            description:
                "Whether the graph is purely decorative (excluded from a11y tree).",
            createPrimitiveOfType: "boolean",
            createStateVariable: "decorative",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };

        attributes.renderer = {
            description: "Which renderer to use for the graph.",
            createPrimitiveOfType: "string",
            createStateVariable: "renderer",
            validValues: [
                {
                    value: "doenet",
                    description:
                        "Render using the built-in Doenet graph renderer.",
                },
                {
                    value: "prefigure",
                    description:
                        "Render using the PreFigure SVG-based renderer.",
                },
            ],
            defaultValue: "doenet",
            public: true,
            toLowerCase: true,
            forRenderer: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "xLabels",
                componentTypes: ["xLabel"],
            },
            {
                group: "yLabels",
                componentTypes: ["yLabel"],
            },
            {
                group: "shortDescriptions",
                componentTypes: ["shortDescription"],
            },
            {
                group: "descriptions",
                componentTypes: ["description"],
            },
            {
                group: "graphical",
                componentTypes: [
                    "_graphical",
                    "image",
                    "text",
                    "math",
                    "m",
                    "md",
                    "label",
                    "number",
                    "updateValue",
                    "callAction",
                    "triggerSet",
                    "booleanInput",
                    "textInput",
                    "mathInput",
                ],
            },
            {
                group: "graphs",
                componentTypes: ["graph"],
            },
            {
                group: "annotations",
                componentTypes: ["annotations"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnListItemChildStateVariableDefinitions({
                listItemInlineAlignment: "flex-start",
            }),
        );

        Object.assign(
            stateVariableDefinitions,
            returnNumberDisplayStateVariableDefinitions(),
        );

        stateVariableDefinitions.shortDescription = {
            description: "A short accessibility description of the graph.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                shortDescriptionChild: {
                    dependencyType: "child",
                    childGroups: ["shortDescriptions"],
                    variableNames: ["text"],
                },
                decorative: {
                    dependencyType: "stateVariable",
                    variableName: "decorative",
                },
            }),
            definition({ dependencyValues }) {
                let shortDescription = "";
                const diagnostics = [];
                if (dependencyValues.shortDescriptionChild.length > 0) {
                    const shortDescriptionChild =
                        dependencyValues.shortDescriptionChild[
                            dependencyValues.shortDescriptionChild.length - 1
                        ];

                    shortDescription =
                        shortDescriptionChild.stateValues.text.trim();
                }
                if (shortDescription === "" && !dependencyValues.decorative) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "accessibility",
                            level: 1,
                            code: "doenet-a0001",
                            args: { component: "graph" },
                        }),
                    );
                }

                return {
                    setValue: { shortDescription },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.descriptionChildInd = {
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        descriptionChildInd:
                            dependencyValues.allChildren.findLastIndex(
                                (child) =>
                                    child.componentType === "description",
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.fixAxes = {
            description: "Whether the visible axes range is locked.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                fixAxesPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "fixAxesPreliminary",
                },
                fixed: {
                    dependencyType: "stateVariable",
                    variableName: "fixed",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        fixAxes:
                            dependencyValues.fixAxesPreliminary ||
                            dependencyValues.fixed,
                    },
                };
            },
        };

        stateVariableDefinitions.xLabel = {
            description: "The x-axis label text.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "label",
                addStateVariablesShadowingStateVariables: {
                    hasLatex: {
                        stateVariableToShadow: "xLabelHasLatex",
                    },
                },
            },
            hasEssential: true,
            defaultValue: "",
            additionalStateVariablesDefined: [
                {
                    variableName: "xLabelHasLatex",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                xLabelChild: {
                    dependencyType: "child",
                    childGroups: ["xLabels"],
                    variableNames: ["value", "hasLatex"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.xLabelChild.length > 0) {
                    let xLabelChild =
                        dependencyValues.xLabelChild[
                            dependencyValues.xLabelChild.length - 1
                        ];
                    return {
                        setValue: {
                            xLabel: xLabelChild.stateValues.value,
                            xLabelHasLatex: xLabelChild.stateValues.hasLatex,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { xLabel: true },
                        setValue: { xLabelHasLatex: false },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (typeof desiredStateVariableValues.xLabel !== "string") {
                    return { success: false };
                }

                if (dependencyValues.xLabelChild.length > 0) {
                    let lastLabelInd = dependencyValues.xLabelChild.length - 1;
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "xLabelChild",
                                desiredValue: desiredStateVariableValues.xLabel,
                                childIndex: lastLabelInd,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "xLabel",
                                value: desiredStateVariableValues.xLabel,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.yLabel = {
            description: "The y-axis label text.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "label",
                addStateVariablesShadowingStateVariables: {
                    hasLatex: {
                        stateVariableToShadow: "yLabelHasLatex",
                    },
                },
            },
            hasEssential: true,
            defaultValue: "",
            additionalStateVariablesDefined: [
                {
                    variableName: "yLabelHasLatex",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                yLabelChild: {
                    dependencyType: "child",
                    childGroups: ["yLabels"],
                    variableNames: ["value", "hasLatex"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.yLabelChild.length > 0) {
                    let yLabelChild =
                        dependencyValues.yLabelChild[
                            dependencyValues.yLabelChild.length - 1
                        ];
                    return {
                        setValue: {
                            yLabel: yLabelChild.stateValues.value,
                            yLabelHasLatex: yLabelChild.stateValues.hasLatex,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { yLabel: true },
                        setValue: { yLabelHasLatex: false },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (typeof desiredStateVariableValues.yLabel !== "string") {
                    return { success: false };
                }

                if (dependencyValues.yLabelChild.length > 0) {
                    let lastLabelInd = dependencyValues.yLabelChild.length - 1;
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "yLabelChild",
                                desiredValue: desiredStateVariableValues.yLabel,
                                childIndex: lastLabelInd,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "yLabel",
                                value: desiredStateVariableValues.yLabel,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.graphicalDescendants = {
            forRenderer: true,
            returnDependencies: () => ({
                graphicalDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["_graphical"],
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        graphicalDescendants:
                            dependencyValues.graphicalDescendants,
                    },
                };
            },
        };

        stateVariableDefinitions.graphicalDescendantsForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                controlDescendants: {
                    dependencyType: "descendant",
                    componentTypes: GRAPH_CONTROL_COMPONENT_TYPES,
                    variableNames: GRAPH_CONTROL_VARIABLE_NAMES,
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            graphicalDescendantsForControls: [],
                        },
                    };
                }

                const graphicalDescendantsForControls = [];
                const countersByType = Object.fromEntries(
                    GRAPH_CONTROL_DESCENDANT_CONFIGS.map((config) => [
                        config.controlType,
                        0,
                    ]),
                );

                for (const descendant of dependencyValues.controlDescendants ??
                    []) {
                    const componentType = descendant.componentType;

                    // Config order is semantically significant: first matching
                    // inherited type wins, so specific types must be listed
                    // before broader ancestors in GRAPH_CONTROL_DESCENDANT_CONFIGS.
                    // This fallback-to-ancestor behavior is intentional.
                    for (const config of GRAPH_CONTROL_DESCENDANT_CONFIGS) {
                        if (
                            !componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: componentType,
                                baseComponentType: config.componentType,
                            })
                        ) {
                            continue;
                        }

                        // Numbering follows matched descendants of a control
                        // family, even when a matched descendant is later
                        // filtered out by payload validation.
                        countersByType[config.controlType] += 1;
                        const componentIdx = descendant.componentIdx;
                        if (!Number.isFinite(componentIdx)) {
                            break;
                        }

                        const payload = config.buildPayload({
                            stateValues: descendant.stateValues ?? {},
                            componentIdx,
                            number: countersByType[config.controlType],
                        });

                        if (payload !== null) {
                            graphicalDescendantsForControls.push(payload);
                        }

                        break;
                    }
                }

                return {
                    setValue: {
                        graphicalDescendantsForControls,
                    },
                };
            },
        };

        Object.assign(
            stateVariableDefinitions,
            returnGraphPrefigureStateVariableDefinitions(),
        );

        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                graphicalOrGraphChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical", "graphs"],
                },
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
                descriptionChildInd: {
                    dependencyType: "stateVariable",
                    variableName: "descriptionChildInd",
                },
            }),
            definition({ dependencyValues }) {
                const childIndicesToRender = [];

                const graphicalChildNames =
                    dependencyValues.graphicalOrGraphChildren.map(
                        (x) => x.componentIdx,
                    );

                for (const [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (graphicalChildNames.includes(child.componentIdx)) {
                        childIndicesToRender.push(ind);
                    }
                }
                if (dependencyValues.descriptionChildInd !== -1) {
                    childIndicesToRender.push(
                        dependencyValues.descriptionChildInd,
                    );
                }

                return { setValue: { childIndicesToRender } };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.numChildrenAdded = {
            defaultValue: 0,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { numChildrenAdded: true },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "numChildrenAdded",
                            value: desiredStateVariableValues.numChildrenAdded,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.size = {
            description: "The size of the graph.",
            public: true,
            defaultValue: "medium",
            hasEssential: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                specifiedSize: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedSize",
                },
                widthAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "width",
                    variableNames: ["componentSize"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                const defaultSize = "medium";

                if (!usedDefault.specifiedSize) {
                    return {
                        setValue: { size: dependencyValues.specifiedSize },
                    };
                } else if (dependencyValues.widthAttr) {
                    let componentSize =
                        dependencyValues.widthAttr.stateValues.componentSize;
                    if (componentSize === null) {
                        return {
                            setValue: { size: defaultSize },
                        };
                    }
                    let { isAbsolute, size: widthSize } = componentSize;
                    let size;

                    if (isAbsolute) {
                        for (let [
                            ind,
                            pixels,
                        ] of orderedWidthMidpoints.entries()) {
                            if (widthSize <= pixels) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    } else {
                        for (let [
                            ind,
                            percent,
                        ] of orderedPercentWidthMidpoints.entries()) {
                            if (widthSize <= percent) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    }
                    return {
                        setValue: { size },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { size: true },
                    };
                }
            },
        };

        stateVariableDefinitions.width = {
            description: "The width of the graph.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "componentSize",
            },
            returnDependencies: () => ({
                size: {
                    dependencyType: "stateVariable",
                    variableName: "size",
                },
            }),
            definition({ dependencyValues }) {
                let width = {
                    isAbsolute: true,
                    size: widthsBySize[dependencyValues.size],
                };

                return {
                    setValue: { width },
                };
            },
        };

        stateVariableDefinitions.aspectRatioFromAxisScales = {
            returnDependencies: () => ({
                aspectRatioAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "aspectRatio",
                    variableNames: ["value"],
                },
                identicalAxisScales: {
                    dependencyType: "stateVariable",
                    variableName: "identicalAxisScales",
                },
            }),
            definition({ dependencyValues }) {
                let aspectRatioFromAxisScales =
                    dependencyValues.identicalAxisScales &&
                    dependencyValues.aspectRatioAttr === null;
                // || !Number.isFinite(dependencyValues.aspectRatioAttr.stateValues.value)

                return {
                    setValue: { aspectRatioFromAxisScales },
                    checkForActualChange: { aspectRatioFromAxisScales: true },
                };
            },
        };

        stateVariableDefinitions.aspectRatio = {
            description: "The aspect ratio (width / height) of the graph.",
            public: true,
            forRenderer: true,
            defaultValue: 1,
            hasEssential: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            stateVariablesDeterminingDependencies: [
                "aspectRatioFromAxisScales",
            ],
            returnDependencies({ stateValues }) {
                if (stateValues.aspectRatioFromAxisScales) {
                    return {
                        aspectRatioFromAxisScales: {
                            dependencyType: "stateVariable",
                            variableName: "aspectRatioFromAxisScales",
                        },
                        xScale: {
                            dependencyType: "stateVariable",
                            variableName: "xScale",
                        },
                        yScale: {
                            dependencyType: "stateVariable",
                            variableName: "yScale",
                        },
                    };
                } else {
                    return {
                        aspectRatioFromAxisScales: {
                            dependencyType: "stateVariable",
                            variableName: "aspectRatioFromAxisScales",
                        },
                        aspectRatioAttr: {
                            dependencyType: "attributeComponent",
                            attributeName: "aspectRatio",
                            variableNames: ["value"],
                        },
                        width: {
                            dependencyType: "stateVariable",
                            variableName: "width",
                        },
                    };
                }
            },
            definition({ dependencyValues }) {
                if (dependencyValues.aspectRatioFromAxisScales) {
                    let aspectRatio =
                        dependencyValues.xScale / dependencyValues.yScale;
                    return {
                        setValue: { aspectRatio },
                    };
                } else if (dependencyValues.aspectRatioAttr !== null) {
                    let aspectRatio =
                        dependencyValues.aspectRatioAttr.stateValues.value;
                    if (!Number.isFinite(aspectRatio)) {
                        aspectRatio = 1;
                    }
                    return {
                        setValue: { aspectRatio },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { aspectRatio: true },
                    };
                }
            },
        };

        stateVariableDefinitions.haveGraphParent = {
            forRenderer: true,
            returnDependencies: () => ({
                graphParent: {
                    dependencyType: "parentIdentity",
                    parentComponentType: "graph",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        haveGraphParent: dependencyValues.graphParent !== null,
                    },
                };
            },
        };

        stateVariableDefinitions.effectiveRenderer = {
            description:
                "The renderer actually used after resolving fallbacks.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                renderer: {
                    dependencyType: "stateVariable",
                    variableName: "renderer",
                },
                graphParentRenderer: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "graph",
                    variableName: "effectiveRenderer",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        effectiveRenderer:
                            dependencyValues.graphParentRenderer ??
                            dependencyValues.renderer,
                    },
                };
            },
        };

        stateVariableDefinitions.displayXAxisTickLabels = {
            description: "Whether x-axis tick labels are displayed.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                displayXAxisTickLabelsPrelim: {
                    dependencyType: "stateVariable",
                    variableName: "displayXAxisTickLabelsPrelim",
                },
                displayXAxisTicks: {
                    dependencyType: "stateVariable",
                    variableName: "displayXAxisTicks",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (usedDefault.displayXAxisTickLabelsPrelim) {
                    return {
                        setValue: {
                            displayXAxisTickLabels:
                                dependencyValues.displayXAxisTicks,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            displayXAxisTickLabels:
                                dependencyValues.displayXAxisTickLabelsPrelim,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.displayYAxisTickLabels = {
            description: "Whether y-axis tick labels are displayed.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                displayYAxisTickLabelsPrelim: {
                    dependencyType: "stateVariable",
                    variableName: "displayYAxisTickLabelsPrelim",
                },
                displayYAxisTicks: {
                    dependencyType: "stateVariable",
                    variableName: "displayYAxisTicks",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (usedDefault.displayYAxisTickLabelsPrelim) {
                    return {
                        setValue: {
                            displayYAxisTickLabels:
                                dependencyValues.displayYAxisTicks,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            displayYAxisTickLabels:
                                dependencyValues.displayYAxisTickLabelsPrelim,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.xMin = {
            description: "Minimum x value displayed.",
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    xminPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    },
                    graphParentXmin: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "xMin",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xmaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    };
                    dependencies.yminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    };
                    dependencies.ymaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentXmin !== null) {
                    return {
                        setValue: { xMin: dependencyValues.graphParentXmin },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { xMin: dependencyValues.xminPrelim } };
                }

                let xminSpecified = !usedDefault.xminPrelim;

                // always use xMin if specified
                if (xminSpecified) {
                    return { setValue: { xMin: dependencyValues.xminPrelim } };
                }

                let xmaxSpecified = !usedDefault.xmaxPrelim;
                let yminSpecified = !usedDefault.yminPrelim;
                let ymaxSpecified = !usedDefault.ymaxPrelim;

                let yscaleSpecified = yminSpecified && ymaxSpecified;

                if (yscaleSpecified) {
                    let aspectRatio = dependencyValues.aspectRatio;
                    let yscaleAdjusted =
                        (dependencyValues.ymaxPrelim -
                            dependencyValues.yminPrelim) *
                        aspectRatio;
                    if (xmaxSpecified) {
                        return {
                            setValue: {
                                xMin:
                                    dependencyValues.xmaxPrelim -
                                    yscaleAdjusted,
                            },
                        };
                    } else {
                        return { setValue: { xMin: -yscaleAdjusted / 2 } };
                    }
                } else {
                    if (xmaxSpecified) {
                        // use the default xscale of 20
                        return {
                            setValue: {
                                xMin: dependencyValues.xmaxPrelim - 20,
                            },
                        };
                    } else {
                        // use the default value of xMin
                        return { setValue: { xMin: -10 } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentXmin !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentXmin",
                                desiredValue: desiredStateVariableValues.xMin,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "xminPrelim",
                            desiredValue: desiredStateVariableValues.xMin,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.xMax = {
            description: "Maximum x value displayed.",
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    xmaxPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    },
                    graphParentXmax: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "xMax",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    };
                    dependencies.yminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    };
                    dependencies.ymaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentXmax !== null) {
                    return {
                        setValue: { xMax: dependencyValues.graphParentXmax },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { xMax: dependencyValues.xmaxPrelim } };
                }

                let xminSpecified = !usedDefault.xminPrelim;
                let xmaxSpecified = !usedDefault.xmaxPrelim;
                let yminSpecified = !usedDefault.yminPrelim;
                let ymaxSpecified = !usedDefault.ymaxPrelim;

                let yscaleSpecified = yminSpecified && ymaxSpecified;
                let xscaleSpecified = xminSpecified && xmaxSpecified;

                let xMin = dependencyValues.xminPrelim;

                if (yscaleSpecified) {
                    let aspectRatio = dependencyValues.aspectRatio;
                    let yscaleAdjusted =
                        (dependencyValues.ymaxPrelim -
                            dependencyValues.yminPrelim) *
                        aspectRatio;

                    if (xscaleSpecified) {
                        let xscale = dependencyValues.xmaxPrelim - xMin;
                        let maxScale = Math.max(xscale, yscaleAdjusted);

                        return { setValue: { xMax: xMin + maxScale } };
                    } else {
                        if (xminSpecified) {
                            return {
                                setValue: { xMax: xMin + yscaleAdjusted },
                            };
                        } else if (xmaxSpecified) {
                            return {
                                setValue: { xMax: dependencyValues.xmaxPrelim },
                            };
                        } else {
                            return { setValue: { xMax: yscaleAdjusted / 2 } };
                        }
                    }
                } else {
                    // no yscale specified
                    if (xmaxSpecified) {
                        return {
                            setValue: { xMax: dependencyValues.xmaxPrelim },
                        };
                    } else if (xminSpecified) {
                        // use the default xscale of 20
                        return { setValue: { xMax: xMin + 20 } };
                    } else {
                        // use the default xMax
                        return { setValue: { xMax: 10 } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentXmax !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentXmax",
                                desiredValue: desiredStateVariableValues.xMax,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "xmaxPrelim",
                            desiredValue: desiredStateVariableValues.xMax,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.yMin = {
            description: "Minimum y value displayed.",
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    yminPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    },
                    graphParentYmin: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "yMin",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xmaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    };
                    dependencies.xminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    };
                    dependencies.ymaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentYmin !== null) {
                    return {
                        setValue: { yMin: dependencyValues.graphParentYmin },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { yMin: dependencyValues.yminPrelim } };
                }

                let yminSpecified = !usedDefault.yminPrelim;

                // always use yMin if specified
                if (yminSpecified) {
                    return { setValue: { yMin: dependencyValues.yminPrelim } };
                }

                let ymaxSpecified = !usedDefault.ymaxPrelim;
                let xminSpecified = !usedDefault.xminPrelim;
                let xmaxSpecified = !usedDefault.xmaxPrelim;

                let xscaleSpecified = xminSpecified && xmaxSpecified;
                let aspectRatio = dependencyValues.aspectRatio;

                if (xscaleSpecified) {
                    let xscaleAdjusted =
                        (dependencyValues.xmaxPrelim -
                            dependencyValues.xminPrelim) /
                        aspectRatio;
                    if (ymaxSpecified) {
                        return {
                            setValue: {
                                yMin:
                                    dependencyValues.ymaxPrelim -
                                    xscaleAdjusted,
                            },
                        };
                    } else {
                        return { setValue: { yMin: -xscaleAdjusted / 2 } };
                    }
                } else {
                    if (ymaxSpecified) {
                        // use the default xscale of 20, adjusted for aspect ratio
                        return {
                            setValue: {
                                yMin:
                                    dependencyValues.ymaxPrelim -
                                    20 / aspectRatio,
                            },
                        };
                    } else {
                        // use the default value of yMin, adjusted for aspect ration
                        return { setValue: { yMin: -10 / aspectRatio } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentYmin !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentYmin",
                                desiredValue: desiredStateVariableValues.yMin,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "yminPrelim",
                            desiredValue: desiredStateVariableValues.yMin,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.yMax = {
            description: "Maximum y value displayed.",
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    ymaxPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    },
                    graphParentYmax: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "yMax",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    };
                    dependencies.yminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    };
                    dependencies.xmaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentYmax !== null) {
                    return {
                        setValue: { yMax: dependencyValues.graphParentYmax },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { yMax: dependencyValues.ymaxPrelim } };
                }

                let xminSpecified = !usedDefault.xminPrelim;
                let xmaxSpecified = !usedDefault.xmaxPrelim;
                let yminSpecified = !usedDefault.yminPrelim;
                let ymaxSpecified = !usedDefault.ymaxPrelim;

                let yscaleSpecified = yminSpecified && ymaxSpecified;
                let xscaleSpecified = xminSpecified && xmaxSpecified;

                let yMin = dependencyValues.yminPrelim;

                let aspectRatio = dependencyValues.aspectRatio;

                if (xscaleSpecified) {
                    let xscaleAdjusted =
                        (dependencyValues.xmaxPrelim -
                            dependencyValues.xminPrelim) /
                        aspectRatio;

                    if (yscaleSpecified) {
                        let yscale = dependencyValues.ymaxPrelim - yMin;
                        let maxScale = Math.max(yscale, xscaleAdjusted);

                        return { setValue: { yMax: yMin + maxScale } };
                    } else {
                        if (yminSpecified) {
                            return {
                                setValue: { yMax: yMin + xscaleAdjusted },
                            };
                        } else if (ymaxSpecified) {
                            return {
                                setValue: { yMax: dependencyValues.ymaxPrelim },
                            };
                        } else {
                            return { setValue: { yMax: xscaleAdjusted / 2 } };
                        }
                    }
                } else {
                    // no xscale specified
                    if (ymaxSpecified) {
                        return {
                            setValue: { yMax: dependencyValues.ymaxPrelim },
                        };
                    } else if (yminSpecified) {
                        // use the default yscale of 20, adjusted for aspect ratio
                        return { setValue: { yMax: yMin + 20 / aspectRatio } };
                    } else {
                        // use the default yMax, adjusted for aspect ratio
                        return { setValue: { yMax: 10 / aspectRatio } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentYmax !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentYmax",
                                desiredValue: desiredStateVariableValues.yMax,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "ymaxPrelim",
                            desiredValue: desiredStateVariableValues.yMax,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.boundingbox = {
            forRenderer: true,
            returnDependencies: () => ({
                xMin: {
                    dependencyType: "stateVariable",
                    variableName: "xMin",
                },
                xMax: {
                    dependencyType: "stateVariable",
                    variableName: "xMax",
                },
                yMin: {
                    dependencyType: "stateVariable",
                    variableName: "yMin",
                },
                yMax: {
                    dependencyType: "stateVariable",
                    variableName: "yMax",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        boundingbox: [
                            dependencyValues.xMin,
                            dependencyValues.yMax,
                            dependencyValues.xMax,
                            dependencyValues.yMin,
                        ],
                    },
                };
            },
        };

        function returnScaleInverseDefinition({
            scaleStateVariable,
            minDependency,
            maxDependency,
        }) {
            return function inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let desiredScale =
                    desiredStateVariableValues[scaleStateVariable];
                let midpoint =
                    dependencyValues[minDependency] / 2 +
                    dependencyValues[maxDependency] / 2;
                let desiredMin = midpoint - desiredScale / 2;
                let desiredMax = midpoint + desiredScale / 2;

                if (
                    !Number.isFinite(desiredScale) ||
                    desiredScale <= 0 ||
                    !Number.isFinite(midpoint) ||
                    !Number.isFinite(desiredMin) ||
                    !Number.isFinite(desiredMax)
                ) {
                    // Reject non-positive scales: they would make min ≥ max,
                    // which breaks consumers that treat the scale as a positive
                    // magnitude (e.g. aspectRatio = xScale / yScale).
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: minDependency,
                            desiredValue: desiredMin,
                        },
                        {
                            setDependency: maxDependency,
                            desiredValue: desiredMax,
                        },
                    ],
                };
            };
        }

        stateVariableDefinitions.xScale = {
            description: "Scale used along the x axis (xMax − xMin).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                xMin: {
                    dependencyType: "stateVariable",
                    variableName: "xMin",
                },
                xMax: {
                    dependencyType: "stateVariable",
                    variableName: "xMax",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        xScale: dependencyValues.xMax - dependencyValues.xMin,
                    },
                };
            },
            inverseDefinition: returnScaleInverseDefinition({
                scaleStateVariable: "xScale",
                minDependency: "xMin",
                maxDependency: "xMax",
            }),
        };

        stateVariableDefinitions.yScale = {
            description: "Scale used along the y axis (yMax − yMin).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                yMin: {
                    dependencyType: "stateVariable",
                    variableName: "yMin",
                },
                yMax: {
                    dependencyType: "stateVariable",
                    variableName: "yMax",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        yScale: dependencyValues.yMax - dependencyValues.yMin,
                    },
                };
            },
            inverseDefinition: returnScaleInverseDefinition({
                scaleStateVariable: "yScale",
                minDependency: "yMin",
                maxDependency: "yMax",
            }),
        };

        stateVariableDefinitions.gridAttrCompName = {
            returnDependencies: () => ({
                gridAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "grid",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.gridAttr) {
                    return {
                        setValue: {
                            gridAttrCompName:
                                dependencyValues.gridAttr.componentIdx,
                        },
                    };
                } else {
                    return { setValue: { gridAttrCompName: null } };
                }
            },
        };

        stateVariableDefinitions.gridAttrCompChildren = {
            stateVariablesDeterminingDependencies: ["gridAttrCompName"],
            returnDependencies: ({ stateValues }) => {
                if (stateValues.gridAttrCompName) {
                    return {
                        gridAttrCompChildren: {
                            dependencyType: "child",
                            parentIdx: stateValues.gridAttrCompName,
                            childGroups: ["textLike"],
                            variableNames: ["value"],
                        },
                    };
                } else {
                    return {};
                }
            },
            definition({ dependencyValues }) {
                if (dependencyValues.gridAttrCompChildren) {
                    return {
                        setValue: {
                            gridAttrCompChildren:
                                dependencyValues.gridAttrCompChildren,
                        },
                    };
                } else {
                    return { setValue: { gridAttrCompChildren: null } };
                }
            },
        };

        stateVariableDefinitions.grid = {
            description: "Grid line spacing on the graph.",
            public: true,
            shadowingInstructions: {
                hasVariableComponentType: true,
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            forRenderer: true,
            stateVariablesDeterminingDependencies: [
                "gridAttrCompName",
                "gridAttrCompChildren",
            ],
            returnDependencies({ stateValues }) {
                if (stateValues.gridAttrCompChildren) {
                    let dependencies = {
                        gridAttrCompChildren: {
                            dependencyType: "stateVariable",
                            variableName: "gridAttrCompChildren",
                        },
                        // Every child of the attribute, used only to tell a
                        // value the author spelled out from one that came from
                        // elsewhere. It has to be every child rather than
                        // `gridAttrCompChildren`, because a child a text
                        // attribute cannot accept at all — `grid="$aPoint"` —
                        // is missing from `gridAttrCompChildren` and from the
                        // attribute's value alike. Judged on what survives, the
                        // value would look authored, and the warning below
                        // would quote the empty remnant the dropped child left
                        // behind, on top of the "invalid format" warning that
                        // child already raised.
                        allGridAttrChildren: {
                            dependencyType: "child",
                            parentIdx: stateValues.gridAttrCompName,
                            includeAllChildren: true,
                        },
                        gridAttr: {
                            dependencyType: "attributeComponent",
                            attributeName: "grid",
                            variableNames: ["value"],
                        },
                    };

                    for (let [
                        ind,
                        child,
                    ] of stateValues.gridAttrCompChildren.entries()) {
                        dependencies["childAdapter" + ind] = {
                            dependencyType: "adapterSourceStateVariable",
                            componentIdx: child.componentIdx,
                            variableName: "value",
                        };
                    }

                    return dependencies;
                } else {
                    return {};
                }
            },
            definition({ dependencyValues }) {
                if (!dependencyValues.gridAttrCompChildren) {
                    return {
                        setValue: { grid: "none" },
                        setCreateComponentOfType: { grid: "text" },
                    };
                }

                const attrChildren = dependencyValues.gridAttrCompChildren;
                const attrValue = dependencyValues.gridAttr.stateValues.value;

                // Only a value the author spelled out can be reported as
                // invalid. Once the attribute contains a reference, an unusable
                // value is not reliably a mistake: it is usually a `<mathInput>`
                // the reader has not filled in yet — warning about that would
                // fire on every load — or one they have filled in badly, which
                // is not the author's to fix. The cost is that a reference to a
                // value the author got wrong, as in `grid="1 $negativeNumber"`,
                // goes unreported.
                const authoredInFull =
                    dependencyValues.allGridAttrChildren.every(
                        (child) => typeof child === "string",
                    );

                const noGrid = () => ({
                    setValue: { grid: "none" },
                    setCreateComponentOfType: { grid: "text" },
                    sendDiagnostics: authoredInFull
                        ? [
                              codedDiagnostic({
                                  type: "warning",
                                  code: "doenet-w0119",
                                  args: { grid: attrValue },
                              }),
                          ]
                        : [],
                });

                let grid = attrValue.toLowerCase().trim();
                if (grid === "true") {
                    grid = "medium";
                } else if (grid === "false") {
                    grid = "none";
                }
                if (["medium", "dense", "none"].includes(grid)) {
                    return {
                        setValue: { grid },
                        setCreateComponentOfType: { grid: "text" },
                    };
                }

                const groupedChildren = groupGridAttrChildren(attrChildren);

                if (groupedChildren.length < 2) {
                    // if don't have at least two pieces separated by spaces, it isn't valid
                    return noGrid();
                }

                grid = [];

                for (let group of groupedChildren) {
                    // each of the grouped children must represent a positive number
                    const spacing = gridSpacingFromGroup(
                        group,
                        dependencyValues,
                    );

                    if (spacing === null) {
                        return noGrid();
                    }

                    grid.push(spacing);
                }

                return {
                    setValue: { grid },
                    setCreateComponentOfType: { grid: "numberList" },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async changeAxisLimits({
        xMin,
        xMax,
        yMin,
        yMax,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let updateInstructions = [];

        if (xMin !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "xMin",
                value: xMin,
            });
        }
        if (xMax !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "xMax",
                value: xMax,
            });
        }
        if (yMin !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "yMin",
                value: yMin,
            });
        }
        if (yMax !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "yMax",
                value: yMax,
            });
        }

        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    xMin,
                    xMax,
                    yMin,
                    yMax,
                },
            },
        });
    }

    async addChildren(args) {
        return await addChildrenToDynamicChild(this, args);
    }

    async deleteChildren(args) {
        return await deleteChildrenFromDynamicChild(this, args);
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
}
