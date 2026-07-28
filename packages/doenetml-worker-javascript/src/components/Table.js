import BlockComponent from "./abstract/BlockComponent";
import {
    contentTranslator,
    returnContentLocaleDependencies,
} from "../utils/contentLocale";
import { composeTableName } from "../utils/containerWords";

export default class Table extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "table";

    static componentDocs = {
        summary: "A container element for a `<tabular>`",
    };
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.suppressTableNameInTitle = {
            createComponentOfType: "boolean",
            createStateVariable: "suppressTableNameInTitle",
            defaultValue: false,
            forRenderer: true,
            description:
                "Whether to omit the auto-generated table name from the title.",
        };
        attributes.number = {
            createComponentOfType: "boolean",
            createStateVariable: "number",
            defaultValue: true,
            description: "Whether to display an auto-generated table number.",
            forRenderer: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "titles",
                componentTypes: ["title"],
            },
            {
                group: "inlinesBlocks",
                componentTypes: ["_inline", "_block"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.tableEnumeration = {
            description: "Auto-generated number for this table.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["number"],
            additionalStateVariablesDefined: [
                {
                    variableName: "tableName",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
                    forRenderer: true,
                    description:
                        "The full display name of the table (e.g., 'Table 2').",
                },
                {
                    // The same name with the separator that joins it to an
                    // authored `<title>` — "Table 2: ". Not public and not a
                    // cross-reference label: `tableName` above is what an
                    // author references and what an `<xref>` shows, and
                    // neither wants punctuation. This exists so that the
                    // separator is the catalog's to choose rather than a
                    // literal in the renderer (#1582).
                    variableName: "tableNamePrefix",
                    forRenderer: true,
                },
            ],
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies({ stateValues }) {
                let dependencies = {
                    titleChild: {
                        dependencyType: "child",
                        childGroups: ["titles"],
                    },
                    ...returnContentLocaleDependencies(),
                };

                if (stateValues.number) {
                    dependencies.tableCounter = {
                        dependencyType: "counter",
                        counterName: "sectioning",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                const tableEnumeration =
                    dependencyValues.tableCounter === undefined
                        ? null
                        : String(dependencyValues.tableCounter);

                const { tableName, tableNamePrefix } = composeTableName({
                    t: contentTranslator(dependencyValues),
                    enumeration: tableEnumeration,
                    haveTitleChild: dependencyValues.titleChild.length > 0,
                });

                return {
                    setValue: { tableEnumeration, tableName, tableNamePrefix },
                };
            },
        };

        stateVariableDefinitions.titleChildName = {
            forRenderer: true,
            returnDependencies: () => ({
                titleChild: {
                    dependencyType: "child",
                    childGroups: ["titles"],
                },
            }),
            definition({ dependencyValues }) {
                let titleChildName = null;
                if (dependencyValues.titleChild.length > 0) {
                    titleChildName =
                        dependencyValues.titleChild[0].componentIdx;
                }
                return {
                    setValue: { titleChildName },
                };
            },
        };

        stateVariableDefinitions.title = {
            description: "The table's title.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                titleChild: {
                    dependencyType: "child",
                    childGroups: ["titles"],
                    variableNames: ["text"],
                },
            }),
            definition({ dependencyValues }) {
                let title = null;
                if (dependencyValues.titleChild.length > 0) {
                    title = dependencyValues.titleChild[0].stateValues.text;
                }
                return { setValue: { title } };
            },
        };

        return stateVariableDefinitions;
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
