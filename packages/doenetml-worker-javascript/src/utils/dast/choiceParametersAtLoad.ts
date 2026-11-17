/**
 * What a random choice chooses from comes from what the author wrote, never
 * from what a reader enters or does (D39, SEL-1). A choice whose parameter
 * reaches anything a reader can change is an error at load, the same in
 * every variant, even where the effect could be worked out
 * (`from="$n"` with `n` from an input).
 *
 * A choice is a `<select>`, `<selectFromSequence>`, `<selectPrimeNumbers>`
 * or `<selectRandomNumbers>`; its parameters are the attributes
 * {@link CHOICE_PARAMETERS} lists, and an `<option>`'s `selectWeight` for
 * the `<select>` holding it. (An option's `selectForVariants` takes no
 * reference: one written there is dropped with a warning. The content of an
 * option, and the items a `<shuffle>` or `<choiceInput>` orders, are what is
 * chosen among, not how, and are not read here.)
 *
 * A parameter may read:
 * - literals, and content that can't change;
 * - another random choice, which is checked as a choice itself. A sampler
 *   is not one: it draws again when its parameters change or when it is
 *   resampled, so a choice that reads one is an error, whatever the
 *   sampler reads;
 * - a repeat's `indexName`, always (SEL-2: a reader may decide how many
 *   iterations there are, but not what iteration *k* is);
 * - a repeat's `valueName`, when what the repeat iterates over may be read:
 *   the `for` of a `<repeat>`, or the `from`, `step` and `exclude` (every
 *   attribute but `to` and `length`, which decide only how many) of a
 *   `<repeatForSequence>`.
 *
 * "A reader can change" is DIAG-2's definition: an input (a `<codeEditor>`
 * and an `<orbitalDiagramInput>` too), an answer, a slider, or what a
 * reader writes to (`buildReaderWritableIndex`: what an input's
 * `bindValueTo` names, what a reader drags, an action's target), and
 * anything that reads one of these through a reference, a child or an
 * attribute. DIAG-2's state a reader sets by an action (a hint, a solution
 * or a section opened, a video played) is not checked.
 *
 * A reference to a property reads the component it names whole, as a
 * reference to the component does, except for the properties a reader
 * can't change whatever the component holds ({@link reachProperty}):
 * - a section's `sectionNumber` is decided by where the section is, not
 *   by what it holds: by its `includeParentNumber`, by what before it in
 *   the sequence it is numbered in can change how many sections there are
 *   (a `<conditionalContent>` or a repeat holding a section), and, when it
 *   includes its parent's number, by the same of the section holding it;
 * - a graph's properties are decided by its attributes and those of what
 *   it extends, not by what is in it, and its axes (`xMin`, `xMax`,
 *   `yMin`, `yMax`, `xScale`, `yScale`, and an `aspectRatio` from
 *   `identicalAxisScales`) by a reader who pans or zooms it or a graph
 *   linked to it by an extend, unless they are fixed on each (`fixAxes`,
 *   or a `fixed` written on the graph or one holding it, or, when it
 *   writes neither, on what it extends);
 * - a component a reader drags in a graph only to place it (a `<number>`,
 *   a `<math>`, `buildReaderWritableIndex`'s `placed`) has its `anchor`
 *   changed by the drag, and nothing else.
 *
 * It errs toward allowing, since a false error is worse here than a missed
 * one: a component's label and the attributes that only display or style it
 * ({@link ATTRIBUTES_NOT_READ}) are not read, and a reference that names
 * nothing (a blank) can't change. It reads the serialized document, so it
 * sees every choice the DoenetML can make: in a case not shown, an option
 * not picked, or an iteration not made yet.
 *
 * An extend already in error because it would change what it extends
 * (`extendErrorsAtLoad.ts`) is that error, and is not checked here.
 *
 * A choice in error becomes an `_error` in place of the choice, reported at
 * the parameter (DIAG-4), so it chooses nothing, and the error is the same
 * one, kept once, when the `_error` is made. A choice that extends or copies
 * it takes its parameters from it, and becomes the same `_error`.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import {
    buildReaderWritableIndex,
    isPlacementLocation,
    isUnlinkedCopy,
    namedUnder,
    placementAttribute,
    writtenAsTrue,
} from "../readerWritable";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { codedDiagnostic } from "../diagnostics";
import { errorComponentState } from "./errors";

/** The parameters of a `<selectRandomNumbers>`'s distribution. */
const RANDOM_NUMBERS_PARAMETERS = [
    "numSamples",
    "type",
    "mean",
    "standardDeviation",
    "variance",
    "logMean",
    "logStandardDeviation",
    "logVariance",
    "means",
    "standardDeviations",
    "variances",
    "weights",
    "from",
    "to",
    "step",
    "exclude",
    "numTotal",
    "numSuccesses",
    "numDraws",
    "numTrials",
    "probability",
    "variantDeterminesSeed",
];

/**
 * For each choosing tag, the attributes that decide what it chooses from
 * (SEL-1). How a selection is sorted is not one: it orders what was chosen.
 */
