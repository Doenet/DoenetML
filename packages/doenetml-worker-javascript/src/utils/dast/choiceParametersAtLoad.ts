/**
 * What a random choice chooses from comes from what the author wrote, never
 * from what a reader enters or does (D39, SEL-1). A choice whose parameter
 * reaches anything a reader can change is an error at load, the same in
 * every variant, even where the effect could be worked out
 * (`from="$n"` with `n` from an input).
 *
 * A choice is a `<select>`, `<selectFromSequence>`, `<selectPrimeNumbers>`,
 * `<selectRandomNumbers>` or a sampler; its parameters are the attributes
 * {@link CHOICE_PARAMETERS} lists, and an `<option>`'s `selectWeight` for
 * the `<select>` holding it. (An option's `selectForVariants` takes no
 * reference: one written there is dropped with a warning. The content of an
 * option, and the items a `<shuffle>` or `<choiceInput>` orders, are what is
 * chosen among, not how, and are not read here.)
 *
 * A parameter may read:
 * - literals, and content that can't change;
 * - another random choice, which is checked as a choice itself;
 * - a repeat's `indexName`, always (SEL-2: a reader may decide how many
 *   iterations there are, but not what iteration *k* is);
 * - a repeat's `valueName`, when what the repeat iterates over may be read:
 *   the `for` of a `<repeat>`, or the `from`, `step` and `exclude` (every
 *   attribute but `to` and `length`, which decide only how many) of a
 *   `<repeatForSequence>`.
 *
 * "A reader can change" is DIAG-2's definition: an input (a `<codeEditor>`
 * too), an answer, a slider, or what a reader writes to
 * (`buildReaderWritableIndex`: what an input's `bindValueTo` names, what a
 * reader drags, an action's target), and anything that reads one of these
 * through a reference, a child or an attribute. DIAG-2's state a reader sets
 * by an action (a hint, a solution or a section opened, a video played) is
 * not checked: a reference to such a component may read what no action
 * changes (`$sec.sectionNumber`), and the pass doesn't tell properties apart.
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
import { buildReaderWritableIndex } from "../readerWritable";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { codedDiagnostic } from "../diagnostics";
import { errorComponentState } from "./errors";

/** The parameters of a sampler of random numbers. */
const SAMPLE_RANDOM_NUMBERS_PARAMETERS = [
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
    selectRandomNumbers: [...SAMPLE_RANDOM_NUMBERS_PARAMETERS, "numToSelect"],
    sampleRandomNumbers: SAMPLE_RANDOM_NUMBERS_PARAMETERS,
    samplePrimeNumbers: [
        "numSamples",
        "from",
        "to",
        "exclude",
        "variantDeterminesSeed",
    ],
    sampleMultivariateRandomNumber: [
        "type",
        "numInCategories",
        "numDraws",
        "variantDeterminesSeed",
    ],
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
 * What a reader enters a value in, besides an `_input`: an `<answer>`, a
 * `<slider>`, and a `<codeEditor>`, which isn't an `_input`.
 */
const READER_ENTERED_TYPES = new Set(["answer", "slider", "codeEditor"]);

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

    const writable = buildReaderWritableIndex(document, componentInfoObjects);

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
        if (isA(type, "_input") || READER_ENTERED_TYPES.has(type)) {
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
                const found = named && reach(named, ref, true);
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
            },
            position,
            sourceDoc,
        });
        errorByChoice.set(choice, diagnostic);
        diagnostics.push(diagnostic);
    }

    // A choice that extends or copies a choice in error
    // (`<selectFromSequence extend="$s"/>`) takes its parameters from it, so
    // it is the same error, reported once: it becomes an `_error` too, as
    // there would be nothing left for it to take them from.
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
    return diagnostics;
}

/**
 * The attribute of `component` named `name`, matched without regard to case,
 * and the name it has.
 */
function attributeNamed(component: any, name: string) {
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
function componentsUnder(node: any): any[] {
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
function createdIdxOf(node: any): number | undefined {
    const value = node.attributes?._createComponentIdx?.primitive?.value;
    return typeof value === "number" ? value : undefined;
}

/** The type of the component `node` makes: what a `_copy` creates. */
function typeMadeBy(node: any): string {
    return (
        node.attributes?._createComponentOfType?.primitive?.value ??
        node.componentType
    );
}
