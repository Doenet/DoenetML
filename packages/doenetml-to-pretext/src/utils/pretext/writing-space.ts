/**
 * An expanded `<textInput>` is a text area where a reader writes a long answer. On paper
 * that is blank space, which PreTeXt spells as a `workspace` attribute on the block the
 * space follows. PreTeXt only honors `workspace` inside a printout division, so the
 * division holding the block becomes a `<handout>`.
 *
 * A document with no expanded input is left exactly as it was: wrapping it in a printout
 * would add a heading, a print-preview bar, and (in LaTeX) its own page geometry.
 */
import type {
    AnnotatedElementRef,
    FlatDastElement,
    FlatDastElementContent,
    FlatDastRoot,
} from "@doenet/doenetml-worker";

/** A `componentSize`, as the height of an input is reported. */
type ComponentSize = { size: number; isAbsolute: boolean };

/** An absolute `componentSize` is measured in pixels. */
const PIXELS_PER_INCH = 96;

/**
 * The height an expanded `<textInput>` gets when its own height is not a printable length.
 * It matches the default of the component's `height` attribute, so that an input that says
 * nothing about its height gets the same space on paper as it takes on screen.
 */
const DEFAULT_HEIGHT_IN_PIXELS = 120;

/**
 * Wrappers with no room for a paragraph inside them, which the space an input asks for is
 * therefore placed outside of, at the outermost such wrapper. Two kinds: the `<answer>` an
 * input is sugared into and the fragment a reference to it renders as, which stand where
 * their children stand; and the formatting an author writes around a phrase, which holds a
 * run of text and nothing more.
 */
const INLINE_WRAPPERS = new Set([
    "answer",
    "_fragment",
    "em",
    "alert",
    "attr",
    "c",
    "q",
]);

/**
 * Elements that stand on their own on the page. Anything else is read as part of a run of
 * text, and a paragraph carrying writing space takes it in rather than leaving it beside a
 * block, since a list item holds a run of text or a series of blocks and never a mix.
 *
 * Naming the blocks is what keeps this list short enough to stay right: far more elements
 * are read as text than stand on their own, and it is text that is written beside an input.
 * Either way a name the list has not heard of prints where it was written; only the source
 * PreTeXt is asked to make sense of, so the list errs towards the commoner reading.
 */
