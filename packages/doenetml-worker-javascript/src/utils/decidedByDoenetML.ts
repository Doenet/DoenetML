/**
 * Whether part of a component is decided by the DoenetML alone, rather than
 * by values that can change (D35, D38).
 *
 * DIAG-2: a diagnostic's level follows where its condition comes from. A
 * condition caused by what the author wrote (literals, the structure of the
 * document) is a warning or an error; one caused by values that can change
 * (inputs, a random choice, the active case, what a reader can write to) is
 * an info. A call site whose check covers both asks this which it is.
 *
 * A reference is decided by what it names: a reference to a component that
 * cannot change (`bins="$edges"` of a `<numberList>` written as literals) is
 * decided by the DoenetML, so its condition is a warning, and one to a
 * component that can change (an input, or a point a reader drags) is not.
 *
 * DIAG-7: an error depends only on the DoenetML, so a select's failure to
 * select is an error only when what decides it cannot change
 * (`selectErrors.ts`).
 */

/**
 * What {@link canChange} reads: the live components, the component classes,
 * what a reader can write to (`Core.readerWritable`, from
 * `buildReaderWritableIndex`), and the answers found so far, keyed by
 * component index and whether it was reached by a reference.
 */
export type ChangeContext = {
    components: any[];
    componentInfoObjects: any;
    writable: Set<number>;
    memo: Map<string, boolean>;
};

/**
 * A {@link ChangeContext} for `core`, with nothing found yet. Make one for
 * each question: a component that isn't made yet counts as one that can
 * change, so an answer is good only while the components stay as they are.
 */
export function changeContext(core: {
    _components: any[];
    componentInfoObjects: any;
    readerWritable?: Set<number>;
}): ChangeContext {
    return {
        components: core._components,
        componentInfoObjects: core.componentInfoObjects,
        writable: core.readerWritable ?? new Set(),
        memo: new Map(),
    };
}

/**
 * The composites that create variants without choosing anything themselves:
 * what they hold decides whether they can change.
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
 * The actions through which a reader changes nothing a value is made of:
 * focusing, clicking, moving in a graph (which `readerWritable` covers),
 * recording that the component was seen, and following a link. Opening or
 * closing a hint, a solution or a section (its `open`), and playing, pausing
 * or watching a video (its `state`, `secondsWatched`), change a value a
 * reference can read, so they are not among them.
 */
const ACTIONS_THAT_CHANGE_NO_VALUE =
    /^(copyDoenetMLToClipboard|recordVisibilityChange|\w+Clicked|\w+Focused|focusChanged|move\w*|switch\w*|finalize\w*|changeRadius|reflect\w*|submitAllAnswers|navigateToTarget|summary|docsSlug)$/;

/** Whether a reader can change the state of `component` by an action. */
function hasReaderStateAction(component: any): boolean {
    return Object.keys(component.actions ?? {}).some(
        (name) => !ACTIONS_THAT_CHANGE_NO_VALUE.test(name),
    );
}

/** Whether `component` makes a random choice. */
function isRandom(component: any, componentInfoObjects: any): boolean {
    const componentType = component.componentType;
    const componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    return (
        Boolean(componentClass?.createsVariants) &&
        !PASS_THROUGH_VARIANT_TYPES.has(componentType) &&
        !componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: "_sectioningComponent",
        })
    );
}

/**
 * The live component for `component`, which may be a serialized one (an
 * index component of a reference held in an attribute's slot), or
 * `component` when there is none.
 */
function liveComponent(component: any, ctx: ChangeContext): any {
    const idx = component.componentIdx;
    return (typeof idx === "number" && ctx.components[idx]) || component;
}

/**
 * Whether the value of `component`, a live component or a serialized one,
 * can change after the document is loaded:
 * - a reader writes to it (`readerWritable`) or sets its state by an
 *   action, when it is reached by a reference (`viaReference`);
 * - it is an input, an answer or a slider;
 * - it makes a random choice;
 * - it is a reference whose source, or whose index, can change, or, for
 *   a reference into what a composite makes (`$r[1].e`), whose
 *   replacements can;
 * - it was made by a composite whose choice of replacements can change (a
 *   case's condition, a repeat's `for`);
 * - it is a copy of something that can change, or an adapter of one;
 * - one of its children (a label aside) or attributes can change.
 *
 * What is written in place (`viaReference` false) is what the author wrote,
 * even when a reader can drag it: a reader who drags a point written with a
 * literal changes it, and the literal is still the author's. What a
 * reference names is read as it is now, so a reader's write reaches it.
 *
 * A component that isn't made yet (a reference to one) counts as one that
 * can change.
 */
