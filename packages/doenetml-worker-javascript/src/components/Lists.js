import BlockComponent from "./abstract/BlockComponent";
import BaseComponent from "./abstract/BaseComponent";
import { textFromChildren } from "../utils/text";
import {
    returnScoredSectionAttributes,
    returnScoredSectionStateVariableDefinition,
    submitAllAnswers,
} from "../utils/scoredSection";
import {
    childRendersSomething,
    listItemChildVisibilityDependency,
    listItemNumberAlignmentForLead,
} from "../utils/listItemChild";

export class Ol extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            submitAllAnswers: this.submitAllAnswers.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "ol";

    static componentDocs = {
        summary: "An ordered list",
    };
    static rendererType = "list";
    static renderChildren = true;
    static canDisplayChildErrors = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        // Accepted for backward compatibility but not yet rendered, so hidden
        // from the schema (docs tables and editor autocomplete).
        attributes.label = {
            description: "Label rendered before each list item.",
            createComponentOfType: "text",
            createStateVariable: "label",
            defaultValue: null,
            public: true,
            forRenderer: true,
            excludeFromSchema: true,
        };

        attributes.level = {
            createComponentOfType: "integer",
            description: "Nesting level of this list (1-based).",
        };

        attributes.marker = {
            createComponentOfType: "text",
            createStateVariable: "marker",
            defaultValue: null,
            forRenderer: true,
            description:
                "Marker style for list items (e.g. 'disc', 'circle', '1', 'a').",
        };

        let scoredSectionAttributes = returnScoredSectionAttributes();
        Object.assign(attributes, scoredSectionAttributes);

        // Accepted for backward compatibility but currently ignored, so hidden
        // from the schema (docs tables and editor autocomplete).
        attributes.cols = {
            createComponentOfType: "number",
            description:
                "Number of columns to lay items out in (currently ignored).",
            excludeFromSchema: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "lis",
                componentTypes: ["li"],
            },
            {
                group: "errors",
                componentTypes: ["_error"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnScoredSectionStateVariableDefinition(),
        );

        stateVariableDefinitions.numbered = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numbered: true } }),
        };

        stateVariableDefinitions.level = {
            forRenderer: true,
            returnDependencies: () => ({
                ancestorLevel: {
                    dependencyType: "ancestor",
                    componentType: "ol",
                    variableNames: ["level"],
                },
                levelAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "level",
                    variableNames: ["value"],
                },
                sectionAncestorIsListItem: {
                    dependencyType: "ancestor",
                    componentType: "_sectioningComponent",
                    variableNames: ["isListItem"],
                },
            }),
            definition({ dependencyValues }) {
                let level = dependencyValues.levelAttr?.stateValues.value;

                if (!(level > 0)) {
                    let ancestorLevel =
                        dependencyValues.ancestorLevel?.stateValues.level;
                    if (
                        !(ancestorLevel > 0) &&
                        dependencyValues.sectionAncestorIsListItem?.stateValues
                            .isListItem
                    ) {
                        level = 2;
                    } else {
                        level = (ancestorLevel || 0) + 1;
                    }
                }

                return { setValue: { level } };
            },
        };

        return stateVariableDefinitions;
    }

    async submitAllAnswers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return submitAllAnswers({
            component: this,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
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

export class Ul extends Ol {
    static componentType = "ul";

    static componentDocs = {
        summary: "An unordered list",
    };
    static rendererType = "list";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numbered = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numbered: false } }),
        };

        return stateVariableDefinitions;
    }
}

export class Li extends BaseComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            submitAllAnswers: this.submitAllAnswers.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "li";

    static componentDocs = {
        summary: "A list item within `<ol>` / `<ul>`",
    };
    static rendererType = "list";
    static renderChildren = true;
    static canDisplayChildErrors = true;

    static inSchemaOnlyInheritAs = [];

    static includeBlankStringChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        let scoredSectionAttributes = returnScoredSectionAttributes();
        Object.assign(attributes, scoredSectionAttributes);
        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnScoredSectionStateVariableDefinition(),
        );

        stateVariableDefinitions.item = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { item: true } }),
        };

        stateVariableDefinitions.childrenToRenderInlineForListItem = {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    ...listItemChildVisibilityDependency(),
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                // Every real `<li>` is unconditionally "a list item" — unlike
                // `<problem asList>` (SectioningComponent's
                // `nonBoxedListItemWithoutTitle` gate) or a wrapper component
                // (whose forwarding is gated on being selected by its own
                // parent), there is no parent-selection concept here: an
                // `<li>`'s first visible child always gets the signal, which
                // suppresses its top margin. Which child leads also decides
                // whether the item asks the browser to draw the native marker
                // beside the top of that child's box rather than on its
                // baseline — see `firstChildListItemAlignment` below.
                //
                // A child that hides itself is skipped, so a leading `<p hide>`
                // does not strand the child after it — that is what the
                // visibility dependency spread above lets
                // `childRendersSomething` see. Only the child's own `hide`
                // counts, so hiding the `<ol>` around this item changes nothing.
                const firstVisibleChild = dependencyValues.children.find(
                    (child) =>
                        childRendersSomething(child, componentInfoObjects),
                );

                return {
                    setValue: {
                        childrenToRenderInlineForListItem:
                            firstVisibleChild &&
                            typeof firstVisibleChild === "object"
                                ? [firstVisibleChild]
                                : [],
                    },
                };
            },
        };

        /**
         * How the item's number should line up with its leading child —
         * {@link listItemNumberAlignmentForLead}, the same mapping of the same
         * `listItemInlineAlignment` that a `<problem>`-style list item goes
         * through — or `"none"` when no component child leads the item (a string
         * does, or nothing does).
         */
        stateVariableDefinitions.firstChildListItemAlignment = {
            forRenderer: true,
            stateVariablesDeterminingDependencies: [
                "childrenToRenderInlineForListItem",
            ],
            returnDependencies: ({ stateValues }) => {
                const leadingChild =
                    stateValues.childrenToRenderInlineForListItem?.[0];

                if (leadingChild?.componentIdx === undefined) {
                    return {};
                }

                return {
                    leadingChildListItemInlineAlignment: {
                        dependencyType: "stateVariable",
                        componentIdx: leadingChild.componentIdx,
                        variableName: "listItemInlineAlignment",
                        variablesOptional: true,
                    },
                };
            },
            definition({ dependencyValues }) {
                if (
                    !("leadingChildListItemInlineAlignment" in dependencyValues)
                ) {
                    // No component child leads the item, so there is nothing to
                    // read an alignment off: a string leads it, or nothing does.
                    return {
                        setValue: { firstChildListItemAlignment: "none" },
                    };
                }

                return {
                    setValue: {
                        firstChildListItemAlignment:
                            listItemNumberAlignmentForLead(
                                dependencyValues.leadingChildListItemInlineAlignment,
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.text = {
            description: "The list's content rendered as plain text.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let text = textFromChildren(dependencyValues.children);

                return { setValue: { text } };
            },
        };

        return stateVariableDefinitions;
    }

    async submitAllAnswers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return submitAllAnswers({
            component: this,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
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
