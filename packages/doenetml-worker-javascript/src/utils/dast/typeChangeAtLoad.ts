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
 *   written as `1` or left out, and each option one component; a case,
 *   an `<else>` or an option written with `copy` is the one it copies;
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
 * the same rules as a whole composite, as is each a reference names by
 * names left for run time (`$m2.s[1]`, `$s.go`), with one that is not a
 * composite (`<math name="go">`) as itself.
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

/**
 * A reference, not written as a tag, to a name declared in the branches of
 * a `<conditionalContent>` or a one-pick `<select>` that does not satisfy
 * the every-branch, same-type rule (D13, D22, `branchDeclaration`), as is
 * one after an index into the picks of any `<select>` (`$s[2].x`) or into a
 * `<conditionalContent>` (`$cc[1].x`): it names nothing, and `code` with
 * `args` is the warning, which is quoted with the reference as written
 * (`reference` is added by the caller).
 */
export type BranchNameWarning = {
    copy: SerializedComponent;
    code: string;
    args: Record<string, string | number>;
};

/**
 * What the branches of a `<conditionalContent>` (its cases and its
 * `<else>`) or of a `<select>` that picks one (its options; any `<select>`
 * for a name after an index into its picks, `$s[2].x`) declare by one name
 * (`branchDeclaration`):
 *
 * - `none`: no branch declares it;
 * - `ok`: every branch declares it once, with the same tag (`type`,
 *   `undefined` when what one is cannot be known from the DoenetML), and
 *   `canBeAbsent` when no branch may be active (a `<conditionalContent>`
 *   with no `<else>`, here or in a branch); `absent` when, for a name after
 *   it (`$P.x`), what every branch declares by the one before has none of
 *   that name, so that it is a property there (`absent` is the name, with
 *   `remaining` the number of names from it to the end of those checked);
 *   `unknownBelow` when no branch is known to declare the names after the
 *   first, as each that declares the first is a copy (`declarationsBelow`);
 * - `missing`: the branch `branch` (`case`, `else` or `option`), the
 *   `ordinal`-th of its kind, of `container` has no `name`: the name, or,
 *   for a name after it (`$h.x`), that name in what the branch declares by
 *   the one before it;
 * - `types`: branches of `container` declare `name`, the name or the last
 *   after it, as `<firstType>` and `<secondType>`;
 * - `skip`: not decided here (a branch declares it twice, which the
 *   run time reports as ambiguous, or what a branch holds is not read here).
 */
type BranchDeclaration =
    | { status: "none" }
    | {
          status: "ok";
          type?: string;
          canBeAbsent: boolean;
          absent?: string;
          remaining?: number;
          unknownBelow?: boolean;
      }
    | {
          status: "missing";
          container: SerializedComponent;
          branch: "case" | "else" | "option";
          ordinal: number;
          name: string;
      }
    | {
          status: "types";
          container: SerializedComponent;
          branch: "case" | "option";
          firstType: string;
          secondType: string;
          name: string;
          property?: boolean;
      }
    | { status: "skip" };

/**
 * One declaration found in a branch (`visibleDeclarations`): its tag
 * (`undefined` when unknown) and whether it can be absent, with
 * `unknownBelow` when what it declares by the names after the first is not
 * known (a copy), a failure of a nested branch container, or, for a name
 * after the first (`$h.x`), the name a component on the way lacks
 * (`absent`), with the number of names from it to the end (`remaining`), so
 * that branches lacking names at different depths (`$h.x.y`, one branch's
 * `h` lacking `x`, another's `h.x` lacking `y`) are told apart, and whether
 * what lacks it can itself be absent (`canBeAbsent`).
 */