export function canChange(
    component: any,
    ctx: ChangeContext,
    viaReference = false,
): boolean {
    if (typeof component !== "object" || component === null) {
        return false;
    }
    const live = liveComponent(component, ctx);
    const idx = live.componentIdx;
    const key = typeof idx === "number" ? `${idx}:${viaReference}` : null;
    if (key !== null) {
        const known = ctx.memo.get(key);
        if (known !== undefined) {
            return known;
        }
        // until it is found, for a cycle of references
        ctx.memo.set(key, false);
    }
    const result = canChangeUncached(live, ctx, viaReference);
    if (key !== null) {
        ctx.memo.set(key, result);
    }
    return result;
}

function canChangeUncached(
    component: any,
    ctx: ChangeContext,
    viaReference: boolean,
): boolean {
    const componentInfoObjects = ctx.componentInfoObjects;
    const componentType = component.componentType;
    if (viaReference && ctx.writable.has(component.componentIdx)) {
        return true;
    }
    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: "_input",
        }) ||
        componentType === "answer" ||
        componentType === "slider" ||
        (viaReference && hasReaderStateAction(component))
    ) {
        return true;
    }
    if (isRandom(component, componentInfoObjects)) {
        return true;
    }
    if (
        component.refResolution &&
        referenceCanChange(component.refResolution, ctx)
    ) {
        return true;
    }
    if (
        component.refResolution?.unresolvedPath &&
        component.isExpanded &&
        Array.isArray(component.replacements) &&
        component.replacements.some((replacement: any) =>
            canChange(replacement, ctx, viaReference),
        )
    ) {
        // a reference into what a composite makes (`$r[1].e`, an iteration
        // of a repeat) names it once the composite has made it: its
        // replacements, which copy what it names
        return true;
    }
    if (
        typeof component.adaptedFrom === "object" &&
        component.adaptedFrom !== null &&
        canChange(component.adaptedFrom, ctx, viaReference)
    ) {
        // an adapter (the `<math>` a parent matches in place of `$t` of a
        // `<text>`) is what it adapts
        return true;
    }
    const fixedReferent = component.doenetAttributes?.fixedReferent;
    if (fixedReferent) {
        // a value reference a copy made, which reads what the copy named
        const referent = ctx.components[fixedReferent.componentIdx];
        if (!referent || canChange(referent, ctx, true)) {
            return true;
        }
    }
    for (const refResolution of Object.values(component.extending ?? {})) {
        if (referenceCanChange(refResolution, ctx)) {
            return true;
        }
    }
    if (
        component.replacementOf &&
        (viaReference
            ? replacementsCanChange(component.replacementOf, ctx)
            : writtenInPlaceCanChange(component, ctx))
    ) {
        return true;
    }
    if (component.shadows) {
        const source = ctx.components[component.shadows.componentIdx];
        if (!source || canChange(source, ctx, true)) {
            return true;
        }
    }
    const children = component.definingChildren ?? component.children ?? [];
    return (
        children.some(
            (child: any) =>
                !standsOnlyForLabels(child, componentInfoObjects) &&
                canChange(child, ctx, viaReference),
        ) ||
        Object.entries(component.attributes ?? {}).some(
            ([name, attribute]) =>
                !ATTRIBUTES_NOT_OF_THE_VALUE.has(name.toLowerCase()) &&
                attributeCanChange(attribute, ctx, viaReference),
        )
    );
}

/**
 * The attributes that only display, style or place a component, or say how
 * a reader may act on it, so decide nothing of its value: one that can
 * change (`<number displayDigits="$n">`, `<series styleNumber="$n">`)
 * doesn't make the value one that can (#2506). Lower case.
 */
