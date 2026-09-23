import BaseComponent from "./abstract/BaseComponent";
import me from "math-expressions";
import {
    evaluateToNumber,
    preprocessMathInverseDefinition,
    textToAst,
} from "../utils/math";
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

        // Which column of a `<tabular>` this cell sits in, zero-based, so that
        // it can find the `<col>` that applies to it. The row does the
        // counting, because a preceding cell with `colSpan="2"` pushes this
        // one along by two columns and only the row sees the cells in order.
        //
        // Deliberately not `public`. It counts a cell's position among its
        // siblings, which is the column only in a `<tabular>`: inside a
        // `<spreadsheet>` a `<cell colNum="3">` is the third column but still
        // the first among its siblings, so as an author-facing property it
        // would contradict the `colNum` a `<cell>` already publishes.
        stateVariableDefinitions.columnIndex = {
            forRenderer: true,
            returnDependencies: () => ({
                positionAmongCells: {
                    dependencyType: "countAmongSiblings",
                    componentType: "cell",
                },
                cellColumnIndices: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "row",
                    variableName: "cellColumnIndices",
                },
            }),
            definition({ dependencyValues }) {
                const { cellColumnIndices, positionAmongCells } =
                    dependencyValues;
                if (!Array.isArray(cellColumnIndices)) {
                    // Not inside a `<row>` — a cell of a `<column>` or a
                    // `<cellBlock>` in a spreadsheet, where columns are
                    // addressed by `colNum` instead.
                    return { setValue: { columnIndex: null } };
                }
                // `countAmongSiblings` is 1-based.
                const columnIndex =
                    cellColumnIndices[positionAmongCells - 1] ?? null;
                return { setValue: { columnIndex } };
            },
        };

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
            // PreTeXt resolves a cell's alignment in the order cell, row,
            // col, tabular, and so does this chain. The row contributes
            // `authoredHalign` rather than `halign`, because `halign` has
            // already inherited the tabular's value and would otherwise hide
            // the `<col>` behind a `<tabular halign>` the author set.
            returnDependencies: () => ({
                halignAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "halign",
                    variableNames: ["value"],
                },
                parentAuthoredHalign: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "row",
                    variableName: "authoredHalign",
                },
                columnIndex: {
                    dependencyType: "stateVariable",
                    variableName: "columnIndex",
                },
                tabularColumnAttributes: {
                    dependencyType: "ancestor",
                    componentType: "tabular",
                    variableNames: ["columnAttributes"],
                },
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
                }

                if (dependencyValues.parentAuthoredHalign) {
                    return {
                        setValue: {
                            halign: dependencyValues.parentAuthoredHalign,
                        },
                    };
                }

                // A cell that spans columns takes its alignment from the
                // first column it covers, the one its content starts in.
                const columnHalign = columnSettingForCell({
                    dependencyValues,
                    setting: "halign",
                    columnIndex: dependencyValues.columnIndex,
                });
                if (columnHalign) {
                    return { setValue: { halign: columnHalign } };
                }

                if (
                    !usedDefault.tabularHalign &&
                    dependencyValues.tabularHalign
                ) {
                    return {
                        setValue: {
                            halign: dependencyValues.tabularHalign.stateValues
                                .halign,
                        },
                    };
                }

                return { useEssentialOrDefaultValue: { halign: true } };
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
            // A `<row>` has no trailing-edge border of its own, so the chain
            // is cell, col, tabular. Inheriting the column's border down into
            // the cells — rather than drawing it once on the `<colgroup>` —
            // is what lets a single `<cell endBorder="none">` punch a hole in
            // the column's rule, the way PreTeXt's "lower level wins" reading
            // implies. The column consulted is the *last* one the cell spans,
            // because that is where the cell's trailing edge falls.
            returnDependencies: () => ({
                endBorderAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "endBorder",
                    variableNames: ["value"],
                },
                columnIndex: {
                    dependencyType: "stateVariable",
                    variableName: "columnIndex",
                },
                colSpan: {
                    dependencyType: "stateVariable",
                    variableName: "colSpan",
                },
                tabularColumnAttributes: {
                    dependencyType: "ancestor",
                    componentType: "tabular",
                    variableNames: ["columnAttributes"],
                },
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
                }

                const columnEndBorder = columnSettingForCell({
                    dependencyValues,
                    setting: "endBorder",
                    columnIndex: lastColumnIndexOfCell(dependencyValues),
                });
                if (columnEndBorder) {
                    return { setValue: { endBorder: columnEndBorder } };
                }

                if (
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
                }

                return { useEssentialOrDefaultValue: { endBorder: true } };
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
                // A cell holding text the parser cannot evaluate has no
                // numeric value. This is a public state variable of type
                // `number`, which has exactly one spelling for that, and it is
                // `NaN` — the engine's own answer now, and what
                // `evaluateToNumber` also maps the `Complex` arm to. The
                // engine used to say `null` here, which every consumer that
                // does arithmetic on it would have read as `0`.
                let number = evaluateToNumber(dependencyValues.math);
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

/**
 * The value the `<col>` at `columnIndex` contributes for `setting`, or `null`
 * when there is no column to consult (the cell is outside a `<row>`, or its
 * column is past the end of the `<col>` list) or the column left that
 * attribute off.
 *
 * Expects `tabularColumnAttributes` among `dependencyValues`.
 */
function columnSettingForCell({ dependencyValues, setting, columnIndex }) {
    const { tabularColumnAttributes } = dependencyValues;
    if (columnIndex === null || !tabularColumnAttributes) {
        return null;
    }
    const columnAttributes =
        tabularColumnAttributes.stateValues.columnAttributes;
    return columnAttributes?.[columnIndex]?.[setting] ?? null;
}

/**
 * The last column a cell covers: its own column plus one less than its
 * `colSpan`. A cell's trailing edge sits at the right of the *last* column it
 * spans, so that is the `<col>` whose `endBorder` belongs there; the rules of
 * the columns it swallows fall inside the cell, where neither a browser nor
 * PreTeXt draws them. A `colSpan` that is not a whole number greater than one
 * spans a single column, matching what HTML does with the same value.
 */
function lastColumnIndexOfCell({ columnIndex, colSpan }) {
    if (columnIndex === null) {
        return null;
    }
    return Number.isInteger(colSpan) && colSpan > 1
        ? columnIndex + colSpan - 1
        : columnIndex;
}
