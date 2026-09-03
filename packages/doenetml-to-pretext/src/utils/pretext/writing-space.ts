import type {
    AnnotatedElementRef,
    DastAttribute,
    FlatDastElement,
    FlatDastElementContent,
    FlatDastRoot,
} from "@doenet/doenetml-worker";

/**
 * An expanded `<textInput>` is a text area where a reader writes a long answer. On paper
 * that is blank space, which PreTeXt spells as a `workspace` attribute on the block the
 * space follows. PreTeXt only honors `workspace` inside a printout division, so the
 * division holding the block becomes a `<handout>`.
 *
 * A document with no expanded input is left exactly as it was: wrapping it in a printout
 * would add a heading, a print-preview bar, and (in LaTeX) its own page geometry.
 */

/** A `componentSize`, as the height of an input is reported. */
type ComponentSize = { size: number; isAbsolute: boolean };

/** An absolute `componentSize` is measured in pixels. */
const PIXELS_PER_INCH = 96;

/** The height an expanded `<textInput>` gets when its own height is not a printable length. */
const DEFAULT_HEIGHT_IN_PIXELS = 120;

/**
 * Give every expanded `<textInput>` in `flatDast` room to write in, and turn the divisions
 * holding them into printouts. `flatDast` is mutated in place.
 *
 * An input whose space cannot be placed — because its division cannot become a printout —
 * is left alone, so it still exports as the short `<fillin>` blank.
 */
export function addWritingSpace(flatDast: FlatDastRoot) {
    const expandedInputs = flatDast.elements.filter(isExpandedTextInput);
    if (expandedInputs.length === 0) {
        return;
    }

    /** How much space each paragraph has been asked for, in inches. */
    const requested = new Map<FlatDastElement, number>();
    /** The containers whose contents need to end up inside a printout. */
    const containers = new Set<FlatDastElement | FlatDastRoot>();

    for (const input of expandedInputs) {
        // Rebuilt each time around, since placing one input's space moves content.
        const parents = buildParentMap(flatDast);
        // PreTeXt puts the space after the block it is asked for, so the paragraph the
        // input is written in is what carries it.
        const paragraph = findAncestor(
            input,
            parents,
            (element) => element.name === "p",
        );
        const container = findPrintoutContainer(
            paragraph ?? input,
            parents,
            flatDast,
        );
        if (!container) {
            continue;
        }
        if (paragraph) {
            removeFromParent(input, parents);
        }
        // An input written outside any paragraph — a hand-graded `<answer>` on a line
        // of its own, say — gets a paragraph of its own, standing where it stood, so
        // that the space stays where the reader is meant to write.
        const target =
            paragraph ?? paragraphInPlaceOf(input, parents, flatDast);
        // Two expanded inputs in one paragraph get room for both.
        requested.set(
            target,
            (requested.get(target) ?? 0) + heightInInches(input),
        );
        containers.add(container);
    }

    for (const [paragraph, inches] of requested) {
        setWorkspace(paragraph, inches);
    }
    for (const container of containers) {
        makePrintout(container, flatDast);
    }
}

function isExpandedTextInput(element: FlatDastElement | undefined) {
    if (element?.name !== "textInput") {
        return false;
    }
    const props = propsOf(element);
    // A hidden input is not rendered at all, so it needs no room.
    return props.expanded === true && props.hidden !== true;
}

/**
 * How much space the input asks for. A height relative to the page (`height="50%"`) says
 * nothing about a printed page, so it falls back to the default height.
 */
function heightInInches(input: FlatDastElement) {
    const height = propsOf(input).height as ComponentSize | undefined;
    const pixels =
        height?.isAbsolute && height.size > 0
            ? height.size
            : DEFAULT_HEIGHT_IN_PIXELS;
    return pixels / PIXELS_PER_INCH;
}

/**
 * Elements that render as their children alone. An input inside one of these is written,
 * as far as the page is concerned, where the wrapper is.
 */
const TRANSPARENT_WRAPPERS = new Set(["answer", "_fragment"]);

/**
 * Put a paragraph where `input` is written and return it, since the paragraph is what
 * carries the writing space. Where the input is one of a run of inline content — a
 * question written straight into a list item, say — the paragraph takes in that run,
 * because a list item holds either inline content or blocks, never a mix of the two.
 */
function paragraphInPlaceOf(
    input: FlatDastElement,
    parents: Map<number, FlatDastElement>,
    flatDast: FlatDastRoot,
) {
    const paragraph = addElement(flatDast, { name: "p", children: [] });

    // The input's own slot in the content around it, which is the wrapper it is sugared
    // into rather than the input itself when there is one.
    let slot: FlatDastElement = input;
    let parent = parents.get(slot.data.id);
    while (parent && TRANSPARENT_WRAPPERS.has(parent.name)) {
        slot = parent;
        parent = parents.get(slot.data.id);
    }
    if (!parent) {
        return paragraph;
    }

    const withoutSlot = parent.children.filter(
        (child) => typeof child === "string" || child.id !== slot.data.id,
    );
    const hasInlineContent = parent.children.some(
        (child) => typeof child === "string" && child.trim() !== "",
    );
    if (hasInlineContent) {
        paragraph.children = withoutSlot;
        parent.children = [refTo(paragraph)];
    } else {
        parent.children = parent.children.map((child) =>
            typeof child !== "string" && child.id === slot.data.id
                ? refTo(paragraph)
                : child,
        );
    }
    return paragraph;
}

