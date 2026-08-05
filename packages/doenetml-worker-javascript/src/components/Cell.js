import BaseComponent from "./abstract/BaseComponent";
import me from "math-expressions";
import { preprocessMathInverseDefinition, textToAst } from "../utils/math";
import { textFromChildren } from "../utils/text";
import {
    BORDER_VALUES,
    HALIGN_VALUES,
    readVocabularyValue,
    returnBorderValidValues,
    returnHalignValidValues,
} from "../utils/tabularAttributes";

export default class Cell extends BaseComponent {
    static componentType = "cell";

    static componentDocs = {
        summary: "A single cell within a tabular layout or spreadsheet",
    };
    static rendererType = "cell";
    static renderChildren = true;

    static includeBlankStringChildren = true;

    static primaryStateVariableForDefinition = "text";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.rowNum = {
            createComponentOfType: "text",
            createStateVariable: "rowNum",
            defaultValue: null,
            public: true,
            description: "Row number where this cell is placed (1-based).",
        };
        attributes.colNum = {
            createComponentOfType: "text",
            createStateVariable: "colNum",
            defaultValue: null,
            public: true,
            description: "Column number where this cell is placed (1-based).",
        };
        attributes.colSpan = {
            createComponentOfType: "integer",
            createStateVariable: "colSpan",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: "Number of columns this cell spans.",
        };
        attributes.halign = {
            createComponentOfType: "text",
            toLowerCase: true,
            validValues: returnHalignValidValues(),
            description: "Horizontal alignment for the cell's content.",
        };
        attributes.bottomBorder = {
            createComponentOfType: "text",
            toLowerCase: true,
            validValues: returnBorderValidValues(),
            description: "Border style for the bottom edge of the cell.",
        };
        attributes.endBorder = {
            createComponentOfType: "text",
            toLowerCase: true,
            validValues: returnBorderValidValues(),
            description:
                "Border style for the trailing edge of the cell: its right edge in a left-to-right document, its left edge in a right-to-left one.",
        };
        attributes.prefill = {
            createComponentOfType: "text",
            createStateVariable: "prefill",
            defaultValue: "",
            public: true,
            description: "Initial text content of the cell.",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "maths",
                componentTypes: ["math"],
            },
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.halign = {
            description:
                "Horizontal alignment of the cell's content (start, center, end, or justify).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            hasEssential: true,
            defaultValue: "start",
            returnDependencies: () => ({
                halignAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "halign",
                    variableNames: ["value"],
                },
                parentHalign: {
                    dependencyType: "parentStateVariable",
                    variableName: "halign",
                },
                // TODO: get halign for corresponding col
                tabularHalign: {
                    dependencyType: "ancestor",
                    componentType: "tabular",
                    variableNames: ["halign"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.halignAttr !== null) {
                    const halign = readVocabularyValue(
                        dependencyValues.halignAttr.stateValues.value,
                        HALIGN_VALUES,
                        "start",
                    );
                    return { setValue: { halign } };
                } else if (
                    !usedDefault.parentHalign &&
                    dependencyValues.parentHalign
                ) {
                    return {
                        setValue: { halign: dependencyValues.parentHalign },
                    };
                } else if (
                    !usedDefault.tabularHalign &&
                    dependencyValues.tabularHalign
                ) {
                    return {
                        setValue: {
                            halign: dependencyValues.tabularHalign.stateValues
                                .halign,
                        },
                    };
                } else {
                    return { useEssentialOrDefaultValue: { halign: true } };
                }
            },
        };

        stateVariableDefinitions.bottomBorder = {
            description: "Border style for the bottom edge of the cell.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            hasEssential: true,
            defaultValue: "none",
            returnDependencies: () => ({
                bottomBorderAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "bottomBorder",
                    variableNames: ["value"],
                },
                parentBottomBorder: {
                    dependencyType: "parentStateVariable",
                    variableName: "bottomBorder",
                },
                tabularBottomBorder: {
                    dependencyType: "ancestor",
                    componentType: "tabular",
                    variableNames: ["bottomBorder"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.bottomBorderAttr !== null) {
                    const bottomBorder = readVocabularyValue(
                        dependencyValues.bottomBorderAttr.stateValues.value,
                        BORDER_VALUES,
                        "none",
                    );
                    return { setValue: { bottomBorder } };
                } else if (
                    !usedDefault.parentBottomBorder &&
                    dependencyValues.parentBottomBorder
                ) {
                    return {
                        setValue: {
                            bottomBorder: dependencyValues.parentBottomBorder,
                        },
                    };
                } else if (
                    !usedDefault.tabularBottomBorder &&
                    dependencyValues.tabularBottomBorder
                ) {
                    return {
                        setValue: {
                            bottomBorder:
                                dependencyValues.tabularBottomBorder.stateValues
                                    .bottomBorder,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { bottomBorder: true },
                    };
                }
            },
        };

        stateVariableDefinitions.endBorder = {
            description:
                "Border style for the trailing edge of the cell: its right edge in a left-to-right document, its left edge in a right-to-left one.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            hasEssential: true,
            defaultValue: "none",
            returnDependencies: () => ({
                endBorderAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "endBorder",
                    variableNames: ["value"],
                },
                // TODO: get endBorder for corresponding col
                tabularEndBorder: {
                    dependencyType: "ancestor",
                    componentType: "tabular",
                    variableNames: ["endBorder"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.endBorderAttr !== null) {
                    const endBorder = readVocabularyValue(
                        dependencyValues.endBorderAttr.stateValues.value,
                        BORDER_VALUES,
                        "none",
                    );
                    return { setValue: { endBorder } };
                } else if (
                    !usedDefault.tabularEndBorder &&
                    dependencyValues.tabularEndBorder
                ) {
                    return {
                        setValue: {
                            endBorder:
                                dependencyValues.tabularEndBorder.stateValues
                                    .endBorder,
                        },
                    };
                } else {
                    return { useEssentialOrDefaultValue: { endBorder: true } };
                }
            },
        };

        stateVariableDefinitions.inHeader = {
            description: "Whether this cell is in a header row of the table.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            defaultValue: false,
            returnDependencies: () => ({
                parentHeader: {
                    dependencyType: "parentStateVariable",
                    variableName: "header",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        inHeader: dependencyValues.parentHeader === true,
                    },
                };
            },
        };

        stateVariableDefinitions.onlyMathChild = {
            returnDependencies: () => ({
                mathChild: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                },
                otherChildren: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    onlyMathChild:
                        dependencyValues.mathChild.length === 1 &&
                        dependencyValues.otherChildren.length === 0,
                },
            }),
        };

        stateVariableDefinitions.text = {
            description: "The cell's content as a text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            hasEssential: true,
            forRenderer: true,
            // Note: even though the default value isn't used in the definition, below,
            // it needed because `text` is the `primaryStateVariableForDefinition`, defined above.
            // When `cell` is extended from a prop, this definition is overwritten
            // with a definition that assumes a default value.
            defaultValue: "",
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["maths", "anything"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
                prefill: {
                    dependencyType: "stateVariable",
                    variableName: "prefill",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.children.length === 0) {
                    return {
                        useEssentialOrDefaultValue: {
                            text: {
                                defaultValue: dependencyValues.prefill,
                            },
                        },
                    };
                }
                let text = textFromChildren(dependencyValues.children);

                return { setValue: { text } };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.children.length === 0) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "text",
                                value:
                                    desiredStateVariableValues.text === null
                                        ? ""
                                        : String(
                                              desiredStateVariableValues.text,
                                          ),
                            },
                        ],
                    };
                } else if (dependencyValues.children.length === 1) {
                    if (
                        typeof dependencyValues.children[0] === "object" &&
                        dependencyValues.children[0].stateValues.text ===
                            undefined
                    ) {
                        return { success: false };
                    } else {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "children",
                                    desiredValue:
                                        desiredStateVariableValues.text,
                                    childIndex: 0,
                                    variableIndex: 0,
                                },
                            ],
                        };
                    }
                } else {
                    return { success: false };
                }
            },
        };

        stateVariableDefinitions.math = {
            description: "The cell's content interpreted as a math expression.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
            },
            stateVariablesDeterminingDependencies: ["onlyMathChild"],
            returnDependencies({ stateValues }) {
                if (stateValues.onlyMathChild) {
                    return {
                        mathChild: {
                            dependencyType: "child",
                            childGroups: ["maths"],
                            variableNames: ["value"],
                        },
                    };
                } else {
                    return {
                        text: {
                            dependencyType: "stateVariable",
                            variableName: "text",
                        },
                    };
                }
            },
            definition({ dependencyValues }) {
                if (dependencyValues.mathChild) {
                    return {
                        setValue: {
                            math: dependencyValues.mathChild[0].stateValues
                                .value,
                        },
                    };
                } else {
                    let math;
                    try {
                        math = me.fromAst(
                            textToAst.convert(dependencyValues.text),
                        );
                    } catch (e) {
                        math = me.fromAst("\uff3f");
                    }

                    return { setValue: { math } };
                }
            },
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
                workspace,
            }) {
                if (dependencyValues.mathChild) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "mathChild",
                                desiredValue: desiredStateVariableValues.math,
                                childIndex: 0,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    let result = await preprocessMathInverseDefinition({
                        desiredValue: desiredStateVariableValues.math,
                        stateValues,
                        variableName: "math",
                        workspace,
                    });

                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "text",
                                desiredValue: result.desiredValue.toString(),
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.number = {
            description: "The cell's content interpreted as a number.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                math: {
                    dependencyType: "stateVariable",
                    variableName: "math",
                },
            }),
            definition({ dependencyValues }) {
                let number = dependencyValues.math.evaluate_to_constant();
                return { setValue: { number } };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "math",
                            desiredValue: me.fromAst(
                                desiredStateVariableValues.number,
                            ),
                        },
                    ],
                };
            },
        };

        return stateVariableDefinitions;
    }

    static adapters = ["text", "math", "number"];
}