type VisibleDeclaration =
    | { type?: string; canBeAbsent: boolean; unknownBelow?: boolean }
    | { failure: BranchDeclaration }
    | {
          absent: string;
          remaining: number;
          canBeAbsent?: boolean;
          type?: string;
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

/**
 * In the names of a reference held to the every-branch rule (`namesOf`), an
 * index between two names (`$h[1].x`), which no name can be.
 */
const INDEX = "[]";

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
}): { branchNameWarnings: BranchNameWarning[] } {
    const branchNameWarnings: BranchNameWarning[] = [];

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
    /**
     * What one instance of each selector or repeat an index selects holds
     * (`instanceHolding`), kept as `heldByIdx` keeps what all of it holds.
     */
    const instanceByIdx = new Map<
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
     * What `descendantsNamed` found, by the index of the component searched
     * and the name, so that a component is searched once for a name however
     * many references (`$s.x`, `$s.title`) start from it.
     */
    const namedBelowByKey = new Map<string, SerializedComponent[] | null>();

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
        // How many they hold together, `<group/><math/><math/>` two.
        let total = 0;
        let holdsNothing = false;
        for (const holding of holdings) {
            const count = countOf(holding);
            if (count === undefined) {
                // it does not always hold one number of components,
                // whatever the others hold
                return {
                    notOne: holding.notOne,
                    notOneTag: holding.notOneTag,
                    types,
                    unknown,
                };
            }
            total += count;
            holdsNothing ||= count === 0;
        }
        if (total === 1) {
            // One component beside what holds nothing (a `<group/>` beside
            // a `<math>`) is one, but the copy is made from each of them
            // (`replacementSourceIdentities` stops at a group), so it could
            // not be made from that one: not decided, rather than an error
            // that it holds more.
            return holdsNothing ? { types, skip: true } : { types, unknown };
        }
        return {
            notOne: { reason: "count", count: total, part },
            types,
            unknown,
        };
    }

    /**
     * How many components `h` always holds, or `undefined` when that is not
     * one number (a count of a case, a `<repeat>`).
     */
    function countOf(h: Holding) {
        if (h.notOne === undefined) {
            return 1;
        }
        return h.notOne.reason === "count" && h.notOne.part === "other"
            ? h.notOne.count
            : undefined;
    }

    /**
     * What one of `holdings` holds, where which one is not known from the
     * DoenetML (each a component of one name in a different option).
     */
    function eitherOf(holdings: Holding[]): Holding {
        if (holdings.length === 1) {
            return holdings[0];
        }
        const types = new Set<string>();
        let unknown: Holding["unknown"];
        let notOneOf: Holding | undefined;
        for (const holding of holdings) {
            if (holding.skip) {
                return { types, skip: true };
            }
            holding.types.forEach((type) => types.add(type));
            unknown ??= holding.unknown;
            notOneOf ??= holding.notOne ? holding : undefined;
        }
        return {
            ...(notOneOf && {
                notOne: notOneOf.notOne,
                notOneTag: notOneOf.notOneTag,
            }),
            types,
            unknown,
        };
    }

    /**
     * What `node`, a composite or a copy reached by a reference, holds, as
     * `compute` finds it from the components `seen` and `node`, kept in
     * `cache` (see `heldByIdx`). `skip` when `node` is being found already:
     * what it holds holds itself (`doenet-e0005`).
     */
    function cachedHolding(
        cache: Map<number, { held: Holding; touched: Set<number> }>,
        node: SerializedComponent,
        seen: Set<number>,
        compute: (seenBelow: Set<number>) => Holding,
    ): Holding {
        const idx = node.componentIdx;
        trail.push(idx);
        if (seen.has(idx)) {
            seenHits++;
            return { types: new Set(), skip: true };
        }
        const known = cache.get(idx);
        if (known && ![...seen].some((i) => known.touched.has(i))) {
            trail.push(...known.touched);
            return known.held;
        }
        const hitsBefore = seenHits;
        const trailBefore = trail.length;
        const held = compute(new Set(seen).add(idx));
        if (seenHits === hitsBefore && !known) {
            cache.set(idx, {
                held,
                touched: new Set(trail.slice(trailBefore - 1)),
            });
        }
        return held;
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
        const path = ref.unresolvedPath ?? [];
        if (path.length > 0) {
            if (path[0].name === "") {
                return indexedHolding(ref, seen);
            }
            // Names, the last of which may have one index (`$m2.l[1]`).
            const last = path[path.length - 1];
            const lastIndex = last.index ?? [];
            const named =
                lastIndex.length <= 1
                    ? descendantsNamed(ref.nodeIdx, [
                          ...path.slice(0, -1),
                          { ...last, index: [] },
                      ])
                    : [];
            if (named === null) {
                return { types: new Set(), skip: true };
            }
            if (named.length === 0) {
                return { types: new Set(), unknown: "property" };
            }
            return eitherOf(
                named.map((n) =>
                    lastIndex.length === 1
                        ? indexedHolding(
                              {
                                  nodeIdx: n.componentIdx,
                                  unresolvedPath: [
                                      { name: "", index: lastIndex },
                                  ],
                              },
                              seen,
                          )
                        : referenceHolding(
                              {
                                  ...copy,
                                  extending: {
                                      Ref: {
                                          nodeIdx: n.componentIdx,
                                          unresolvedPath: null,
                                          originalPath: [],
                                      },
                                  },
                              } as any,
                              seen,
                          ),
                ),
            );
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
            return cachedHolding(heldByIdx, node, seen, (seenBelow) =>
                node.componentType === "_copy"
                    ? itemHolding(node, seenBelow)
                    : holding(node, seenBelow),
            );
        }
        if (allClasses[referentType]?.listEntryComponentType !== undefined) {
            // a list, not decided here, as a list written there is not
            // (`itemHolding`)
            return { types: new Set(), skip: true };
        }
        return { types: new Set([referentType]) };
    }

    /**
     * The components a reference can name by names left for run time
     * (`$s.go`, of a `<group name="go">` in an option of a `<select>`):
     * each a descendant, written in the DoenetML, of one before it, or of
     * what it copies (`$m2.go` of `<module name="m2" extend="$m"/>`). Each
     * written with the name is one it can name, as one in each option of a
     * `<select>` is. None when a part is not such a name (a property, an
     * index). `null` when what can be so named is not known from the
     * DoenetML (`findNamed`).
     */
    function descendantsNamed(
        nodeIdx: number,
        path: any[],
    ): SerializedComponent[] | null {
        const start =
            referents.componentsByIdx.get(nodeIdx) ??
            referents.copiesByCreatedIdx.get(nodeIdx);
        let nodes: SerializedComponent[] = start ? [start] : [];
        for (const part of path) {
            if (part.name === "" || (part.index ?? []).length > 0) {
                return [];
            }
            const next: SerializedComponent[] = [];
            for (const node of nodes) {
                const key = `${node.componentIdx}:${part.name}`;
                if (!namedBelowByKey.has(key)) {
                    namedBelowByKey.set(key, namedIn(node, part.name));
                }
                const named = namedBelowByKey.get(key)!;
                if (named === null) {
                    return null;
                }
                next.push(...named);
            }
            nodes = next;
        }
        return nodes;
    }

    /**
     * The components named `name` written in `node`, or, when there are
     * none and `node` is a copy, in what it copies.
     */
    function namedIn(node: SerializedComponent, name: string) {
        const visited = new Set<number>();
        let current: SerializedComponent | undefined = node;
        while (current && !visited.has(current.componentIdx)) {
            visited.add(current.componentIdx);
            const search = { visited: new Set<number>(), incomplete: false };
            const found = findNamed(current.children ?? [], name, [], search);
            if (search.incomplete) {
                return null;
            }
            if (found.length > 0 || current.componentType !== "_copy") {
                return found;
            }
            const ref = refOf(current);
            if (
                !ref ||
                ref.nodeIdx < 0 ||
                (ref.unresolvedPath && ref.unresolvedPath.length > 0)
            ) {
                return [];
            }
            current =
                referents.componentsByIdx.get(ref.nodeIdx) ??
                referents.copiesByCreatedIdx.get(ref.nodeIdx);
        }
        return [];
    }

    /**
     * The components named `name` among `components` and theirs, and those
     * of what a copy among them copies (`<option copy="$o"/>`), not looking
     * in one so named. `search.incomplete` when a copy among them copies
     * what is not known from the DoenetML (`$m.g`), which could hold one so
     * named; `search.visited` is each component a copy was followed to.
     */
    function findNamed(
        components: (SerializedComponent | string)[],
        name: string,
        found: SerializedComponent[],
        search: { visited: Set<number>; incomplete: boolean },
    ): SerializedComponent[] {
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
                found.push(component);
                continue;
            }
            findNamed(component.children ?? [], name, found, search);
            if (component.componentType === "_copy") {
                findInCopied(component, name, found, search);
            }
        }
        return found;
    }

    /**
     * The components named `name` in what `copy` copies, through copies of
     * it, added to `found` (see `findNamed`).
     */
    function findInCopied(
        copy: SerializedComponent,
        name: string,
        found: SerializedComponent[],
        search: { visited: Set<number>; incomplete: boolean },
    ) {
        let current = copy;
        while (current.componentType === "_copy") {
            const ref = refOf(current);
            if (!ref || ref.nodeIdx < 0) {
                return;
            }
            const first = ref.unresolvedPath?.[0];
            if (first) {
                // A property (`$P.x`) holds no named component; anything
                // else left for run time could.
                if (
                    typeof first.name !== "string" ||
                    first.name === "" ||
                    allNames.has(first.name)
                ) {
                    search.incomplete = true;
                }
                return;
            }
            const next =
                referents.componentsByIdx.get(ref.nodeIdx) ??
                referents.copiesByCreatedIdx.get(ref.nodeIdx);
            if (!next || search.visited.has(next.componentIdx)) {
                return;
            }
            search.visited.add(next.componentIdx);
            findNamed(next.children ?? [], name, found, search);
            current = next;
        }
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
        const hitsBefore = seenHits;
        const holder =
            node.componentType === "_copy"
                ? undefined
                : namedHolder(ref.nodeIdx, seen);
        if (seenHits !== hitsBefore) {
            // what it holds holds itself (`doenet-e0005`)
            return { types: new Set(), skip: true };
        }
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

    /**
     * The cases of a `<conditionalContent>` (`kind` `case`) or the options
     * of a `<select>` (`option`) `x`, each as the part written (`part`),
     * and, for a case, whether it is an `<else>`. A part written with
     * `copy` (`<else copy="$e"/>`, `<option copy="$o"/>`) is the part it
     * copies. `undefined` when what one is is not read here: one written
     * with `extend`, which is an error (`doenet-e0061`), one with
     * attributes or children of its own, or one copying what is not such a
     * part.
     */
    function partsOf(x: SerializedComponent, kind: "case" | "option") {
        const kinds = kind === "case" ? ["case", "else"] : ["option"];
        const parts: { part: SerializedComponent; isElse: boolean }[] = [];
        for (const child of x.children ?? []) {
            if (typeof child !== "object") {
                continue;
            }
            if (kinds.includes(child.componentType)) {
                parts.push({
                    part: child,
                    isElse:
                        child.componentType === "else" ||
                        attributeOf(child, "condition") === undefined,
                });
                continue;
            }
            if (child.componentType !== "_copy") {
                continue;
            }
            const written = canonicalType(
                literalText(child.attributes._createComponentOfType),
            );
            if (written === undefined || !kinds.includes(written)) {
                continue;
            }
            const source = copiedPart(child, kinds);
            if (!source) {
                return undefined;
            }
            const sourceIsElse =
                source.componentType === "else" ||
                attributeOf(source, "condition") === undefined;
            if (kind === "case" && sourceIsElse !== (written === "else")) {
                // a case copying an else, or an else copying a case
                return undefined;
            }
            parts.push({ part: source, isElse: sourceIsElse });
        }
        return parts;
    }

    /**
     * The part of one of `kinds` the part `copy` written with `copy` is a
     * copy of, through copies of it, or `undefined` when that is not read
     * here (see `partsOf`).
     */
    function copiedPart(copy: SerializedComponent, kinds: string[]) {
        const visited = new Set<number>();
        let current = copy;
        while (current.componentType === "_copy") {
            if (visited.has(current.componentIdx)) {
                return undefined;
            }
            visited.add(current.componentIdx);
            trail.push(current.componentIdx);
            const extending: any = current.extending;
            const ref = extending?.CopyAttribute;
            const ownAttributes = Object.keys(current.attributes ?? {}).filter(
                (name) => !name.startsWith("_"),
            );
            // through the `<group>` sugar wraps a case's children in
            const ownChildren = withoutSugarGroup(
                current.children ?? [],
            ).filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
            if (
                !ref ||
                ref.nodeIdx < 0 ||
                (ref.unresolvedPath && ref.unresolvedPath.length > 0) ||
                ownAttributes.length > 0 ||
                ownChildren.length > 0
            ) {
                return undefined;
            }
            const next =
                referents.componentsByIdx.get(ref.nodeIdx) ??
                referents.copiesByCreatedIdx.get(ref.nodeIdx);
            if (!next) {
                return undefined;
            }
            current = next;
        }
        return kinds.includes(current.componentType) ? current : undefined;
    }

    /**
     * What a `<select>` `x` holds, picking one option, with `notOne` when
     * it picks other than one.
     */
    function selectHolding(
        x: SerializedComponent,
        notOne: NotOne | undefined,
        seen: Set<number>,
    ): Holding {
        const options = partsOf(x, "option");
        if (!options) {
            return { types: new Set(), skip: true };
        }
        return combineParts(
            options.map(({ part }) =>
                childrenHolding(part.children, "option", seen),
            ),
            notOne,
            "select",
            "option",
        );
    }

    /** What the composite, or the list the document makes, `x` holds. */
    function holding(x: SerializedComponent, seen: Set<number>): Holding {
        const componentType = x.componentType;
        const children = x.children ?? [];

        if (componentType === "conditionalContent") {
            const cases = partsOf(x, "case");
            if (!cases) {
                return { types: new Set(), skip: true };
            }
            const hasElse = cases.some(({ isElse }) => isElse);
            return combineParts(
                cases.map(({ part }) =>
                    childrenHolding(
                        withoutSugarGroup(part.children),
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
                return selectHolding(x, notOne, seen);
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
            return cachedHolding(instanceByIdx, x, seen, (seenBelow) =>
                selectHolding(x, undefined, seenBelow),
            );
        }
        if (x.componentType === "collect") {
            // One component collected, of the type written as its
            // `componentType`. A composite or a list collected is not
            // decided here, nor is a collect whose type is not written.
            const collected = canonicalType(
                literalText(attributeOf(x, "componentType")),
            );
            if (collected === undefined) {
                return undefined;
            }
            if (
                collected === "group" ||
                isHolder(collected) ||
                allClasses[collected]?.listEntryComponentType !== undefined
            ) {
                return { types: new Set(), skip: true };
            }
            return { types: new Set([collected]) };
        }
        if (
            x.componentType === "repeat" ||
            x.componentType === "repeatForSequence"
        ) {
            // An instance holding an instance of itself (`$r[1]` in the
            // repeat `r`) is `skip`, as what holds itself is.
            return cachedHolding(instanceByIdx, x, seen, (seenBelow) =>
                asPartOf(
                    childrenHolding(x.children, "other", seenBelow),
                    x.componentType,
                    "iteration",
                ),
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
        // What the types that are known prove is reported, whatever an
        // unknown one would be.
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
        if (held.unknown) {
            return {
                code: "doenet-e0067",
                args: { what: held.unknown },
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
        // Types that are known and differ are an error, whatever an
        // unknown one would be; an unknown one alone is not decided.
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

    /**
     * What an index (`index`, as written) selects of the composite
     * `nodeIdx` names, a selector or a repeat, with nothing after it: an
     * error (`bounds`) when it is a literal past the picks a selector's
     * written `numToSelect` makes, else what one instance holds (`held`) of
     * the composite `tag`. `undefined` when that is not decided here.
     */
    function indexedInstance(
        nodeIdx: number,
        index: any,
        seen: Set<number>,
    ):
        | { bounds: TypeChangeAtLoadError }
        | { held: Holding; tag: string }
        | undefined {
        const indexed =
            referents.componentsByIdx.get(nodeIdx) ??
            referents.copiesByCreatedIdx.get(nodeIdx);
        if (!indexed || indexed.componentType === "_copy") {
            // An index after a reference to a copy selects among what the
            // copy holds (`indexedHolding`).
            return undefined;
        }
        const holder = namedHolder(nodeIdx, seen);
        if (!holder) {
            return undefined;
        }
        const indexText = (index.value ?? []).every(
            (v: unknown) => typeof v === "string",
        )
            ? index.value.join("").trim()
            : undefined;
        if (
            indexText !== undefined &&
            /^\d+$/.test(indexText) &&
            Object.hasOwn(SELECTORS, holder.componentType)
        ) {
            const picked = numPicked(holder);
            if (picked !== undefined && Number(indexText) > picked) {
                return {
                    bounds: {
                        code: "doenet-w0181",
                        args: {
                            component: holder.componentType,
                            kind: "pick",
                            count: picked,
                        },
                    },
                };
            }
        }
        const held = instanceHolding(holder, seen);
        if (!held || held.skip) {
            return undefined;
        }
        return { held, tag: holder.componentType };
    }

    /**
     * The kind of branch `component` holds, if it is a branch container: a
     * `<conditionalContent>` shows one of its cases (`case`), and a
     * `<select>` whose `numToSelect` is written as `1` or left out shows one
     * of its options (`option`), read as the resolver reads it
     * (`branch_container_kind`): the text `1`, not any whole number equal to
     * it (`01`). The names declared in those branches are
     * visible outside it, as a `<group>`'s are (D13, D22; `Ref::Branches` in
     * the resolver). With `indexed`, for a name after an index into a
     * select's picks (`$s[2].x`, D27), a `<select>` of any number of picks
     * shows one of its options there.
     */
    function branchKind(component: SerializedComponent, indexed = false) {
        if (component.componentType === "conditionalContent") {
            return "case" as const;
        }
        const picks = attributeOf(component, "numToSelect");
        if (
            component.componentType === "select" &&
            (indexed ||
                picks === undefined ||
                literalText(picks)?.trim() === "1")
        ) {
            return "option" as const;
        }
        return undefined;
    }

    /**
     * The tag of the component `component` declares by its name, or
     * `undefined` when the DoenetML does not give it: a tag written with
     * `extend` or `copy` is the tag written, and a bare `$y` given a name
     * holds y's tag, as in `typeChangeAtLoad` (#2447).
     */
    function declaredType(component: SerializedComponent) {
        if (component.componentType !== "_copy") {
            return component.componentType;
        }
        const written = canonicalType(
            literalText(component.attributes?._createComponentOfType),
        );
        if (written) {
            return written;
        }
        const ref = refOf(component);
        if (
            !ref ||
            ref.nodeIdx < 0 ||
            (ref.unresolvedPath && ref.unresolvedPath.length > 0)
        ) {
            return undefined;
        }
        const type = referents.referentType(ref.nodeIdx);
        return type === "_error" ? undefined : type;
    }

    /**
     * The declarations of `names[0]` among `components`, where a reference
     * from outside them would see one (`branchDeclaration`): written there,
     * or in a component written there, not in a repeat or the options of a
     * select that picks several (whose names are private), nor in what a copy
     * copies (reached only through the copy's name). A branch container among
     * them declares it if its branches do, as `branchDeclaration` decides. A
     * component with the name hides any of that name in it. With names after
     * it (`$h.x`), what is found is what the one so named declares by them
     * (`declarationsBelow`).
     */
    function visibleDeclarations(
        components: (SerializedComponent | string)[],
        names: string[],
        visited: Set<number>,
        found: VisibleDeclaration[],
    ) {
        const name = names[0];
        for (const component of components) {
            if (typeof component !== "object") {
                continue;
            }
            const attributes = component.attributes ?? {};
            if (
                literalText(attributes.name) === name ||
                literalText(attributes._createComponentName) === name
            ) {
                found.push(
                    names.length === 1
                        ? { type: declaredType(component), canBeAbsent: false }
                        : declarationsBelow(component, names.slice(1), visited),
                );
                continue;
            }
            if (branchKind(component)) {
                const declared = asVisible(
                    branchDeclaration(component, names, visited),
                );
                if (declared) {
                    found.push(declared);
                }
                continue;
            }
            if (
                component.componentType === "repeat" ||
                component.componentType === "repeatForSequence" ||
                component.componentType === "select" ||
                component.componentType === "option"
            ) {
                continue;
            }
            visibleDeclarations(
                component.children ?? [],
                names,
                visited,
                found,
            );
        }
    }

    /**
     * What a branch container among the components of a branch declares
     * (`branchDeclaration`), as one declaration of them, or `undefined` when
     * it declares nothing by the name.
     */
    function asVisible(
        declared: BranchDeclaration,
    ): VisibleDeclaration | undefined {
        if (declared.status === "none") {
            return undefined;
        }
        if (declared.status !== "ok") {
            return { failure: declared };
        }
        if (declared.absent !== undefined) {
            return {
                absent: declared.absent,
                remaining: declared.remaining!,
                canBeAbsent: declared.canBeAbsent,
                type: declared.type,
            };
        }
        return {
            type: declared.type,
            canBeAbsent: declared.canBeAbsent,
            ...(declared.unknownBelow && { unknownBelow: true }),
        };
    }

    /**
     * What `component`, declared by a name in a branch, declares by the
     * names after it (`names`, the `x` of `$h.x`), so that the type of what
     * the whole reference names is held to the every-branch rule too: one
     * declaration, `absent` when it has none, or one of unknown type when
     * that is not known from the DoenetML (a name declared twice in it,
     * which the run time reports as ambiguous, or a copy, whose names are
     * `unknownBelow`: not evidence that the name is declared).
     */
    function declarationsBelow(
        component: SerializedComponent,
        names: string[],
        visited: Set<number>,
    ): VisibleDeclaration {
        // what lacks it, whose type is then compared (`$x.value`)
        const absent = {
            absent: names[0],
            remaining: names.length,
            type: declaredType(component),
        };
        const indexed = names[0] === INDEX;
        const container = branchContainerAt(component.componentIdx, indexed);
        if (indexed) {
            // what an index into another composite names is not known here
            return container
                ? (asVisible(
                      branchDeclaration(
                          container,
                          names.slice(1),
                          visited,
                          true,
                      ),
                  ) ?? absent)
                : { type: undefined, canBeAbsent: false, unknownBelow: true };
        }
        if (container) {
            return (
                asVisible(branchDeclaration(container, names, visited)) ??
                absent
            );
        }
        if (component.componentType === "_copy") {
            return { type: undefined, canBeAbsent: false, unknownBelow: true };
        }
        const below: VisibleDeclaration[] = [];
        visibleDeclarations(component.children ?? [], names, visited, below);
        if (below.length === 0) {
            return absent;
        }
        return below.length === 1
            ? below[0]
            : { type: undefined, canBeAbsent: false };
    }

    /**
     * What the branches of the branch container `container` (`branchKind`)
     * declare by `name` (see `BranchDeclaration`). A name in a branch is
     * found by a reference from outside only if every branch declares it,
     * with the same tag, so that what the reference names, and whether a
     * parent accepts it as a child, never changes with the active branch
     * (D13, D22, COMP-11). With no `<else>`, a name in every case is enough:
     * while no case is active, it names nothing (`canBeAbsent`). With
     * `indexed`, for a name after an index (`$s[2].x`, D27, `branchKind`),
     * `container` may be a `<select>` of any number of picks.
     */
    function branchDeclaration(
        container: SerializedComponent,
        names: string[],
        visited: Set<number>,
        indexed = false,
    ): BranchDeclaration {
        const kind = branchKind(container, indexed);
        if (!kind || visited.has(container.componentIdx)) {
            return { status: "skip" };
        }
        const parts = partsOf(container, kind);
        if (!parts) {
            return { status: "skip" };
        }
        const visitedBelow = new Set(visited).add(container.componentIdx);
        const perPart = parts.map(({ part }) => {
            const found: VisibleDeclaration[] = [];
            visibleDeclarations(
                kind === "case"
                    ? withoutSugarGroup(part.children ?? [])
                    : (part.children ?? []),
                names,
                visitedBelow,
                found,
            );
            return found;
        });
        if (perPart.every((found) => found.length === 0)) {
            return { status: "none" };
        }
        if (perPart.some((found) => found.length > 1)) {
            // Declared twice in one branch: the reference is ambiguous,
            // which the run time reports when that branch is active.
            return { status: "skip" };
        }
        // How many of the names each branch is known to declare, in turn
        // (`$h.x.y`: 1 for an `h` lacking `x`, 2 for an `h.x` lacking `y`,
        // all 3 when it declares them all), or `undefined` when that is not
        // known (a copy). A branch that lacks a name that another branch is
        // known to declare there lacks it; a name after the first that no
        // branch is known to declare (`$h.value`) is not a name there but a
        // property, which is not decided here.
        const reach = perPart.map(([declaration]) =>
            declaration === undefined || "failure" in declaration
                ? undefined
                : "absent" in declaration
                  ? names.length - declaration.remaining
                  : declaration.unknownBelow
                    ? undefined
                    : names.length,
        );
        const known = reach.filter((r): r is number => r !== undefined);
        const maxReach = known.length > 0 ? Math.max(...known) : undefined;
        let caseOrdinal = 0;
        for (const [ind, found] of perPart.entries()) {
            const isElse = kind === "case" && parts[ind].isElse;
            if (!isElse) {
                caseOrdinal++;
            }
            if (found.length === 0) {
                return {
                    status: "missing",
                    container,
                    branch: isElse ? "else" : kind,
                    ordinal: isElse ? 1 : caseOrdinal,
                    name: names[0],
                };
            }
            const [declaration] = found;
            if ("failure" in declaration) {
                return declaration.failure;
            }
            if ("absent" in declaration && reach[ind]! < maxReach!) {
                // The one it declares by the first name has none of a name
                // after it (`$h.x`) that another branch's has
                return {
                    status: "missing",
                    container,
                    branch: isElse ? "else" : kind,
                    ordinal: isElse ? 1 : caseOrdinal,
                    name: declaration.absent,
                };
            }
        }
        const declarations = perPart.map(([declaration]) =>
            "absent" in declaration
                ? {
                      // what lacks the name after it, which is then a
                      // property of it (`$x.value`), so that its type is
                      // what the every-branch rule compares
                      type: declaration.type,
                      canBeAbsent: declaration.canBeAbsent ?? false,
                  }
                : (declaration as { type?: string; canBeAbsent: boolean }),
        );
        const knownTypes = declarations
            .map(({ type }) => type)
            .filter((type): type is string => type !== undefined);
        const differs = knownTypes.find((type) => type !== knownTypes[0]);
        if (differs !== undefined) {
            // the last name the branches declare, before a property
            const property = maxReach !== undefined && maxReach < names.length;
            const named = names
                .slice(0, property ? maxReach : names.length)
                .filter((name) => name !== INDEX);
            return {
                status: "types",
                container,
                branch: kind,
                firstType: knownTypes[0],
                secondType: differs,
                name: named[named.length - 1],
                ...(property && { property: true }),
            };
        }
        // Every branch known to declare names lacks the same one, the
        // others being copies
        const absentIn = perPart.find(
            ([declaration]) => "absent" in declaration,
        );
        const absent = absentIn?.[0] as
            { absent: string; remaining: number } | undefined;
        return {
            status: "ok",
            absent: absent?.absent,
            remaining: absent?.remaining,
            unknownBelow: maxReach === undefined,
            type:
                knownTypes.length === declarations.length
                    ? knownTypes[0]
                    : undefined,
            canBeAbsent:
                (kind === "case" && !parts.some(({ isElse }) => isElse)) ||
                parts.length === 0 ||
                declarations.some(({ canBeAbsent }) => canBeAbsent),
        };
    }

    /**
     * The branch container (`branchKind`) at `idx`, through a copy of one
     * (`<conditionalContent name="cc2" extend="$cc"/>`), or other composite
     * (`<group extend="$cc"/>`), which has the branches of the one it
     * copies, or `undefined` if there is none, as for a copy made as a tag
     * that is not a composite (`<math extend="$s"/>`). With
     * `indexed`, a `<select>` of any number of picks (`branchKind`). A copy
     * written with branches of its own (`<select copy="$s"><option>...`)
     * has them after those it copies, and one writing `numToSelect` picks
     * that many, so the container returned then is the one copied with
     * those branches and that `numToSelect`.
     */
    function branchContainerAt(idx: number, indexed = false) {
        const visited = new Set<number>();
        let node =
            referents.componentsByIdx.get(idx) ??
            referents.copiesByCreatedIdx.get(idx);
        const copyName = node?.attributes?._createComponentName;
        // the children of each copy on the way, the nearest first
        const added: (SerializedComponent | string)[][] = [];
        let picks: [string, SerializedAttribute] | undefined;
        while (node && node.componentType === "_copy") {
            if (visited.has(node.componentIdx)) {
                return undefined;
            }
            visited.add(node.componentIdx);
            const ref = refOf(node);
            const created = canonicalType(
                literalText(node.attributes?._createComponentOfType),
            );
            if (
                // a tag that is not a composite (`<math extend="$s"/>`)
                // is itself, not what it copies, so names after it are
                // its properties
                (created !== undefined && !isComposite(created)) ||
                !ref ||
                ref.nodeIdx < 0 ||
                (ref.unresolvedPath && ref.unresolvedPath.length > 0)
            ) {
                return undefined;
            }
            added.push(node.children ?? []);
            picks ??= Object.entries(node.attributes ?? {}).find(
                ([name]) => name.toLowerCase() === "numtoselect",
            );
            node =
                referents.componentsByIdx.get(ref.nodeIdx) ??
                referents.copiesByCreatedIdx.get(ref.nodeIdx);
        }
        if (!node) {
            return undefined;
        }
        const ownChildren = added
            .reverse()
            .flat()
            .filter(
                (child) => typeof child !== "string" || child.trim() !== "",
            );
        if (ownChildren.length > 0 || picks) {
            const attributes = Object.fromEntries(
                Object.entries(node.attributes ?? {}).filter(
                    ([name]) => !picks || name.toLowerCase() !== "numtoselect",
                ),
            );
            if (picks) {
                attributes[picks[0]] = picks[1];
            }
            // named as the copy, whose branches these are
            if (copyName) {
                attributes.name = copyName;
            } else {
                delete attributes.name;
            }
            node = {
                ...node,
                attributes,
                children: [...(node.children ?? []), ...ownChildren],
            };
        }
        return branchKind(node, indexed) ? node : undefined;
    }

    /**
     * The components the names `names` (`x`, or `h` and `x` of `$h.x`) name
     * in the branches of the branch container `container`, found where a
     * reference from outside them sees them, as `visibleDeclarations` finds
     * their declarations: not in a repeat or the options of a select that
     * picks several, whose names are private. `null` when that is not known
     * from the DoenetML (a name after one that is a copy, or branches not
     * read here, `partsOf`).
     */
    function visibleNamed(
        container: SerializedComponent,
        names: string[],
    ): SerializedComponent[] | null {
        const found: SerializedComponent[] = [];
        // the containers on the way, so that one reached again inside
        // itself is a cycle, while one copied in two branches is not
        const onPath = new Set<number>();
        function inBranches(
            branchContainer: SerializedComponent,
            names: string[],
        ) {
            const kind = branchKind(branchContainer, true)!;
            if (onPath.has(branchContainer.componentIdx)) {
                return false;
            }
            const parts = partsOf(branchContainer, kind);
            if (!parts) {
                return false;
            }
            onPath.add(branchContainer.componentIdx);
            const all = parts.every(({ part }) =>
                among(
                    kind === "case"
                        ? withoutSugarGroup(part.children ?? [])
                        : (part.children ?? []),
                    names,
                ),
            );
            onPath.delete(branchContainer.componentIdx);
            return all;
        }
        function among(
            components: (SerializedComponent | string)[],
            names: string[],
        ): boolean {
            for (const component of components) {
                if (typeof component !== "object") {
                    continue;
                }
                const attributes = component.attributes ?? {};
                if (
                    literalText(attributes.name) === names[0] ||
                    literalText(attributes._createComponentName) === names[0]
                ) {
                    if (names.length === 1) {
                        found.push(component);
                        continue;
                    }
                    const indexed = names[1] === INDEX;
                    const below = branchContainerAt(
                        component.componentIdx,
                        indexed,
                    );
                    if (below) {
                        if (!inBranches(below, names.slice(indexed ? 2 : 1))) {
                            return false;
                        }
                    } else if (indexed || component.componentType === "_copy") {
                        return false;
                    } else if (
                        !among(component.children ?? [], names.slice(1))
                    ) {
                        return false;
                    }
                    continue;
                }
                if (branchKind(component)) {
                    if (!inBranches(component, names)) {
                        return false;
                    }
                    continue;
                }
                if (
                    component.componentType === "repeat" ||
                    component.componentType === "repeatForSequence" ||
                    component.componentType === "select" ||
                    component.componentType === "option"
                ) {
                    continue;
                }
                if (!among(component.children ?? [], names)) {
                    return false;
                }
            }
            return true;
        }
        return inBranches(container, names) ? found : null;
    }

    /**
     * What the branches of the container a reference names its first name in
     * (`$x` and `$cc.x`, which the resolver leaves for the container to
     * resolve, as `node_idx` `cc` with `x` unresolved) declare by that name,
     * or `undefined` when the reference is not to such a container. A name
     * after an index into the picks of a `<select>` (`$s[2].x`, as `node_idx`
     * `s` with `[2]` and `x` unresolved) is held to the same rule, for a
     * select of any number of picks (D27), as is one after an index into a
     * `<conditionalContent>` (`$cc[1].x`). The names of the document after
     * the first (`$h.x`, of a `<group name="h">` in every case) are held to
     * the rule too (`namesOf`), as what they name is decided by the active
     * branch.
     */
    function branchNameOf(copy: SerializedComponent) {
        const ref = refOf(copy);
        if (!ref || ref.nodeIdx < 0) {
            return undefined;
        }
        const path = ref.unresolvedPath ?? [];
        const indexed = isIndexIntoPicks(path);
        const first = indexed ? path[1] : path[0];
        if (typeof first?.name !== "string" || first.name === "") {
            return undefined;
        }
        const container = branchContainerAt(ref.nodeIdx, indexed);
        if (!container) {
            return undefined;
        }
        const namePath = path.slice(indexed ? 1 : 0);
        const names = namesOf(namePath);
        const declared = branchDeclaration(
            container,
            names,
            new Set(),
            indexed,
        );
        const followed = names.filter((name) => name !== INDEX).length;
        if (declared.status === "types" && namePath[followed]?.name) {
            // A property after the names (`$x.value`, `value` not a name of
            // the document) is of components of different types
            return { ...declared, property: true };
        }
        if (declared.status === "none" && !allNames.has(first.name)) {
            // A property of the container (`$cc.value`), not a name
            return undefined;
        }
        if (declared.status === "none") {
            // A name the document has, in no branch: the first lacks it.
            const kind = branchKind(container, indexed)!;
            const parts = partsOf(container, kind);
            const firstPart = parts?.[0];
            if (!firstPart) {
                return undefined;
            }
            const isElse = kind === "case" && firstPart.isElse;
            return {
                status: "missing",
                container,
                branch: isElse ? "else" : kind,
                ordinal: 1,
                name: first.name,
            } as BranchDeclaration;
        }
        return declared;
    }

    /**
     * The names at the start of `path` (`h` and `x` of `$h.x`) whose
     * declarations in the branches are held to the every-branch rule: the
     * first, and each after it that is a name of the document, up to one
     * that is a property (`$h.x.value`) or an index with nothing named
     * after it (`$h.x[1]`). One index followed by a name (`$h[1].x`) is
     * `INDEX` between them: the name is in the branches of what is indexed,
     * as for `$s[1].x`.
     */
    function namesOf(path: any[]) {
        const names: string[] = [path[0].name];
        for (const [ind, part] of path.entries()) {
            const index = part.index ?? [];
            const next = path[ind + 1];
            if (
                index.length > 1 ||
                typeof next?.name !== "string" ||
                next.name === "" ||
                !allNames.has(next.name)
            ) {
                break;
            }
            if (index.length === 1) {
                names.push(INDEX);
            }
            names.push(next.name);
        }
        return names;
    }

    /**
     * Whether `path`, what a reference leaves unresolved, is one index into
     * the picks of what it names followed by a name (`$s[2].x`).
     */
    function isIndexIntoPicks(path: any[]) {
        return (
            path.length > 1 &&
            path[0].name === "" &&
            (path[0].index ?? []).length === 1
        );
    }

    /**
     * The diagnostic for a reference whose name the branches of a container
     * do not all declare with one tag, or `undefined` if they do.
     */
    function branchNameIssue(
        declared: BranchDeclaration,
    ): TypeChangeAtLoadError | undefined {
        if (declared.status !== "missing" && declared.status !== "types") {
            return undefined;
        }
        const name = declared.name;
        const containerName = literalText(declared.container.attributes?.name);
        const hasName =
            containerName !== undefined &&
            containerName !== "" &&
            !containerName.startsWith("_");
        const container = hasName
            ? containerName
            : declared.container.componentType;
        if (declared.status === "missing") {
            return {
                code: "doenet-w0183",
                args: {
                    name,
                    branch: declared.branch,
                    ordinal: declared.ordinal,
                    container,
                    hasName: hasName ? "true" : "false",
                },
            };
        }
        return {
            code: "doenet-w0184",
            args: {
                name,
                branch: declared.branch,
                firstType: declared.firstType,
                secondType: declared.secondType,
                container,
                hasName: hasName ? "true" : "false",
            },
        };
    }

    /**
     * The error (`doenet-w0181`) for an index past the picks of each
     * selector it may index (`indexedInstance`), whatever their counts: the
     * one of the most picks, or `undefined` unless the index is past each.
     */
    function pastEach(
        instances: ReturnType<typeof indexedInstance>[],
    ): TypeChangeAtLoadError | undefined {
        let most: TypeChangeAtLoadError | undefined;
        for (const instance of instances) {
            if (!instance || !("bounds" in instance)) {
                return undefined;
            }
            if (
                !most ||
                Number(instance.bounds.args.count) > Number(most.args.count)
            ) {
                most = instance.bounds;
            }
        }
        return most;
    }

    /**
     * The error (`doenet-w0181`) for a reference into the branches of a
     * container (`$s[2].x`, `$h[2].x` of a `<select name="h">` in each
     * case) with a literal index past what the selector it indexes picks,
     * as its `numToSelect` is written: it names nothing whatever the
     * branches declare. The index into each component a name before it
     * names is checked, as for `$h[2]` (`decide`), and is past the picks
     * only when it is for each (`pastEach`), though their counts differ.
     * `undefined` when no index is known to be.
     */
    function literalBounds(copy: SerializedComponent) {
        const ref = refOf(copy);
        if (!ref || ref.nodeIdx < 0) {
            return undefined;
        }
        const path = ref.unresolvedPath ?? [];
        const indexed = isIndexIntoPicks(path);
        const seen = new Set([copy.componentIdx]);
        if (indexed) {
            const instance = indexedInstance(
                ref.nodeIdx,
                path[0].index[0],
                seen,
            );
            if (instance && "bounds" in instance) {
                return instance.bounds;
            }
        }
        const container = branchContainerAt(ref.nodeIdx, indexed);
        if (!container) {
            return undefined;
        }
        const namePath = path.slice(indexed ? 1 : 0);
        const names: string[] = [];
        for (const [ind, part] of namePath.entries()) {
            const index = part.index ?? [];
            if (
                typeof part.name !== "string" ||
                part.name === "" ||
                ind === namePath.length - 1 ||
                index.length > 1
            ) {
                return undefined;
            }
            names.push(part.name);
            if (index.length === 0) {
                continue;
            }
            const named = visibleNamed(container, names);
            if (!named || named.length === 0) {
                return undefined;
            }
            const bounds = pastEach(
                named.map((n) =>
                    indexedInstance(n.componentIdx, index[0], seen),
                ),
            );
            if (bounds) {
                return bounds;
            }
            names.push(INDEX);
        }
        return undefined;
    }

    /**
     * Whether `copy` is a reference written as a tag (`<math extend="$x"/>`,
     * or one filling a list tag), which always makes a component of its tag
     * (REF-0, D36), so that a name it cannot find is an error.
     */
    function isTag(copy: SerializedComponent) {
        return (
            copy.doenetAttributes?.forList !== undefined ||
            canonicalType(
                literalText(copy.attributes?._createComponentOfType),
            ) !== undefined
        );
    }

    /**
     * Whether `copy` is a reference written as a tag that makes one
     * component, rather than a list or a `<group>` (see `decide`).
     */
    function isScalarTag(copy: SerializedComponent) {
        if (copy.doenetAttributes?.forList !== undefined) {
            return false;
        }
        const writtenType = canonicalType(
            literalText(copy.attributes?._createComponentOfType),
        );
        return (
            writtenType !== undefined &&
            literalText(copy.attributes._copyInChildren) === "true" &&
            writtenType !== "group" &&
            !isComposite(writtenType) &&
            allClasses[writtenType]?.listEntryComponentType === undefined
        );
    }

    /**
     * Decide the every-branch, same-type rule for the reference `copy`
     * (`branchDeclaration`). A reference written as a tag gets an error in
     * place of the copy (`typeChangeAtLoad`), as does a scalar tag made from
     * a name no case may hold (no `<else>`, D36). Any other reference names
     * nothing, with a warning (`branchNameWarnings`). Returns whether it was
     * decided here.
     */
    function checkBranchName(copy: SerializedComponent) {
        const declared = branchNameOf(copy);
        if (!declared) {
            return false;
        }
        if (isTag(copy)) {
            // A literal index past what a selector picks (`$s[2].x` of a
            // one-pick select) names nothing whatever the branches declare
            // (`doenet-w0181`, as `decide` finds it for `$s[2]`).
            const bounds = isScalarTag(copy) && literalBounds(copy);
            if (bounds) {
                copy.doenetAttributes = {
                    ...copy.doenetAttributes,
                    typeChangeAtLoad: bounds,
                };
                return true;
            }
            if (declared.status === "types" && !declared.property) {
                // Decided as for any composite holding types that differ
                // (`doenet-e0066`, `decide`)
                return false;
            }
            if (
                declared.status === "ok" &&
                declared.canBeAbsent &&
                isScalarTag(copy)
            ) {
                copy.doenetAttributes = {
                    ...copy.doenetAttributes,
                    typeChangeAtLoad: {
                        code: "doenet-e0064",
                        args: {
                            reason: "noElse",
                            sourceType: "conditionalContent",
                            indexSelectsOne: "false",
                        },
                    },
                };
                return true;
            }
        }
        const issue = branchNameIssue(declared);
        if (issue) {
            if (isTag(copy)) {
                copy.doenetAttributes = {
                    ...copy.doenetAttributes,
                    typeChangeAtLoad: issue,
                };
            } else {
                branchNameWarnings.push({ copy, ...issue });
            }
            return true;
        }
        return false;
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
        // The type of each entry of a list tag.
        const entryOfList = isList
            ? (() => {
                  const list = referents.componentsByIdx.get(
                      copy.doenetAttributes!.forList,
                  );
                  return (
                      list &&
                      allClasses[list.componentType]?.listEntryComponentType
                  );
              })()
            : undefined;
        /** The decision for a tag made from `held`, of the composite `tag`. */
        function verdict(held: Holding, tag: string, direct: boolean) {
            if (held.skip) {
                return undefined;
            }
            return (
                (isList
                    ? listError(held, entryOfList)
                    : scalarError(held, writtenType!, tag, direct)) ?? "allowed"
            );
        }

        /**
         * The indices of the components the names of `namePath` (the last
         * of which may have an index) name in the branches of `container`
         * (`visibleNamed`), or `undefined` when not known or none.
         */
        function namedInBranches(
            container: SerializedComponent,
            namePath: any[],
        ) {
            const names: string[] = [];
            for (const [ind, part] of namePath.entries()) {
                const index = part.index ?? [];
                if (
                    typeof part.name !== "string" ||
                    part.name === "" ||
                    (ind < namePath.length - 1 && index.length > 1)
                ) {
                    return undefined;
                }
                names.push(part.name);
                if (ind < namePath.length - 1 && index.length === 1) {
                    names.push(INDEX);
                }
            }
            const named = visibleNamed(container, names);
            if (!named || named.length === 0) {
                return undefined;
            }
            return named.map((n) => n.componentIdx);
        }

        const path = ref.unresolvedPath ?? [];
        const seen = new Set([copy.componentIdx]);
        trail = [];

        if (path.length === 0) {
            const added: (SerializedComponent | string)[][] = [];
            const holder = namedHolder(ref.nodeIdx, seen, added);
            if (!holder) {
                return undefined;
            }
            return verdict(
                withAdded(holding(holder, seen), added, seen),
                holder.componentType,
                true,
            );
        }

        // Names, the last of which may have one index (`$m2.s[1]`), or one
        // index alone (`$s[1]`), or one index into the picks of a select
        // or into a conditionalContent, and names (`$s[1].x`).
        const last = path[path.length - 1];
        const lastIndex = last.index ?? [];
        if (lastIndex.length > 1) {
            return undefined;
        }
        let nodeIdxs: number[];
        if (isIndexIntoPicks(path)) {
            // A name after an index into the picks of a `<select>`
            // (`$s[2].x`), or into a `<conditionalContent>` (`$cc[1].x`):
            // the components so named in each branch, which
            // `checkBranchName` has found every branch declares.
            const container = branchContainerAt(ref.nodeIdx, true);
            if (!container) {
                return undefined;
            }
            // An index past the picks names nothing, whatever follows it
            // (a list tag made from it is empty, as below).
            const bounds = literalBounds(copy);
            if (bounds) {
                return isList ? undefined : bounds;
            }
            const named = namedInBranches(container, path.slice(1));
            if (!named) {
                return undefined;
            }
            nodeIdxs = named;
        } else if (path[0].name === "") {
            if (path.length !== 1) {
                return undefined;
            }
            nodeIdxs = [ref.nodeIdx];
        } else if (branchContainerAt(ref.nodeIdx)) {
            // A name in the branches of a container (`$x`, `$cc.x`): those
            // a reference from outside them sees, unless an index between
            // the names (`$h[2].x`) is past what each it indexes picks
            const bounds = literalBounds(copy);
            if (bounds) {
                return isList ? undefined : bounds;
            }
            const named = namedInBranches(
                branchContainerAt(ref.nodeIdx)!,
                path,
            );
            if (!named) {
                return undefined;
            }
            nodeIdxs = named;
        } else {
            const named = descendantsNamed(ref.nodeIdx, [
                ...path.slice(0, -1),
                { ...last, index: [] },
            ]);
            if (!named || named.length === 0) {
                return undefined;
            }
            nodeIdxs = named.map((n) => n.componentIdx);
        }

        if (lastIndex.length === 1) {
            // An index into a selector or a repeat each name names, which
            // is decided when it is for each.
            const instances = nodeIdxs.map((idx) =>
                indexedInstance(idx, lastIndex[0], seen),
            );
            if (instances[0] && "bounds" in instances[0]) {
                // Past the picks of each names nothing whatever happens at
                // run time. A list tag made from it is empty, which the run
                // time reports as it does an index past the entries of a
                // list.
                return isList ? undefined : pastEach(instances);
            }
            const helds: Holding[] = [];
            for (const instance of instances) {
                if (!instance || !("held" in instance)) {
                    return undefined;
                }
                helds.push(instance.held);
            }
            return verdict(
                eitherOf(helds),
                (instances[0] as { tag: string }).tag,
                false,
            );
        }

        // Each component the names can name (`$s.go` of a `<group
        // name="go">` in each option): a composite, as what it holds, or
        // another component, as itself.
        const helds: Holding[] = [];
        let tag: string | undefined;
        for (const idx of nodeIdxs) {
            const hitsBefore = seenHits;
            const added: (SerializedComponent | string)[][] = [];
            const holder = namedHolder(idx, seen, added);
            if (seenHits !== hitsBefore) {
                // what it holds holds itself (`doenet-e0005`)
                return undefined;
            }
            if (holder) {
                tag ??= holder.componentType;
                helds.push(withAdded(holding(holder, seen), added, seen));
                continue;
            }
            const node =
                referents.componentsByIdx.get(idx) ??
                referents.copiesByCreatedIdx.get(idx);
            if (!node || node.componentType === "setup") {
                return undefined;
            }
            helds.push(itemHolding(node, seen));
        }
        const held = eitherOf(helds);
        if (
            tag === undefined &&
            !held.skip &&
            typesAs(held.types, isList ? entryOfList : writtenType).length <= 1
        ) {
            // Components that are not composites, of one type: the one
            // named is checked when the document runs, as a component
            // named by a reference is.
            return undefined;
        }
        return verdict(held, tag ?? held.notOneTag ?? "", true);
    }

    /**
     * What is written between the brackets of each index of the reference
     * of `component` (`$l[<integer extend="$cc"/>]`), in the path as
     * written, as `applySugar` and `documentReferents` read it.
     */
    function indexContents(component: SerializedComponent) {
        return (refOf(component)?.originalPath ?? []).flatMap((part: any) =>
            (part.index ?? []).map(
                (piece: any) =>
                    (piece.value ?? []) as (SerializedComponent | string)[],
            ),
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
            for (const value of indexContents(component)) {
                collectNames(value);
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
     * not hold (`$cc.c`). An index before it (`$s[1].nothing`) is resolved
     * at run time, leaving the property first.
     */
    function pathStartsWithProperty(copy: SerializedComponent) {
        const ref = refOf(copy);
        let path: any[] = ref?.unresolvedPath ?? [];
        if (ref && ref.nodeIdx >= 0 && path.length > 0) {
            // The names of the document after a branch container
            // (`$x.nothing`, `$cc.h.x.nothing`; not `$cc.nothing`, a
            // property of the container), which the every-branch rule
            // has found every branch declares, are resolved at run time,
            // leaving what follows them first.
            const indexed = isIndexIntoPicks(path);
            const start = indexed ? 1 : 0;
            const first = path[start];
            if (
                typeof first?.name === "string" &&
                allNames.has(first.name) &&
                branchContainerAt(ref.nodeIdx, indexed)
            ) {
                const names = namesOf(path.slice(start));
                path = path.slice(
                    start + names.filter((name) => name !== INDEX).length,
                );
            }
        }
        const first = path.find((part) => part.name !== "");
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
            if (
                component.componentType === "_copy" &&
                checkBranchName(component)
            ) {
                // decided by the every-branch rule
            } else if (component.componentType === "_copy") {
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
            for (const value of indexContents(component)) {
                visit(value);
            }
            visit(component.children ?? []);
        }
    }

    collectNames(serializedComponents);
    visit(serializedComponents);

    return { branchNameWarnings };
}
