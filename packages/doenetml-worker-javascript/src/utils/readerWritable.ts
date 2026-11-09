/**
 * The pass that marks what a reader can change: the components a reader of
 * the document can write to, found once, from the serialized document, when
 * the document is loaded (`Core.generateDast`).
 *
 * It reads the serialized document rather than the components, so it sees
 * every component the DoenetML can make, including the content of a case
 * that isn't shown yet or of an option that isn't selected: a reader who
 * reaches it can write to it then.
 *
 * Where a reader writes:
 * - what an input's `bindValueTo` names, and the child that holds an
 *   input's value (`<mathInput>$a</mathInput>`,
 *   `<textInput><text>$t</text></textInput>`), which the input writes its
 *   value back to, unless the input is fixed (its own `fixed`, or one it
 *   inherits): a fixed component writes nothing through its inverse;
 * - the `target` of an `<updateValue>`, an `<animateFromSequence>` or a
 *   `<callAction>`;
 * - every component inside a `<graph>` that is not fixed (`fixed` or
 *   `fixLocation` written as true on it, or on an ancestor when it doesn't
 *   write its own: `fixed="false"` in a fixed graph is not fixed), which a
 *   reader can drag, and what it references, which the drag writes to
 *   through it;
 * - a `<spreadsheet>` that is not fixed, whose cells a reader edits: an
 *   edit to a cell holding a reference (`<cell>$a</cell>`) writes to what
 *   it references.
 *
 * A write to a component reaches its descendants and, through them, what
 * they reference (an inverse definition), until a fixed component stops it:
 * neither a fixed component nor what is under it or what it references is
 * written to. Only a spreadsheet writes past one, to its cells directly: a
 * cell that is not fixed itself (`fixed="false"`) in a fixed row, column,
 * cell block or group of the spreadsheet is written to.
 * An unlinked copy (`<point copy="$Q"/>`) is its source's DoenetML pasted
 * where it sits, so a write to it reaches its source's descendants, fixed
 * as they are written there and as the copy is, not as its source is, and
 * not its source. A source that is a copy or an extend is pasted as what it
 * copies or extends (a copy of `<point name="E" extend="$Q"/>` pastes `Q`'s
 * DoenetML). A copy of what a composite makes pastes the component the
 * path names in the composite's DoenetML (`copy="$r[1].P"` pastes `P` from
 * the repeat's template, which each iteration copies). A copy of a
 * property or an entry (`copy="$Q.x"`, `copy="$pl[1]"`) pastes nothing.
 * A reference to what a copy or an extend makes (`$D` of `<math
 * name="D" copy="$m"/>`) names the index it is made with, which stands
 * for the `_copy` here.
 * `fixLocation` stops only a write to a location (`isLocation`), as
 * `EssentialValueWriter` does, so it stops a write only at a component
 * that has one (a point, a line): a `<numberList fixLocation>` an input is
 * bound to, or a `<math>` in a `<point fixLocation>`, is still written to.
 *
 * Whether a value can change (`canChange` in `decidedByDoenetML.ts`) reads
 * this for a component named by a reference; what is written in place is
 * what the author wrote, even when a reader can drag it. A select's check
 * that its choices are feasible can read it too (D39, SEL-1).
 *
 * A component made after load from a serialized one keeps the index
 * current (`noteReaderWritable`, as each component is made): the index marks
 * each serialized component it finds (`readerWritable`), and a copy of one
 * with new indices, such as an iteration of a repeat, keeps the mark. A
 * component serialized from one the index holds (`originalIdx`), such as
 * an unlinked copy, is added too.
 *
 * It errs toward writable: a `fixed` that comes from a value (`fixed="$b"`)
 * counts as not fixed, and everything in a graph counts as draggable, a
 * label too.
 */

/** The components whose `target` a reader's click writes to. */
const ACTION_TYPES = new Set([
    "updateValue",
    "animateFromSequence",
    "callAction",
]);

/** The components a reader edits in place, writing to what they hold. */
const EDITED_TYPES = new Set(["spreadsheet"]);

/**
 * The inputs that write their value back to their value child, when they
 * have one (the inverse that sets `mathChild`, `textChild` or
 * `booleanChild`), and the type of that child. A `<choiceInput>` writes
 * only its choices' `submitted`, which is the choices' own.
 */