/** Ask PreTeXt for `inches` of blank space after `paragraph`. */
function setWorkspace(paragraph: FlatDastElement, inches: number) {
    const rounded = Math.round(inches * 100) / 100;
    paragraph.attributes = paragraph.attributes ?? {};
    paragraph.attributes.workspace = {
        type: "attribute",
        name: "workspace",
        children: [{ type: "text", value: `${rounded}in` }],
    } as DastAttribute;
}

/**
 * The element whose contents must become a printout for the workspace to be rendered:
 * the innermost division containing `node`, or the document as a whole if there is none.
 *
 * Returns `undefined` when no printout can hold the workspace, which happens when that
 * container also holds divisions — no PreTeXt printout can contain a division.
 */
function findPrintoutContainer(
    node: FlatDastElement,
    parents: Map<number, FlatDastElement>,
    flatDast: FlatDastRoot,
): FlatDastElement | FlatDastRoot | undefined {
    const container =
        findAncestor(node, parents, (element) => element.name === "division") ??
        documentElement(flatDast) ??
        flatDast;
    return containsDivision(container, flatDast) ? undefined : container;
}

/**
 * Turn `container` into a printout: a division is retagged as a `<handout>`, and the
 * document as a whole gets a `<handout>` wrapped around its contents.
 */
function makePrintout(
    container: FlatDastElement | FlatDastRoot,
    flatDast: FlatDastRoot,
) {
    if (isElement(container) && container.name === "division") {
        // `divisionType` is the name of the tag a division exports as.
        (propsOf(container) as { divisionType: string }).divisionType =
            "handout";
        return;
    }

    // The document itself. Its title stays where it is, since the `<article>` built around
    // the document needs one, and is repeated on the handout so that the printed page is
    // headed by the activity's title.
    const title = container.children.find(
        (child) => elementOf(child, flatDast)?.name === "title",
    );
    const handoutChildren = container.children.filter(
        (child) => child !== title,
    );
    if (title) {
        handoutChildren.unshift(
            copyElement(elementOf(title, flatDast)!, flatDast),
        );
    }

    const handout = addElement(flatDast, {
        name: "handout",
        attributes: {},
        children: handoutChildren,
    });
    container.children = title ? [title, refTo(handout)] : [refTo(handout)];
}

/** A shallow copy of `element` that renders the same content a second time. */
function copyElement(element: FlatDastElement, flatDast: FlatDastRoot) {
    return refTo(
        addElement(flatDast, {
            ...element,
            children: [...element.children],
        }),
    );
}

/** Append a new element to `flatDast`, giving it the next available id. */
function addElement(
    flatDast: FlatDastRoot,
    element: Partial<FlatDastElement> & {
        name: string;
        children: FlatDastElementContent[];
    },
) {
    const newElement = {
        type: "element",
        attributes: {},
        ...element,
        data: { ...element.data, id: flatDast.elements.length },
    } as FlatDastElement;
    flatDast.elements.push(newElement);
    return newElement;
}

function refTo(element: FlatDastElement): AnnotatedElementRef {
    return { id: element.data.id, annotation: "original" };
}

/** Whether `container` has a division somewhere inside it. */
function containsDivision(
    container: FlatDastElement | FlatDastRoot,
    flatDast: FlatDastRoot,
): boolean {
    return container.children.some((child) => {
        const element = elementOf(child, flatDast);
        if (!element) {
            return false;
        }
        return (
            element.name === "division" || containsDivision(element, flatDast)
        );
    });
}

/** The `<document>` element, when the root holds a single one. */
function documentElement(flatDast: FlatDastRoot) {
    if (flatDast.children.length !== 1) {
        return undefined;
    }
    const element = elementOf(flatDast.children[0], flatDast);
    return element?.name === "document" ? element : undefined;
}

function findAncestor(
    element: FlatDastElement,
    parents: Map<number, FlatDastElement>,
    predicate: (element: FlatDastElement) => boolean,
) {
    let current = parents.get(element.data.id);
    while (current) {
        if (predicate(current)) {
            return current;
        }
        current = parents.get(current.data.id);
    }
    return undefined;
}

function removeFromParent(
    element: FlatDastElement,
    parents: Map<number, FlatDastElement>,
) {
    const parent = parents.get(element.data.id);
    if (!parent) {
        return;
    }
    parent.children = parent.children.filter(
        (child) => typeof child === "string" || child.id !== element.data.id,
    );
}

function buildParentMap(flatDast: FlatDastRoot) {
    const parents = new Map<number, FlatDastElement>();
    for (const element of flatDast.elements) {
        if (!element) {
            continue;
        }
        for (const child of element.children) {
            if (typeof child !== "string") {
                parents.set(child.id, element);
            }
        }
    }
    return parents;
}

function elementOf(child: FlatDastElementContent, flatDast: FlatDastRoot) {
    return typeof child === "string" ? undefined : flatDast.elements[child.id];
}

function propsOf(element: FlatDastElement): Record<string, unknown> {
    return (element.data as { props?: Record<string, unknown> }).props ?? {};
}

function isElement(
    node: FlatDastElement | FlatDastRoot,
): node is FlatDastElement {
    return (node as FlatDastElement).type === "element";
}
