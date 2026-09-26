import BlockComponent from "./abstract/BlockComponent";
import { returnCascadeStepStateVariableDefinitions } from "../utils/cascadeStep";
import { codedDiagnostic } from "../utils/diagnostics";
import { returnScoredSectionStateVariableDefinition } from "../utils/scoredSection";
import {
    returnSectionTitleStateColorAttributes,
    returnSectionTitleStateColorStateVariableDefinitions,
} from "../utils/sectionTitleColors";

/**
 * `<cascade>` does one thing: it reveals its children one step at a time, each
 * once the steps before it are complete.
 *
 * It is not a section. It has no heading, no number, no heading level, no box
 * and no score of its own, and it seeds no variants, so a section inside it is
 * numbered, leveled and scored exactly as it would be beside it. An author who
 * wants any of those wraps the cascade in a `<section>`.
 *
 * What it keeps of a section is what its steps read off their parent: the
 * `childrenToHideChildren` and `sectionToShowCascadeMessage` that hold a step
 * back and pick its message (`returnCascadeStepStateVariableDefinitions`), the
 * `childrenAggregateScores` that makes each step score itself, the heading-bar
 * colors a step shows its progress in, `boxAll`, and `asList`, passed through
 * so that a `<problems>` still numbers the problems inside a cascade as its
 * items. A cascade that is itself a step of another cascade reads the same
 * variables off its parent in turn.
 */
