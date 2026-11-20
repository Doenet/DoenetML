/**
 * Numbering that runs through containers which show no number of their own.
 *
 * Two sequences number sections by their position among the sections beside
 * them:
 *
 * - **Divisions.** A numbered division — a `<section>`, `<example>`,
 *   `<problem>`, `<aside>`, … — is numbered among the numbered divisions beside
 *   it, all types in one sequence. Its number is prefixed with the enclosing
 *   section's when it has `includeParentNumber`.
 * - **List items.** A section that is an item of a list — a `<problem>` in a
 *   `<problems>`, a `<part>` in a `<problem>` — is numbered among the
 *   sectioning components beside it.
 *
 * "Beside it" looks through the containers that show no number of their own,
 * the *pass-throughs* of the sequence. For divisions they are `<div>` (with
 * `<statement>`, `<introduction>` and `<conclusion>`, which are divs),
 * `<cascade>`, `<page>`, and the sectioning components that pass the numbering around
 * them through in place of a number of their own: `<externalContent>`, the
 * wrapper a copy from an external URI arrives in, and
 * `<standinForFutureLayoutTag>`. For list items it is `<cascade>` and `<page>`,
 * the containers a list renders the items of. In
 *
 * ```xml
 * <section/>
 * <div><section/><cascade><section/></cascade></div>
 * <section/>
 * ```
 *
 * the four sections are numbered 1, 2, 3, 4: the ones inside the div continue
 * the sequence of the sections around it, and the section after it continues
 * after them.
 *
 * Every other component bounds a sequence. A division numbers the divisions
 * inside it from 1, and so does a `<proof>`, which shows no number but has a
 * heading of its own and starts closed, so that numbering through it would
 * skip numbers the reader cannot see. So does a container a sequence does not
 * pass through, such as a `<blockQuote>`, a `<sideBySide>` or a `<solution>`:
 * every block component and `<li>` numbers the divisions among its children,
 * counting through the pass-throughs among them.
 * A composite such as a `<group>` or a `<conditionalContent>` is no container
 * at all: its replacements are the children of its parent.
 *
 * Every component that numbers its children records the counters they start
 * from (`…Offset`): the document from the `initializeCounters` the hosting
 * page passed in, a component that bounds a sequence from zero, and a
 * pass-through from where its parent's count stands before it. An item, or a
 * pass-through, walks the siblings *before* it in order from those counters:
 * an item advances its counter by one, and a pass-through by the items it
 * holds (`…Counts`). An item takes the next number; a pass-through records
 * where the count stands as its own `…Offset`, so nested pass-throughs
 * continue one sequence.
 *
 * A number depends only on what comes before it, never on the siblings after
 * it (the `precedingSiblings` dependency). So a composite after a section can
 * read the section's number in a parameter it needs before it can expand, such
 * as `<sequence to="$s.sectionNumber"/>` (#2578 item 1). Read through the
 * numbers of all the parent's children, that had to wait for the composite to
 * expand: a circular dependency that stopped the document from loading.
 *
 * Counts flow up (`…Counts` reads only children) and offsets flow down
 * (`…Offset` reads only the parent and the siblings before), so there is no
 * cycle. None of it reads
 * visibility or credit: which steps a cascade has revealed does not move a
 * number, and answering a question recomputes none of this. A number does
 * follow a count that changes at runtime: when a `<repeatForSequence>` or a
 * `<conditionalContent>` among the items, or inside a pass-through among them,
 * grows or shrinks, the items after it are renumbered.
 *
 * Counters, counts and offsets are keyed by the name of a counter
 * (`counterOf`), so that a sequence could number each type of division
 * separately by giving each its own counter. Both sequences use one counter
 * today.
 */

/**
 * Whether `componentType` is `baseComponentType` or inherits from it.
 */
function inherits(componentType, baseComponentType, componentInfoObjects) {
    return componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: componentType,
        baseComponentType,
    });
}

/**
 * The components the division sequence passes through. Each calls
 * `returnSequencePassThroughDefinitions(DIVISION_SEQUENCE)`.
 */
const DIVISION_PASS_THROUGH_TYPES = [
    "div",
    "cascade",
    "page",
    "externalContent",
    "standinForFutureLayoutTag",
];