export const CHOICE_PARAMETERS: Record<string, string[]> = {
    select: ["numToSelect", "withReplacement"],
    selectFromSequence: [
        "type",
        "from",
        "to",
        "step",
        "length",
        "exclude",
        "numToSelect",
        "withReplacement",
        "excludeCombinations",
        "coprime",
        "lowercase",
    ],
    selectPrimeNumbers: [
        "from",
        "to",
        "exclude",
        "numToSelect",
        "withReplacement",
        "excludeCombinations",
    ],
    selectRandomNumbers: [...RANDOM_NUMBERS_PARAMETERS, "numToSelect"],
    // A sampler (`<sampleRandomNumbers>`, `<samplePrimeNumbers>`,
    // `<sampleMultivariateRandomNumber>`) is not a choice here: it may read
    // what a reader changes, and draws again when its parameters change, or
    // when it is resampled.
    // A `<choiceInput>`'s `shuffleOrder`, and a `<shuffle>`'s and a
    // `<pretzel>`'s order, take no reference: they are written as literals.
};

/**
 * The parameters an `<option>` gives the `<select>` holding it. Not
 * `selectForVariants`, a list of strings that drops a reference written in
 * it (`doenet-w0106`), so no reference there can reach the choice.
 */
const OPTION_PARAMETERS = ["selectWeight"];

/**
 * The attributes of a component a parameter reaches that only display or
 * style it, or decide whether a reader may change it (which the writable
 * index reads), not its value.
 */
const ATTRIBUTES_NOT_READ = new Set(
    [
        "name",
        "hide",
        "disabled",
        "fixed",
        "fixLocation",
        "draggable",
        "styleNumber",
        "labelIsName",
        "labelPosition",
        "label",
        "shortDescription",
        "description",
        "displayDigits",
        "displayDecimals",
        "displaySmallAsZero",
        "padZeros",
        "renderMode",
        "layer",
        "applyStyleToLabel",
        "isResponse",
        "isPotentialResponse",
    ].map((name) => name.toLowerCase()),
);

/**
 * The composites that create variants without choosing anything
 * themselves, as `decidedByDoenetML.ts` has them.
 */
const PASS_THROUGH_VARIANT_TYPES = new Set([
    "group",
    "document",
    "option",
    "conditionalContent",
    "case",
    "repeat",
    "repeatForSequence",
]);

/**
 * The samplers, which draw again when their parameters change, which may be
 * what a reader changes, or when they are resampled. A choice may not read
 * one at all: what a sampler holds is never decided by the DoenetML.
 */
const SAMPLER_TYPES = new Set([
    "sampleRandomNumbers",
    "samplePrimeNumbers",
    "sampleMultivariateRandomNumber",
]);

/**
 * What a reader enters a value in, besides an `_input`: an `<answer>`, a
 * `<slider>`, and a `<codeEditor>` and an `<orbitalDiagramInput>`, which
 * aren't `_input`s.
 */
const READER_ENTERED_TYPES = new Set([
    "answer",
    "slider",
    "codeEditor",
    "orbitalDiagramInput",
]);

/**
 * The properties of a `<graph>` a reader changes by panning or zooming it,
 * unless its axes are fixed, written in lowercase.
 */
const GRAPH_AXIS_PROPERTIES = new Set([
    "xmin",
    "xmax",
    "ymin",
    "ymax",
    "xscale",
    "yscale",
]);

/**
 * The components the sequences that number sections pass through
 * (`sequenceNumbering.js`): a section is numbered among the sections
 * beside it, through these.
 */
const SECTION_PASS_THROUGH_TYPES = [
    "div",
    "cascade",
    "page",
    "externalContent",
    "standinForFutureLayoutTag",
];

/** The attributes of a repeat that decide only how many iterations it has. */
const COUNT_ONLY_ATTRIBUTES = new Set(["to", "length"]);

/** What a parameter was found to reach that a reader can change. */
type Reached = {
    /** The reference written in the parameter that leads to it. */
    reference: any;
    /** The component a reader can change. */
    changeable: any;
};

/**
 * Find each choice among `document`'s components whose parameter reaches
 * what a reader can change, make it an `_error` in place of the choice, and
 * return its error, to report now.
 */