export default class Cascade extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }

    static componentType = "cascade";

    static componentDocs = {
        summary:
            "Reveals its children one step at a time, each once the steps before it are complete",
    };
    static rendererType = "containerBlock";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static includeBlankStringChildren = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.hideFutureSections = {
            createComponentOfType: "boolean",
            createStateVariable: "hideFutureSections",
            defaultValue: false,
            public: true,
            description:
                "Whether to hide later cascade sections until previous ones are completed.",
        };

        // Keep the explicit attribute value separate so the effective state
        // variable can inherit from the parent when the attribute is omitted.
        // Mark it non-public so it doesn't appear in the schema or as a
        // shadowable property.
        attributes.asList = {
            createComponentOfType: "boolean",
            createStateVariable: "asListPreliminary",
            defaultValue: false,
            description:
                "Whether to render this cascade's children as a list (by default, whatever its parent does).",
        };

        attributes.revealAll = {
            createComponentOfType: "boolean",
            createStateVariable: "revealAllPreliminary",
            defaultValue: false,
            description:
                "Whether all cascade entries should be revealed regardless of progress.",
        };

        attributes.boxAll = {
            createComponentOfType: "boolean",
            createStateVariable: "boxAll",
            defaultValue: false,
            description:
                "Whether to draw boxes around all cascade entries regardless of progress.",
        };

        // The colors the steps' heading bars show their progress in. A step
        // reads these off its immediate parent, so without them here a cascade
        // would cut its steps off from the colors of the section around it.
        Object.assign(attributes, returnSectionTitleStateColorAttributes());

        return attributes;
    }

    static returnChildGroups() {
        return [
            // Not rendered: a cascade has no heading. Kept apart so a `<title>`
            // is not taken for a step, and so it can be reported.
            {
                group: "titles",
                componentTypes: ["title"],
            },
            // Kept apart so a `<setup>` is not taken for a step and hidden,
            // which would hollow out whatever it defines.
            {
                group: "setups",
                componentTypes: ["setup"],
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

        // A cascade nested in another cascade is one of its steps.
        Object.assign(
            stateVariableDefinitions,
            returnCascadeStepStateVariableDefinitions(),
        );

        Object.assign(
            stateVariableDefinitions,
            returnSectionTitleStateColorStateVariableDefinitions(),
        );

        /**
         * Which children to render: every child but a `<title>`, which a
         * cascade does not show, and — while an enclosing cascade holds this one
         * back — none of its strings, which `childrenToHide` cannot reach.
         *
         * Under `asList` (a cascade in a `<problems>`), only the children that
         * are items of that list render, as they did when a cascade was a
         * section: the sections and nested cascades.
         *
         * Also where a `<title>` is reported, since this is computed for every
         * cascade that renders.
         */
        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
                titleChildren: {
                    dependencyType: "child",
                    childGroups: ["titles"],
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
                const titleChildIndices = new Set(
                    dependencyValues.titleChildren.map((x) => x.componentIdx),
                );

                const childIndicesToRender = [];

                for (const [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (typeof child === "string") {
                        if (
                            !dependencyValues.hideChildren &&
                            !dependencyValues.asList
                        ) {
                            childIndicesToRender.push(ind);
                        }
                        continue;
                    }
                    if (titleChildIndices.has(child.componentIdx)) {
                        continue;
                    }
                    if (
                        dependencyValues.asList &&
                        !["_sectioningComponent", "cascade"].some(
                            (baseComponentType) =>
                                componentInfoObjects.isInheritedComponentType({
                                    inheritedComponentType: child.componentType,
                                    baseComponentType,
                                }),
                        ) &&
                        !["introduction", "conclusion"].includes(
                            child.componentType,
                        )
                    ) {
                        continue;
                    }
                    childIndicesToRender.push(ind);
                }

                const sendDiagnostics = dependencyValues.titleChildren.map(
                    (child) =>
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0167",
                            position: child.position || undefined,
                        }),
                );

                return {
                    setValue: { childIndicesToRender },
                    sendDiagnostics,
                };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        // Cascade is a structural container rather than a numbered item, even
        // when it sits inside a list-producing parent such as <problems>.
        stateVariableDefinitions.isListItem = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isListItem: false } }),
        };

        // Make cascade transparent for `asList` propagation unless the author
        // explicitly sets `asList` on the cascade itself.
        stateVariableDefinitions.asList = {
            description:
                "Whether to render this cascade's children as a list (by default, whatever its parent does).",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                asListPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "asListPreliminary",
                },
                parentAsList: {
                    dependencyType: "parentStateVariable",
                    variableName: "asList",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let asList = dependencyValues.parentAsList;
                if (!usedDefault.asListPreliminary) {
                    asList = dependencyValues.asListPreliminary;
                }

                return { setValue: { asList: Boolean(asList) } };
            },
        };

        stateVariableDefinitions.childrenAggregateScores = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { childrenAggregateScores: true } }),
        };

        // A cascade has no score of its own: a section around it is scored on
        // the steps inside it directly, since the scored-descendant search
        // looks through a cascade the way it looks through any container it
        // does not list. What a cascade does keep is its progress, which an
        // enclosing cascade reads to decide whether this one — as a step of
        // it — is complete. That is the shared aggregate over the scored
        // descendants, always aggregated, with nothing to weigh it by.
        const scoredSectionDefinitions =
            returnScoredSectionStateVariableDefinition();
        stateVariableDefinitions.aggregateScores = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { aggregateScores: true } }),
        };
        stateVariableDefinitions.scoredDescendants =
            scoredSectionDefinitions.scoredDescendants;
        stateVariableDefinitions.creditAchievedForProgress =
            scoredSectionDefinitions.creditAchievedForProgress;

        // Progress reads `creditAchievedForProgress` rather than
        // `creditAchieved`, and the two differ in exactly one place: a
        // hand-graded answer. Its `creditAchieved` stays 0 until an instructor
        // grades it, long after the reader has moved on, so scoring the cascade
        // on it would strand the reader at that step for good. Progress counts
        // such an answer as correct once the reader has actually responded.
        stateVariableDefinitions.childCreditAchieved = {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["creditAchievedForProgress"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                const childCreditAchieved = dependencyValues.children.map(
                    (child) =>
                        child.stateValues?.creditAchievedForProgress ?? null,
                );

                return { setValue: { childCreditAchieved } };
            },
        };

        stateVariableDefinitions.numCompleted = {
            description: "The number of cascade sections currently completed.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                childCreditAchieved: {
                    dependencyType: "stateVariable",
                    variableName: "childCreditAchieved",
                },
            }),
            definition({ dependencyValues }) {
                let numCompleted = 0;

                for (const childCredit of dependencyValues.childCreditAchieved) {
                    // if childCredit === null, then that child doesn't have a credit achieved
                    // so it is automatically deemed completed when reached
                    if (childCredit === 1 || childCredit === null) {
                        numCompleted++;
                    } else {
                        // Stop as soon as reach a child that has a credit achieved less than 1
                        break;
                    }
                }

                return { setValue: { numCompleted } };
            },
        };

        stateVariableDefinitions.revealAll = {
            returnDependencies: () => ({
                cascadeAncestor: {
                    dependencyType: "ancestor",
                    componentType: "cascade",
                    variableNames: ["revealAll"],
                },
                revealAllPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "revealAllPreliminary",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                let revealAll = false;
                if (!usedDefault.revealAllPreliminary) {
                    revealAll = dependencyValues.revealAllPreliminary;
                } else if (dependencyValues.cascadeAncestor) {
                    revealAll =
                        dependencyValues.cascadeAncestor.stateValues.revealAll;
                } else {
                    dependencyValues.revealAllPreliminary;
                }

                return { setValue: { revealAll } };
            },
        };

        /**
         * A cascade shows one continuation message at a time, chosen here.
         *
         * There are two places an author can put one. A `<cascadeMessage>` child
         * of the cascade itself stands between two steps, and the cascade shows
         * the next such message after the last shown step — one trailing message
         * therefore serves every gap. A `<cascadeMessage>` nested inside a step
         * belongs to that step alone, and a step's own message is the more
         * specific of the two, so when the next step has one it wins and every
         * message of the cascade's own is hidden for as long as it shows.
         *
         * `sectionToShowCascadeMessage` names the step whose nested messages are
         * shown (`null` for none); each section compares it against itself in
         * `showCascadeMessage`. Only the *next* step is ever named, so a step
         * further down the cascade shows nothing but its number and title, the
         * same as a step with no message at all. A nested `<cascade>` is a step
         * like any other, and one that has a message to show is nominated like
         * any other — it then chooses that message here in its own right, which
         * is the single message shown. What "has one" means is
         * `hasCascadeMessageToShow`, which the override below answers for a
         * cascade by asking this very question of itself: nominating a step that
         * would then show nothing would leave the gap silent, having suppressed
         * the cascade's own message on its behalf.
         *
         * Note that a nested message is the only kind that survives `asList`
         * (`<problems>` and friends): `childIndicesToRender` there renders only
         * the cascade's sections and nested cascades, so a message child of the
         * cascade is dropped before it can be shown.
         */
        stateVariableDefinitions.childrenToHide = {
            additionalStateVariablesDefined: [
                "childrenToHideChildren",
                "sectionToShowCascadeMessage",
            ],
            returnDependencies: () => ({
                hideFutureSections: {
                    dependencyType: "stateVariable",
                    variableName: "hideFutureSections",
                },
                numCompleted: {
                    dependencyType: "stateVariable",
                    variableName: "numCompleted",
                },
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["hasCascadeMessageToShow"],
                    variablesOptional: true,
                },
                childrenWithCascadeMessages: {
                    dependencyType: "child",
                    childGroups: ["anything", "cascadeMessages"],
                },
                revealAll: {
                    dependencyType: "stateVariable",
                    variableName: "revealAll",
                },
                hideChildren: {
                    dependencyType: "stateVariable",
                    variableName: "hideChildren",
                },
                showCascadeMessage: {
                    dependencyType: "stateVariable",
                    variableName: "showCascadeMessage",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const allContinuationComponentIndices =
                    dependencyValues.childrenWithCascadeMessages
                        .filter(
                            (child) => child.componentType === "cascadeMessage",
                        )
                        .map((child) => child.componentIdx);

                // If `revealAll` is set, then just hide continuation messages
                if (dependencyValues.revealAll) {
                    return {
                        setValue: {
                            childrenToHide: allContinuationComponentIndices,
                            childrenToHideChildren: [],
                            sectionToShowCascadeMessage: null,
                        },
                    };
                }

                const childrenToHide = [];
                const childrenToHideChildren = [];

                for (const [
                    idx,
                    child,
                ] of dependencyValues.children.entries()) {
                    if (idx <= dependencyValues.numCompleted) {
                        if (dependencyValues.hideChildren) {
                            childrenToHide.push(child.componentIdx);
                        }
                    } else if (
                        !dependencyValues.hideChildren &&
                        !dependencyValues.hideFutureSections &&
                        // A step that can show its heading (or, for a nested
                        // cascade, its message) while held back.
                        ["_sectioningComponent", "cascade"].some(
                            (baseComponentType) =>
                                componentInfoObjects.isInheritedComponentType({
                                    inheritedComponentType: child.componentType,
                                    baseComponentType,
                                }),
                        )
                    ) {
                        childrenToHideChildren.push(child.componentIdx);
                    } else {
                        childrenToHide.push(child.componentIdx);
                    }
                }

                // The next step is the first one held back. It speaks for the
                // gap if it has a message of its own to show, and then the
                // cascade's own messages all stay hidden.
                const nextStep =
                    dependencyValues.children[
                        dependencyValues.numCompleted + 1
                    ];
                const sectionToShowCascadeMessage =
                    nextStep &&
                    childrenToHideChildren.includes(nextStep.componentIdx) &&
                    nextStep.stateValues?.hasCascadeMessageToShow
                        ? nextStep.componentIdx
                        : null;

                // Otherwise the cascade speaks for the gap with one message of
                // its own, if it has one there.
                //
                // A cascade that is itself a step of an enclosing cascade has a
                // further reason to stay quiet: `hideChildren` says the enclosing
                // cascade is holding it back, and then it speaks only while it is
                // the step that cascade nominates. A cascade further down the
                // enclosing cascade shows nothing at all, its own messages
                // included, exactly as a plain step further down does.
                const continuationToShow =
                    sectionToShowCascadeMessage === null &&
                    (!dependencyValues.hideChildren ||
                        dependencyValues.showCascadeMessage)
                        ? nextOwnCascadeMessage(dependencyValues)
                        : null;

                // Hide every message of the cascade's own but that one. (With
                // none to show, `null` matches no child and all are hidden.)
                childrenToHide.push(
                    ...allContinuationComponentIndices.filter(
                        (cIdx) => cIdx !== continuationToShow,
                    ),
                );

                return {
                    setValue: {
                        childrenToHide,
                        childrenToHideChildren,
                        sectionToShowCascadeMessage,
                    },
                };
            },
        };

        /**
         * A cascade has a message to show when it has one of its *own* between
         * the steps it is showing and the steps it is holding back — the same
         * message `childrenToHide` picks above, asked here without reference to
         * whether this cascade has been nominated.
         *
         * That independence is the point, and it is why this cannot simply
         * count message children the way an ordinary section does: the enclosing
         * cascade reads this to decide whether to nominate this one, so anything
         * it asked about visibility would close a cycle. Counting is also not the
         * same question. A message this cascade would never show — its only one
         * placed ahead of its first step, or none in the gap it has reached, or
         * `revealAll` leaving it no gap at all — must not win the nomination, or
         * the enclosing cascade suppresses its own message on behalf of a step
         * that then says nothing.
         */
        stateVariableDefinitions.hasCascadeMessageToShow = {
            returnDependencies: () => ({
                numCompleted: {
                    dependencyType: "stateVariable",
                    variableName: "numCompleted",
                },
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                },
                childrenWithCascadeMessages: {
                    dependencyType: "child",
                    childGroups: ["anything", "cascadeMessages"],
                },
                revealAll: {
                    dependencyType: "stateVariable",
                    variableName: "revealAll",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        hasCascadeMessageToShow:
                            nextOwnCascadeMessage(dependencyValues) !== null,
                    },
                };
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

/**
 * The one `<cascadeMessage>` child of a cascade's own that stands in for the
 * steps it is holding back: the next one after the last shown step, or `null`
 * if there is none there.
 *
 * There is none when the last step is showing, since then no step is held back
 * for a message to stand in for, and none when `revealAll` holds nothing back
 * at all. Which messages a cascade has and where its steps end are all this
 * asks about, so it says nothing about whether the message is *shown*: the
 * caller adds the reasons a cascade stays quiet even with one here.
 *
 * @param {object} dependencyValues - dependency values holding `numCompleted`,
 *   `revealAll`, the `children` of the `anything` group (the steps), and
 *   `childrenWithCascadeMessages` (those steps with the messages interleaved in
 *   document order).
 * @returns {number | null} the component index of the message, or `null`.
 */
function nextOwnCascadeMessage(dependencyValues) {
    if (
        dependencyValues.revealAll ||
        dependencyValues.numCompleted > dependencyValues.children.length - 2
    ) {
        return null;
    }

    const lastShownStep =
        dependencyValues.children[dependencyValues.numCompleted].componentIdx;
    const lastShownStepIdx =
        dependencyValues.childrenWithCascadeMessages.findIndex(
            (child) => child.componentIdx === lastShownStep,
        );

    return (
        dependencyValues.childrenWithCascadeMessages
            .slice(lastShownStepIdx + 1)
            .find((child) => child.componentType === "cascadeMessage")
            ?.componentIdx ?? null
    );
}