const ATTRIBUTES_NOT_OF_THE_VALUE: ReadonlySet<string> = new Set(
    [
        "name",
        "hide",
        "rendered",
        "disabled",
        "fixed",
        "fixLocation",
        "draggable",
        "styleNumber",
        "layer",
        "isResponse",
        "isPotentialResponse",
        "permid",
        "displayDigits",
        "displayDecimals",
        "displaySmallAsZero",
        "padZeros",
        "avoidScientificNotation",
        "labelIsName",
        "labelPosition",
        "showLabel",
        "applyStyleToLabel",
        "anchor",
        "positionFromAnchor",
    ].map((name) => name.toLowerCase()),
);

/**
 * Whether which replacements the composite `composite` makes can change:
 * it chooses at random, it is a reference that can come to name something
 * else (an index that can change, or a component made by a composite whose
 * replacements can change), a copy of one whose replacements can change,
 * made by one whose replacements can change, or an attribute of it (a
 * repeat's `for`) or of one of its cases (`condition`) can change.
 *
 * What it holds, which it makes copies of, is not asked: a component is not
 * made changeable by a sibling in the same group. Nor is the value of what a
 * reference names: a replacement that copies a value that can change
 * follows it as a copy (`shadows`), and one that copies it once, unlinked,
 * holds what it was made with.
 */
function replacementsCanChange(
    composite: any,
    ctx: ChangeContext,
    inPlace = false,
): boolean {
    if (typeof composite !== "object" || composite === null) {
        return false;
    }
    const live = liveComponent(composite, ctx);
    const key = `replacements:${live.componentIdx}:${inPlace}`;
    const known = ctx.memo.get(key);
    if (known !== undefined) {
        return known;
    }
    ctx.memo.set(key, false);
    let result =
        isRandom(live, ctx.componentInfoObjects) ||
        (typeof live.refResolution === "object" &&
            live.refResolution !== null &&
            referenceCanNameSomethingElse(live.refResolution, ctx)) ||
        (inPlace
            ? writtenInPlaceCanChange(live, ctx)
            : live.replacementOf !== undefined &&
              replacementsCanChange(live.replacementOf, ctx)) ||
        Object.values(live.attributes ?? {}).some((attribute) =>
            attributeCanChange(attribute, ctx),
        ) ||
        (live.definingChildren ?? []).some(
            (child: any) =>
                typeof child === "object" &&
                child !== null &&
                (child.componentType === "case" ||
                    child.componentType === "else") &&
                Object.values(child.attributes ?? {}).some((attribute) =>
                    attributeCanChange(attribute, ctx),
                ),
        );
    if (!result && live.shadows) {
        const source = ctx.components[live.shadows.componentIdx];
        result = !source || replacementsCanChange(source, ctx);
    }
    ctx.memo.set(key, result);
    return result;
}

/**
 * The composites whose replacements are content the author wrote in them:
 * a case's or option's content, a repeat's template, what a group, sort or
 * shuffle holds. Which of it is shown can change (the active case, the
 * option picked, the number of iterations), but what is written in it is
 * the author's wherever it is shown, so a literal in it is decided by the
 * DoenetML (DIAG-2, SEL-8, #2506). A value in it that can change, such as
 * `$v` of a repeat over an input, is found where it is read.
 */
const HOLD_WRITTEN_CONTENT = new Set([
    "group",
    "conditionalContent",
    "case",
    "else",
    "option",
    "select",
    "repeat",
    "repeatForSequence",
    "sort",
    "shuffle",
]);

/**
 * Whether `component`, as it is written in place (not reached by a
 * reference), can change because a composite made it: not one that holds
 * what the author wrote ({@link HOLD_WRITTEN_CONTENT}), which it passes
 * through, but one that makes its replacements otherwise, such as a
 * reference that can come to name something else or a random choice
 * ({@link replacementsCanChange}).
 */
function writtenInPlaceCanChange(component: any, ctx: ChangeContext): boolean {
    const seen = new Set<number>();
    let composite = component.replacementOf;
    while (typeof composite === "object" && composite !== null) {
        const live = liveComponent(composite, ctx);
        if (seen.has(live.componentIdx)) {
            return false;
        }
        seen.add(live.componentIdx);
        if (!HOLD_WRITTEN_CONTENT.has(live.componentType)) {
            return replacementsCanChange(live, ctx, true);
        }
        composite = live.replacementOf;
    }
    return false;
}

