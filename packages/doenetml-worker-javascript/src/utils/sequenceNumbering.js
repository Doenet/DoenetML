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
 * pass-through from where its parent's count stands before it.
 *
 * Each item and each pass-through records the counters as they stand after
 * it (`…CountersAfter`). Before it, they are where the nearest item or
 * pass-through before it among its siblings left them, or, with none, its
 * parent's offset. After an item, its counter is one
 * more; after a pass-through, the counters have advanced by the items it holds
 * (`…Counts`). An item's number is its counter after it; a pass-through's
 * offset is its counters before it, so nested pass-throughs continue one
 * sequence. In a parent that numbers no children (one with no offset, such
 * as a `<span>`), the count starts at zero and a pass-through doesn't advance
 * it.
 *
 * A number depends only on what comes before it, never on the siblings after
 * it. So a composite after a section can read the section's number in a
 * parameter it needs before it can expand, such as
 * `<sequence to="$s.sectionNumber"/>` (#2578 item 1). Read through the numbers
 * of all the parent's children, that had to wait for the composite to expand:
 * a circular dependency that stopped the document from loading. And each item
 * reads one sibling (the `nearestPrecedingSibling` dependency), so the
 * numbering of N items costs O(N) dependencies, not O(N²).
 *
 * Counts flow up (`…Counts` reads only children) and counters flow forward
 * and down (`…CountersAfter` and `…Offset` read only the parent, an earlier
 * sibling and the component's own counts),
 * so there is no cycle. None of it reads
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
 * @property {string} countersAfter - an item's or pass-through's counters as
 *   they stand after it.
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
    countersAfter: "divisionCountersAfter",
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
    countersAfter: "listItemCountersAfter",
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
 * Walk `children` in order: each item advances its counter by one, and each
 * pass-through advances the counters by its counts.
 *
 * @returns {object} the counters' final values.
 */
function countChildren({ sequence, children, componentInfoObjects }) {
    const counters = {};

    for (const child of children) {
        if (typeof child !== "object" || child === null) {
            continue;
        }
        if (
            isPassThrough(sequence, child.componentType, componentInfoObjects)
        ) {
            addCounts(counters, child.stateValues?.[sequence.counts]);
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

/** Advance `counters` by `counts`, in place. */
function addCounts(counters, counts) {
    for (const [counter, count] of Object.entries(counts ?? {})) {
        counters[counter] = (counters[counter] ?? 0) + count;
    }
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
 * The dependencies of the counters before an item or a pass-through: its
 * parent's offset, and the nearest item or pass-through before it among its
 * siblings, with its counters after it.
 *
 * @param {Sequence} sequence
 */
function countersBeforeDependencies(sequence) {
    return {
        parentOffset: {
            dependencyType: "parentStateVariable",
            variableName: sequence.offset,
        },
        previous: {
            dependencyType: "nearestPrecedingSibling",
            componentTypes: [
                sequence.itemComponentType,
                ...sequence.passThroughComponentTypes,
            ],
            variableNames: [sequence.countersAfter],
        },
    };
}

/**
 * The counters before an item or a pass-through, from the dependencies of
 * `countersBeforeDependencies`: the counters after the nearest item or
 * pass-through before it, or, with none, its parent's offset (zero in a
 * parent that numbers no children). A copy, to be advanced.
 *
 * @param {Sequence} sequence
 */
function countersBefore(sequence, dependencyValues) {
    const previous = dependencyValues.previous[0];
    return {
        ...(previous
            ? previous.stateValues[sequence.countersAfter]
            : (dependencyValues.parentOffset ?? {})),
    };
}

/**
 * The state variables of a component `sequence` passes through: its counts
 * of the items it holds, its offset (the counters its children start from,
 * which are the counters before it), and its counters after it.
 *
 * Each item and pass-through reads the counters after the one before it, so
 * the counters form one chain through the siblings. Its links are kept to one
 * state variable each: there is no state variable for the counters before.
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
            definition({ dependencyValues }) {
                // A parent the sequence neither passes through nor is bounded
                // by numbers no children, and the count starts over here.
                return {
                    setValue: {
                        [sequence.offset]:
                            dependencyValues.parentOffset == null
                                ? {}
                                : countersBefore(sequence, dependencyValues),
                    },
                };
            },
        },
        [sequence.countersAfter]: {
            returnDependencies: () => ({
                ...countersBeforeDependencies(sequence),
                counts: {
                    dependencyType: "stateVariable",
                    variableName: sequence.counts,
                },
            }),
            definition({ dependencyValues }) {
                const counters = countersBefore(sequence, dependencyValues);
                // In a parent that numbers no children, a pass-through
                // doesn't advance the count.
                if (dependencyValues.parentOffset != null) {
                    addCounts(counters, dependencyValues.counts);
                }
                return { setValue: { [sequence.countersAfter]: counters } };
            },
        },
    };
}

/**
 * The state variable of an item of `sequence` of type `componentType`: its
 * counters after it, where its counter is one more than before it.
 *
 * @param {Sequence} sequence
 * @param {string} componentType
 */
export function returnSequenceItemDefinitions(sequence, componentType) {
    const counter = sequence.counterOf(componentType);
    return {
        [sequence.countersAfter]: {
            returnDependencies: () => countersBeforeDependencies(sequence),
            definition({ dependencyValues }) {
                const counters = countersBefore(sequence, dependencyValues);
                counters[counter] = (counters[counter] ?? 0) + 1;
                return { setValue: { [sequence.countersAfter]: counters } };
            },
        },
    };
}

/**
 * The dependency an item reads its number in `sequence` from, under the name
 * `${sequence.name}CountersAfter`.
 *
 * @param {Sequence} sequence
 */
export function sequenceNumberDependencies(sequence) {
    return {
        [`${sequence.name}CountersAfter`]: {
            dependencyType: "stateVariable",
            variableName: sequence.countersAfter,
        },
    };
}

/**
 * An item's number in `sequence`, from the dependencies of
 * `sequenceNumberDependencies(sequence)`: its counter after it.
 *
 * @param {Sequence} sequence
 */
export function numberInSequence({
    sequence,
    dependencyValues,
    componentType,
}) {
    return dependencyValues[`${sequence.name}CountersAfter`][
        sequence.counterOf(componentType)
    ];
}