export function checkChoiceParametersAtLoad({
    document,
    componentInfoObjects,
    sources,
}: {
    document: SerializedComponent;
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
}) {
    const nodeByIdx = new Map<number, any>();
    const parentOf = new Map<any, any>();
    const nodes: any[] = [];

    function index(node: any, parent: any) {
        nodes.push(node);
        if (parent) {
            parentOf.set(node, parent);
        }
        if (typeof node.componentIdx === "number" && node.componentIdx >= 0) {
            nodeByIdx.set(node.componentIdx, node);
        }
        const created = createdIdxOf(node);
        if (created !== undefined) {
            nodeByIdx.set(created, node);
        }
        for (const under of componentsUnder(node)) {
            index(under, node);
        }
    }
    index(document, undefined);

    // Only when a choice has a parameter that holds a component or a
    // reference is what a reader can change worth finding. A literal
    // (`from="1"`) is a component here too, so that is whenever a choice
    // has a parameter written.
    const parametersToCheck: {
        choice: any;
        attributeName: string;
        attribute: any;
    }[] = [];
    for (const node of nodes) {
        const type = typeMadeBy(node);
        const parent = parentOf.get(node);
        const choice =
            type === "option" && parent && typeMadeBy(parent) === "select"
                ? parent
                : CHOICE_PARAMETERS[type]
                  ? node
                  : undefined;
        if (
            !choice ||
            // an extend marked with its error (`extendErrorsAtLoad.ts`), such
            // as `<select extend="$a" numToSelect="$n"/>` of a `<select>`
            // `a`, is that error,
            // with nothing about its attributes' values
            (choice.doenetAttributes?.extendErrorsAtLoad ?? []).length > 0
        ) {
            continue;
        }
        const names =
            type === "option" ? OPTION_PARAMETERS : CHOICE_PARAMETERS[type];
        for (const name of names) {
            const found = attributeNamed(node, name);
            if (found && holdsComponentOrReference(found.attribute)) {
                parametersToCheck.push({
                    choice,
                    attributeName: found.name,
                    attribute: found.attribute,
                });
            }
        }
    }
    if (parametersToCheck.length === 0) {
        return [];
    }

    // what a reader drags in a graph only to place it, which changes its
    // `anchor` alone
    const placed = new Set<number>();
    const writable = buildReaderWritableIndex(
        document,
        componentInfoObjects,
        placed,
    );

    // what each component reaches, once found; `null` for nothing, and
    // while it is being found, for a cycle of references
    const memo = new Map<any, Reached | null>();

    function isA(type: string, base: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: type,
            baseComponentType: base,
        });
    }

    function isChoice(type: string) {
        const componentClass = (
            componentInfoObjects.allComponentClasses as any
        )[type];
        return (
            Boolean(componentClass?.createsVariants) &&
            !PASS_THROUGH_VARIANT_TYPES.has(type) &&
            !SAMPLER_TYPES.has(type) &&
            !isA(type, "_sectioningComponent")
        );
    }

    /**
     * What a reader can change that `node` reaches, as written where it is
     * (`viaReference` false) or named by a reference (true). The reference
     * reported is `reference`, the one written in the parameter that led
     * here, or, from the parameter itself, the first one on the way.
     */
    function reach(
        node: any,
        reference: any,
        viaReference: boolean,
    ): Reached | null {
        if (typeof node !== "object" || node === null) {
            return null;
        }
        const memoKey = viaReference ? node : inPlaceKey(node);
        let found: Reached | null;
        if (memo.has(memoKey)) {
            found = memo.get(memoKey)!;
        } else {
            memo.set(memoKey, null);
            found = reachUncached(node, viaReference);
            memo.set(memoKey, found);
        }
        return (
            found && {
                changeable: found.changeable,
                reference: reference ?? found.reference,
            }
        );
    }

    const inPlaceKeys = new WeakMap<any, object>();
    function inPlaceKey(node: any) {
        let key = inPlaceKeys.get(node);
        if (!key) {
            key = {};
            inPlaceKeys.set(node, key);
        }
        return key;
    }

    /**
     * What a reader can change that `node` reaches ({@link reach}), with
     * the reference found on the way, if any.
     */
    function reachUncached(node: any, viaReference: boolean): Reached | null {
        const type = typeMadeBy(node);
        if (
            viaReference &&
            (writable.has(node.componentIdx) ||
                (createdIdxOf(node) !== undefined &&
                    writable.has(createdIdxOf(node)!)))
        ) {
            return { reference: undefined, changeable: node };
        }
        if (
            isA(type, "_input") ||
            READER_ENTERED_TYPES.has(type) ||
            SAMPLER_TYPES.has(type)
        ) {
            return { reference: undefined, changeable: node };
        }
        if (isChoice(type)) {
            // another random choice: checked as a choice itself
            return null;
        }
        const iteration = iterationVariable(node);
        if (iteration) {
            if (iteration.kind === "index") {
                return null;
            }
            // a repeat's `valueName`: what the repeat iterates over, not
            // whether it is shown (`hide`)
            for (const [name, attribute] of Object.entries(
                iteration.repeat.attributes ?? {},
            )) {
                if (
                    name.startsWith("_") ||
                    ATTRIBUTES_NOT_READ.has(name.toLowerCase()) ||
                    (iteration.repeat.componentType !== "repeat" &&
                        COUNT_ONLY_ATTRIBUTES.has(name))
                ) {
                    continue;
                }
                const found = reachAttribute(attribute, undefined);
                if (found) {
                    return found;
                }
            }
            return null;
        }

        // a reference: what it names, and what its index reads (`$l[$i]`)
        for (const ref of referencesOf(node)) {
            for (const part of ref.originalPath ?? []) {
                for (const indexPart of part?.index ?? []) {
                    for (const value of indexPart?.value ?? []) {
                        if (typeof value === "object" && value !== null) {
                            const found = reach(value, ref, false);
                            if (found) {
                                return found;
                            }
                        }
                    }
                }
            }
            if (typeof ref.nodeIdx === "number") {
                const named = nodeByIdx.get(ref.nodeIdx);
                const placedEntry =
                    named && readsEntryAnchor(named, ref)
                        ? placedEntryOf(named, new Set())
                        : undefined;
                if (placedEntry !== undefined) {
                    // where a reader drags the entry (`$ml[1].anchor`): the
                    // component the entry is placed as
                    return { reference: ref, changeable: placedEntry };
                }
                const placedInComposite =
                    named && placedAnchorInComposite(named, ref);
                if (placedInComposite !== undefined) {
                    // where a reader drags a component of a composite's
                    // DoenetML (`$r[1].n.anchor`)
                    return { reference: ref, changeable: placedInComposite };
                }
                const property = named && propertyNamedBy(named, ref);
                const found =
                    named &&
                    (property
                        ? reachProperty(named, property, ref)
                        : reach(named, ref, true));
                if (found) {
                    return found;
                }
            }
        }

        for (const child of node.children ?? []) {
            if (
                typeof child === "object" &&
                child !== null &&
                !isA(typeMadeBy(child), "label")
            ) {
                const found = reach(child, undefined, viaReference);
                if (found) {
                    return found;
                }
            }
        }
        for (const [name, attribute] of Object.entries(node.attributes ?? {})) {
            if (
                name.startsWith("_") ||
                ATTRIBUTES_NOT_READ.has(name.toLowerCase())
            ) {
                continue;
            }
            const found = reachAttribute(attribute, undefined, viaReference);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /**
     * The property of `named` that the reference `ref` to it reads
     * (`sectionNumber` of `$sec.sectionNumber`), if what follows the name
     * is one, and not a name inside it.
     */
    function propertyNamedBy(named: any, ref: any): string | undefined {
        const name = ref.unresolvedPath?.[0]?.name;
        if (typeof name !== "string") {
            return undefined;
        }
        const info = (componentInfoObjects as any).publicStateVariableInfo?.[
            typeMadeBy(named)
        ];
        if (!info) {
            return undefined;
        }
        const lower = name.toLowerCase();
        return [
            ...Object.keys(info.stateVariableDescriptions ?? {}),
            ...Object.keys(info.aliases ?? {}),
        ].some((property) => property.toLowerCase() === lower)
            ? name
            : undefined;
    }

    /**
     * What a reader can change that the property `property` of `node`,
     * named by the reference `reference`, reaches. A property a reader
     * can't change whatever the component holds reads only what decides
     * it; any other reads the component whole, as a reference to it does.
     */
    function reachProperty(
        node: any,
        property: string,
        reference: any,
    ): Reached | null {
        const type = typeMadeBy(node);
        const lower = property.toLowerCase();
        if (
            isPlacementLocation(property) &&
            anchorIsPlaced(node, property, new Set())
        ) {
            // where a reader drags it
            return { reference, changeable: node };
        }
        if (isA(type, "_sectioningComponent") && lower === "sectionnumber") {
            // decided by where the section is, not by what it holds
            return reachSectionNumber(node, reference, new Set());
        }
        if (isA(type, "graph")) {
            if (
                (GRAPH_AXIS_PROPERTIES.has(lower) ||
                    (lower === "aspectratio" &&
                        aspectRatioFromAxisScales(node))) &&
                !axesFixed(node)
            ) {
                // a reader pans or zooms it
                return { reference, changeable: node };
            }
            // decided by its attributes, not by what is in it
            return reachOwnAttributes(node, reference, new Set());
        }
        return reach(node, reference, true);
    }

    /**
     * What a reader can change that the attributes written on `node`
     * reach, and those of what it extends, other than those that only
     * display or style it.
     */
    function reachOwnAttributes(
        node: any,
        reference: any,
        seen: Set<any>,
    ): Reached | null {
        if (seen.has(node)) {
            return null;
        }
        seen.add(node);
        if (
            writable.has(node.componentIdx) ||
            (createdIdxOf(node) !== undefined &&
                writable.has(createdIdxOf(node)!))
        ) {
            return { reference, changeable: node };
        }
        for (const [name, attribute] of Object.entries(node.attributes ?? {})) {
            if (
                name.startsWith("_") ||
                ATTRIBUTES_NOT_READ.has(name.toLowerCase())
            ) {
                continue;
            }
            const found = reachAttribute(attribute, reference, true);
            if (found) {
                return found;
            }
        }
        // an extend's properties are its source's too
        for (const ref of referencesOf(node)) {
            const source =
                typeof ref.nodeIdx === "number"
                    ? nodeByIdx.get(ref.nodeIdx)
                    : undefined;
            const found =
                source && (ref.unresolvedPath ?? []).length === 0
                    ? reachOwnAttributes(source, reference, seen)
                    : reach(node, reference, true);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /**
     * What a reader can change that the `sectionNumber` of the section
     * `node`, named by `reference`, reaches: its `includeParentNumber`,
     * what before it among the sections it is numbered with can change
     * how many there are (a `<conditionalContent>` or a repeat holding a
     * section, `sequenceNumbering.js`), and, when it includes its parent's
     * number, the same of the section holding it.
     */
    function reachSectionNumber(
        node: any,
        reference: any,
        seen: Set<any>,
    ): Reached | null {
        if (seen.has(node)) {
            return null;
        }
        seen.add(node);
        if (
            writable.has(node.componentIdx) ||
            (createdIdxOf(node) !== undefined &&
                writable.has(createdIdxOf(node)!))
        ) {
            return { reference, changeable: node };
        }
        if (Object.keys(node.extending ?? {}).length > 0) {
            // an extend's properties are its source's too
            return reach(node, reference, true);
        }
        const includeParentNumber = attributeNamed(node, "includeParentNumber");
        if (includeParentNumber) {
            const found = reachAttribute(
                includeParentNumber.attribute,
                reference,
                true,
            );
            if (found) {
                return found;
            }
        }
        // what comes before it in the sequence it is numbered in, which
        // runs through the containers that show no number of their own
        // and through composites
        let current = node;
        for (
            let parent = parentOf.get(current);
            parent;
            current = parent, parent = parentOf.get(current)
        ) {
            for (const sibling of parent.children ?? []) {
                if (sibling === current) {
                    break;
                }
                const found = reachSectionCount(sibling, reference);
                if (found) {
                    return found;
                }
            }
            const parentType = typeMadeBy(parent);
            if (
                !isSectionPassThrough(parentType) &&
                !isA(parentType, "_composite") &&
                parentType !== "case" &&
                parentType !== "else"
            ) {
                break;
            }
        }
        if (includeParentNumber) {
            // the number of the section holding it, past those that show
            // no number of their own
            for (
                let holder = parentOf.get(node);
                holder;
                holder = parentOf.get(holder)
            ) {
                const holderType = typeMadeBy(holder);
                if (
                    isA(holderType, "_sectioningComponent") &&
                    !isSectionPassThrough(holderType)
                ) {
                    return reachSectionNumber(holder, reference, seen);
                }
            }
        }
        return null;
    }

    /**
     * Whether a sequence of section numbers passes through a component of
     * type `type` (`DIVISION_SEQUENCE` and `LIST_ITEM_SEQUENCE` in
     * `sequenceNumbering.js`).
     */
    function isSectionPassThrough(type: string) {
        return SECTION_PASS_THROUGH_TYPES.some((base) => isA(type, base));
    }

    /**
     * What a reader can change that decides how many sections `node`,
     * written before a section in the sequence it is numbered in, holds:
     * the attributes of a composite holding a section (a
     * `<conditionalContent>`'s `condition`, a repeat's `for`), and of its
     * `<case>`s.
     */
    function reachSectionCount(node: any, reference: any): Reached | null {
        if (typeof node !== "object" || node === null) {
            return null;
        }
        const type = typeMadeBy(node);
        const isComposite = isA(type, "_composite");
        if (
            !isComposite &&
            !isSectionPassThrough(type) &&
            type !== "case" &&
            type !== "else"
        ) {
            // a section, which is one, or what bounds a sequence of its own
            return null;
        }
        if (!holdsSection(node)) {
            return null;
        }
        if (isComposite || type === "case") {
            for (const [name, attribute] of Object.entries(
                node.attributes ?? {},
            )) {
                if (
                    name.startsWith("_") ||
                    ATTRIBUTES_NOT_READ.has(name.toLowerCase())
                ) {
                    continue;
                }
                const found = reachAttribute(attribute, reference, true);
                if (found) {
                    return found;
                }
            }
        }
        for (const child of node.children ?? []) {
            const found = reachSectionCount(child, reference);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /** Whether a section is written under `node`. */
    function holdsSection(node: any): boolean {
        return componentsUnder(node).some(
            (under) =>
                isA(typeMadeBy(under), "_sectioningComponent") ||
                holdsSection(under),
        );
    }

    /**
     * Whether the `aspectRatio` of the graph `node` is its axes' scales,
     * which a reader changes by panning or zooming: `identicalAxisScales`
     * written on it, and no `aspectRatio`.
     */
    function aspectRatioFromAxisScales(node: any): boolean {
        return (
            attributeNamed(node, "identicalAxisScales") !== undefined &&
            attributeNamed(node, "aspectRatio") === undefined
        );
    }

    /**
     * Whether a reader can't pan or zoom the graph `node`, nor any graph
     * sharing its axes: what it extends, and what extends it, unless an
     * unlinked copy.
     */
    function axesFixed(node: any): boolean {
        return graphsSharingAxes(node).every((graph) => axesFixedOn(graph));
    }

    /**
     * Whether a reader can't pan or zoom the graph `node` itself:
     * `fixAxes` written as true on it, or `fixed` written as true on it
     * or, when it doesn't write its own, on the nearest component holding
     * it that does; when it writes neither, as what it extends.
     */
    function axesFixedOn(node: any, seen = new Set<any>()): boolean {
        if (seen.has(node)) {
            return false;
        }
        seen.add(node);
        const fixAxes = attributeNamed(node, "fixAxes");
        if (writtenAsTrue(fixAxes?.attribute)) {
            return true;
        }
        let fixed: { attribute: any } | undefined;
        for (
            let holder = node;
            holder && !fixed;
            holder = parentOf.get(holder)
        ) {
            fixed = attributeNamed(holder, "fixed");
        }
        if (fixed) {
            return writtenAsTrue(fixed.attribute);
        }
        if (fixAxes) {
            return false;
        }
        const sources = linkedSourcesOf(node);
        return (
            sources.length > 0 &&
            sources.every((source) => axesFixedOn(source, seen))
        );
    }

    /** The graphs whose axes are those of the graph `node`, it among them. */
    function graphsSharingAxes(node: any): any[] {
        const found = new Set<any>();
        const toVisit = [node];
        while (toVisit.length > 0) {
            const graph = toVisit.pop();
            if (found.has(graph)) {
                continue;
            }
            found.add(graph);
            toVisit.push(...linkedSourcesOf(graph));
            toVisit.push(...(linkedExtendsOf().get(graph) ?? []));
        }
        return [...found];
    }

    /** What the component `node` extends, when linked to it, by name. */
    function linkedSourcesOf(node: any): any[] {
        if (isUnlinkedCopy(node)) {
            return [];
        }
        const sources: any[] = [];
        for (const ref of referencesOf(node)) {
            const source =
                typeof ref.nodeIdx === "number" &&
                (ref.unresolvedPath ?? []).length === 0
                    ? nodeByIdx.get(ref.nodeIdx)
                    : undefined;
            if (source && source !== node) {
                sources.push(source);
            }
        }
        return sources;
    }

    // what extends each component, linked to it, once found
    let linkedExtends: Map<any, any[]> | undefined;
    function linkedExtendsOf(): Map<any, any[]> {
        if (!linkedExtends) {
            linkedExtends = new Map();
            for (const node of nodes) {
                for (const source of linkedSourcesOf(node)) {
                    if (!linkedExtends.has(source)) {
                        linkedExtends.set(source, []);
                    }
                    linkedExtends.get(source)!.push(node);
                }
            }
        }
        return linkedExtends;
    }

    /** Whether a reader drags `node` in a graph only to place it. */
    function isPlaced(node: any): boolean {
        const created = createdIdxOf(node);
        return (
            placed.has(node.componentIdx) ||
            (created !== undefined && placed.has(created))
        );
    }

    /**
     * Whether a reader drags where `node` is placed (its `anchor`, the
     * placement location `location`): it is placed in a graph, or it
     * extends, linked, one whose `anchor` is (`<number extend="$n"/>` of a
     * `<number>` in a graph) and writes no `anchor` of its own, as such an
     * extend shares its source's `anchor`.
     */
    function anchorIsPlaced(
        node: any,
        location: string,
        seen: Set<any>,
    ): boolean {
        return placedAnchorOf(node, location, seen) !== undefined;
    }

    /**
     * The component a reader drags whose `anchor` is where `node` is placed
     * (see {@link anchorIsPlaced}): `node` itself, or what it extends, in
     * turn; `undefined` when there is none.
     */
    function placedAnchorOf(node: any, location: string, seen: Set<any>): any {
        if (seen.has(node)) {
            return undefined;
        }
        seen.add(node);
        if (isPlaced(node)) {
            return node;
        }
        if (placementAttribute(node, location)) {
            return undefined;
        }
        for (const source of linkedSourcesOf(node)) {
            const found = placedAnchorOf(source, location, seen);
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }

    /**
     * Whether the reference `ref` to `named` reads the `anchor` of an entry
     * of it: its path is indices, then a placement location
     * (`$ml[1].anchor`), or, for a list with no such property of its own,
     * the location alone, of every entry (`$ml.anchor`).
     */
    function readsEntryAnchor(named: any, ref: any): boolean {
        const path: any[] = ref.unresolvedPath ?? [];
        const last = path[path.length - 1];
        if (
            typeof last?.name !== "string" ||
            !isPlacementLocation(last.name) ||
            last.index?.length > 0
        ) {
            return false;
        }
        if (path.length === 1) {
            // the entries' `anchor`; an `entryAnchor` is the list's own
            return (
                last.name.toLowerCase() === "anchor" &&
                (componentInfoObjects.allComponentClasses as any)[
                    typeMadeBy(named)
                ]?.listEntryComponentType !== undefined &&
                propertyNamedBy(named, ref) === undefined
            );
        }
        return path
            .slice(0, -1)
            .every((part) => !part?.name && part?.index?.length > 0);
    }

    /**
     * The component a reader drags whose `anchor` the reference `ref` reads
     * through what the composite `named` makes (`$r[1].n.anchor`, `$g.n.anchor`
     * of a placed `n`), if any: the component of its DoenetML that the
     * names of the path find, each once, as `sourceOf` in
     * `readerWritable.ts` finds what an extend copies.
     */
    function placedAnchorInComposite(named: any, ref: any): any {
        const path: any[] = ref.unresolvedPath ?? [];
        const last = path[path.length - 1];
        if (
            path.length < 2 ||
            typeof last?.name !== "string" ||
            !isPlacementLocation(last.name) ||
            last.index?.length > 0 ||
            !path.slice(0, -1).some((part) => part?.name)
        ) {
            return undefined;
        }
        let node = named;
        for (const part of path.slice(0, -1)) {
            if (part?.name) {
                const found = namedUnder(node, part.name);
                if (found.length !== 1) {
                    return undefined;
                }
                node = found[0];
            }
            if (
                part?.index?.length > 0 &&
                !componentInfoObjects.isCompositeComponent({
                    componentType: typeMadeBy(node),
                    includeNonStandard: true,
                })
            ) {
                return undefined;
            }
        }
        return placedAnchorOf(node, last.name, new Set());
    }

    /**
     * The component whose `anchor` a reader drags where an entry of the list
     * `list` is placed, if any: the list, when it is placed in a graph, or
     * a component an entry comes from whose `anchor` is (`$a` in
     * `<mathList>`, of a `<math>` in a graph, `graphSourceOf` in
     * `AuthoredValueList.js`), or one found so for a list it extends,
     * linked. Any entry counts, erring toward changeable.
     */
    function placedEntryOf(list: any, seen: Set<any>): any {
        if (seen.has(list)) {
            return undefined;
        }
        seen.add(list);
        const placedList = placedAnchorOf(list, "entryAnchor", new Set());
        if (placedList !== undefined) {
            return placedList;
        }
        for (const child of [
            ...(list.children ?? []),
            ...linkedSourcesOf(list),
        ]) {
            if (typeof child !== "object" || child === null) {
                continue;
            }
            const found =
                placedAnchorOf(child, "anchor", new Set()) ??
                placedEntryOf(child, seen);
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }

    /** What a reader can change that the attribute `attribute` reaches. */
    function reachAttribute(
        attribute: any,
        reference: any,
        viaReference = false,
    ): Reached | null {
        if (typeof attribute !== "object" || attribute === null) {
            return null;
        }
        for (const slot of attribute.slots ?? []) {
            if (slot?.refResolution) {
                const found = reach(
                    { extending: { Ref: slot.refResolution } },
                    reference,
                    false,
                );
                if (found) {
                    return found;
                }
            }
        }
        for (const component of componentsOfAttribute(attribute)) {
            const found = reach(component, reference, viaReference);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /**
     * Whether `node` is a repeat's index or value, which a reference in the
     * repeat's template names: a `_repeatIndices` or `_repeatValues` of the
     * repeat, or the `_placeholder` its `_repeatSetup` holds for the name.
     */
    function iterationVariable(
        node: any,
    ): { kind: "index" | "value"; repeat: any } | undefined {
        let repeat = parentOf.get(node);
        if (node.componentType === "_placeholder") {
            if (repeat?.componentType !== "_repeatSetup") {
                return undefined;
            }
            repeat = parentOf.get(repeat);
        } else if (
            node.componentType !== "_repeatIndices" &&
            node.componentType !== "_repeatValues"
        ) {
            return undefined;
        }
        if (!repeat) {
            return undefined;
        }
        if (node.componentType === "_repeatIndices") {
            return { kind: "index", repeat };
        }
        if (node.componentType === "_repeatValues") {
            return { kind: "value", repeat };
        }
        const name = node.attributes?.name?.primitive?.value;
        const indexName = repeat.attributes?.indexName?.primitive?.value;
        return name !== undefined && name === indexName
            ? { kind: "index", repeat }
            : { kind: "value", repeat };
    }

    /**
     * The type of `node`, or of the nearest component holding it that an
     * author writes, for one an author never writes (the
     * `_dynamicChildren` of a `<graph>`).
     */
    function authoredTypeOf(node: any): string {
        let type = typeMadeBy(node);
        let holder = parentOf.get(node);
        while (type.startsWith("_") && holder) {
            type = typeMadeBy(holder);
            holder = parentOf.get(holder);
        }
        return type;
    }

    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const errorByChoice = new Map<any, ReturnType<typeof codedDiagnostic>>();
    for (const { choice, attributeName, attribute } of parametersToCheck) {
        if (errorByChoice.has(choice)) {
            continue;
        }
        const found = reachAttribute(attribute, undefined);
        if (!found) {
            continue;
        }
        // where the attribute is written, name and value (`numToSelect="$n"`),
        // which an attribute that is one reference keeps on the reference
        const position =
            attribute.component?.doenetAttributes?.attributePosition ??
            attribute.component?.position ??
            attribute.position ??
            choice.position;
        const sourceDoc =
            attribute.component?.sourceDoc ??
            attribute.sourceDoc ??
            choice.sourceDoc;
        const diagnostic = codedDiagnostic({
            type: "error",
            code: "doenet-e0070",
            args: {
                attribute: attributeName,
                componentType: typeMadeBy(choice),
                reference: doenetMLReferenceAsWritten(
                    found.reference?.originalPath,
                    sources,
                ),
                changeableType: authoredTypeOf(found.changeable),
                // a sampler is an error whatever it reads, so its message
                // says it draws again, not that a reader changes it
                kind: SAMPLER_TYPES.has(typeMadeBy(found.changeable))
                    ? "sampler"
                    : "reader",
            },
            position,
            sourceDoc,
        });
        errorByChoice.set(choice, diagnostic);
        diagnostics.push(diagnostic);
    }

    makeChoicesErrors({ errorByChoice, nodes, nodeByIdx });
    return diagnostics;
}

/**
 * Make each choice in `errorByChoice` an `_error` in place of the choice,
 * reported where its diagnostic is, so it chooses nothing, and the error is
 * the same one, kept once, when the `_error` is made.
 *
 * A choice that extends or copies a choice in error
 * (`<selectFromSequence extend="$s"/>`) takes its parameters from it, so it
 * is the same error, reported once: it becomes an `_error` too, as there
 * would be nothing left for it to take them from.
 */
export function makeChoicesErrors({
    errorByChoice,
    nodes,
    nodeByIdx,
}: {
    errorByChoice: Map<any, ReturnType<typeof codedDiagnostic>>;
    nodes: any[];
    nodeByIdx: Map<number, any>;
}) {
    let added = errorByChoice.size > 0;
    while (added) {
        added = false;
        for (const node of nodes) {
            if (
                errorByChoice.has(node) ||
                !CHOICE_PARAMETERS[typeMadeBy(node)]
            ) {
                continue;
            }
            for (const ref of Object.values(node.extending ?? {}) as any[]) {
                const extended =
                    typeof ref?.nodeIdx === "number"
                        ? nodeByIdx.get(ref.nodeIdx)
                        : undefined;
                const diagnostic = extended && errorByChoice.get(extended);
                if (diagnostic) {
                    errorByChoice.set(node, diagnostic);
                    added = true;
                    break;
                }
            }
        }
    }

    // Each choice in error becomes an `_error`, reported at its parameter.
    for (const [choice, diagnostic] of errorByChoice) {
        choice.componentType = "_error";
        choice.state = errorComponentState(diagnostic.message, diagnostic);
        choice.attributes = {};
        choice.children = [];
        choice.doenetAttributes = {};
        choice.position = diagnostic.position;
        choice.sourceDoc = diagnostic.sourceDoc;
        delete choice.extending;
        delete choice.variants;
    }
}

/**
 * The attribute of `component` named `name`, matched without regard to case,
 * and the name it has.
 */
export function attributeNamed(component: any, name: string) {
    const lower = name.toLowerCase();
    for (const [attributeName, attribute] of Object.entries(
        component.attributes ?? {},
    )) {
        if (attributeName.toLowerCase() === lower) {
            return { name: attributeName, attribute: attribute as any };
        }
    }
    return undefined;
}

/** Whether the attribute `attribute` holds a component or a reference. */
function holdsComponentOrReference(attribute: any): boolean {
    return (
        typeof attribute === "object" &&
        attribute !== null &&
        ((attribute.slots ?? []).length > 0 ||
            componentsOfAttribute(attribute).length > 0)
    );
}

/** The serialized components the attribute `attribute` holds. */
function componentsOfAttribute(attribute: any): any[] {
    const found: any[] = [];
    if (attribute?.component) {
        found.push(attribute.component);
    }
    for (const reference of attribute?.references ?? []) {
        found.push(reference);
    }
    for (const child of attribute?.children ?? []) {
        if (typeof child === "object" && child !== null) {
            found.push(child);
        }
    }
    return found;
}

/**
 * The serialized components directly under `node`: its children and the
 * components of its attributes.
 */
export function componentsUnder(node: any): any[] {
    const under: any[] = [];
    for (const child of node.children ?? []) {
        if (typeof child === "object" && child !== null) {
            under.push(child);
        }
    }
    for (const attribute of Object.values(node.attributes ?? {})) {
        under.push(...componentsOfAttribute(attribute));
    }
    return under;
}

/**
 * The references `node` is: what it extends or copies (`extending`), or its
 * `refResolution`.
 */
function referencesOf(node: any): any[] {
    const found: any[] = [];
    for (const ref of Object.values(node.extending ?? {})) {
        if (typeof ref === "object" && ref !== null) {
            found.push(ref);
        }
    }
    if (typeof node.refResolution === "object" && node.refResolution) {
        found.push(node.refResolution);
    }
    return found;
}

/**
 * The index of the component a `_copy` is made with, which a reference to
 * it by name names, if it has one.
 */
export function createdIdxOf(node: any): number | undefined {
    const value = node.attributes?._createComponentIdx?.primitive?.value;
    return typeof value === "number" ? value : undefined;
}

/** The type of the component `node` makes: what a `_copy` creates. */
export function typeMadeBy(node: any): string {
    return (
        node.attributes?._createComponentOfType?.primitive?.value ??
        node.componentType
    );
}
