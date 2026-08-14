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

/**
 * The marker styles a numbered list (`<ol>`) can use.
 *
 * Kept beside the unnumbered set below so the two stay recognizable as the two
 * halves of one renderer decision: `list.tsx` reads `numbered` to pick which
 * of them applies, and neither half does anything on the other kind of list.
 */
const NUMBERED_MARKER_VALUES = [
    { value: "1", description: "Arabic numerals: 1, 2, 3, …" },
    { value: "a", description: "Lowercase letters: a, b, c, …" },
    { value: "A", description: "Uppercase letters: A, B, C, …" },
    {
        value: "i",
        description: "Lowercase roman numerals: i, ii, iii, …",
    },
    {
        value: "I",
        description: "Uppercase roman numerals: I, II, III, …",
    },
];

/**
 * The marker styles an unnumbered list (`<ul>`) can use — the complete set,
 * unlike the numbered ones above, which is why `<ul>` enforces these.
 */
const UNNUMBERED_MARKER_VALUES = [
    { value: "disc", description: "A filled circle." },
    { value: "circle", description: "A hollow circle." },
    { value: "square", description: "A filled square." },
];

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

        // The numbered markers, since `<ol>` fixes `numbered` to true. `<ul>`
        // overrides this whole declaration with the bullet markers — the two
        // sets do not cross, so a list offering both would offer each tag
        // values that do nothing there.
        //
        // `suggestedValues`, not `validValues`: the markers are distinguished
        // by *case* (`a` vs `A`), so the value cannot be lower-cased, and the
        // renderer matches on the first character only, so decorated forms
        // like `1.` or `a)` work too. Offering the list without enforcing it
        // keeps both of those intact.
        attributes.marker = {
            createComponentOfType: "text",
            createStateVariable: "marker",
            defaultValue: null,
            forRenderer: true,
            suggestedValues: NUMBERED_MARKER_VALUES,
            description:
                "Marker style for the list items: `1`, `a`, `A`, `i`, or `I`. The value is matched on its first character, so a decorated form such as `1.` or `a)` selects the same style. Defaults to a style chosen by the list's nesting level.",
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

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // Replace `<ol>`'s numbered markers with the bullet ones. These are
        // `validValues` where `<ol>`'s are only suggestions, because here the
        // list really is the permitted set: the renderer lower-cases the value
        // and drops anything outside these three, so `none` and the rest of
        // the CSS `list-style-type` vocabulary do nothing. Enforcing turns
        // that into an author-facing diagnostic instead of a marker that
        // silently reverts to the level default. `suggestedValues` has to go
        // with it — the spread inherits `<ol>`'s, and declaring both is a
        // build error.
        const { suggestedValues: _numberedMarkers, ...inheritedMarker } =
            attributes.marker;
        attributes.marker = {
            ...inheritedMarker,
            toLowerCase: true,
            validValues: UNNUMBERED_MARKER_VALUES,
            description:
                "Marker style for the list items: `disc`, `circle`, or `square`. Defaults to a style chosen by the list's nesting level.",
        };

        return attributes;
    }

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