/**
 * Whether what made `component` can come to make other content, written
 * otherwise, as a reader works: `component` is in the content of a case of a
 * `<conditionalContent>` whose choice of case can change (a condition from
 * an input), or made by a composite that makes its replacements otherwise,
 * such as a reference that can come to name something else. For a
 * diagnostic about how what a reference reaches is written: a group holding
 * several components that an index comes after (`doenet-w0188`), or a
 * repeat with fewer iterations than an index (`doenet-w0181`), is an info
 * while it lasts when the reference can come to reach other content
 * (DIAG-2, #2506).
 *
 * What an iteration of a repeat holds is made from the same template as
 * every other. What a `<select>` picked is the content of an option the
 * author wrote, which SEL-8 checks whether picked or not, and a pick doesn't
 * change as a reader works, so neither counts here.
 */
export function branchCanChange(component: any, ctx: ChangeContext): boolean {
    const seen = new Set<number>();
    let composite = liveComponent(component, ctx).replacementOf;
    while (typeof composite === "object" && composite !== null) {
        const live = liveComponent(composite, ctx);
        if (seen.has(live.componentIdx)) {
            return false;
        }
        seen.add(live.componentIdx);
        if (
            live.componentType === "conditionalContent"
                ? replacementsCanChange(live, ctx, true)
                : !HOLD_WRITTEN_CONTENT.has(live.componentType) &&
                  !isRandom(live, ctx.componentInfoObjects) &&
                  madeFromCanChange(live, ctx)
        ) {
            return true;
        }
        composite = live.replacementOf;
    }
    return false;
}

/**
 * Whether the number of replacements the composite `composite` makes can
 * change as a reader works: an attribute it is made from can (a repeat's
 * `for` from an input), it is a reference that can come to name something
 * else, or it is in content that can come to be other content
 * ({@link branchCanChange}). A `<select>`'s `numToSelect` written as `1`
 * decides its number of picks, though which it picks is random.
 */
export function numReplacementsCanChange(
    composite: any,
    ctx: ChangeContext,
): boolean {
    const live = liveComponent(composite, ctx);
    return madeFromCanChange(live, ctx) || branchCanChange(live, ctx);
}

/**
 * Whether what the live composite `live` is made from can change: an
 * attribute (a repeat's `for` from an input), what an attribute that names
 * components holds (a `<collect>`'s `from`, {@link contentCanChange}: not
 * whether a reader can open the section it names), or its reference, which
 * can come to name something else.
 */
function madeFromCanChange(live: any, ctx: ChangeContext): boolean {
    return (
        Object.values(live.attributes ?? {}).some((attribute: any) =>
            typeof attribute === "object" &&
            attribute !== null &&
            attribute.type !== "expression" &&
            !attribute.component &&
            Array.isArray(attribute.references)
                ? attribute.references.some((reference: any) =>
                      contentCanChange(reference, ctx),
                  )
                : attributeCanChange(attribute, ctx),
        ) ||
        (typeof live.refResolution === "object" &&
            live.refResolution !== null &&
            referenceCanNameSomethingElse(live.refResolution, ctx))
    );
}

/**
 * Whether what the component `component` holds can change in number or in
 * what it is: for a composite, its choice of replacements
 * ({@link replacementsCanChange}), or that of a composite among them, in
 * turn; for another component (a list, which holds its entries), whether it
 * can change where it is written ({@link canChange}). It is the question for
 * a condition that something is missing from it: an action's target with
 * nothing in it, or a collect's source not in the composite `from` names.
 *
 * It isn't `canChange(component)`: what a reader writes to, an action's
 * target among them (`readerWritable`), or a value that can change inside
 * it, says nothing about whether a `<conditionalContent>` with
 * `condition="false"` can come to hold something. It errs toward changing as
 * `readerWritable` does: a reference a list holds names what is written to.
 */
