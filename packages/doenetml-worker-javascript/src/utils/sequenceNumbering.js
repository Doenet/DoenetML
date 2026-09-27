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
 * `<cascade>`, and the sectioning components that pass the numbering around
 * them through in place of a number of their own: `<externalContent>`, the
 * wrapper a copy from an external URI arrives in, and
 * `<standinForFutureLayoutTag>`. For list items it is `<cascade>` alone, the one
 * container a list renders the items of. In
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
 * The component that bounds a sequence numbers its children. The
 * `…NumbersOfChildren` of a sequence walks the children in order with a
 * counter: an item takes the next number, and a pass-through is recorded at the
 * counter's current value — the count of items before it — and then advances
 * the counter by the items it holds (`…Counts`). A pass-through numbers its
 * own children the same way, starting from the value its parent recorded for it
 * (`…Offset`), so nested pass-throughs continue one sequence.
 *
 * Counts flow up (`…Counts` reads only children) and offsets flow down
 * (`…Offset` reads only the parent), so there is no cycle. None of it reads
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
 * @property {string} numbersOfChildren - the state variable mapping each
 *   child to its number.
 * @property {string} counts - a pass-through's counts of the items it holds.
 * @property {string} offset - a pass-through's counts of the items before it.
 * @property {string} itemComponentType - the base type of the items.
 * @property {(componentType: string, componentInfoObjects: object) => boolean}
 *   isPassThrough - whether the sequence passes through a component of this
 *   type.
 * @property {(componentType: string) => string} counterOf - the counter an
 *   item of this type advances.
 */

/** @type {Sequence} */
export const DIVISION_SEQUENCE = {
    name: "division",
    numbersOfChildren: "divisionNumbersOfChildren",
    counts: "divisionCounts",
    offset: "divisionOffset",
    itemComponentType: "_sectioningComponentNumberWithSiblings",
    isPassThrough: (componentType, componentInfoObjects) =>
        DIVISION_PASS_THROUGH_TYPES.some((baseComponentType) =>
            inherits(componentType, baseComponentType, componentInfoObjects),
        ),
    // One sequence across the types of division.
    counterOf: () => "division",
};

/** @type {Sequence} */
export const LIST_ITEM_SEQUENCE = {
    name: "listItem",
    numbersOfChildren: "listItemNumbersOfChildren",
    counts: "listItemCounts",
    offset: "listItemOffset",
    // Every sectioning child counts, whether or not it is itself a list item.
    itemComponentType: "_sectioningComponent",
    isPassThrough: (componentType, componentInfoObjects) =>
        inherits(componentType, "cascade", componentInfoObjects),
    counterOf: () => "listItem",
};

/**
 * Walk `children` in order, starting from `offset`: each item takes the next
 * number of its counter, and each pass-through is recorded at the counters'
 * current values and then advances them by its counts.
 *
 * @returns {{ numbers: object, counters: object }} `numbers` maps the
 *   component index of each item to its number and of each pass-through to its
 *   offset; `counters` holds the counters' final values.
 */
function numberChildren({
    sequence,
    children,
    offset = {},
    componentInfoObjects,
}) {
    const counters = { ...offset };
    const numbers = {};

    for (const child of children) {
        if (typeof child !== "object") {
            continue;
        }
        if (sequence.isPassThrough(child.componentType, componentInfoObjects)) {
            numbers[child.componentIdx] = { ...counters };
            for (const [counter, count] of Object.entries(
                child.stateValues[sequence.counts] ?? {},
            )) {
                counters[counter] = (counters[counter] ?? 0) + count;
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
            numbers[child.componentIdx] = counters[counter];
        }
    }

    return { numbers, counters };
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
 * The definition of `sequence.numbersOfChildren`: an object mapping the
 * component index of each item child to its number, and of each pass-through
 * child to the counts of the items before it.
 *
 * @param {Sequence} sequence
 * @param {object} params
 * @param {boolean} params.hasOffset - whether the component is a pass-through,
 *   which starts counting from its offset.
 * @param {boolean} params.isDocument - whether the component is the document,
 *   which starts counting from the `initializeCounters` the hosting page
 *   passed in.
 *
 * Otherwise counting starts at zero.
 */
export function returnSequenceNumbersOfChildrenDefinition(
    sequence,
    { hasOffset = false, isDocument = false } = {},
) {
    return {
        returnDependencies: () => ({
            children: childrenCountsDependency(sequence),
            ...(hasOffset
                ? {
                      offset: {
                          dependencyType: "stateVariable",
                          variableName: sequence.offset,
                      },
                  }
                : {}),
            ...(isDocument
                ? {
                      initializeCounters: {
                          dependencyType: "initializeCounters",
                      },
                  }
                : {}),
        }),
        definition({ dependencyValues, componentInfoObjects }) {
            const { numbers } = numberChildren({
                sequence,
                children: dependencyValues.children,
                offset:
                    dependencyValues.offset ??
                    initialOffset({
                        sequence,
                        initializeCounters: dependencyValues.initializeCounters,
                        componentInfoObjects,
                    }),
                componentInfoObjects,
            });

            return { setValue: { [sequence.numbersOfChildren]: numbers } };
        },
    };
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
                const { counters } = numberChildren({
                    sequence,
                    children: dependencyValues.children,
                    componentInfoObjects,
                });
                return { setValue: { [sequence.counts]: counters } };
            },
        },
        [sequence.offset]: {
            returnDependencies: () => ({
                parentNumbers: {
                    dependencyType: "parentStateVariable",
                    variableName: sequence.numbersOfChildren,
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                // A parent the sequence neither passes through nor is bounded
                // by numbers no children, and the count starts over here.
                return {
                    setValue: {
                        [sequence.offset]:
                            dependencyValues.parentNumbers?.[componentIdx] ??
                            {},
                    },
                };
            },
        },
        [sequence.numbersOfChildren]: returnSequenceNumbersOfChildrenDefinition(
            sequence,
            { hasOffset: true },
        ),
    };
}

/**
 * The dependencies an item numbers itself from in `sequence`: the numbers its
 * parent gave its children, and its count among its sibling items as the
 * fallback for a parent that numbers no children.
 *
 * @param {Sequence} sequence
 */
export function sequenceNumberDependencies(sequence) {
    return {
        [`${sequence.name}ParentNumbers`]: {
            dependencyType: "parentStateVariable",
            variableName: sequence.numbersOfChildren,
        },
        [`${sequence.name}CountAmongSiblings`]: {
            dependencyType: "countAmongSiblings",
            componentType: sequence.itemComponentType,
            includeInheritedComponentTypes: true,
        },
    };
}

/**
 * An item's number in `sequence`, from the dependencies of
 * `sequenceNumberDependencies(sequence)`: the number its parent gave it, or,
 * when the parent numbers no children (a container that neither bounds nor
 * passes on the sequence), its count among its sibling items.
 *
 * @param {Sequence} sequence
 */
export function sequenceNumberFromParent({
    sequence,
    dependencyValues,
    componentIdx,
}) {
    return (
        dependencyValues[`${sequence.name}ParentNumbers`]?.[componentIdx] ??
        dependencyValues[`${sequence.name}CountAmongSiblings`]
    );
}