/**
 * A sequence of numbers: what takes a number in it, what it passes through,
 * and the names of the state variables that carry it.
 *
 * @typedef {object} Sequence
 * @property {string} name - prefixes the dependency names a numbered item
 *   reads the sequence through, keeping them apart from another sequence's.
 * @property {string} counts - a pass-through's counts of the items it holds.
 * @property {string} offset - the counters the children of a component that
 *   numbers them start from: for a pass-through, the counts of the items
 *   before it.
 * @property {string} itemComponentType - the base type of the items.
 * @property {string[]} passThroughComponentTypes - the base types of the
 *   components the sequence passes through.
 * @property {(componentType: string) => string} counterOf - the counter an
 *   item of this type advances.
 */

/** @type {Sequence} */
export const DIVISION_SEQUENCE = {
    name: "division",
    counts: "divisionCounts",
    offset: "divisionOffset",
    itemComponentType: "_sectioningComponentNumberWithSiblings",
    passThroughComponentTypes: DIVISION_PASS_THROUGH_TYPES,
    // One sequence across the types of division.
    counterOf: () => "division",
};

/** @type {Sequence} */
export const LIST_ITEM_SEQUENCE = {
    name: "listItem",
    counts: "listItemCounts",
    offset: "listItemOffset",
    // Every sectioning child counts, whether or not it is itself a list item.
    itemComponentType: "_sectioningComponent",
    passThroughComponentTypes: ["cascade", "page"],
    counterOf: () => "listItem",
};

/**
 * Whether `sequence` passes through a component of type `componentType`.
 */
function isPassThrough(sequence, componentType, componentInfoObjects) {
    return sequence.passThroughComponentTypes.some((baseComponentType) =>
        inherits(componentType, baseComponentType, componentInfoObjects),
    );
}

/**
 * The children a list renders besides its `<introduction>` and `<conclusion>`:
 * its items, and the containers that hold items without being one — a
 * `<cascade>` that reveals them and a `<page>` that prints them.
 */
export const LIST_CONTAINER_TYPES = ["_sectioningComponent", "cascade", "page"];

/**
 * Walk `children` in order, starting from `offset`: each item advances its
 * counter by one, and each pass-through advances the counters by its counts.
 * With `countThroughPassThroughs` false, a pass-through counts as any other
 * component that is not an item: not at all.
 *
 * @returns {object} the counters' final values.
 */
function countChildren({
    sequence,
    children,
    offset = {},
    componentInfoObjects,
    countThroughPassThroughs = true,
}) {
    const counters = { ...offset };

    for (const child of children) {
        if (typeof child !== "object" || child === null) {
            continue;
        }
        if (
            isPassThrough(sequence, child.componentType, componentInfoObjects)
        ) {
            if (countThroughPassThroughs) {
                for (const [counter, count] of Object.entries(
                    child.stateValues?.[sequence.counts] ?? {},
                )) {
                    counters[counter] = (counters[counter] ?? 0) + count;
                }
            }
        } else if (
            inherits(
                child.componentType,
                sequence.itemComponentType,
                componentInfoObjects,
            )
        ) {
            const counter = sequence.counterOf(child.componentType);
            counters[counter] = (counters[counter] ?? 0) + 1;
        }
    }

    return counters;
}

/**
 * The counters a document starts from, given the `initializeCounters` the
 * hosting page passed in: an entry for a type of item starts the counter that
 * type advances, so that the first item on that counter, of whatever type,
 * takes the entry's value. As with the sibling count, the first entry found for
 * a counter wins.
 */
function initialOffset({ sequence, initializeCounters, componentInfoObjects }) {
    const offset = {};
    for (const [componentType, initialCounter] of Object.entries(
        initializeCounters ?? {},
    )) {
        if (
            !inherits(
                componentType,
                sequence.itemComponentType,
                componentInfoObjects,
            )
        ) {
            continue;
        }
        const counter = sequence.counterOf(componentType);
        if (!(counter in offset)) {
            offset[counter] = initialCounter - 1;
        }
    }
    return offset;
}

function childrenCountsDependency(sequence) {
    return {
        dependencyType: "child",
        includeAllChildren: true,
        variableNames: [sequence.counts],
        variablesOptional: true,
    };
}

/**
 * The definition of `sequence.offset` for a component that numbers its
 * children and is not a pass-through: the counters its children start from.
 * The document starts from the `initializeCounters` the hosting page passed
 * in; any other component from zero.
 *
 * @param {Sequence} sequence
 * @param {object} params
 * @param {boolean} params.isDocument - whether the component is the document.
 */