const BLOCK_ELEMENTS = new Set([
    // Text laid out as its own block.
    "p",
    "pre",
    "blockQuote",
    "blockquote",
    "poem",
    // A `<codeEditor>` exports as a `<program>`, but a `<displayDoenetML>` is not here:
    // it exports as the text it shows, with no element around it.
    "codeEditor",
    "program",
    "console",
    // Displayed mathematics, as opposed to mathematics inside a sentence.
    "me",
    "md",
    "men",
    "mdn",
    // Lists.
    "ol",
    "ul",
    "dl",
    "li",
    "list",
    // Figures, tables and other drawn blocks.
    "graph",
    "image",
    "figure",
    "video",
    "audio",
    "table",
    "tabular",
    "spreadsheet",
    "orbitalDiagram",
    "sideBySide",
    "sidebyside",
    // Blocks that hold a piece of the document.
    "division",
    "section",
    "subsection",
    "subsubsection",
    "worksheet",
    "handout",
    "page",
    "title",
    "introduction",
    "conclusion",
    "objectives",
    "outcomes",
    "assemblage",
    "aside",
    "exercise",
    "task",
    // Statements set apart from the text around them.
    "definition",
    "example",
    "problem",
    "question",
    "theorem",
    "proof",
    "activity",
    "remark",
    "note",
]);

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
        const container = findPrintoutContainer(input, parents, flatDast);
        if (!container) {
            continue;
        }
        const paragraph = paragraphForSpace(input, parents, flatDast);
        if (!paragraph) {
            continue;
        }
        // Two expanded inputs in one paragraph get room for both.
        requested.set(
            paragraph,
            (requested.get(paragraph) ?? 0) + heightInInches(input),
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
    // A hidden input asks the reader nothing, so it claims no room.
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
 * The paragraph that carries the space `input` asks for, with the input itself taken out of
 * the document: the space stands where the input stood. PreTeXt puts the space after the
 * block it is asked for, so an input written inside a paragraph hands the space to that
 * paragraph.
 *
 * An input written outside any paragraph — a hand-graded `<answer>` on a line of its own,
 * say — gets a paragraph of its own, standing where it stood, so that the space stays where
 * the reader is meant to write. Where the input is one of a run of inline content — a
 * question written straight into a list item, say — that new paragraph takes in the run,
 * because a list item holds either inline content or blocks, never a mix of the two.
 *
 * Returns `undefined` when the input sits in no element at all and so has no place to put a
 * paragraph, leaving it to export as the short `<fillin>` blank.
 */
function paragraphForSpace(
    input: FlatDastElement,
    parents: Map<number, FlatDastElement>,
    flatDast: FlatDastRoot,
) {
    const enclosing = findAncestor(
        input,
        parents,
        (element) => element.name === "p",
    );
    if (enclosing) {
        removeFromParent(input, parents);
        return enclosing;
    }

    // The input's own slot in the content around it: the outermost wrapper that has no
    // room for the paragraph, rather than the input itself when there is one.
    let slot: FlatDastElement = input;
    let parent = parents.get(slot.data.id);
    while (parent && INLINE_WRAPPERS.has(parent.name)) {
        slot = parent;
        parent = parents.get(slot.data.id);
    }
    if (!parent) {
        return undefined;
    }

    // Where the slot sits among its siblings, read before the input is taken out, since
    // taking it out shifts everything after it along.
    const slotIndex = parent.children.findIndex(
        (child) => typeof child !== "string" && child.id === slot.data.id,
    );
    // What the slot was written among, which decides whether the new paragraph stands
    // beside its siblings or takes them in.
    const alongsideBlocks = parent.children.some(
        (child, index) =>
            index !== slotIndex && isBlockContent(child, flatDast),
    );
    // Only the input goes: a wrapper it was sugared into stays, since that wrapper is what
    // renders the question's label.
    removeFromParent(input, parents);

    const paragraph = addElement(flatDast, "p", []);
    if (!alongsideBlocks) {
        paragraph.children = parent.children;
        parent.children = [refTo(paragraph)];
    } else if (slot === input) {
        // Nothing is left of the slot, so the paragraph simply takes its place.
        parent.children.splice(slotIndex, 0, refTo(paragraph));
    } else {
        paragraph.children = [parent.children[slotIndex]];
        parent.children[slotIndex] = refTo(paragraph);
    }
    return paragraph;
}

/**
 * Whether `child` stands on its own on the page: a block, or a reference that renders one.
 * Written-out text never does.
 */
function isBlockContent(
    child: FlatDastElementContent,
    flatDast: FlatDastRoot,
): boolean {
    if (typeof child === "string") {
        return false;
    }
    const element = elementOf(child, flatDast);
    if (!element) {
        return false;
    }
    if (element.name === "_fragment") {
        return element.children.some((c) => isBlockContent(c, flatDast));
    }
    if (element.name === "choiceInput") {
        // A choice input is a list of every choice, unless it is written inline, where it
        // is the chosen one read as part of the sentence around it.
        return propsOf(element).inline !== true;
    }
    return BLOCK_ELEMENTS.has(element.name);
}

/** Ask PreTeXt for `inches` of blank space after `paragraph`. */
function setWorkspace(paragraph: FlatDastElement, inches: number) {
    const rounded = Math.round(inches * 100) / 100;
    paragraph.attributes = paragraph.attributes ?? {};
    paragraph.attributes.workspace = {
        type: "attribute",
        name: "workspace",
        children: [{ type: "text", value: `${rounded}in` }],
    };
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
    if (container.type === "element" && container.name === "division") {
        // `divisionType` is the name of the tag a division exports as.
        mutableProps(container).divisionType = "handout";
        return;
    }

    // The document itself. Its title stays where it is, since the `<article>` built around
    // the document needs one, and is rendered a second time on the handout so that the
    // printed page is headed by the activity's title. That second rendering is annotated a
    // duplicate, so it claims none of the `xml:id`s the first one already owns.
    const titleRef = container.children.find(
        (child): child is AnnotatedElementRef =>
            elementOf(child, flatDast)?.name === "title",
    );
    const handoutChildren = container.children.filter(
        (child) => child !== titleRef,
    );
    if (titleRef) {
        handoutChildren.unshift({ id: titleRef.id, annotation: "duplicate" });
    }

    const handout = addElement(flatDast, "handout", handoutChildren);
    container.children = titleRef
        ? [titleRef, refTo(handout)]
        : [refTo(handout)];
}

/** Append a new element to `flatDast`, giving it the next available id. */
function addElement(
    flatDast: FlatDastRoot,
    name: string,
    children: FlatDastElementContent[],
): FlatDastElement {
    const element: FlatDastElement = {
        type: "element",
        name,
        attributes: {},
        children,
        data: { id: flatDast.elements.length },
    };
    flatDast.elements.push(element);
    return element;
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

/**
 * The resolved `forRenderer` state values the core hands each element. `ElementData` does
 * not declare them, so reaching them takes a cast.
 */
type DataWithProps = { props?: Record<string, unknown> };

/**
 * The resolved `forRenderer` state values of `element`. The converter runs the core, so
 * these — rather than the element's (empty) attributes — say how it was written.
 */
function propsOf(element: FlatDastElement): Record<string, unknown> {
    return (element.data as DataWithProps).props ?? {};
}

/** The props of `element`, to write into, created if the element has none. */
function mutableProps(element: FlatDastElement): Record<string, unknown> {
    const data = element.data as DataWithProps;
    return (data.props ??= {});
}