export function contentCanChange(component: any, ctx: ChangeContext): boolean {
    if (typeof component !== "object" || component === null) {
        return true;
    }
    const live = liveComponent(component, ctx);
    if (
        !ctx.componentInfoObjects.isCompositeComponent({
            componentType: live.componentType,
            includeNonStandard: false,
        })
    ) {
        return canChange(live, ctx);
    }
    return (
        replacementsCanChange(live, ctx) ||
        (live.replacements ?? []).some(
            (replacement: any) =>
                typeof replacement === "object" &&
                replacement !== null &&
                ctx.componentInfoObjects.isCompositeComponent({
                    componentType: replacement.componentType,
                    includeNonStandard: false,
                }) &&
                contentCanChange(replacement, ctx),
        )
    );
}

/**
 * Whether the reference `refResolution` can come to name another component:
 * an index of it can change, or what it names is made by a composite whose
 * replacements can change (a `<select>`'s option, a case's content). A
 * component not made yet counts as one that can. (A copy of a composite is
 * a composite whose replacements copy, and so follow, those of the one it
 * copies.)
 */
function referenceCanNameSomethingElse(
    refResolution: any,
    ctx: ChangeContext,
): boolean {
    if (typeof refResolution.nodeIdx !== "number") {
        return true;
    }
    if (pathHasIndexThatCanChange(refResolution.originalPath, ctx)) {
        return true;
    }
    const source = ctx.components[refResolution.nodeIdx];
    if (!source) {
        return true;
    }
    return (
        source.replacementOf !== undefined &&
        replacementsCanChange(source.replacementOf, ctx)
    );
}

/**
 * Whether what the reference `refResolution` names can change (it is
 * reached by a reference, so a reader's write to it counts), or one of its
 * indices can ({@link pathHasIndexThatCanChange}).
 */
export function referenceCanChange(
    refResolution: any,
    ctx: ChangeContext,
): boolean {
    if (
        typeof refResolution !== "object" ||
        refResolution === null ||
        typeof refResolution.nodeIdx !== "number"
    ) {
        return true;
    }
    if (pathHasIndexThatCanChange(refResolution.originalPath, ctx)) {
        return true;
    }
    const source = ctx.components[refResolution.nodeIdx];
    return !source || canChange(source, ctx, true);
}

/**
 * Whether an index in the reference path `path`, as written, can change
 * (`$l[$i]` with `i` an input), rather than being a literal (`$l[2]`) or
 * read from a component that cannot change (`$l[$i]` with `i` a literal
 * `<number>`). A literal index part holds only strings; one written as a
 * reference holds the component it is read from.
 */
export function pathHasIndexThatCanChange(
    path: any,
    ctx: ChangeContext,
): boolean {
    return (path ?? []).some((part: any) =>
        (part?.index ?? []).some((indexPart: any) =>
            (indexPart?.value ?? []).some(
                (value: any) =>
                    typeof value !== "string" && canChange(value, ctx),
            ),
        ),
    );
}

/**
 * Whether the attribute `attribute` of a component can change: an
 * attribute component or reference that can ({@link canChange}), or an
 * expression attribute with a reference that can. One not written (its
 * default), a literal or a primitive cannot.
 */
export function attributeCanChange(
    attribute: any,
    ctx: ChangeContext,
    viaReference = false,
): boolean {
    if (typeof attribute !== "object" || attribute === null) {
        return false;
    }
    if (attribute.type === "literal" || attribute.type === "primitive") {
        return false;
    }
    if (attribute.type === "expression") {
        return (attribute.slots ?? []).some((slot: any) =>
            referenceCanChange(slot.refResolution, ctx),
        );
    }
    if (attribute.component) {
        return canChange(attribute.component, ctx, viaReference);
    }
    if (attribute.references) {
        return attribute.references.some((reference: any) =>
            canChange(reference, ctx, viaReference),
        );
    }
    // a form not known here: as one that can change
    return true;
}

/**
 * Whether the attributes `attributeNames` of the live component `component`,
 * and its children in the child groups `childGroups`
 * (`childMatchesByGroup`, from `returnChildGroups`), are decided by the
 * DoenetML alone: none of them can change ({@link canChange}). What the
 * `decidedByDoenetML` dependency gives.
 *
 * The children are those the component matched to the groups, its active
 * children, so a reference among them (`$data`) is what it stands for, its
 * replacements, and a child of another group (a `<label>` or `<title>`)
 * isn't asked. They must be matched first.
 */
