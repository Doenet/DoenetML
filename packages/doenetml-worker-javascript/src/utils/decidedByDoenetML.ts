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
 * opening or closing, and recording what the reader did.
 */
const ACTIONS_THAT_CHANGE_NO_VALUE =
    /^(copyDoenetMLToClipboard|recordVisibilityChange|record\w+|\w+Clicked|\w+Focused|focusChanged|move\w*|switch\w*|finalize\w*|changeRadius|reflect\w*|submitAllAnswers|reveal\w+|close\w+|navigateToTarget|playVideo|pauseVideo|summary|docsSlug)$/;

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
 * - it is a reference whose source, or whose index, can change;
 * - it was made by a composite whose choice of replacements can change (a
 *   case's condition, a repeat's `for`);
 * - it is a copy of something that can change;
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
    for (const refResolution of Object.values(component.extending ?? {})) {
        if (referenceCanChange(refResolution, ctx)) {
            return true;
        }
    }
    if (
        component.replacementOf &&
        replacementsCanChange(component.replacementOf, ctx)
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
        Object.values(component.attributes ?? {}).some((attribute) =>
            attributeCanChange(attribute, ctx, viaReference),
        )
    );
}

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
function replacementsCanChange(composite: any, ctx: ChangeContext): boolean {
    if (typeof composite !== "object" || composite === null) {
        return false;
    }
    const live = liveComponent(composite, ctx);
    const key = `replacements:${live.componentIdx}`;
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
        (live.replacementOf !== undefined &&
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
            attributeCanChange(component.attributes?.[name], ctx),
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
