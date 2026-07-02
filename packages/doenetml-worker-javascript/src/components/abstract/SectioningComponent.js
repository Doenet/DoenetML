import BlockComponent from "./BlockComponent";
import {
    determineVariantsForSection,
    getVariantsForDescendantsForUniqueVariants,
    setUpVariantSeedAndRng,
} from "../../utils/variants";
import { returnStyleDefinitionStateVariables } from "@doenet/utils";
import { returnFeedbackDefinitionStateVariables } from "../../utils/feedback";
import {
    returnScoredSectionAttributes,
    returnScoredSectionStateVariableDefinition,
    submitAllAnswers,
} from "../../utils/scoredSection";
import {
    addChildrenToDynamicChild,
    deleteChildrenFromDynamicChild,
} from "../../utils/dynamicChildren";
import {
    CANVAS_DARK_MODE_COLOR,
    CANVAS_LIGHT_MODE_COLOR,
    sectionTitleStateKeys,
    titleStateKeyFromCredit,
    resolveSectionTitleLightColorSpec,
    resolveSectionTitleDarkColorSpec,
    shouldEmitSectionTitleColorDiagnostic,
    addSectionTitleColorContrastDiagnostic,
} from "../../utils/sectionTitleColors";

export class SectioningComponent extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            submitAllAnswers: this.submitAllAnswers.bind(this),
            revealSection: this.revealSection.bind(this),
            closeSection: this.closeSection.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
            addChildren: this.addChildren.bind(this),
            deleteChildren: this.deleteChildren.bind(this),
        });
    }

    static componentType = "_sectioningComponent";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static includeBlankStringChildren = true;

    static createsVariants = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        let scoredSectionAttributes = returnScoredSectionAttributes();
        Object.assign(attributes, scoredSectionAttributes);

        attributes.boxed = {
            createComponentOfType: "boolean",
            createStateVariable: "boxedPreliminary",
            defaultValue: false,
            description:
                "Whether to render this section with a visible box around it.",
        };

        attributes.includeAutoName = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoName",
            defaultValue: false,
            public: true,
            description:
                'Whether to include the auto-generated section name (e.g. "Section") in the rendered title.',
        };

        attributes.includeAutoNumber = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoNumber",
            defaultValue: false,
            public: true,
            description:
                "Whether to include the auto-generated section number in the rendered title.",
        };

        attributes.noAutoTitle = {
            createComponentOfType: "boolean",
            createStateVariable: "noAutoTitle",
            defaultValue: false,
            public: true,
            description:
                "Whether to suppress the auto-generated title entirely.",
        };

        attributes.includeAutoNameIfNoTitle = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoNameIfNoTitle",
            defaultValue: true,
            public: true,
            description:
                "Whether to include the auto-generated name when no explicit title is provided.",
        };

        attributes.includeAutoNumberIfNoTitle = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoNumberIfNoTitle",
            defaultValue: true,
            public: true,
            description:
                "Whether to include the auto-generated number when no explicit title is provided.",
        };

        attributes.asList = {
            createComponentOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: false,
            public: true,
            forRenderer: true,
            description: "Whether to render this section's children as a list.",
        };

        attributes.collapsible = {
            createComponentOfType: "boolean",
            createStateVariable: "collapsible",
            defaultValue: false,
            public: true,
            forRenderer: true,
            description: "Whether the section can be collapsed and expanded.",
        };

        attributes.startOpen = {
            createComponentOfType: "boolean",
            createStateVariable: "startOpen",
            defaultValue: true,
            description:
                "Whether the collapsible section starts in the open state.",
        };

        attributes.level = {
            createComponentOfType: "integer",
            description:
                "The heading level for this section (overrides the default level inferred from nesting).",
        };

        attributes.renameTo = {
            createComponentOfType: "text",
            description:
                'Override the auto-generated section name (e.g. rename "Section" to a custom label).',
        };

        attributes.completedColor = {
            createComponentOfType: "text",
            createStateVariable: "completedColor",
            defaultValue: "var(--lightGreen)",
            description:
                "Color used to indicate this section has been completed.",
        };

        attributes.inProgressColor = {
            createComponentOfType: "text",
            createStateVariable: "inProgressColor",
            defaultValue: "var(--mainGray)",
            description: "Color used to indicate this section is in progress.",
        };

        attributes.notStartedColor = {
            createComponentOfType: "text",
            createStateVariable: "notStartedColor",
            defaultValue: "var(--mainGray)",
            description:
                "Color used to indicate this section has not been started.",
        };

        attributes.completedColorDarkMode = {
            createComponentOfType: "text",
            createStateVariable: "completedColorDarkMode",
            // Dark green; white text contrast ≈ 7.9:1 (passes WCAG AA and AAA).
            defaultValue: "#1a5e20",
            description:
                "Color used to indicate this section has been completed (dark mode). " +
                "If omitted, the dark-mode color is derived from `completedColor` when " +
                "that attribute is explicitly set; otherwise falls back to a dark green " +
                "that meets WCAG AA contrast for white text.",
        };

        attributes.inProgressColorDarkMode = {
            createComponentOfType: "text",
            createStateVariable: "inProgressColorDarkMode",
            // Dark gray; white text contrast ≈ 11.4:1 (passes WCAG AA and AAA).
            defaultValue: "#3a3a3a",
            description:
                "Color used to indicate this section is in progress (dark mode). " +
                "If omitted, the dark-mode color is derived from `inProgressColor` when " +
                "that attribute is explicitly set; otherwise falls back to a dark gray " +
                "that meets WCAG AA contrast for white text.",
        };

        attributes.notStartedColorDarkMode = {
            createComponentOfType: "text",
            createStateVariable: "notStartedColorDarkMode",
            // Dark gray; white text contrast ≈ 11.4:1 (passes WCAG AA and AAA).
            defaultValue: "#3a3a3a",
            description:
                "Color used to indicate this section has not been started (dark mode). " +
                "If omitted, the dark-mode color is derived from `notStartedColor` when " +
                "that attribute is explicitly set; otherwise falls back to a dark gray " +
                "that meets WCAG AA contrast for white text.",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "variantControls",
                componentTypes: ["variantControl"],
            },
            {
                group: "titles",
                componentTypes: ["title"],
            },
            {
                group: "setups",
                componentTypes: ["setup"],
            },
            {
                group: "styleDefinitions",
                componentTypes: ["styleDefinition"],
            },
            {
                group: "feedbackDefinitions",
                componentTypes: ["feedbackDefinition"],
            },
            {
                group: "cascadeMessages",
                componentTypes: ["cascadeMessage"],
            },
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let componentClass = this;

        // Note: style definition state variables allow one to redefine the style
        // via styledefinitions inside a setup in the section
        let styleDefinitionStateVariables =
            returnStyleDefinitionStateVariables();
        Object.assign(stateVariableDefinitions, styleDefinitionStateVariables);

        let feedbackDefinitionStateVariables =
            returnFeedbackDefinitionStateVariables();
        Object.assign(
            stateVariableDefinitions,
            feedbackDefinitionStateVariables,
        );

        Object.assign(
            stateVariableDefinitions,
            returnScoredSectionStateVariableDefinition(),
        );

        // For most components, isListItem will be set to always be true for `<task>` and `<part>`.
        stateVariableDefinitions.isListItem = {
            forRenderer: true,
            returnDependencies: () => ({
                parentAsList: {
                    dependencyType: "parentStateVariable",
                    variableName: "asList",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        isListItem: Boolean(dependencyValues.parentAsList),
                    },
                };
            },
        };

        stateVariableDefinitions.boxed = {
            description:
                "Whether this section is rendered with a visible box around it.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                boxedPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "boxedPreliminary",
                },
                parentBoxAll: {
                    dependencyType: "parentStateVariable",
                    variableName: "boxAll",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let boxed = dependencyValues.boxedPreliminary;
                if (
                    usedDefault.boxedPreliminary &&
                    typeof dependencyValues.parentBoxAll === "boolean" &&
                    !usedDefault.parentBoxAll
                ) {
                    boxed = dependencyValues.parentBoxAll;
                }
                return { setValue: { boxed } };
            },
        };

        stateVariableDefinitions.enumeration = {
            stateVariablesDeterminingDependencies: ["isListItem"],
            additionalStateVariablesDefined: [
                {
                    variableName: "sectionNumber",
                    description: "The displayed number for this section.",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
                    forRenderer: true,
                },
            ],
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies: ({ stateValues }) => {
                let dependencies = {
                    isListItem: {
                        dependencyType: "stateVariable",
                        variableName: "isListItem",
                    },
                };

                if (stateValues.isListItem) {
                    dependencies.countAmongSiblings = {
                        dependencyType: "countAmongSiblings",
                        componentType: "_sectioningComponent",
                        includeInheritedComponentTypes: true,
                    };
                } else {
                    dependencies.sectioningCounter = {
                        dependencyType: "counter",
                        counterName: "sectioning",
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                if (dependencyValues.isListItem) {
                    let sectionNumber = dependencyValues.countAmongSiblings;
                    let enumeration = [sectionNumber];
                    return { setValue: { enumeration, sectionNumber } };
                } else {
                    let sectionNumber = String(
                        dependencyValues.sectioningCounter,
                    );
                    return {
                        setValue: {
                            enumeration: [sectionNumber],
                            sectionNumber,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.sectionName = {
            returnDependencies: () => ({
                renameToAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "renameTo",
                    variableNames: ["value"],
                },
            }),
            definition: ({ dependencyValues }) => {
                if (dependencyValues.renameToAttr) {
                    return {
                        setValue: {
                            sectionName:
                                dependencyValues.renameToAttr.stateValues.value,
                        },
                    };
                } else {
                    return { setValue: { sectionName: componentClass.name } };
                }
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
                        dependencyValues.titleChild[
                            dependencyValues.titleChild.length - 1
                        ].componentIdx;
                }
                return {
                    setValue: { titleChildName },
                };
            },
        };

        stateVariableDefinitions.hideChildren = {
            returnDependencies: () => ({
                parentChildrenToHideChildren: {
                    dependencyType: "parentStateVariable",
                    variableName: "childrenToHideChildren",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let hideChildren = Boolean(
                    dependencyValues.parentChildrenToHideChildren?.includes(
                        componentIdx,
                    ),
                );

                return { setValue: { hideChildren } };
            },
        };

        stateVariableDefinitions.childIndicesToRender = {
            additionalStateVariablesDefined: ["firstVisibleChild"],
            returnDependencies: () => ({
                titleChildren: {
                    dependencyType: "child",
                    childGroups: ["titles"],
                },
                allChildren: {
                    dependencyType: "child",
                    childGroups: [
                        "anything",
                        "variantControls",
                        "titles",
                        "setups",
                        "cascadeMessages",
                    ],
                },
                titleChildName: {
                    dependencyType: "stateVariable",
                    variableName: "titleChildName",
                },
                asList: {
                    dependencyType: "stateVariable",
                    variableName: "asList",
                },
                hideChildren: {
                    dependencyType: "stateVariable",
                    variableName: "hideChildren",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const childIndicesToRender = [];
                // Tracks first non-hidden rendered child (including non-blank strings)
                // so list-item sections can delegate alignment behavior to that child.
                let firstVisibleChild = null;

                let allTitleChildNames = dependencyValues.titleChildren.map(
                    (x) => x.componentIdx,
                );

                for (let [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    // If `hideChildren` is set, string children should also be hidden.
                    // However, string children cannot be hidden via the `childrenToHide`
                    // state variable as it is based on component indices.
                    // Instead, we remove strings from `childIndicesToRender`
                    if (
                        dependencyValues.hideChildren &&
                        typeof child === "string"
                    ) {
                        continue;
                    }

                    if (dependencyValues.asList) {
                        // if asList, then only include titleChild, sections, introduction, and conclusion
                        if (
                            child.componentIdx ===
                                dependencyValues.titleChildName ||
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: child.componentType,
                                baseComponentType: "_sectioningComponent",
                            }) ||
                            ["introduction", "conclusion"].includes(
                                child.componentType,
                            )
                        ) {
                            childIndicesToRender.push(ind);
                            if (
                                firstVisibleChild === null &&
                                !dependencyValues.hideChildren
                            ) {
                                firstVisibleChild = child;
                            }
                        }
                    } else if (
                        typeof child !== "object" ||
                        !allTitleChildNames.includes(child.componentIdx) ||
                        child.componentIdx === dependencyValues.titleChildName
                    ) {
                        childIndicesToRender.push(ind);
                        if (
                            firstVisibleChild === null &&
                            !dependencyValues.hideChildren &&
                            (typeof child === "object" || child.trim() !== "")
                        ) {
                            firstVisibleChild = child;
                        }
                    }
                }

                return {
                    setValue: { childIndicesToRender, firstVisibleChild },
                };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.childrenToHide = {
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    childGroups: [
                        "anything",
                        "variantControls",
                        "titles",
                        "setups",
                        "cascadeMessages",
                    ],
                },
                titleChildName: {
                    dependencyType: "stateVariable",
                    variableName: "titleChildName",
                },
                hideChildren: {
                    dependencyType: "stateVariable",
                    variableName: "hideChildren",
                },
            }),
            definition({ dependencyValues }) {
                const childrenToHide = [];

                for (let child of dependencyValues.allChildren) {
                    if (child.componentType === "cascadeMessage") {
                        // For <cascadeMessage>, the logic is inverted.
                        // It is hidden when `hideChildren` is `false`!
                        if (
                            !dependencyValues.hideChildren &&
                            typeof child === "object"
                        ) {
                            childrenToHide.push(child.componentIdx);
                        }
                    } else if (
                        dependencyValues.hideChildren &&
                        typeof child === "object" &&
                        child.componentIdx !==
                            dependencyValues.titleChildName &&
                        child.componentType !== "cascadeMessage"
                    ) {
                        childrenToHide.push(child.componentIdx);
                    }
                }

                return { setValue: { childrenToHide } };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.nonBoxedListItemWithoutTitle = {
            returnDependencies: () => ({
                isListItem: {
                    dependencyType: "stateVariable",
                    variableName: "isListItem",
                },
                boxed: {
                    dependencyType: "stateVariable",
                    variableName: "boxed",
                },
                titleChildName: {
                    dependencyType: "stateVariable",
                    variableName: "titleChildName",
                },
                collapsible: {
                    dependencyType: "stateVariable",
                    variableName: "collapsible",
                },
            }),
            definition({ dependencyValues }) {
                // This is the only section mode that performs first-child list-item
                // alignment delegation on the root section container.
                const nonBoxedListItemWithoutTitle = Boolean(
                    dependencyValues.isListItem &&
                    !dependencyValues.boxed &&
                    !dependencyValues.collapsible &&
                    dependencyValues.titleChildName === null,
                );

                return { setValue: { nonBoxedListItemWithoutTitle } };
            },
        };

        stateVariableDefinitions.childrenToRenderInlineForListItem = {
            returnDependencies: () => ({
                firstVisibleChild: {
                    dependencyType: "stateVariable",
                    variableName: "firstVisibleChild",
                },
                nonBoxedListItemWithoutTitle: {
                    dependencyType: "stateVariable",
                    variableName: "nonBoxedListItemWithoutTitle",
                },
            }),
            definition({ dependencyValues }) {
                // Delegate list-item inline rendering to the first visible child only.
                let childrenToRenderInlineForListItem = [];
                if (
                    dependencyValues.nonBoxedListItemWithoutTitle &&
                    dependencyValues.firstVisibleChild &&
                    typeof dependencyValues.firstVisibleChild === "object"
                ) {
                    childrenToRenderInlineForListItem = [
                        dependencyValues.firstVisibleChild,
                    ];
                }
                return { setValue: { childrenToRenderInlineForListItem } };
            },
        };

        stateVariableDefinitions.firstVisibleChildAdjustedForListItem = {
            forRenderer: true,
            returnDependencies: () => ({
                nonBoxedListItemWithoutTitle: {
                    dependencyType: "stateVariable",
                    variableName: "nonBoxedListItemWithoutTitle",
                },
                firstVisibleChild: {
                    dependencyType: "stateVariable",
                    variableName: "firstVisibleChild",
                },
            }),
            definition({ dependencyValues }) {
                // Alignment adjustments only apply when the first visible child
                // is a component object (not plain text).
                const firstVisibleChildAdjustedForListItem = Boolean(
                    dependencyValues.nonBoxedListItemWithoutTitle &&
                    typeof dependencyValues.firstVisibleChild === "object",
                );

                return {
                    setValue: {
                        firstVisibleChildAdjustedForListItem,
                    },
                };
            },
        };

        stateVariableDefinitions.firstChildListItemAlignment = {
            stateVariablesDeterminingDependencies: ["firstVisibleChild"],
            forRenderer: true,
            returnDependencies: ({ stateValues }) => {
                const dependencies = {
                    firstVisibleChildAdjustedForListItem: {
                        dependencyType: "stateVariable",
                        variableName: "firstVisibleChildAdjustedForListItem",
                    },
                };

                if (stateValues.firstVisibleChild?.componentIdx !== undefined) {
                    dependencies.firstVisibleChildListItemInlineAlignment = {
                        dependencyType: "stateVariable",
                        componentIdx:
                            stateValues.firstVisibleChild.componentIdx,
                        variableName: "listItemInlineAlignment",
                        variablesOptional: true,
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                // Baseline is a safe fallback if the first child does not expose
                // an explicit list-item alignment signal.
                let firstChildListItemAlignment = "none";

                if (dependencyValues.firstVisibleChildAdjustedForListItem) {
                    const alignmentFromFirstChild =
                        dependencyValues.firstVisibleChildListItemInlineAlignment;

                    if (
                        alignmentFromFirstChild === "baseline" ||
                        alignmentFromFirstChild === "flex-start"
                    ) {
                        firstChildListItemAlignment = alignmentFromFirstChild;
                    } else {
                        firstChildListItemAlignment = "baseline";
                    }
                }

                return { setValue: { firstChildListItemAlignment } };
            },
        };

        // Determine if the rendered children start with an `<introduction>`
        // or end with a `<conclusion>`.
        // Currently, this is only need if `asList` is set,
        // in which case the starting `<introduction>` or ending `<conclusion>`
        // are rendered outside of the list.
        stateVariableDefinitions.startsWithIntroduction = {
            additionalStateVariablesDefined: [
                { variableName: "endsWithConclusion", forRenderer: true },
            ],
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    childGroups: [
                        "anything",
                        "variantControls",
                        "titles",
                        "setups",
                        "cascadeMessages",
                    ],
                },
                asList: {
                    dependencyType: "stateVariable",
                    variableName: "asList",
                },
                childIndicesToRender: {
                    dependencyType: "stateVariable",
                    variableName: "childIndicesToRender",
                },
            }),
            definition({ dependencyValues }) {
                const childIndices = dependencyValues.childIndicesToRender;

                const renderedNonTitleBlankStringChildren = childIndices
                    .map((idx) => dependencyValues.allChildren[idx])
                    .filter((child) => {
                        if (typeof child === "string") {
                            return child.trim() !== "";
                        }
                        return child.componentType !== "title";
                    });

                const startsWithIntroduction =
                    renderedNonTitleBlankStringChildren[0]?.componentType ===
                    "introduction";

                const lastRenderedChild =
                    renderedNonTitleBlankStringChildren[
                        renderedNonTitleBlankStringChildren.length - 1
                    ];

                const endsWithConclusion =
                    lastRenderedChild?.componentType === "conclusion";

                return {
                    setValue: { startsWithIntroduction, endsWithConclusion },
                };
            },
        };

        stateVariableDefinitions.title = {
            description: "The displayed title text for this section.",
            additionalStateVariablesDefined: [
                {
                    variableName: "titlePrefix",
                    forRenderer: true,
                    alwaysUpdateRenderer: true,
                },
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            alwaysUpdateRenderer: true,
            returnDependencies: ({ sharedParameters }) => ({
                titleChild: {
                    dependencyType: "child",
                    childGroups: ["titles"],
                    variableNames: ["text"],
                },
                sectionName: {
                    dependencyType: "stateVariable",
                    variableName: "sectionName",
                },
                sectionNumber: {
                    dependencyType: "stateVariable",
                    variableName: "sectionNumber",
                },
                includeAutoName: {
                    dependencyType: "stateVariable",
                    variableName: "includeAutoName",
                },
                includeAutoNumber: {
                    dependencyType: "stateVariable",
                    variableName: "includeAutoNumber",
                },
                prerender: {
                    dependencyType: "value",
                    value: sharedParameters.prerender,
                },
                includeAutoNameIfNoTitle: {
                    dependencyType: "stateVariable",
                    variableName: "includeAutoNameIfNoTitle",
                },
                includeAutoNumberIfNoTitle: {
                    dependencyType: "stateVariable",
                    variableName: "includeAutoNumberIfNoTitle",
                },
                noAutoTitle: {
                    dependencyType: "stateVariable",
                    variableName: "noAutoTitle",
                },
            }),
            definition({ dependencyValues }) {
                let titlePrefix = "";
                let title = "";

                const haveTitleChild = dependencyValues.titleChild.length > 0;

                let includeAutoNumber =
                    (dependencyValues.includeAutoNumber ||
                        (!haveTitleChild &&
                            dependencyValues.includeAutoNumberIfNoTitle &&
                            !dependencyValues.noAutoTitle)) &&
                    !dependencyValues.prerender;

                let includeAutoName =
                    dependencyValues.includeAutoName ||
                    (!haveTitleChild &&
                        dependencyValues.includeAutoNameIfNoTitle &&
                        !dependencyValues.noAutoTitle);

                if (includeAutoNumber) {
                    if (includeAutoName) {
                        titlePrefix = dependencyValues.sectionName + " ";
                    }
                    titlePrefix += dependencyValues.sectionNumber;
                } else {
                    if (includeAutoName) {
                        titlePrefix = dependencyValues.sectionName;
                    }
                }

                if (!haveTitleChild) {
                    title = titlePrefix;
                } else {
                    if (titlePrefix) {
                        if (dependencyValues.includeAutoName) {
                            titlePrefix += ": ";
                        } else {
                            titlePrefix += ". ";
                        }
                    }

                    title =
                        dependencyValues.titleChild[
                            dependencyValues.titleChild.length - 1
                        ].stateValues.text;
                }

                return { setValue: { title, titlePrefix } };
            },
        };

        stateVariableDefinitions.sectionTitleStateColors = {
            additionalStateVariablesDefined: [
                "sectionTitleStateColorsDarkMode",
                "sectionTitleStateColorSources",
                "sectionTitleStateColorSourcesDarkMode",
            ],
            returnDependencies: () => ({
                completedColor: {
                    dependencyType: "stateVariable",
                    variableName: "completedColor",
                },
                inProgressColor: {
                    dependencyType: "stateVariable",
                    variableName: "inProgressColor",
                },
                notStartedColor: {
                    dependencyType: "stateVariable",
                    variableName: "notStartedColor",
                },
                completedColorDarkMode: {
                    dependencyType: "stateVariable",
                    variableName: "completedColorDarkMode",
                },
                inProgressColorDarkMode: {
                    dependencyType: "stateVariable",
                    variableName: "inProgressColorDarkMode",
                },
                notStartedColorDarkMode: {
                    dependencyType: "stateVariable",
                    variableName: "notStartedColorDarkMode",
                },
                parentSectionTitleStateColors: {
                    dependencyType: "parentStateVariable",
                    variableName: "sectionTitleStateColors",
                },
                parentSectionTitleStateColorsDarkMode: {
                    dependencyType: "parentStateVariable",
                    variableName: "sectionTitleStateColorsDarkMode",
                },
                parentSectionTitleStateColorSources: {
                    dependencyType: "parentStateVariable",
                    variableName: "sectionTitleStateColorSources",
                },
                parentSectionTitleStateColorSourcesDarkMode: {
                    dependencyType: "parentStateVariable",
                    variableName: "sectionTitleStateColorSourcesDarkMode",
                },
                parentBoxed: {
                    dependencyType: "parentStateVariable",
                    variableName: "boxed",
                },
                parentCollapsible: {
                    dependencyType: "parentStateVariable",
                    variableName: "collapsible",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                const sectionTitleStateColors = {};
                const sectionTitleStateColorsDarkMode = {};
                const sectionTitleStateColorSources = {};
                const sectionTitleStateColorSourcesDarkMode = {};
                const parentIsBoxedOrCollapsible = Boolean(
                    dependencyValues.parentBoxed ||
                    dependencyValues.parentCollapsible,
                );

                const colorNamesByState = {
                    completed: {
                        light: "completedColor",
                        dark: "completedColorDarkMode",
                    },
                    inProgress: {
                        light: "inProgressColor",
                        dark: "inProgressColorDarkMode",
                    },
                    notStarted: {
                        light: "notStartedColor",
                        dark: "notStartedColorDarkMode",
                    },
                };

                for (const stateKey of sectionTitleStateKeys) {
                    const colorNames = colorNamesByState[stateKey];
                    const lightSpec = resolveSectionTitleLightColorSpec({
                        dependencyValues,
                        usedDefault,
                        ownColorName: colorNames.light,
                        parentColors:
                            dependencyValues.parentSectionTitleStateColors,
                        parentSources:
                            dependencyValues.parentSectionTitleStateColorSources,
                        parentIsBoxedOrCollapsible,
                        stateKey,
                    });
                    sectionTitleStateColors[stateKey] = lightSpec.value;
                    sectionTitleStateColorSources[stateKey] = lightSpec.source;

                    const darkSpec = resolveSectionTitleDarkColorSpec({
                        dependencyValues,
                        usedDefault,
                        ownDarkColorName: colorNames.dark,
                        ownLightColorName: colorNames.light,
                        parentColorsDarkMode:
                            dependencyValues.parentSectionTitleStateColorsDarkMode,
                        parentSourcesDarkMode:
                            dependencyValues.parentSectionTitleStateColorSourcesDarkMode,
                        parentIsBoxedOrCollapsible,
                        stateKey,
                    });
                    sectionTitleStateColorsDarkMode[stateKey] = darkSpec.value;
                    sectionTitleStateColorSourcesDarkMode[stateKey] =
                        darkSpec.source;
                }

                return {
                    setValue: {
                        sectionTitleStateColors,
                        sectionTitleStateColorsDarkMode,
                        sectionTitleStateColorSources,
                        sectionTitleStateColorSourcesDarkMode,
                    },
                };
            },
        };

        stateVariableDefinitions.titleColor = {
            // Note: currently title color is used only when boxed or collapsible
            additionalStateVariablesDefined: [
                {
                    variableName: "titleColorDarkMode",
                    forRenderer: true,
                },
            ],
            forRenderer: true,
            returnDependencies: () => ({
                sectionTitleStateColors: {
                    dependencyType: "stateVariable",
                    variableName: "sectionTitleStateColors",
                },
                sectionTitleStateColorsDarkMode: {
                    dependencyType: "stateVariable",
                    variableName: "sectionTitleStateColorsDarkMode",
                },
                sectionTitleStateColorSources: {
                    dependencyType: "stateVariable",
                    variableName: "sectionTitleStateColorSources",
                },
                sectionTitleStateColorSourcesDarkMode: {
                    dependencyType: "stateVariable",
                    variableName: "sectionTitleStateColorSourcesDarkMode",
                },
                creditAchieved: {
                    dependencyType: "stateVariable",
                    variableName: "creditAchieved",
                },
                boxed: {
                    dependencyType: "stateVariable",
                    variableName: "boxed",
                },
                collapsible: {
                    dependencyType: "stateVariable",
                    variableName: "collapsible",
                },
            }),
            definition({ dependencyValues }) {
                const titleStateKey = titleStateKeyFromCredit(
                    dependencyValues.creditAchieved,
                );
                const titleColor =
                    dependencyValues.sectionTitleStateColors[titleStateKey];
                const titleColorDarkMode =
                    dependencyValues.sectionTitleStateColorsDarkMode[
                        titleStateKey
                    ];

                const diagnostics = [];
                if (dependencyValues.boxed || dependencyValues.collapsible) {
                    for (const stateKey of sectionTitleStateKeys) {
                        const lightSource =
                            dependencyValues.sectionTitleStateColorSources[
                                stateKey
                            ];
                        addSectionTitleColorContrastDiagnostic({
                            diagnostics,
                            authorSet: shouldEmitSectionTitleColorDiagnostic({
                                source: lightSource,
                            }),
                            colorValue:
                                dependencyValues.sectionTitleStateColors[
                                    stateKey
                                ],
                            colorName: lightSource?.colorName ?? stateKey,
                            textColor: "#000000",
                            canvasColor: CANVAS_LIGHT_MODE_COLOR,
                        });

                        const darkSource =
                            dependencyValues
                                .sectionTitleStateColorSourcesDarkMode[
                                stateKey
                            ];
                        addSectionTitleColorContrastDiagnostic({
                            diagnostics,
                            authorSet: shouldEmitSectionTitleColorDiagnostic({
                                source: darkSource,
                            }),
                            colorValue:
                                dependencyValues
                                    .sectionTitleStateColorsDarkMode[stateKey],
                            colorName: darkSource?.colorName ?? stateKey,
                            textColor: "#ffffff",
                            canvasColor: CANVAS_DARK_MODE_COLOR,
                            modeSuffix: " (dark mode)",
                        });
                    }
                }

                return {
                    setValue: {
                        titleColor,
                        titleColorDarkMode,
                    },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.containerTag = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { containerTag: "section" } }),
        };

        stateVariableDefinitions.level = {
            forRenderer: true,
            returnDependencies: () => ({
                ancestorLevel: {
                    dependencyType: "ancestor",
                    componentType: "_sectioningComponent",
                    variableNames: ["level"],
                },
                levelAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "level",
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                let level = dependencyValues.levelAttr?.stateValues.value;

                if (!(level > 0)) {
                    level =
                        (dependencyValues.ancestorLevel?.stateValues.level ||
                            0) + 1;
                }

                return { setValue: { level } };
            },
        };

        stateVariableDefinitions.generatedVariantInfo = {
            shadowVariable: true,
            additionalStateVariablesDefined: ["isVariantComponent"],
            returnDependencies: ({
                sharedParameters,
                componentInfoObjects,
            }) => ({
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
                },
                variantIndex: {
                    dependencyType: "value",
                    value: sharedParameters.variantIndex,
                },
                variantName: {
                    dependencyType: "value",
                    value: sharedParameters.variantName,
                },
                variantDescendants: {
                    dependencyType: "descendant",
                    componentTypes: Object.keys(
                        componentInfoObjects.componentTypesCreatingVariants,
                    ),
                    variableNames: [
                        "isVariantComponent",
                        "generatedVariantInfo",
                    ],
                    recurseToMatchedChildren: false,
                    variablesOptional: true,
                    includeNonActiveChildren: true,
                    ignoreReplacementsOfEncounteredComposites: true,
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {};

                if (dependencyValues.variantName) {
                    generatedVariantInfo.index = dependencyValues.variantIndex;
                    generatedVariantInfo.name = dependencyValues.variantName;
                } else {
                    generatedVariantInfo.seed = dependencyValues.variantSeed;
                }

                generatedVariantInfo.meta = {
                    createdBy: componentIdx,
                };

                let subvariants = (generatedVariantInfo.subvariants = []);
                for (let descendant of dependencyValues.variantDescendants) {
                    if (descendant.stateValues.isVariantComponent) {
                        subvariants.push(
                            descendant.stateValues.generatedVariantInfo,
                        );
                    } else if (descendant.stateValues.generatedVariantInfo) {
                        subvariants.push(
                            ...descendant.stateValues.generatedVariantInfo
                                .subvariants,
                        );
                    }
                }

                return {
                    setValue: {
                        generatedVariantInfo,
                        isVariantComponent: true,
                    },
                };
            },
        };

        stateVariableDefinitions.open = {
            description:
                "Whether this section is currently open (for collapsible sections).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            defaultValue: true,
            hasEssential: true,
            returnDependencies: () => ({
                collapsible: {
                    dependencyType: "stateVariable",
                    variableName: "collapsible",
                },
                startOpen: {
                    dependencyType: "stateVariable",
                    variableName: "startOpen",
                },
            }),
            definition({ dependencyValues }) {
                // When not collapsible, always open regardless of any stored
                // essential value (handles collapsible toggling false at runtime).
                if (!dependencyValues.collapsible) {
                    return { setValue: { open: true } };
                }
                return {
                    useEssentialOrDefaultValue: {
                        open: { defaultValue: dependencyValues.startOpen },
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "open",
                            value: desiredStateVariableValues.open,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.rendered = {
            forRenderer: true,
            defaultValue: true,
            hasEssential: true,
            returnDependencies: () => ({
                collapsible: {
                    dependencyType: "stateVariable",
                    variableName: "collapsible",
                },
                startOpen: {
                    dependencyType: "stateVariable",
                    variableName: "startOpen",
                },
            }),
            definition({ dependencyValues }) {
                // When not collapsible, always rendered regardless of any stored
                // essential value (handles collapsible toggling false at runtime).
                if (!dependencyValues.collapsible) {
                    return { setValue: { rendered: true } };
                }
                return {
                    useEssentialOrDefaultValue: {
                        rendered: { defaultValue: dependencyValues.startOpen },
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "rendered",
                            value: desiredStateVariableValues.rendered,
                        },
                    ],
                };
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

    async addChildren(args) {
        return await addChildrenToDynamicChild(this, args);
    }

    async deleteChildren(args) {
        return await deleteChildrenFromDynamicChild(this, args);
    }

    async revealSection({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "open",
                    value: true,
                },
            ],
            overrideReadOnly: true,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "viewed",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
            },
        });

        return this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "rendered",
                    value: true,
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            overrideReadOnly: true,
        });
    }

    async closeSection({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "open",
                    value: false,
                },
            ],
            overrideReadOnly: true,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "closed",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
            },
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

    static setUpVariant({
        serializedComponent,
        sharedParameters,
        descendantVariantComponents,
        core,
    }) {
        if (!serializedComponent.variants?.allPossibleVariants) {
            // no variant control child
            // so don't actually control variants
            // just calculate a seed

            setUpVariantSeedAndRng({
                serializedComponent,
                sharedParameters,
                descendantVariantComponents,
                useSubpartVariantRng: true,
            });

            return;
        }

        let numVariants = serializedComponent.variants.numVariants;

        let variantIndex;
        // check if desiredVariant was specified
        let desiredVariant = serializedComponent.variants.desiredVariant;
        if (desiredVariant !== undefined) {
            if (desiredVariant.index !== undefined) {
                let desiredVariantIndex = Number(desiredVariant.index);
                if (!Number.isFinite(desiredVariantIndex)) {
                    core.addDiagnostic({
                        type: "info",
                        message:
                            "Variant index " +
                            desiredVariant.index +
                            " must be a number",
                        position: serializedComponent.position,
                        sourceDoc: serializedComponent.sourceDoc,
                    });
                    variantIndex = 1;
                } else {
                    if (!Number.isInteger(desiredVariantIndex)) {
                        core.addDiagnostic({
                            type: "info",
                            message:
                                "Variant index " +
                                desiredVariant.index +
                                " must be an integer",
                            position: serializedComponent.position,
                            sourceDoc: serializedComponent.sourceDoc,
                        });
                        desiredVariantIndex = Math.round(desiredVariantIndex);
                    }
                    let indexFrom0 = (desiredVariantIndex - 1) % numVariants;
                    if (indexFrom0 < 0) {
                        indexFrom0 += numVariants;
                    }
                    variantIndex = indexFrom0 + 1;
                }
            }
        }

        if (variantIndex === undefined) {
            // if variant index wasn't specified, randomly generate a variant index
            // random number in [0, 1)
            let rand = sharedParameters.variantRng();

            // random integer from 1 to numVariants
            variantIndex = Math.floor(rand * numVariants) + 1;
        }

        sharedParameters.allPossibleVariants =
            serializedComponent.variants.allPossibleVariants;
        sharedParameters.allVariantNames =
            serializedComponent.variants.allVariantNames;

        sharedParameters.variantSeed =
            serializedComponent.variants.allPossibleVariantSeeds[
                variantIndex - 1
            ];
        sharedParameters.variantIndex = variantIndex;
        sharedParameters.variantName =
            serializedComponent.variants.allPossibleVariants[variantIndex - 1];
        sharedParameters.uniqueIndex =
            serializedComponent.variants.allPossibleVariantUniqueIndices[
                variantIndex - 1
            ];

        sharedParameters.variantRng = sharedParameters.rngClass(
            sharedParameters.variantSeed,
        );
        sharedParameters.subpartVariantRng = sharedParameters.rngClass(
            sharedParameters.variantSeed + "s",
        );

        // console.log("****Variant for sectioning component****")
        // console.log("Selected seed: " + variantControlChild.stateValues.selectedSeed);
        // console.log("Variant name for " + this.componentType + ": " + sharedParameters.variantName);

        // if subvariants were specified, add those the corresponding descendants
        if (desiredVariant?.subvariants && descendantVariantComponents) {
            for (let ind in desiredVariant.subvariants) {
                let subvariant = desiredVariant.subvariants[ind];
                let variantComponent = descendantVariantComponents[ind];
                if (variantComponent === undefined) {
                    break;
                }
                variantComponent.variants.desiredVariant = subvariant;
            }
        }
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
        infoDiagnostics,
    }) {
        return determineVariantsForSection({
            serializedComponent,
            componentInfoObjects,
            infoDiagnostics,
        });
    }

    static getUniqueVariant({
        serializedComponent,
        variantIndex,
        componentInfoObjects,
    }) {
        if (!serializedComponent.variants.allPossibleVariants) {
            return super.getUniqueVariant({
                serializedComponent,
                variantIndex,
                componentInfoObjects,
            });
        }

        let uniqueIndex =
            serializedComponent.variants.allPossibleVariantUniqueIndices[
                variantIndex - 1
            ];

        if (uniqueIndex === undefined) {
            return { success: false };
        }

        if (!serializedComponent.variants.uniqueVariants) {
            // it don't have unique variants, then just return variantIndex
            return {
                success: true,
                desiredVariant: {
                    index: variantIndex,
                },
            };
        }

        let result = getVariantsForDescendantsForUniqueVariants({
            variantIndex: uniqueIndex,
            serializedComponent,
            componentInfoObjects,
        });

        if (!result.success) {
            return { success: false };
        }

        serializedComponent.variants.selectedUniqueVariant = true;

        return {
            success: true,
            desiredVariant: {
                index: variantIndex,
                subvariants: result.desiredVariants,
            },
        };
    }
}

export class SectioningComponentNumberWithSiblings extends SectioningComponent {
    static componentType = "_sectioningComponentNumberWithSiblings";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        delete attributes.renameTo;

        attributes.includeParentNumber = {
            createComponentOfType: "boolean",
            createStateVariable: "includeParentNumber",
            defaultValue: false,
            public: true,
            description:
                "Whether to prefix this section's number with the parent section's number.",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.enumeration = {
            additionalStateVariablesDefined: [
                {
                    variableName: "sectionNumber",
                    description: "The displayed number for this section.",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                countAmongSiblings: {
                    dependencyType: "countAmongSiblings",
                    componentType: "_sectioningComponentNumberWithSiblings",
                    includeInheritedComponentTypes: true,
                },
                sectionAncestor: {
                    dependencyType: "ancestor",
                    componentType: "_sectioningComponent",
                    variableNames: ["enumeration"],
                },
                includeParentNumber: {
                    dependencyType: "stateVariable",
                    variableName: "includeParentNumber",
                },
                isListItem: {
                    dependencyType: "stateVariable",
                    variableName: "isListItem",
                },
                countAmongSiblingsForListItem: {
                    dependencyType: "countAmongSiblings",
                    componentType: "_sectioningComponent",
                    includeInheritedComponentTypes: true,
                },
            }),
            definition({ dependencyValues }) {
                let enumeration = [];
                if (dependencyValues.isListItem) {
                    enumeration.push(
                        dependencyValues.countAmongSiblingsForListItem,
                    );
                } else {
                    if (
                        dependencyValues.includeParentNumber &&
                        dependencyValues.sectionAncestor
                    ) {
                        enumeration.push(
                            ...dependencyValues.sectionAncestor.stateValues
                                .enumeration,
                        );
                    }
                    enumeration.push(dependencyValues.countAmongSiblings);
                }

                return {
                    setValue: {
                        enumeration,
                        sectionNumber: enumeration.join("."),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

export class UnnumberedSectioningComponent extends SectioningComponent {
    static componentType = "_unnumberedSectioningComponent";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.includeAutoNumberIfNoTitle.defaultValue = false;
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.enumeration = {
            additionalStateVariablesDefined: [
                {
                    variableName: "sectionNumber",
                    description:
                        "The displayed number for this section (always null for unnumbered sections).",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({}),
            definition() {
                return { setValue: { enumeration: [], sectionNumber: null } };
            },
        };

        return stateVariableDefinitions;
    }
}