export function partsDecidedByDoenetML({
    component,
    attributeNames = [],
    childGroups = [],
    ctx,
}: {
    component: any;
    attributeNames?: string[];
    childGroups?: string[];
    ctx: ChangeContext;
}): boolean {
    return (
        !attributeNames.some((name) =>
            attributeOrSourceCanChange(component, name, ctx),
        ) &&
        !childGroups.some((group) =>
            (component.childMatchesByGroup?.[group] ?? []).some(
                (childIndex: number) =>
                    canChange(component.activeChildren[childIndex], ctx),
            ),
        )
    );
}

/**
 * Whether the attribute `name` of the live component `component` can change
 * ({@link attributeCanChange}). A copy (`$b`, or `<binCounts extend="$b"/>`)
 * that doesn't write the attribute itself has none: it takes the value its
 * source computes, so it is decided as its source's attribute is, the
 * source's own source in turn.
 */
function attributeOrSourceCanChange(
    component: any,
    name: string,
    ctx: ChangeContext,
): boolean {
    const seen = new Set<number>();
    let current = component;
    while (
        current.attributes?.[name] === undefined &&
        current.shadows &&
        !seen.has(current.componentIdx)
    ) {
        seen.add(current.componentIdx);
        const source = ctx.components[current.shadows.componentIdx];
        if (!source) {
            return true;
        }
        current = source;
    }
    return attributeCanChange(current.attributes?.[name], ctx);
}

/**
 * Whether the attribute `attribute` of a component is decided by the
 * DoenetML alone: it cannot change ({@link attributeCanChange}).
 */
export function attributeDecidedByDoenetML(
    attribute: any,
    ctx: ChangeContext,
): boolean {
    return !attributeCanChange(attribute, ctx);
}

/**
 * Whether `child` stands only for labels: it is a `<label>`, or a
 * composite (`$lbl`) whose shown replacements all are. A label names its
 * component, and decides none of its value.
 */
function standsOnlyForLabels(child: any, componentInfoObjects: any): boolean {
    const stoodFor = typesStoodFor(child);
    return (
        stoodFor.length > 0 &&
        stoodFor.every((componentType) =>
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: "label",
            }),
        )
    );
}

/**
 * The component types `child` stands for: its own, or, for a composite
 * that has been expanded, those of its shown replacements, in turn. A
 * string stands for none.
 */
function typesStoodFor(child: any): string[] {
    if (typeof child !== "object" || child === null) {
        return [];
    }
    if (!child.isExpanded || !Array.isArray(child.replacements)) {
        return [child.componentType];
    }
    const shown = child.replacements.slice(
        0,
        child.replacements.length - (child.replacementsToWithhold ?? 0),
    );
    return shown.flatMap(typesStoodFor);
}

/**
 * The level of a diagnostic whose condition is a value of what
 * `decidedByDoenetML` describes (DIAG-2): a warning when the value is
 * decided by the DoenetML, so the author should change it, and an info when
 * it can change, so the diagnostic only explains why part of the document is
 * missing or degenerate now.
 */
export function levelFromSource(
    decidedByDoenetML: boolean | undefined,
): "warning" | "info" {
    return decidedByDoenetML === false ? "info" : "warning";
}

/**
 * `diagnostics`, with the level of each whose code is in `decidedByCode` set
 * by whether what causes it is decided by the DoenetML
 * ({@link levelFromSource}). The others are as they are.
 */
export function withLevelsFromSource<T extends { code?: string; type: string }>(
    diagnostics: T[],
    decidedByCode: Record<string, boolean | undefined>,
): T[] {
    // Each diagnostic is constructed where it is raised; this sets the
    // level of one already made.
    return diagnostics.map((diagnostic) => {
        if (
            diagnostic.code === undefined ||
            !(diagnostic.code in decidedByCode)
        ) {
            return diagnostic;
        }
        const type = levelFromSource(decidedByCode[diagnostic.code]);
        return { ...diagnostic, type };
    });
}
