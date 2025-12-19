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

export class SectioningComponent extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            submitAllAnswers: this.submitAllAnswers.bind(this),
            revealSection: this.revealSection.bind(this),
            closeSection: this.closeSection.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
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
            createStateVariable: "boxed",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };

        attributes.includeAutoName = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoName",
            defaultValue: false,
            public: true,
        };

        attributes.includeAutoNumber = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoNumber",
            defaultValue: false,
            public: true,
        };

        attributes.noAutoTitle = {
            createComponentOfType: "boolean",
            createStateVariable: "noAutoTitle",
            defaultValue: false,
            public: true,
        };

        attributes.includeAutoNameIfNoTitle = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoNameIfNoTitle",
            defaultValue: true,
            public: true,
        };

        attributes.includeAutoNumberIfNoTitle = {
            createComponentOfType: "boolean",
            createStateVariable: "includeAutoNumberIfNoTitle",
            defaultValue: true,
            public: true,
        };

        attributes.asList = {
            createComponentOfType: "boolean",
            createStateVariable: "asListPrelim",
            defaultValue: false,
        };

        attributes.level = {
            createComponentOfType: "integer",
        };

        attributes.renameTo = {
            createComponentOfType: "text",
        };

        attributes.completedColor = {
            createComponentOfType: "text",
            createStateVariable: "completedColor",
            defaultValue: "var(--lightGreen)",
        };

        attributes.inProgressColor = {
            createComponentOfType: "text",
            createStateVariable: "inProgressColor",
            defaultValue: "var(--mainGray)",
        };

        attributes.notStartedColor = {
            createComponentOfType: "text",
            createStateVariable: "notStartedColor",
            defaultValue: "var(--mainGray)",
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

        // Check if any children of the section are flagged with `forceList`
        // (currently `<task>` and `<part>` children),
        stateVariableDefinitions.haveForceListChildren = {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["forceList"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                const haveForceListChildren =
                    dependencyValues.children.findIndex(
                        (child) => child.stateValues?.forceList,
                    ) !== -1;

                return { setValue: { haveForceListChildren } };
            },
        };

        stateVariableDefinitions.asList = {
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                asListPrelim: {
                    dependencyType: "stateVariable",
                    variableName: "asListPrelim",
                },
                haveForceListChildren: {
                    dependencyType: "stateVariable",
                    variableName: "haveForceListChildren",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        asList:
                            dependencyValues.asListPrelim ||
                            dependencyValues.haveForceListChildren,
                    },
                };
            },
        };

        // forceList will be set for `<task>` and `<part>`.
        stateVariableDefinitions.forceList = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { forceList: false } }),
        };

        stateVariableDefinitions.inAList = {
            forRenderer: true,
            returnDependencies: () => ({
                parentIsAsList: {
                    dependencyType: "parentStateVariable",
                    variableName: "asList",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        inAList: Boolean(dependencyValues.parentIsAsList),
                    },
                };
            },
        };

        stateVariableDefinitions.enumeration = {
            stateVariablesDeterminingDependencies: ["inAList"],
            additionalStateVariablesDefined: [
                {
                    variableName: "sectionNumber",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
                },
            ],
            mustEvaluate: true, // must evaluate to make sure all counters are accounted for
            returnDependencies: ({ stateValues }) => {
                let dependencies = {
                    inAList: {
                        dependencyType: "stateVariable",
                        variableName: "inAList",
                    },
                };

                if (stateValues.inAList) {
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
                if (dependencyValues.inAList) {
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
                        }
                    } else if (
                        typeof child !== "object" ||
                        !allTitleChildNames.includes(child.componentIdx) ||
                        child.componentIdx === dependencyValues.titleChildName
                    ) {
                        childIndicesToRender.push(ind);
                    }
                }

                return { setValue: { childIndicesToRender } };
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

        stateVariableDefinitions.titleColor = {
            // Note: currently title color is used only when boxed or collapsible
            forRenderer: true,
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
                parentCompletedColor: {
                    dependencyType: "parentStateVariable",
                    variableName: "completedColor",
                },
                parentInProgressColor: {
                    dependencyType: "parentStateVariable",
                    variableName: "inProgressColor",
                },
                parentNotStartedColor: {
                    dependencyType: "parentStateVariable",
                    variableName: "notStartedColor",
                },
                creditAchieved: {
                    dependencyType: "stateVariable",
                    variableName: "creditAchieved",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let titleColor = dependencyValues.notStartedColor;
                if (dependencyValues.creditAchieved === 1) {
                    if (!usedDefault.completedColor) {
                        titleColor = dependencyValues.completedColor;
                    } else if (
                        typeof dependencyValues.parentCompletedColor ===
                        "string"
                    ) {
                        titleColor = dependencyValues.parentCompletedColor;
                    } else {
                        titleColor = dependencyValues.completedColor;
                    }
                } else if (dependencyValues.creditAchieved > 0) {
                    if (!usedDefault.inProgressColor) {
                        titleColor = dependencyValues.inProgressColor;
                    } else if (
                        typeof dependencyValues.parentInProgressColor ===
                        "string"
                    ) {
                        titleColor = dependencyValues.parentInProgressColor;
                    } else {
                        titleColor = dependencyValues.inProgressColor;
                    }
                } else {
                    if (!usedDefault.notStartedColor) {
                        titleColor = dependencyValues.notStartedColor;
                    } else if (
                        typeof dependencyValues.parentNotStartedColor ===
                        "string"
                    ) {
                        titleColor = dependencyValues.parentNotStartedColor;
                    } else {
                        titleColor = dependencyValues.notStartedColor;
                    }
                }

                return { setValue: { titleColor } };
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

        stateVariableDefinitions.collapsible = {
            forRenderer: true,
            returnDependencies: () => ({}),
            definition() {
                return { setValue: { collapsible: false } };
            },
        };

        stateVariableDefinitions.open = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            defaultValue: true,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition() {
                return {
                    useEssentialOrDefaultValue: {
                        open: true,
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
            returnDependencies: () => ({}),
            definition() {
                return {
                    useEssentialOrDefaultValue: {
                        rendered: true,
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
                    console.warn(
                        "Variant index " +
                            desiredVariant.index +
                            " must be a number",
                    );
                    variantIndex = 1;
                } else {
                    if (!Number.isInteger(desiredVariantIndex)) {
                        console.warn(
                            "Variant index " +
                                desiredVariant.index +
                                " must be an integer",
                        );
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
    }) {
        return determineVariantsForSection({
            serializedComponent,
            componentInfoObjects,
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
            console.log("Failed to get unique variant for section.");

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
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.enumeration = {
            additionalStateVariablesDefined: [
                {
                    variableName: "sectionNumber",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
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
                inAList: {
                    dependencyType: "stateVariable",
                    variableName: "inAList",
                },
                countAmongSiblingsInAList: {
                    dependencyType: "countAmongSiblings",
                    componentType: "_sectioningComponent",
                    includeInheritedComponentTypes: true,
                },
            }),
            definition({ dependencyValues }) {
                let enumeration = [];
                if (dependencyValues.inAList) {
                    enumeration.push(
                        dependencyValues.countAmongSiblingsInAList,
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
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "text",
                    },
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
