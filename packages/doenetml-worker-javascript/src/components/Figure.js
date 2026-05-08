import BlockComponent from "./abstract/BlockComponent";

export default class Figure extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "figure";

    static componentDocs = {
        summary: "A figure container holding graphical content with a caption.",
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
            ],
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies({ stateValues }) {
                let dependencies = {};

                if (stateValues.number) {
                    dependencies.figureCounter = {
                        dependencyType: "counter",
                        counterName: "sectioning",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                if (dependencyValues.figureCounter === undefined) {
                    return {
                        setValue: {
                            figureEnumeration: null,
                            figureName: "Figure",
                        },
                    };
                }
                let figureEnumeration = String(dependencyValues.figureCounter);
                let figureName = "Figure " + figureEnumeration;
                return {
                    setValue: { figureEnumeration, figureName },
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
