import BlockComponent from "./abstract/BlockComponent";
import {
    contentTranslator,
    returnContentLocaleDependencies,
} from "../utils/contentLocale";
import { composeFigureName } from "../utils/containerWords";
import { returnPassThroughListItemChildStateVariableDefinitions } from "../utils/listItemChild";

export default class Figure extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "figure";

    static componentDocs = {
        summary: "A figure container holding graphical content with a caption",
    };
    static renderChildren = true;
    static canDisplayChildErrors = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.suppressFigureNameInCaption = {
            createComponentOfType: "boolean",
            createStateVariable: "suppressFigureNameInCaption",
            defaultValue: false,
            forRenderer: true,
            description:
                "Whether to omit the auto-generated figure name from the caption.",
        };
        attributes.number = {
            createComponentOfType: "boolean",
            createStateVariable: "number",
            defaultValue: true,
            description: "Whether to display an auto-generated figure number.",
            forRenderer: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "captions",
                componentTypes: ["caption"],
            },
            {
                group: "inlinesBlocks",
                componentTypes: ["_inline", "_block"],
            },
            {
                group: "errors",
                componentTypes: ["_error"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // A figure leading a list item hands the item's number the alignment of
        // the content it holds — a graph or an image asks for the number beside
        // the top of its box — and passes the item's top-margin suppression on to
        // that content, so the number and the figure start on the same row.
        Object.assign(
            stateVariableDefinitions,
            returnPassThroughListItemChildStateVariableDefinitions(),
        );

        stateVariableDefinitions.figureEnumeration = {
            description: "Auto-generated number for this figure.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["number"],
            additionalStateVariablesDefined: [
                {
                    variableName: "figureName",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
                    forRenderer: true,
                    description:
                        "The full display name of the figure (e.g., 'Figure 3').",
                },
                {
                    // The name with the separator joining it to an authored
                    // `<caption>` — "Figure 3: ". See `tableNamePrefix` in
                    // `Table.js`; same reason, same shape (#1582).
                    variableName: "figureNamePrefix",
                    forRenderer: true,
                },
            ],
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies({ stateValues }) {
                let dependencies = {
                    captionChild: {
                        dependencyType: "child",
                        childGroups: ["captions"],
                    },
                    ...returnContentLocaleDependencies(),
                };

                if (stateValues.number) {
                    dependencies.figureCounter = {
                        dependencyType: "counter",
                        counterName: "sectioning",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                const figureEnumeration =
                    dependencyValues.figureCounter === undefined
                        ? null
                        : String(dependencyValues.figureCounter);

                const { figureName, figureNamePrefix } = composeFigureName({
                    t: contentTranslator(dependencyValues),
                    enumeration: figureEnumeration,
                    haveCaptionChild: dependencyValues.captionChild.length > 0,
                });

                return {
                    setValue: {
                        figureEnumeration,
                        figureName,
                        figureNamePrefix,
                    },
                };
            },
        };

        stateVariableDefinitions.captionChildName = {
            forRenderer: true,
            returnDependencies: () => ({
                captionChild: {
                    dependencyType: "child",
                    childGroups: ["captions"],
                },
            }),
            definition({ dependencyValues }) {
                let captionChildName = null;
                if (dependencyValues.captionChild.length > 0) {
                    captionChildName =
                        dependencyValues.captionChild[0].componentIdx;
                }
                return {
                    setValue: { captionChildName },
                };
            },
        };

        stateVariableDefinitions.caption = {
            description: "The figure's caption text.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                captionChild: {
                    dependencyType: "child",
                    childGroups: ["captions"],
                    variableNames: ["text"],
                },
            }),
            definition({ dependencyValues }) {
                let caption = null;

                if (dependencyValues.captionChild.length > 0) {
                    caption = dependencyValues.captionChild[0].stateValues.text;
                }
                return { setValue: { caption } };
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
