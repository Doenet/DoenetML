/**
 * The load-time check of a reference written as a tag (D36, REF-0, REF-5):
 * `<T extend="$x" …/>` and `<T copy="$x" …/>` always make exactly one `T`,
 * so whether a `T` can be made from what `x` holds is decided here, from
 * the DoenetML alone, before anything runs. Part of Doenet/DoenetML#2445.
 *
 * When `x` is a composite, or a list the document makes, a scalar tag `T`
 * needs it to **always hold exactly one component, of one type S**, where S
 * may become a `T` (`typeChangeRule`). What it holds is read from what the
 * author wrote:
 *
 * - a `<conditionalContent>` needs an `<else>` (a `<case>` with no
 *   `condition`), and each case one component;
 * - a `<select>` and the other selectors need `numToSelect` (`numSamples`)
 *   written as `1` or left out, and each option one component;
 * - a `<group>`, `<sort>` or `<shuffle>` needs one component, and a copy of
 *   one (`<group name="h" extend="$g">…</group>`) holds what it copies and
 *   what is written in it;
 * - a `<repeat>`, `<collect>`, `<sequence>`, `<intersection>`, or any other
 *   composite whose content is made rather than written, can hold any number;
 * - a bare string is a text, a bare `$y` holds y's tag (looked through when
 *   y is a composite), a tag `<U extend="$y"/>` is a `U`, and a property
 *   `$P.x` has a type the DoenetML does not give.
 *
 * Different types that could each become a `T` are an error too: the author
 * wraps the reference, `<math>$cc</math>`, to read whatever it holds as one
 * value. A type that already is a `T` (an `<integer>` for a `<number>`)
 * counts as `T`.
 *
 * A list tag (`<mathList extend="$g"/>`) takes any number of components,
 * including none, but they must all be of one type.
 *
 * An index written as a literal into a selector whose `numToSelect` is
 * written (`<math extend="$s[2]"/>` of a one-pick `<select>`) names nothing
 * whatever happens at run time, so it is an error too. Each pick of a
 * `<select>` and each iteration of a `<repeat>` an index selects is held to
 * the same rules as a whole composite.
 *
 * What is found is recorded on the `_copy` as
 * `doenetAttributes.typeChangeAtLoad`: `{ code, args }` for an error, which
 * `Copy.js` reports in place of the copy (`typeChangeStatus`), or `"allowed"`
 * when the check passed. What still changes at run time is the value of a
 * math a point or a boolean is made from (`doenet-i0053`), and an index whose
 * value names nothing (`doenet-i0054`); neither changes what the component is.
 *
 * Runs after sugar (which makes an `<else>` a `<case>`) and before the list
 * forms and value references, so that it sees the tags the author wrote.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent, SerializedAttribute } from "./types";
import { documentReferents } from "./valueReferences";
import { typeChangeRule } from "../typeChange";
import { sequenceEntryComponentType } from "../sequence";

/** What `doenetAttributes.typeChangeAtLoad` holds for an error. */
export type TypeChangeAtLoadError = {
    code: string;
    args: Record<string, string | number>;
};

/** Why a composite does not always hold exactly one component. */
type NotOne =
    /** a `<conditionalContent>` with no `<else>` */
    | { reason: "noElse" }
    /** a selector whose `numToSelect` (`numSamples`) is not written as 1 */
    | { reason: "numToSelect"; attribute: string }
    /** a composite that can hold any number, such as a `<repeat>` */
    | { reason: "anyNumber" }
    /**
     * a part (a case, an option, an iteration), or a composite itself
     * (`other`), that holds `count`
     */
    | { reason: "count"; count: number; part: Part };

/** What a count of `NotOne` is of. */
type Part = "case" | "option" | "iteration" | "other";

/**
 * What a composite, or a part of one, can hold, read from the DoenetML:
 * whether it always holds exactly one component (`notOne` when not, and
 * why), the types it can hold, and whether some of them are not known.
 * `skip` when an error is there already, or what it holds is the copy
 * itself, so nothing more is reported.
 */
type Holding = {
    notOne?: NotOne;
    /** the tag of the composite `notOne` is about */
    notOneTag?: string;
    types: Set<string>;
    /** what of it has a type the DoenetML does not give */
    unknown?: "property" | "reference";
    skip?: boolean;
};

/** The composites that can hold any number of components. */
const HOLD_ANY_NUMBER = new Set([
    "repeat",
    "repeatForSequence",
    "collect",
    "sequence",
    "intersection",
]);

