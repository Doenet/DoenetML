import BaseComponent from "./abstract/BaseComponent";

export default class CellBlock extends BaseComponent {
    static componentType = "cellBlock";
    static rendererType = undefined;

    static componentDocs = {
        summary:
            "A block of cells, rows, and columns inside a <table> with a starting row/column.",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.rowNum = {
            createComponentOfType: "text",
            createStateVariable: "rowNum",
            defaultValue: null,
            public: true,
            description:
                "Row number where this block starts (1-based; can be a letter or number).",
        };
        attributes.colNum = {
            createComponentOfType: "text",
            createStateVariable: "colNum",
            defaultValue: null,
            public: true,
            description:
                "Column number where this block starts (1-based; can be a letter or number).",
        };
        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "children",
                componentTypes: ["cell", "row", "column", "cellBlock"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.prescribedCellsRowsColumnsBlocks = {
            returnDependencies: () => ({
                cellRelatedChildren: {
                    dependencyType: "child",
                    childGroups: ["children"],
                    variableNames: [
                        "rowNum",
                        "colNum",
                        "prescribedCellsWithColNum",
                        "prescribedCellsWithRowNum",
                        "prescribedCellsRowsColumnsBlocks",
                    ],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        prescribedCellsRowsColumnsBlocks:
                            dependencyValues.cellRelatedChildren,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