const VALUE_CHILD_TYPE_OF_INPUT: Record<string, string> = {
    mathInput: "math",
    matrixInput: "math",
    fractionInput: "math",
    textInput: "text",
    booleanInput: "boolean",
};

/**
 * The children of the input `node` that can hold its value: a child of
 * its value type (`<math>`, `<text>`, `<boolean>`; `$a` written as a child
 * of a `<mathInput>` is wrapped in a `<math>`), or a composite that can
 * become one (`$b` in a `<booleanInput>`). A label or a description is
 * not one, nor is the input's own grid (`_matrixInputGrid`, a composite).
 */
function valueChildren(
    node: any,
    valueType: string,
    componentInfoObjects: any,
): any[] {
    return (node.children ?? []).filter(
        (child: any) =>
            typeof child === "object" &&
            child !== null &&
            child.componentType !== "_matrixInputGrid" &&
            (child.componentType === valueType ||
                (componentInfoObjects?.isCompositeComponent
                    ? componentInfoObjects.isCompositeComponent({
                          componentType: child.componentType,
                          includeNonStandard: true,
                      })
                    : child.componentType === "_copy" ||
                      child.componentType === "_ref")),
    );
}

/** Whether `value` is a reference: a serialized `refResolution`. */
function isReference(value: any): boolean {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof value.nodeIdx === "number" &&
        "originalPath" in value
    );
}

/**
 * The keys of a serialized component, or part of one, that hold no
 * reference written to: where it is in the source, and the path of a
 * reference, whose index (`$l[$n]`) is only read to pick what the reference
 * names.
 */
const KEYS_NOT_WRITTEN_THROUGH = new Set([
    "position",
    "childrenPosition",
    "originalPath",
    "unresolvedPath",
]);

/**
 * The component indices named by every reference anywhere in `value`, a
 * serialized component or part of one, appended to `found`. A reference
 * held in another's index (`n` of `$l[$n]`) is not one: a write through
 * `$l[$n]` reaches `l`, not `n`.
 */
function referencesIn(value: any, found: number[] = []): number[] {
    if (Array.isArray(value)) {
        for (const item of value) {
            referencesIn(item, found);
        }
    } else if (typeof value === "object" && value !== null) {
        if (isReference(value)) {
            found.push(value.nodeIdx);
        }
        for (const [key, item] of Object.entries(value)) {
            if (KEYS_NOT_WRITTEN_THROUGH.has(key)) {
                continue;
            }
            referencesIn(item, found);
        }
    }
    return found;
}

/**
 * Whether the serialized attribute `attribute` is written as true: present
 * with no value (`fixed`), or `true`. One that holds a reference is not,
 * whether the reference is a child of its component (`fixed="$b"`, a
 * `<boolean>` holding `$b`) or the component itself (`fixLocation="$b"`,
 * a `_ref` extending `b`).
 */
function writtenAsTrue(attribute: any): boolean {
    if (!attribute) {
        return false;
    }
    if (attribute.type === "primitive") {
        return attribute.primitive?.value === true;
    }
    if (attribute.type === "literal") {
        return attribute.value === true;
    }
    // on a `_copy` (`<point copy="$Q" fixed/>`), what is written is kept
    // unresolved for the component it makes
    const component =
        attribute.type === "unresolved" ? attribute : attribute.component;
    if (!component || component.extending) {
        return false;
    }
    if (component.state && "value" in component.state) {
        return component.state.value === true;
    }
    const children = component.children ?? [];
    if (!children.every((child: any) => typeof child === "string")) {
        return false;
    }
    const text = children.join("").trim().toLowerCase();
    return text === "" || text === "true";
}

/**
 * The component indices named by the references `node`, a serialized
 * component, holds itself, appended to `found`: what it extends or copies
 * (`extending`), and what the expressions of its attributes reference
 * (`slots`), but not what is referenced in its children or in the
 * components of its attributes, which are components of their own.
 * With `withoutExtending`, what it copies or extends is left out too.
 */