export function returnSequenceStartDefinition(
    sequence,
    { isDocument = false } = {},
) {
    return {
        returnDependencies: () =>
            isDocument
                ? {
                      initializeCounters: {
                          dependencyType: "initializeCounters",
                      },
                  }
                : {},
        definition({ dependencyValues, componentInfoObjects }) {
            return {
                setValue: {
                    [sequence.offset]: isDocument
                        ? initialOffset({
                              sequence,
                              initializeCounters:
                                  dependencyValues.initializeCounters,
                              componentInfoObjects,
                          })
                        : {},
                },
            };
        },
    };
}

/**
 * The dependencies of the counters before a component in `sequence`: where
 * its parent's count starts (`sequence.offset`, which a parent that numbers no
 * children does not have), and the siblings before it, with the counts of the
 * pass-throughs among them.
 *
 * @param {Sequence} sequence
 */
function countersBeforeDependencies(sequence) {
    return {
        [`${sequence.name}ParentOffset`]: {
            dependencyType: "parentStateVariable",
            variableName: sequence.offset,
        },
        [`${sequence.name}PrecedingSiblings`]: {
            dependencyType: "precedingSiblings",
            variableNames: [sequence.counts],
            variablesOptional: true,
            // A placeholder of any other type can't change the count.
            placeholderTypesToWaitFor: [
                sequence.itemComponentType,
                ...sequence.passThroughComponentTypes,
            ],
        },
    };
}

/**
 * The counters before a component in `sequence`, from the dependencies of
 * `countersBeforeDependencies(sequence)`. In a parent that numbers no
 * children (a container that neither bounds nor passes on the sequence), the
 * count starts at zero, and a pass-through among the siblings is not counted
 * through.
 *
 * @param {Sequence} sequence
 */
function countersBefore({ sequence, dependencyValues, componentInfoObjects }) {
    const parentOffset = dependencyValues[`${sequence.name}ParentOffset`];
    return countChildren({
        sequence,
        children: dependencyValues[`${sequence.name}PrecedingSiblings`],
        offset: parentOffset ?? {},
        componentInfoObjects,
        countThroughPassThroughs: parentOffset != null,
    });
}

/**
 * The state variables of a component `sequence` passes through: its counts
 * of the items it holds, its offset (the counts of the items before it), and
 * the numbers of its children, counted on from that offset.
 *
 * @param {Sequence} sequence
 */
export function returnSequencePassThroughDefinitions(sequence) {
    return {
        [sequence.counts]: {
            returnDependencies: () => ({
                children: childrenCountsDependency(sequence),
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const counters = countChildren({
                    sequence,
                    children: dependencyValues.children,
                    componentInfoObjects,
                });
                return { setValue: { [sequence.counts]: counters } };
            },
        },
        [sequence.offset]: {
            returnDependencies: () => countersBeforeDependencies(sequence),
            definition({ dependencyValues, componentInfoObjects }) {
                // A parent the sequence neither passes through nor is bounded
                // by numbers no children, and the count starts over here.
                return {
                    setValue: {
                        [sequence.offset]:
                            dependencyValues[`${sequence.name}ParentOffset`] ==
                            null
                                ? {}
                                : countersBefore({
                                      sequence,
                                      dependencyValues,
                                      componentInfoObjects,
                                  }),
                    },
                };
            },
        },
    };
}

/**
 * The dependencies an item numbers itself from in `sequence`: where its
 * parent's count starts and the siblings before it.
 *
 * @param {Sequence} sequence
 */
export function sequenceNumberDependencies(sequence) {
    return countersBeforeDependencies(sequence);
}

/**
 * An item's number in `sequence`, from the dependencies of
 * `sequenceNumberDependencies(sequence)`: one more than the count of its
 * counter before it. In a parent that numbers no children, that is its count
 * among its sibling items.
 *
 * @param {Sequence} sequence
 */
export function sequenceNumberFromParent({
    sequence,
    dependencyValues,
    componentType,
    componentInfoObjects,
}) {
    const counters = countersBefore({
        sequence,
        dependencyValues,
        componentInfoObjects,
    });
    return (counters[sequence.counterOf(componentType)] ?? 0) + 1;
}