/** The selectors, by the attribute that says how many they pick. */
const SELECTORS: Record<string, string> = {
    select: "numToSelect",
    selectFromSequence: "numToSelect",
    selectRandomNumbers: "numToSelect",
    selectPrimeNumbers: "numToSelect",
    sampleRandomNumbers: "numSamples",
    samplePrimeNumbers: "numSamples",
};

/** The composites that hold what is written in them, reordered or not. */
const HOLD_CHILDREN = new Set(["group", "sort", "shuffle"]);

/**
 * Check every reference written as a tag in `serializedComponents`, marking
 * what is found on it (see above).
 */
export function checkTypeChangesAtLoad({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const referents = documentReferents({
        serializedComponents,
        componentInfoObjects,
    });

    /**
     * What each composite or copy a reference names holds
     * (`referenceHolding`), by its index, kept when nothing in finding it
     * met what was being found already (`seenHits`), with the components
     * finding it checked against `seen` (`touched`). Where none of those
     * is being found already, finding it again would follow the same path
     * and meet nothing, so the result is the same however it was reached,
     * and it is found once however many references, or parts, name it.
     * Without it, cases that each name a composite whose cases each name
     * another would be read once per path, doubling with each level. Where
     * one of them is being found already (it is reached from inside a
     * cycle through it), it is found again, and that meets the cycle.
     */
    const heldByIdx = new Map<
        number,
        { held: Holding; touched: Set<number> }
    >();
    /** How many times a search met what it was finding already. */
    let seenHits = 0;
    /**
     * The components checked against `seen` while deciding one reference,
     * in order, from which `touched` of what `heldByIdx` keeps is taken.
     */
    let trail: number[] = [];

    /**
     * What `descendantNamed` found, by the index of the component searched
     * and the name, so that a component is searched once for a name however
     * many references (`$s.x`, `$s.title`) start from it.
     */
    const namedBelowByKey = new Map<string, SerializedComponent | undefined>();

    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;

    function canonicalType(type: string | undefined) {
        return type === undefined
            ? undefined
            : componentInfoObjects.componentTypeLowerCaseMapping[
                  type.toLowerCase()
              ];
    }

    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }

    /** Whether what a component of this type holds is read here. */
    function isHolder(componentType: string) {
        return (
            isComposite(componentType) ||
            HOLD_ANY_NUMBER.has(componentType) ||
            Object.hasOwn(SELECTORS, componentType)
        );
    }

    /** The reference a `_copy` is of. */
    function refOf(component: SerializedComponent) {
        const extending: any = component.extending;
        if (!extending) {
            return undefined;
        }
        return (extending.Ref ??
            extending.ExtendAttribute ??
            extending.CopyAttribute) as
            | {
                  nodeIdx: number;
                  unresolvedPath: any[] | null;
                  originalPath: any[];
              }
            | undefined;
    }

    /** The text an attribute is written as, if it is only text. */
    function literalText(attribute: SerializedAttribute | undefined) {
        if (attribute === undefined) {
            return undefined;
        }
        const attr: any = attribute;
        if (attr.type === "primitive") {
            return String(attr.primitive.value);
        }
        const children =
            attr.type === "component"
                ? attr.component?.children
                : attr.type === "unresolved"
                  ? attr.children
                  : undefined;
        if (
            Array.isArray(children) &&
            children.every((child: unknown) => typeof child === "string")
        ) {
            return children.join("").trim();
        }
        return undefined;
    }

    /** An attribute of `component`, matched without regard to case. */
    function attributeOf(component: SerializedComponent, name: string) {
        const lower = name.toLowerCase();
        for (const [attrName, attribute] of Object.entries(
            component.attributes ?? {},
        )) {
            if (attrName.toLowerCase() === lower) {
                return attribute;
            }
        }
        return undefined;
    }

    /**
     * How many a selector picks, when written as a whole number, or
     * `undefined` when it is not (a reference, an expression).
     */
    function numPicked(component: SerializedComponent) {
        const attribute = attributeOf(
            component,
            SELECTORS[component.componentType],
        );
        if (attribute === undefined) {
            return 1;
        }
        const text = literalText(attribute);
        if (text === undefined || !/^\d+$/.test(text)) {
            return undefined;
        }
        return Number(text);
    }

    /**
     * The type of the components a list the document makes, such as a
     * `<selectFromSequence>`, holds.
     */
    function entryType(component: SerializedComponent) {
        const componentClass = allClasses[component.componentType];
        if (componentClass?.listEntryTypeAttribute !== undefined) {
            const type = sequenceEntryComponentType(
                attributeOf(component, componentClass.listEntryTypeAttribute),
            );
            return type;
        }
        return componentClass?.listEntryComponentType;
    }

    /**
     * The children of a case, through the `<group>` with no attributes that
     * its sugar wraps them in.
     */
    function withoutSugarGroup(children: (SerializedComponent | string)[]) {
        const shown = children.filter(
            (child) => typeof child !== "string" || child.trim() !== "",
        );
        const [only] = shown;
        if (
            shown.length === 1 &&
            typeof only === "object" &&
            only.componentType === "group" &&
            Object.keys(only.attributes ?? {}).length === 0
        ) {
            return only.children;
        }
        return children;
    }

    /** What the children of a group, a case or an option hold together. */
    function childrenHolding(
        children: (SerializedComponent | string)[],
        part: Part,
        seen: Set<number>,
    ): Holding {
        const holdings: Holding[] = [];
        for (const child of children) {
            if (typeof child === "string") {
                if (child.trim() !== "") {
                    holdings.push({ types: new Set(["text"]) });
                }
                continue;
            }
            // A `<setup>`, and the one a repeat makes for its `valueName`
            // and `indexName`, show nothing.
            if (
                child.componentType === "setup" ||
                child.componentType === "_repeatSetup"
            ) {
                continue;
            }
            holdings.push(itemHolding(child, seen));
        }
        const types = new Set<string>();
        let unknown: Holding["unknown"];
        for (const holding of holdings) {
            if (holding.skip) {
                return { types, skip: true };
            }
            holding.types.forEach((type) => types.add(type));
            unknown ??= holding.unknown;
        }
        if (holdings.length === 1) {
            return holdings[0];
        }
        return {
            notOne: { reason: "count", count: holdings.length, part },
            types,
            unknown,
        };
    }

    /** What one component written in a composite stands for. */
    function itemHolding(
        item: SerializedComponent,
        seen: Set<number>,
    ): Holding {
        const componentType = item.componentType;
        if (componentType === "_error") {
            return { types: new Set(), skip: true };
        }
        if (componentType === "_copy") {
            const written = canonicalType(
                literalText(item.attributes._createComponentOfType),
            );
            if (
                written &&
                written !== "group" &&
                !isHolder(written) &&
                allClasses[written]?.listEntryComponentType === undefined
            ) {
                return { types: new Set([written]) };
            }
            return withAdded(
                referenceHolding(item, seen),
                [item.children ?? []],
                seen,
            );
        }
        if (isHolder(componentType)) {
            return holding(item, seen);
        }
        if (allClasses[componentType]?.listEntryComponentType !== undefined) {
            // What a list stands for, its entries, can change without the
            // composite holding it making anything new, so it is not
            // decided here.
            return { types: new Set(), skip: true };
        }
        return { types: new Set([componentType]) };
    }

    /** What a bare reference `$y` holds: y's tag, or what y holds. */
    function referenceHolding(
        copy: SerializedComponent,
        seen: Set<number>,
    ): Holding {
        const ref = refOf(copy);
        if (!ref || ref.nodeIdx < 0) {
            return { types: new Set(), skip: true };
        }
        if (ref.unresolvedPath && ref.unresolvedPath.length > 0) {
            if (ref.unresolvedPath[0].name !== "") {
                const named = descendantNamed(ref.nodeIdx, ref.unresolvedPath);
                if (!named) {
                    return { types: new Set(), unknown: "property" };
                }
                return referenceHolding(
                    {
                        ...copy,
                        extending: {
                            Ref: {
                                nodeIdx: named.componentIdx,
                                unresolvedPath: null,
                                originalPath: [],
                            },
                        },
                    } as any,
                    seen,
                );
            }
            return indexedHolding(ref, seen);
        }
        const referent = referents.componentsByIdx.get(ref.nodeIdx);
        const referentType = referents.referentType(ref.nodeIdx);
        if (referentType === undefined) {
            return { types: new Set(), unknown: "reference" };
        }
        if (referentType === "_error") {
            return { types: new Set(), skip: true };
        }
        const node =
            referent ?? referents.copiesByCreatedIdx.get(ref.nodeIdx) ?? null;
        if (
            node &&
            (node.componentType === "_copy" || isHolder(referentType))
        ) {
            trail.push(node.componentIdx);
            if (seen.has(node.componentIdx)) {
                // what it holds holds itself (`doenet-e0005`)
                seenHits++;
                return { types: new Set(), skip: true };
            }
            const known = heldByIdx.get(node.componentIdx);
            if (known && ![...seen].some((idx) => known.touched.has(idx))) {
                trail.push(...known.touched);
                return known.held;
            }
            const hitsBefore = seenHits;
            const trailBefore = trail.length;
            const seenBelow = new Set(seen).add(node.componentIdx);
            const held =
                node.componentType === "_copy"
                    ? itemHolding(node, seenBelow)
                    : holding(node, seenBelow);
            if (seenHits === hitsBefore && !known) {
                heldByIdx.set(node.componentIdx, {
                    held,
                    touched: new Set(trail.slice(trailBefore - 1)),
                });
            }
            return held;
        }
        return { types: new Set([referentType]) };
    }

    /**
     * The component a reference names by names left for run time
     * (`$s.go`, of a `<group name="go">` in an option of a `<select>`):
     * each a descendant, written in the DoenetML, of the one before it, or
     * of what it copies (`$m2.go` of `<module name="m2" extend="$m"/>`), or
     * `undefined` when a part is not such a name (a property, an index).
     */
    function descendantNamed(nodeIdx: number, path: any[]) {
        let node: SerializedComponent | undefined =
            referents.componentsByIdx.get(nodeIdx) ??
            referents.copiesByCreatedIdx.get(nodeIdx);
        for (const part of path) {
            if (!node || part.name === "" || (part.index ?? []).length > 0) {
                return undefined;
            }
            const key = `${node.componentIdx}:${part.name}`;
            if (!namedBelowByKey.has(key)) {
                namedBelowByKey.set(key, namedIn(node, part.name));
            }
            node = namedBelowByKey.get(key);
        }
        return node;
    }

    /**
     * The first component named `name` written in `node`, or, when there
     * is none and `node` is a copy, in what it copies.
     */
    function namedIn(node: SerializedComponent, name: string) {
        const visited = new Set<number>();
        let current: SerializedComponent | undefined = node;
        while (current && !visited.has(current.componentIdx)) {
            visited.add(current.componentIdx);
            const found = findNamed(current.children ?? [], name);
            if (found || current.componentType !== "_copy") {
                return found;
            }
            const ref = refOf(current);
            if (
                !ref ||
                ref.nodeIdx < 0 ||
                (ref.unresolvedPath && ref.unresolvedPath.length > 0)
            ) {
                return undefined;
            }
            current =
                referents.componentsByIdx.get(ref.nodeIdx) ??
                referents.copiesByCreatedIdx.get(ref.nodeIdx);
        }
        return undefined;
    }

    /** The first component named `name` among `components` and theirs. */
    function findNamed(
        components: (SerializedComponent | string)[],
        name: string,
    ): SerializedComponent | undefined {
        for (const component of components) {
            if (typeof component !== "object") {
                continue;
            }
            // A tag written with `extend` or `copy` has its name moved to
            // `_createComponentName` (`convertToCopy.ts`).
            const attributes = component.attributes ?? {};
            if (
                literalText(attributes.name) === name ||
                literalText(attributes._createComponentName) === name
            ) {
                return component;
            }
            const below = findNamed(component.children ?? [], name);
            if (below) {
                return below;
            }
        }
        return undefined;
    }

    /**
     * What a reference with one index and nothing after it (`$l[$i]`,
     * `$r[1]`) holds: an entry of a list, of the type of its entries, or
     * an instance of a selector or a repeat (`instanceHolding`). An index
     * that names nothing now makes nothing, which is not decided here.
     */
    function indexedHolding(
        ref: { nodeIdx: number; unresolvedPath: any[] | null },
        seen: Set<number>,
    ): Holding {
        const path = ref.unresolvedPath ?? [];
        const unknown: Holding = { types: new Set(), unknown: "reference" };
        if (path.length !== 1 || (path[0].index ?? []).length !== 1) {
            return unknown;
        }
        const node =
            referents.componentsByIdx.get(ref.nodeIdx) ??
            referents.copiesByCreatedIdx.get(ref.nodeIdx);
        const type = referents.referentType(ref.nodeIdx);
        if (!node || type === undefined) {
            return unknown;
        }
        if (node.componentType !== "_copy" && !isHolder(type)) {
            const entry = entryType(node);
            return entry ? { types: new Set([entry]) } : unknown;
        }
        // An index after a reference to a copy (`$a1[2]` of `<group
        // extend="$a"/>`) selects among what the copy holds, not the
        // instances of what it copies.
        const holder =
            node.componentType === "_copy"
                ? undefined
                : namedHolder(ref.nodeIdx, seen);
        const held = holder && instanceHolding(holder, seen);
        if (held) {
            return held;
        }
        if (holder && !isComposite(holder.componentType)) {
            // a list the document makes, such as a `<sequence>`
            const entry = entryType(holder);
            return entry ? { types: new Set([entry]) } : unknown;
        }
        return unknown;
    }

    /** What the composite, or the list the document makes, `x` holds. */
    function holding(x: SerializedComponent, seen: Set<number>): Holding {
        const componentType = x.componentType;
        const children = x.children ?? [];

        if (componentType === "conditionalContent") {
            const cases = children.filter(
                (child): child is SerializedComponent =>
                    typeof child === "object" && child.componentType === "case",
            );
            const hasElse = cases.some(
                (c) => attributeOf(c, "condition") === undefined,
            );
            return combineParts(
                cases.map((c) =>
                    childrenHolding(
                        withoutSugarGroup(c.children),
                        "case",
                        seen,
                    ),
                ),
                hasElse ? undefined : { reason: "noElse" },
                componentType,
                "case",
            );
        }

        if (Object.hasOwn(SELECTORS, componentType)) {
            const picked = numPicked(x);
            const notOne: NotOne | undefined =
                picked === 1
                    ? undefined
                    : {
                          reason: "numToSelect",
                          attribute: SELECTORS[componentType],
                      };
            if (componentType === "select") {
                const options = children.filter(
                    (child): child is SerializedComponent =>
                        typeof child === "object" &&
                        child.componentType === "option",
                );
                return combineParts(
                    options.map((o) =>
                        childrenHolding(o.children, "option", seen),
                    ),
                    notOne,
                    componentType,
                    "option",
                );
            }
            const type = entryType(x);
            return {
                types: new Set(type ? [type] : []),
                ...(type === undefined && { unknown: "reference" }),
                ...(notOne && { notOne, notOneTag: componentType }),
            };
        }

        if (componentType === "substitute") {
            // one math or text, as its `type` says
            const type = literalText(attributeOf(x, "type"));
            if (type === undefined && attributeOf(x, "type") !== undefined) {
                return { types: new Set(), unknown: "reference" };
            }
            return {
                types: new Set([
                    type?.toLowerCase() === "text" ? "text" : "math",
                ]),
            };
        }

        if (HOLD_CHILDREN.has(componentType)) {
            return asPartOf(
                childrenHolding(children, "other", seen),
                componentType,
                "other",
            );
        }

        // Any other composite, or a list the document makes, can hold any
        // number of components. Their type, where the DoenetML gives it:
        const types = new Set<string>();
        let unknown: Holding["unknown"];
        if (
            componentType === "repeat" ||
            componentType === "repeatForSequence"
        ) {
            const template = childrenHolding(children, "other", seen);
            if (template.skip) {
                return template;
            }
            template.types.forEach((type) => types.add(type));
            unknown = template.unknown;
        } else if (componentType === "collect") {
            const collected = canonicalType(
                literalText(attributeOf(x, "componentType")),
            );
            if (collected) {
                types.add(collected);
            } else {
                unknown = "reference";
            }
        } else {
            const type = entryType(x);
            if (type) {
                types.add(type);
            } else {
                unknown = "reference";
            }
        }
        return {
            notOne: { reason: "anyNumber" },
            notOneTag: componentType,
            types,
            unknown,
        };
    }

    /**
     * `held`, what one `part` of the composite `tag` holds, with a count of
     * what that part holds itself named as `tag`'s `part`. A count passed
     * up from a `<group>` written in it (`part` `other`) is one too. A count
     * of a part of a composite further in (a case of a `<conditionalContent>`
     * in a `<group>`) keeps naming that composite.
     */
    function asPartOf(held: Holding, tag: string, part: Part): Holding {
        if (held.notOne?.reason !== "count") {
            return held;
        }
        if (held.notOne.part === "other") {
            return {
                ...held,
                notOne: { ...held.notOne, part },
                notOneTag: tag,
            };
        }
        return held.notOneTag === undefined
            ? { ...held, notOneTag: tag }
            : held;
    }

    /**
     * What a composite `tag` holding one of `parts` at a time (each a
     * `partKind`, a case or an option) holds: one component when each part
     * holds one, and `notOne` is not given.
     */
    function combineParts(
        parts: Holding[],
        notOne: NotOne | undefined,
        tag: string,
        partKind: "case" | "option",
    ): Holding {
        const types = new Set<string>();
        let unknown: Holding["unknown"];
        let partNotOne: Holding | undefined;
        for (const part of parts) {
            if (part.skip) {
                return { types, skip: true };
            }
            part.types.forEach((type) => types.add(type));
            unknown ??= part.unknown;
            if (part.notOne && !partNotOne) {
                partNotOne = part;
            }
        }
        if (notOne) {
            return { notOne, notOneTag: tag, types, unknown };
        }
        if (partNotOne) {
            const named = asPartOf(partNotOne, tag, partKind);
            return {
                notOne: named.notOne,
                notOneTag: named.notOneTag,
                types,
                unknown,
            };
        }
        if (parts.length === 0) {
            return {
                notOne: { reason: "count", count: 0, part: "other" },
                notOneTag: tag,
                types,
            };
        }
        return { types, unknown };
    }

    /**
     * What `held`, what a composite a copy is of holds, holds with the
     * children written on the copy and each copy between (`added`, as
     * `<group name="h" extend="$g"><math>2</math></group>` adds a math to
     * what `g` holds), which it holds after what it copies.
     */
    function withAdded(
        held: Holding,
        added: (SerializedComponent | string)[][],
        seen: Set<number>,
    ): Holding {
        const children = added
            .flat()
            .filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
        if (held.skip || children.length === 0) {
            return held;
        }
        const extra = childrenHolding(children, "other", seen);
        if (extra.skip) {
            return extra;
        }
        const types = new Set([...held.types, ...extra.types]);
        const unknown = held.unknown ?? extra.unknown;
        /**
         * How many components `h` always holds, or `undefined` when that is
         * not one number (a count of a case, a `<repeat>`).
         */
        function countOf(h: Holding) {
            if (h.notOne === undefined) {
                return 1;
            }
            return h.notOne.reason === "count" && h.notOne.part === "other"
                ? h.notOne.count
                : undefined;
        }
        const heldCount = countOf(held);
        const extraCount = countOf(extra);
        if (heldCount === undefined || extraCount === undefined) {
            // one of them does not always hold one number of components,
            // whatever the other holds
            const notOneOf = heldCount === undefined ? held : extra;
            return {
                notOne: notOneOf.notOne,
                notOneTag: notOneOf.notOneTag,
                types,
                unknown,
            };
        }
        const total = heldCount + extraCount;
        if (total === 1) {
            return { types, unknown };
        }
        return {
            notOne: { reason: "count", count: total, part: "other" },
            notOneTag:
                held.notOne?.reason === "count" ? held.notOneTag : undefined,
            types,
            unknown,
        };
    }

    /** What one instance of `x` an index selects holds, if that is known. */
    function instanceHolding(
        x: SerializedComponent,
        seen: Set<number>,
    ): Holding | undefined {
        if (x.componentType === "select") {
            const options = x.children.filter(
                (child): child is SerializedComponent =>
                    typeof child === "object" &&
                    child.componentType === "option",
            );
            return combineParts(
                options.map((o) => childrenHolding(o.children, "option", seen)),
                undefined,
                "select",
                "option",
            );
        }
        if (
            x.componentType === "repeat" ||
            x.componentType === "repeatForSequence"
        ) {
            return asPartOf(
                childrenHolding(x.children, "other", seen),
                x.componentType,
                "iteration",
            );
        }
        return undefined;
    }

    /** Whether `writtenType` may be made from a component of `sourceType`. */
    function becomes(sourceType: string, writtenType: string) {
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: sourceType,
                baseComponentType: writtenType,
            })
        ) {
            return { allowed: true } as const;
        }
        if (!allClasses[sourceType]) {
            return { allowed: true } as const;
        }
        return typeChangeRule({
            writtenType,
            sourceType,
            componentInfoObjects,
        });
    }

    /**
     * The types in `types`, with each that already is a `writtenType`
     * (`<integer>` for a `<number>`) counted as one: a `writtenType` is
     * made from any of them without a type change, so they are one type
     * for it.
     */
    function typesAs(types: Set<string>, writtenType: string | undefined) {
        const result = new Set<string>();
        for (const type of types) {
            result.add(
                writtenType !== undefined &&
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: type,
                        baseComponentType: writtenType,
                    })
                    ? writtenType
                    : type,
            );
        }
        return [...result];
    }

    /** The error for a scalar tag `writtenType` made from `held`, if any. */
    function scalarError(
        held: Holding,
        writtenType: string,
        sourceTag: string,
        direct: boolean,
    ): TypeChangeAtLoadError | undefined {
        if (held.notOne) {
            const notOne = held.notOne;
            const tag = held.notOneTag ?? sourceTag;
            return {
                code: "doenet-e0064",
                args: {
                    reason: notOne.reason,
                    sourceType: tag,
                    ...(notOne.reason === "count" && {
                        count: notOne.count,
                        holdsNothing: notOne.count === 0 ? "true" : "false",
                        part: notOne.part,
                    }),
                    ...(notOne.reason === "numToSelect" && {
                        attribute: notOne.attribute,
                    }),
                    // `$x[1]` names one component only of the composite named
                    indexSelectsOne:
                        direct &&
                        tag === sourceTag &&
                        (notOne.reason === "numToSelect" ||
                            (notOne.reason === "anyNumber" &&
                                HOLD_ANY_NUMBER.has(tag)))
                            ? "true"
                            : "false",
                },
            };
        }
        if (held.unknown) {
            return {
                code: "doenet-e0067",
                args: { what: held.unknown },
            };
        }
        const types = typesAs(held.types, writtenType);
        for (const sourceType of types) {
            const rule = becomes(sourceType, writtenType);
            if (!rule.allowed) {
                return {
                    code: "doenet-e0065",
                    args: { sourceType },
                };
            }
        }
        if (types.length > 1) {
            return {
                code: "doenet-e0066",
                args: {
                    isList: "false",
                    types: types.map((type) => `\`<${type}>\``).join(", "),
                },
            };
        }
        return undefined;
    }

    /**
     * The error for a list tag whose entries are `entryType` made from
     * `held`, if any.
     */
    function listError(
        held: Holding,
        entryType: string | undefined,
    ): TypeChangeAtLoadError | undefined {
        if (held.unknown) {
            return undefined;
        }
        const types = typesAs(held.types, entryType);
        if (types.length > 1) {
            return {
                code: "doenet-e0066",
                args: {
                    isList: "true",
                    types: types.map((type) => `\`<${type}>\``).join(", "),
                },
            };
        }
        return undefined;
    }

    /**
     * The composite (or list the document makes) a reference names, with
     * no path left, looking through references to it (`<group name="h"
     * extend="$g"/>`), or `undefined` when it names something else.
     */
    function namedHolder(
        nodeIdx: number,
        seen: Set<number>,
        added: (SerializedComponent | string)[][] = [],
    ) {
        let idx = nodeIdx;
        const visited = new Set(seen);
        for (;;) {
            trail.push(idx);
            if (visited.has(idx)) {
                seenHits++;
                return undefined;
            }
            visited.add(idx);
            const type = referents.referentType(idx);
            const node =
                referents.componentsByIdx.get(idx) ??
                referents.copiesByCreatedIdx.get(idx);
            if (!node || type === undefined) {
                return undefined;
            }
            if (node.componentType === "_copy") {
                if (type !== "group" && !isHolder(type)) {
                    return undefined;
                }
                const ref = refOf(node);
                if (
                    !ref ||
                    ref.nodeIdx < 0 ||
                    (ref.unresolvedPath && ref.unresolvedPath.length > 0)
                ) {
                    return undefined;
                }
                added.push(node.children ?? []);
                idx = ref.nodeIdx;
                continue;
            }
            // A `<setup>` shows nothing; one reached by the index of a
            // child (`$g[1]`, `doenet-w0179`) is not decided.
            return isHolder(type) && type !== "setup" ? node : undefined;
        }
    }

    /** The decision for one reference written as a tag. */
    function decide(copy: SerializedComponent) {
        const ref = refOf(copy);
        if (!ref || ref.nodeIdx < 0) {
            return undefined;
        }
        const isList = copy.doenetAttributes?.forList !== undefined;
        const writtenType = isList
            ? undefined
            : canonicalType(
                  literalText(copy.attributes._createComponentOfType),
              );
        if (!isList) {
            if (
                !writtenType ||
                literalText(copy.attributes._copyInChildren) !== "true" ||
                writtenType === "group" ||
                isComposite(writtenType) ||
                allClasses[writtenType]?.listEntryComponentType !== undefined
            ) {
                return undefined;
            }
        }
        const path = ref.unresolvedPath ?? [];
        const seen = new Set([copy.componentIdx]);
        trail = [];

        const named =
            path.length > 0 && path[0].name !== ""
                ? descendantNamed(ref.nodeIdx, path)
                : undefined;
        if (path.length === 0 || named) {
            const added: (SerializedComponent | string)[][] = [];
            const holder = namedHolder(
                named ? named.componentIdx : ref.nodeIdx,
                seen,
                added,
            );
            if (!holder) {
                return undefined;
            }
            const held = withAdded(holding(holder, seen), added, seen);
            if (held.skip) {
                return undefined;
            }
            if (isList) {
                const list = referents.componentsByIdx.get(
                    copy.doenetAttributes!.forList,
                );
                return (
                    listError(
                        held,
                        list &&
                            allClasses[list.componentType]
                                ?.listEntryComponentType,
                    ) ?? "allowed"
                );
            }
            return (
                scalarError(held, writtenType!, holder.componentType, true) ??
                "allowed"
            );
        }

        // An index into a selector or a repeat, with nothing after it.
        if (isList || path.length !== 1 || path[0].name !== "") {
            return undefined;
        }
        const indices = path[0].index ?? [];
        if (indices.length !== 1) {
            return undefined;
        }
        const indexed =
            referents.componentsByIdx.get(ref.nodeIdx) ??
            referents.copiesByCreatedIdx.get(ref.nodeIdx);
        if (!indexed || indexed.componentType === "_copy") {
            // An index after a reference to a copy selects among what the
            // copy holds (`indexedHolding`).
            return undefined;
        }
        const holder = namedHolder(ref.nodeIdx, seen);
        if (!holder) {
            return undefined;
        }
        const indexText = (indices[0].value ?? []).every(
            (v: unknown) => typeof v === "string",
        )
            ? indices[0].value.join("").trim()
            : undefined;
        if (
            indexText !== undefined &&
            /^\d+$/.test(indexText) &&
            Object.hasOwn(SELECTORS, holder.componentType)
        ) {
            const picked = numPicked(holder);
            if (picked !== undefined && Number(indexText) > picked) {
                return {
                    code: "doenet-w0181",
                    args: {
                        component: holder.componentType,
                        kind: "pick",
                        count: picked,
                    },
                };
            }
        }
        const held = instanceHolding(holder, seen);
        if (!held || held.skip) {
            return undefined;
        }
        return (
            scalarError(held, writtenType!, holder.componentType, false) ??
            "allowed"
        );
    }

    /** Each name written in the document. */
    const allNames = new Set<string>();
    function collectNames(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object") {
                continue;
            }
            for (const attrName of ["name", "_createComponentName"]) {
                const name = literalText(component.attributes?.[attrName]);
                if (name !== undefined) {
                    allNames.add(name);
                }
            }
            for (const attribute of Object.values(component.attributes ?? {})) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    collectNames([attr.component]);
                } else if (Array.isArray(attr.children)) {
                    collectNames(attr.children);
                }
            }
            collectNames(component.children ?? []);
        }
    }

    /**
     * Whether what is left of the reference of `copy` for run time starts
     * with a property (`$g.nothing`) rather than a name: one no component
     * of the document has. A tag made from a composite is an error when
     * none of what it holds has that property (`missingPropertyError` in
     * `Copy.js`), but not when it is a name that the case now active does
     * not hold (`$cc.c`).
     */
    function pathStartsWithProperty(copy: SerializedComponent) {
        const first = refOf(copy)?.unresolvedPath?.[0];
        return (
            typeof first?.name === "string" &&
            first.name !== "" &&
            !allNames.has(first.name)
        );
    }

    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object") {
                continue;
            }
            if (component.componentType === "_copy") {
                const decision = decide(component);
                if (decision !== undefined) {
                    component.doenetAttributes = {
                        ...component.doenetAttributes,
                        typeChangeAtLoad: decision,
                    };
                }
                if (pathStartsWithProperty(component)) {
                    component.doenetAttributes = {
                        ...component.doenetAttributes,
                        pathStartsWithProperty: true,
                    };
                }
            }
            for (const attribute of Object.values(component.attributes ?? {})) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    visit([attr.component]);
                } else if (Array.isArray(attr.children)) {
                    visit(attr.children);
                }
            }
            visit(component.children ?? []);
        }
    }

    collectNames(serializedComponents);
    visit(serializedComponents);
}