function ownReferencesIn(
    node: any,
    found: number[] = [],
    withoutExtending = false,
): number[] {
    for (const [key, value] of Object.entries(node)) {
        if (
            key === "children" ||
            key === "attributes" ||
            // a record of the variant components under it, copies of its
            // descendants, which are visited on their own
            key === "variants" ||
            // an unlinked copy doesn't write to its source
            (key === "extending" &&
                (withoutExtending || isUnlinkedCopy(node))) ||
            KEYS_NOT_WRITTEN_THROUGH.has(key)
        ) {
            continue;
        }
        referencesIn(value, found);
    }
    for (const attribute of Object.values(node.attributes ?? {}) as any[]) {
        if (typeof attribute !== "object" || attribute === null) {
            continue;
        }
        for (const [key, value] of Object.entries(attribute)) {
            if (
                key === "component" ||
                key === "references" ||
                key === "children" ||
                KEYS_NOT_WRITTEN_THROUGH.has(key)
            ) {
                continue;
            }
            referencesIn(value, found);
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
    for (const attribute of Object.values(node.attributes ?? {}) as any[]) {
        if (attribute?.component) {
            under.push(attribute.component);
        }
        for (const reference of attribute?.references ?? []) {
            under.push(reference);
        }
        for (const child of attribute?.children ?? []) {
            if (typeof child === "object" && child !== null) {
                under.push(child);
            }
        }
    }
    return under;
}

/** For each component class, whether it has a location (see below). */
const classHasLocation = new WeakMap<object, boolean>();

/**
 * The locations a component has only to be drawn in a graph (where a
 * `<math>` or a list entry is placed), which a reader writing its value
 * doesn't write to.
 */
const PLACEMENT_LOCATIONS = new Set(["anchor", "entryAnchor"]);

/**
 * Whether a component of type `componentType` has a value that is a
 * location (a state variable with `isLocation`, other than where it is
 * placed), which its `fixLocation` keeps from being written to: a point, a
 * line, a list of points, not a `<math>` or a `<numberList>`. A type not
 * known here counts as one that has.
 */
function hasLocation(componentType: string, componentInfoObjects: any) {
    const componentClass =
        componentInfoObjects?.allComponentClasses?.[componentType];
    if (!componentClass) {
        return true;
    }
    let found = classHasLocation.get(componentClass);
    if (found === undefined) {
        const definitions =
            componentClass.returnNormalizedStateVariableDefinitions?.();
        found = definitions
            ? Object.entries(definitions).some(
                  ([name, definition]: [string, any]) =>
                      definition?.isLocation && !PLACEMENT_LOCATIONS.has(name),
              )
            : true;
        classHasLocation.set(componentClass, found);
    }
    return found;
}

/**
 * The indices of the components of the serialized document `root` that a
 * reader can write to (see the top of this file). `componentInfoObjects`
 * tells which components have a location, which `fixLocation` stops a
 * write to; without it, `fixLocation` stops a write to any component.
 */
export function buildReaderWritableIndex(
    root: any,
    componentInfoObjects?: any,
): Set<number> {
    const nodeByIdx = new Map<number, any>();
    // the serialized components a write stops at, an attribute's component
    // without an index among them
    const fixedNodes = new Set<any>();
    // the serialized components that aren't fixed by what they write
    // themselves (`fixed="false"`), which a write reaches under a fixed one
    const unfixedOwnNodes = new Set<any>();
    // component indices, or serialized components (an input's value child)
    const seeds: (number | any)[] = [];
    // the components between a spreadsheet and its cells (a row, a column,
    // a cell block, a group), which its edit passes by
    const passedBySpreadsheet = new Set<any>();
    // what each unlinked copy inherits where it sits
    const inheritedByCopy = new Map<
        any,
        { fixed: boolean; fixLocation: boolean }
    >();

    /**
     * Whether `fixed` and `fixLocation` as `node` has them (`own`) stop a
     * write to it.
     */
    function stopsWrite(
        node: any,
        own: { fixed: boolean; fixLocation: boolean },
    ): boolean {
        return (
            own.fixed ||
            (own.fixLocation &&
                (!componentInfoObjects ||
                    hasLocation(typeMadeBy(node), componentInfoObjects)))
        );
    }

    /**
     * Whether the serialized component `node` makes a composite (a
     * `<repeat>`, a `<select>`, a `<group>`), whose replacements a
     * reference's path can go into.
     */
    function makesComposite(node: any): boolean {
        return Boolean(
            componentInfoObjects?.isCompositeComponent?.({
                componentType: typeMadeBy(node),
                includeNonStandard: true,
            }),
        );
    }

    /**
     * Whether `name` names a property (a public state variable, or an
     * alias of one) of the component `node` makes.
     */
    function isPropertyOf(node: any, name: string): boolean {
        const info =
            componentInfoObjects?.publicStateVariableInfo?.[typeMadeBy(node)];
        if (!info) {
            return false;
        }
        const lower = name.toLowerCase();
        return [
            ...Object.keys(info.stateVariableDescriptions ?? {}),
            ...Object.keys(info.aliases ?? {}),
        ].some((property) => property.toLowerCase() === lower);
    }

    /**
     * What the copy or extend `node` copies whole, if it copies a
     * component, not a property or an entry of one (`$Q.x`, `$pl[1]`).
     * A path into what a composite makes names a component of its
     * DoenetML: `$r[1].P` names `P` in the repeat's template, which each
     * iteration copies, `$s.P` `P` in an option, and `$r[1]` the repeat,
     * whose template an iteration is. Where the path's name, not a
     * property of the composite, isn't found once under it (made later,
     * or in more than one place), the composite stands for it, erring
     * toward writable.
     */
    function sourceOf(node: any) {
        if (node.componentType !== "_copy") {
            return undefined;
        }
        const reference = Object.values(node.extending ?? {})[0] as any;
        if (typeof reference?.nodeIdx !== "number") {
            return undefined;
        }
        let source = nodeByIdx.get(reference.nodeIdx);
        for (const part of reference.unresolvedPath ?? []) {
            if (!source) {
                return undefined;
            }
            if (part.name) {
                const named = namedUnder(source, part.name);
                if (named.length !== 1) {
                    // a property (`$Q.x`, `$s.numToSelect`), or a
                    // component not found once under a composite
                    return makesComposite(source) &&
                        !isPropertyOf(source, part.name)
                        ? source
                        : undefined;
                }
                source = named[0];
            }
            if (part.index?.length > 0 && !makesComposite(source)) {
                // an entry of a list or of a value
                return undefined;
            }
        }
        return source;
    }

    /**
     * What the unlinked copy `node` pastes, where it `inherited` `fixed`
     * and `fixLocation`: its source, and the source of that when it is a
     * copy or an extend too (`sources`, in turn; an unlinked copy of
     * `<point name="E" extend="$Q"/>` pastes `Q`'s DoenetML, not a link to
     * `Q`), and the `fixed` and `fixLocation` of what it makes (`context`):
     * its own attribute, else the one written on the first source in turn
     * that writes one, else the inherited one. Undefined if `node` pastes
     * nothing.
     */
    function pastedBy(
        node: any,
        inherited: { fixed: boolean; fixLocation: boolean },
    ) {
        const sources: any[] = [];
        for (
            let source = isUnlinkedCopy(node) ? sourceOf(node) : undefined;
            source && source !== node && !sources.includes(source);
            source = sourceOf(source)
        ) {
            sources.push(source);
        }
        if (sources.length === 0) {
            return undefined;
        }
        let context = inherited;
        for (const source of [...sources].reverse()) {
            context = ownContext(source, context);
        }
        context = ownContext(node, context);
        return {
            sources,
            context,
            stops: stopsWrite(sources[sources.length - 1], context),
        };
    }

    /**
     * Queue what a write to an unlinked copy reaches (`pastedBy`): the own
     * references and descendants of each source it pastes, as pasted where
     * the copy sits, fixed as `context` says. No source is written to.
     */
    function paste({
        sources,
        context,
    }: {
        sources: any[];
        context: { fixed: boolean; fixLocation: boolean };
    }) {
        for (const source of sources) {
            // what a source in turn copies or extends is pasted as the next
            // source, not written to; what the last one extends (a property,
            // `$Q.x`, or a component the document doesn't hold) counts as
            // written to, erring toward writable
            for (const idx of ownReferencesIn(
                source,
                [],
                source !== sources[sources.length - 1],
            )) {
                queue.push({ item: idx, stopped: false });
            }
            for (const under of componentsUnder(source)) {
                queue.push({ item: under, stopped: false, pasted: context });
            }
        }
    }

    // `fixed` and `fixLocation` are each inherited from where a component
    // sits, unless it writes its own (`fixed="false"` in a fixed graph),
    // as `contextAttribute.js` decides them
    function walk(
        node: any,
        inGraph: boolean,
        inherited: { fixed: boolean; fixLocation: boolean },
        inSpreadsheet = false,
    ) {
        const own = ownContext(node, inherited);
        // a reader can't drag what is fixed or has a fixed location
        const isFixed = own.fixed || own.fixLocation;
        const isGraph = node.componentType === "graph";
        if (typeof node.componentIdx === "number" && node.componentIdx >= 0) {
            nodeByIdx.set(node.componentIdx, node);
        }
        // a reference to what `copy`, `extend` (`<point extend="$Q"
        // name="E"/>`) makes names the index it is made with
        const createdIdx = createdIdxOf(node);
        if (createdIdx !== undefined) {
            nodeByIdx.set(createdIdx, node);
        }
        if (stopsWrite(node, own)) {
            fixedNodes.add(node);
        } else if (node.attributes?.fixed || node.attributes?.fixLocation) {
            unfixedOwnNodes.add(node);
        }
        if (inSpreadsheet) {
            passedBySpreadsheet.add(node);
        }
        if (isUnlinkedCopy(node)) {
            inheritedByCopy.set(node, inherited);
        }
        // a fixed input writes nothing back (its inverse isn't called)
        if (node.attributes?.bindValueTo && !own.fixed) {
            referencesIn(node.attributes.bindValueTo, seeds);
        }
        const valueType = VALUE_CHILD_TYPE_OF_INPUT[node.componentType];
        if (valueType && !own.fixed) {
            seeds.push(...valueChildren(node, valueType, componentInfoObjects));
        }
        if (ACTION_TYPES.has(node.componentType) && node.attributes?.target) {
            referencesIn(node.attributes.target, seeds);
        }
        if (
            EDITED_TYPES.has(node.componentType) &&
            typeof node.componentIdx === "number"
        ) {
            // a fixed one is stopped as the write spreads
            seeds.push(node.componentIdx);
        }
        if (inGraph && !isFixed) {
            // dragged, and so is what it references itself (an extend);
            // what its children and attributes reference is reached as
            // they are walked
            if (typeof node.componentIdx === "number") {
                seeds.push(node.componentIdx);
            }
            if (!isUnlinkedCopy(node)) {
                referencesIn(node.extending, seeds);
            }
            for (const attribute of Object.values(
                node.attributes ?? {},
            ) as any[]) {
                if (attribute?.type === "expression") {
                    referencesIn(attribute.slots, seeds);
                }
            }
        }
        // a spreadsheet's edit passes by what is between it and its cells
        const childrenInSpreadsheet =
            EDITED_TYPES.has(node.componentType) ||
            (inSpreadsheet && node.componentType !== "cell");
        const children = new Set(node.children ?? []);
        for (const under of componentsUnder(node)) {
            walk(
                under,
                inGraph || isGraph,
                own,
                childrenInSpreadsheet && children.has(under),
            );
        }
    }
    walk(root, false, { fixed: false, fixLocation: false });

    // A write reaches a component's descendants, each visited on its own,
    // so that a fixed one stops it, and what each references itself (an
    // inverse definition). A write to a fixed component stops there: it
    // reaches nothing under it, as each write passes through it. Only a
    // spreadsheet writes past a fixed component, to its cells directly, so
    // under a fixed component between a spreadsheet and its cells
    // (`stopped`) it reaches only a descendant that writes its own
    // `fixed="false"` (a `<cell fixed="false">` in a `<row fixed>`), and
    // what is under that one.
    // A write to an unlinked copy reaches its source's descendants as they
    // are pasted in the copy (`pasted`: what they inherit there), which a
    // fixed descendant stops, and what they reference; not its source.
    const writable = new Set<number>();
    const reached = new Set<any>();
    const reachedStopped = new Set<any>();
    const reachedPasted = new Map<any, Set<string>>();
    type Item = {
        item: number | any;
        stopped: boolean;
        pasted?: { fixed: boolean; fixLocation: boolean };
    };
    const queue: Item[] = seeds.map((item) => ({ item, stopped: false }));
    while (queue.length > 0) {
        const { item, stopped: stoppedAbove, pasted } = queue.pop()!;
        const node = typeof item === "number" ? nodeByIdx.get(item) : item;
        if (!node) {
            // a component the serialized document doesn't hold
            writable.add(item);
            continue;
        }
        if (pasted) {
            const own = ownContext(node, pasted);
            const key = `${own.fixed},${own.fixLocation}`;
            const seen = reachedPasted.get(node) ?? new Set<string>();
            if (seen.has(key) || stopsWrite(node, own)) {
                continue;
            }
            seen.add(key);
            reachedPasted.set(node, seen);
            for (const idx of ownReferencesIn(node)) {
                queue.push({ item: idx, stopped: false });
            }
            for (const under of componentsUnder(node)) {
                queue.push({ item: under, stopped: false, pasted: own });
            }
            // an unlinked copy in what is pasted is pasted there too
            const pastedHere = pastedBy(node, pasted);
            if (pastedHere && !pastedHere.stops) {
                paste(pastedHere);
            }
            continue;
        }
        const pastedHere = isUnlinkedCopy(node)
            ? pastedBy(node, inheritedByCopy.get(node)!)
            : undefined;
        const stopped =
            (pastedHere ? pastedHere.stops : fixedNodes.has(node)) ||
            (stoppedAbove && !unfixedOwnNodes.has(node));
        if (reached.has(node) || (stopped && reachedStopped.has(node))) {
            continue;
        }
        (stopped ? reachedStopped : reached).add(node);
        if (!stopped) {
            if (
                typeof node.componentIdx === "number" &&
                node.componentIdx >= 0
            ) {
                writable.add(node.componentIdx);
            }
            const createdIdx = createdIdxOf(node);
            if (createdIdx !== undefined) {
                writable.add(createdIdx);
            }
            // what is made from it later is written to as it is
            node.readerWritable = true;
            for (const idx of ownReferencesIn(node)) {
                queue.push({ item: idx, stopped: false });
            }
            if (pastedHere) {
                paste(pastedHere);
            }
        }
        if (stopped && !passedBySpreadsheet.has(node)) {
            continue;
        }
        for (const under of componentsUnder(node)) {
            queue.push({ item: under, stopped });
        }
    }
    return writable;
}

/**
 * `fixed` and `fixLocation` of the serialized component `node`: what it
 * writes itself, or else what it `inherited`.
 */
function ownContext(
    node: any,
    inherited: { fixed: boolean; fixLocation: boolean },
) {
    return {
        fixed: node.attributes?.fixed
            ? writtenAsTrue(node.attributes.fixed)
            : inherited.fixed,
        fixLocation: node.attributes?.fixLocation
            ? writtenAsTrue(node.attributes.fixLocation)
            : inherited.fixLocation,
    };
}

/** Whether the serialized component `node` is an unlinked copy. */
function isUnlinkedCopy(node: any): boolean {
    return (
        node.componentType === "_copy" &&
        node.attributes?._link?.primitive?.value === false
    );
}

/**
 * The serialized components under `node` (not `node` itself) named `name`.
 */
function namedUnder(node: any, name: string): any[] {
    const found: any[] = [];
    const toVisit = componentsUnder(node);
    while (toVisit.length > 0) {
        const under = toVisit.pop();
        if (under.attributes?.name?.primitive?.value === name) {
            found.push(under);
        }
        toVisit.push(...componentsUnder(under));
    }
    return found;
}

/**
 * The index of the component a `_copy` (a reference, `copy` or `extend`)
 * is made with, which a reference to it by name (`$E`) names, if it has one.
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

/**
 * Add the component `componentIdx`, being made from `serializedComponent`,
 * to `writable` (`Core.readerWritable`) when it is made from what a reader
 * can write to: a serialized component {@link buildReaderWritableIndex}
 * marked, or a copy of one with new indices (an iteration of a repeat), or
 * one serialized from a component in `writable` (`originalIdx`).
 */
export function noteReaderWritable(
    serializedComponent: any,
    componentIdx: number,
    writable: Set<number>,
) {
    if (
        serializedComponent.readerWritable ||
        (typeof serializedComponent.originalIdx === "number" &&
            writable.has(serializedComponent.originalIdx))
    ) {
        writable.add(componentIdx);
    }
}
