/**
 * The errors of a `<sort>`, `<sortIndices>` or `<shuffle>` whose items are
 * not of one type, decided when the document loads (COLL-4, D41 decision 4,
 * DIAG-7):
 *
 * - `doenet-e0076`: items of more than one type, as a `<number>` and a
 *   `<text>`, or a `<math>` and a `<group>` of several components;
 * - `doenet-e0077`: a `<sort>` or `<sortIndices>` of an item holding
 *   several components (a
 *   `<group>` of several, or the items of a `<repeat>`, `<select>` or
 *   `<conditionalContent>` that each hold several), which has nothing to be
 *   compared by.
 *
 * What an item is follows COLL-4: a child that is a list or a collection is
 * flattened into its items; a wrapper (a `<group>`, an iteration, a pick, a
 * case) is not, and with one component it stands for that component.
 *
 * What a type is follows D46 (`utils/componentKinds.ts`): a value (a
 * `<math>`, a `<text>`, an input) is of its value's type, with integer,
 * number and math one type; an object (a `<point>`, a `<line>`, an `<atom>`)
 * is of its tag, with the tags built on it; and all content (a `<p>`, a
 * `<feedback>`, an `<m>`, a `<label>`) is one type, with an item holding
 * several components. A `<shuffle>` compares nothing, but takes one type all
 * the same, so that the two agree (COLL-4).
 *
 * A `<sort>` or `<sortIndices>` compares values by value, and points and
 * vectors by a coordinate. Other objects, and content, have no value to be
 * compared by, so a sort of them needs `sortByProp`, and without it is
 * `doenet-e0080`.
 *
 * Only what the DoenetML says is read (DIAG-7). An item whose type it does
 * not say (a reference to a property of a composite, the `valueName` of a
 * `<repeat>` whose `for` does not decide it) is left out of the decision, so the error is reported only for
 * the types that are known; and a reference that names nothing is a blank,
 * of no type; so is an item whose type is decided only as the document
 * runs (a `<slider>` or `<choiceInput>`, until #2568). A `<sort>` or
 * `<shuffle>` that is an error is marked
 * (`doenetAttributes.reorderErrorAtLoad`), is not made a list
 * (`listForms.ts`), and shows the same error in place of its items, kept
 * once. A `<sortIndices>`, which sorts as a `<sort>` does but is not a
 * composite, becomes that error itself.
 *
 * A `<repeat>`'s `for` holds one type too (COLL-5, D44), read as a
 * `<shuffle>`'s children are: `doenet-e0081`, reported at the `for`, for
 * items of more than one type, or, with `type` written, an item of another
 * type than it says. The repeat is marked as a `<sort>` is, and shows the
 * error in place of its iterations. The same reading gives the type of the
 * repeat's `valueName` (`repeatValueType`, read by `documentReferents`).
 */
import type { SerializedComponent } from "./types";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import { codedDiagnostic } from "../diagnostics";
import { errorComponentState } from "./errors";
import {
    type ReorderErrorAtLoad,
    reorderErrorDiagnostic,
} from "../reorderErrors";
import { documentReferents } from "./valueReferences";
import { staticValueReferenceTarget } from "../valueReference";
import { unwrapSource } from "./convertNormalizedDast";
import { attributeOf, literalText } from "./choiceErrorsAtLoad";
import { sequenceEntryComponentType } from "../sequence";
import { kindOfComponentType } from "../componentKinds";

/**
 * An item of a `<sort>` or `<shuffle>`: one component, of the tag `tag`, or
 * an item holding `count` components, which is a `<group>` (`how` is
 * `"group"`) or an item of the collection `tag` (`"item"`), whose
 * components a `<collect>` of `first` collects, if known.
 */
type Item =
    | { kind: "one"; tag: string; piece?: string }
    | {
          kind: "several";
          tag: string;
          count: number;
          how: "group" | "item";
          first?: string;
          /** what it holds, as written */
          children: (SerializedComponent | string)[];
      };

/** The items found, and whether there may be others not known. */
type Items = { items: Item[]; unknown: boolean };

const NONE: Items = { items: [], unknown: false };
const UNKNOWN: Items = { items: [], unknown: true };

/** The composites that reorder their items, which are flattened. */
const REORDERED = new Set(["sort", "shuffle"]);

/** The components that take items of one type. */
const CHECKED = new Set(["sort", "sortIndices", "shuffle"]);

/** The types a `<repeat>`'s `type` gives the text in its `for` (the sugar's). */
const REPEAT_TYPES = ["math", "text", "number", "boolean"];

/** The components that compare their items, and so take no item of several. */
const SORTS = new Set(["sort", "sortIndices"]);

/**
 * What the items of a collection are, read from the DoenetML (COLL-4,
 * COLL-5), with `referents` the document's (`documentReferents`): the
 * reading a `<sort>`, `<shuffle>` and a repeat's `for` share.
 */
export function itemReader({
    componentInfoObjects,
    referents,
}: {
    componentInfoObjects: ComponentInfoObjects;
    referents: ReturnType<typeof documentReferents>;
}) {
    const { componentsByIdx, copiesByCreatedIdx, referentType, referentClass } =
        referents;
    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;

    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }

    function inherits(componentType: string, base: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: base,
        });
    }

    /**
     * The one type an item is of (D46): a value's type (`math`, `text`,
     * `boolean`), an object's tag, or `content`, which an item holding
     * several components is too. `undefined` when the DoenetML doesn't say.
     */
    function typeOf(item: Item) {
        return item.kind === "several"
            ? "content"
            : kindOfComponentType(item.tag, componentInfoObjects)?.type;
    }

    /** Whether `item` is one component of a tag built on `base`. */
    function isOf(item: Item, base: string) {
        return item.kind === "one" && inherits(item.tag, base);
    }

    function canonical(type: string | undefined) {
        return type === undefined
            ? undefined
            : componentInfoObjects.componentTypeLowerCaseMapping[
                  type.toLowerCase()
              ];
    }

    /** The tag of the entries of the list `component`, if known. */
    function entryTag(component: SerializedComponent): string | undefined {
        const componentClass = allClasses[component.componentType];
        if (componentClass?.listEntryTypeAttribute !== undefined) {
            return sequenceEntryComponentType(
                attributeOf(component, componentClass.listEntryTypeAttribute),
            );
        }
        return componentClass?.listEntryComponentType;
    }

    function merge(into: Items, more: Items) {
        into.items.push(...more.items);
        into.unknown ||= more.unknown;
    }

    /** The items `children`, written in a collection, are together. */
    function itemsOfChildren(
        children: (SerializedComponent | string)[],
        seen: Set<number>,
    ): Items {
        const result: Items = { items: [], unknown: false };
        for (const child of children) {
            // Text is either split into components by the sugar, or blank,
            // or left out, with `doenet-w0015`.
            if (typeof child === "object") {
                merge(result, itemsOf(child, seen));
            }
        }
        return result;
    }

    /**
     * The children of a case or an option, through the `<group>` with no
     * attributes that its sugar wraps them in.
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

    /**
     * The items a wrapper holding `children` is: none, what its one
     * component is (it stands for it), or one item holding several.
     */
    function wrapperItems(
        children: (SerializedComponent | string)[],
        how: "group" | "item",
        tag: string,
        seen: Set<number>,
    ): Items {
        const held = children.filter((child) =>
            typeof child === "string"
                ? child.trim() !== ""
                : child.componentType !== "setup" &&
                  child.componentType !== "_repeatSetup",
        );
        if (
            held.some(
                (child) =>
                    typeof child === "object" &&
                    child.componentType === "_error",
            )
        ) {
            return UNKNOWN;
        }
        if (held.length === 0) {
            return NONE;
        }
        if (held.length > 1) {
            // The tag a `<collect>` of the components the message suggests
            // collects: one every component is of, where there is one (a
            // `<number>` beside an `<integer>`, which a `<collect>` of
            // integers would leave out), else the first component's (no
            // `<collect>` collects a piece of text). A `<collect>` collects
            // the components of a `<group>` inside too.
            const tags = held.flatMap((child) => {
                if (typeof child !== "object") {
                    return [];
                }
                const item = itemsOf(child as SerializedComponent, seen)
                    .items[0];
                return item?.kind === "one"
                    ? [item.tag]
                    : item?.first !== undefined
                      ? [item.first]
                      : [];
            });
            const collected =
                tags.find((base) => tags.every((t) => inherits(t, base))) ??
                tags[0];
            return {
                items: [
                    {
                        kind: "several",
                        tag,
                        count: held.length,
                        how,
                        ...(collected !== undefined
                            ? { first: collected }
                            : {}),
                        children: held,
                    },
                ],
                unknown: false,
            };
        }
        const [only] = held;
        return typeof only === "string"
            ? { items: [{ kind: "one", tag: "text" }], unknown: false }
            : itemsOf(only, seen);
    }

    /** The items `component`, written in a collection, is. */
    function itemsOf(component: SerializedComponent, seen: Set<number>): Items {
        const idx = component.componentIdx;
        if (seen.has(idx)) {
            return UNKNOWN;
        }
        seen = new Set(seen).add(idx);
        const type = component.componentType;
        if (type === "_error") {
            return UNKNOWN;
        }
        if (type === "_copy") {
            return itemsOfCopy(component, seen);
        }
        if (type === "_placeholder") {
            // the value of a repeat, of the type its `type` gives
            const valueType = referentType(idx);
            return valueType === undefined
                ? UNKNOWN
                : { items: [{ kind: "one", tag: valueType }], unknown: false };
        }
        if (component.extending !== undefined) {
            return UNKNOWN;
        }
        if (REORDERED.has(type)) {
            // flattened into its items, unless it is an error itself
            return component.doenetAttributes?.reorderErrorAtLoad
                ? UNKNOWN
                : itemsOfChildren(component.children ?? [], seen);
        }
        if (type === "group") {
            return wrapperItems(
                component.children ?? [],
                "group",
                "group",
                seen,
            );
        }
        if (
            type === "repeat" &&
            component.doenetAttributes?.reorderErrorAtLoad
        ) {
            // its `for` in error: it shows the error
            return UNKNOWN;
        }
        if (type === "repeat" || type === "repeatForSequence") {
            // each iteration is a wrapper of the template
            return wrapperItems(component.children ?? [], "item", type, seen);
        }
        if (type === "select" || type === "conditionalContent") {
            // each pick or case shown is a wrapper of what it holds
            const result: Items = { items: [], unknown: false };
            for (const part of component.children ?? []) {
                if (typeof part !== "object") {
                    continue;
                }
                if (
                    part.componentType !== "option" &&
                    part.componentType !== "case"
                ) {
                    return UNKNOWN;
                }
                merge(
                    result,
                    wrapperItems(
                        withoutSugarGroup(part.children ?? []),
                        "item",
                        type,
                        seen,
                    ),
                );
            }
            return result;
        }
        if (type === "collect") {
            const attribute = attributeOf(component, "componentType");
            const written = canonical(
                attribute === undefined ? undefined : literalText(attribute),
            );
            if (
                written === undefined ||
                isComposite(written) ||
                allClasses[written]?.listEntryComponentType !== undefined
            ) {
                return UNKNOWN;
            }
            return { items: [{ kind: "one", tag: written }], unknown: false };
        }
        if (allClasses[type]?.listEntryComponentType !== undefined) {
            // a list, flattened into its entries
            const tag = entryTag(component);
            return tag === undefined
                ? UNKNOWN
                : { items: [{ kind: "one", tag }], unknown: false };
        }
        if (isComposite(type)) {
            return UNKNOWN;
        }
        // A component made from a piece of text the author wrote (`z` of
        // `<sort>$m z</sort>`) is named by that text.
        const piece = component.doenetAttributes?.textPiece;
        return {
            items: [
                {
                    kind: "one",
                    tag: type,
                    ...(typeof piece === "string" && piece !== ""
                        ? { piece }
                        : {}),
                },
            ],
            unknown: false,
        };
    }

    /** The items a reference, or an `extend` or `copy` written as a tag, is. */
    function itemsOfCopy(copy: SerializedComponent, seen: Set<number>): Items {
        if (!copy.extending) {
            return UNKNOWN;
        }
        const createdType = copy.attributes?._createComponentOfType;
        const written = canonical(
            createdType === undefined ? undefined : literalText(createdType),
        );
        if (written !== undefined && !isComposite(written)) {
            const entry = allClasses[written]?.listEntryComponentType;
            return {
                items: [{ kind: "one", tag: entry ?? written }],
                unknown: false,
            };
        }
        const ref: any = unwrapSource(copy.extending as any);
        if (!ref) {
            return UNKNOWN;
        }
        if (ref.nodeIdx < 0) {
            // names nothing: a blank, of no type
            return NONE;
        }
        const path = ref.unresolvedPath ?? [];
        if (path.length > 0) {
            const targetType = referentType(ref.nodeIdx);
            if (targetType === undefined) {
                return UNKNOWN;
            }
            const targetClass = referentClass(ref.nodeIdx, targetType);
            if (targetClass === undefined) {
                return UNKNOWN;
            }
            const target = staticValueReferenceTarget({
                targetComponentType: targetType,
                targetClass,
                unresolvedPath: path,
                componentInfoObjects,
            });
            return target
                ? {
                      items: [{ kind: "one", tag: target.valueComponentType }],
                      unknown: false,
                  }
                : UNKNOWN;
        }
        const node =
            componentsByIdx.get(ref.nodeIdx) ??
            copiesByCreatedIdx.get(ref.nodeIdx);
        if (node === undefined) {
            return UNKNOWN;
        }
        // A reference to a tag that gives a value of its own, as an input
        // does (`$m` of a `<mathInput>` is its math), is that value.
        const targetType = referentType(ref.nodeIdx);
        if (
            targetType !== undefined &&
            node.componentType !== "_copy" &&
            !isComposite(targetType) &&
            allClasses[targetType]?.listEntryComponentType === undefined
        ) {
            const target = staticValueReferenceTarget({
                targetComponentType: targetType,
                unresolvedPath: null,
                componentInfoObjects,
            });
            if (target?.fromImplicitProp) {
                return {
                    items: [{ kind: "one", tag: target.valueComponentType }],
                    unknown: false,
                };
            }
        }
        return itemsOf(node, seen);
    }

    /** How an item is named in a message, as fluent arguments. */
    function describe(item: Item, prefix: string) {
        return item.kind === "one"
            ? {
                  [`${prefix}Kind`]: item.piece === undefined ? "one" : "piece",
                  [prefix]: item.tag,
                  [`${prefix}Count`]: 1,
                  [`${prefix}Piece`]: item.piece ?? "",
              }
            : {
                  [`${prefix}Kind`]: item.how,
                  [prefix]: item.tag,
                  [`${prefix}Count`]: item.count,
                  [`${prefix}Piece`]: "",
              };
    }

    /**
     * The `type` written on the `<repeat>` `repeat`, which types the text
     * written in its `for` (`math`, `number`, `text` or `boolean`, as the
     * sugar reads it), `undefined` if not written, or `null` if written as
     * other than one of those, which the sugar reads as `math`.
     */
    function typeWrittenOn(repeat: SerializedComponent) {
        const attribute = attributeOf(repeat, "type");
        if (attribute === undefined) {
            return undefined;
        }
        // as the sugar reads it (`repeatSugar` in the parser)
        const type = literalText(attribute);
        return type !== undefined && REPEAT_TYPES.includes(type) ? type : null;
    }

    /**
     * The items of the `for` of the `<repeat>` `repeat` (COLL-5), as for a
     * `<shuffle>`: a list or collection flattened, a wrapper of one
     * standing for it, a wrapper of several one item. A component the sugar
     * made from text written in `for` is named by that text. `undefined` if
     * it has no `for` written as a component.
     */
    function forItemsOf(repeat: SerializedComponent): Items | undefined {
        const forAttribute: any = attributeOf(repeat, "for");
        const children: (SerializedComponent | string)[] | undefined =
            forAttribute?.type === "component"
                ? forAttribute.component?.children
                : forAttribute?.type === "unresolved"
                  ? forAttribute.children
                  : undefined;
        if (!Array.isArray(children)) {
            return undefined;
        }
        const result: Items = { items: [], unknown: false };
        for (const child of children) {
            if (typeof child !== "object") {
                continue;
            }
            const more = itemsOf(child, new Set());
            if (
                child.componentType !== "_copy" &&
                more.items.length === 1 &&
                more.items[0].kind === "one" &&
                (child.children ?? []).every(
                    (piece) => typeof piece === "string",
                )
            ) {
                // text written in `for`, which the sugar made a component
                // of the repeat's `type`
                more.items[0] = {
                    ...more.items[0],
                    piece: (child.children as string[]).join("").trim(),
                };
            }
            merge(result, more);
        }
        return result;
    }

    /**
     * The error of the `<repeat>` `repeat` whose `for` does not hold items
     * of one type (COLL-5, D44): `doenet-e0081`, for items of more than
     * one type, or, with `type` written, an item of another type. Text
     * written in `for` is of the repeat's `type` (`math` if not written).
     * Only the types the DoenetML gives are compared (DIAG-7).
     */
    function repeatForError(
        repeat: SerializedComponent,
    ): ReorderErrorAtLoad | undefined {
        const found = forItemsOf(repeat);
        if (!found) {
            return undefined;
        }
        const written = typeWrittenOn(repeat);
        const writtenKey =
            typeof written === "string"
                ? kindOfComponentType(written, componentInfoObjects)?.type
                : undefined;
        if (writtenKey !== undefined) {
            const other = found.items.find((item) => {
                const key = typeOf(item);
                return key !== undefined && key !== writtenKey;
            });
            if (other) {
                return {
                    code: "doenet-e0081",
                    args: {
                        reason: "type",
                        type: written as string,
                        ...describe(other, "first"),
                        ...describe(other, "second"),
                        suggestText: "no",
                    },
                };
            }
            return undefined;
        }
        const firstOfType = new Map<string, Item>();
        for (const item of found.items) {
            const key = typeOf(item);
            if (key !== undefined && !firstOfType.has(key)) {
                firstOfType.set(key, item);
            }
        }
        if (firstOfType.size < 2) {
            return undefined;
        }
        const [[, first], [, second]] = [...firstOfType.entries()];
        // Text beside a text is read as a math unless `type="text"` says
        // otherwise (D44 decision 4).
        const isPiece = (item: Item) =>
            item.kind === "one" && item.piece !== undefined;
        const suggestText =
            (isPiece(first) && typeOf(second) === "text") ||
            (isPiece(second) && typeOf(first) === "text");
        return {
            code: "doenet-e0081",
            args: {
                reason: "mix",
                type: "",
                ...describe(first, "first"),
                ...describe(second, "second"),
                suggestText: suggestText ? "yes" : "no",
            },
        };
    }

    /**
     * The tag `$v` is, for `v` the `valueName` of the `<repeat>` `repeat`,
     * decided from its `for` (COLL-5, D44 decisions 2 and 3): the tag its
     * items share, or, for values of one type, the widest (integer, then
     * number, then math), and for objects of tags built on one, that one.
     * `undefined` when the DoenetML doesn't decide it: an item whose type
     * it doesn't give, a `for` in error, items of several components or
     * content of several tags.
     */
    function repeatValueType(repeat: SerializedComponent): string | undefined {
        const found = forItemsOf(repeat);
        if (
            !found ||
            found.unknown ||
            found.items.length === 0 ||
            repeatForError(repeat) !== undefined
        ) {
            return undefined;
        }
        const tags = new Set<string>();
        for (const item of found.items) {
            if (item.kind !== "one" || typeOf(item) === undefined) {
                return undefined;
            }
            tags.add(item.tag);
        }
        if (tags.size === 1) {
            return [...tags][0];
        }
        const key = typeOf(found.items[0])!;
        if (key === "math") {
            for (const widest of ["integer", "number"]) {
                if ([...tags].every((tag) => inherits(tag, widest))) {
                    return widest;
                }
            }
            return "math";
        }
        return key === "content" ? undefined : key;
    }

    return {
        itemsOf,
        itemsOfChildren,
        typeOf,
        isOf,
        inherits,
        canonical,
        describe,
        forItemsOf,
        repeatForError,
        repeatValueType,
    };
}

/**
 * Mark each `<sort>` and `<shuffle>` among `serializedComponents` whose
 * items are not of one type, and return its error, to report now.
 */
export function checkReorderedItemsAtLoad({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const referents = documentReferents({
        serializedComponents,
        componentInfoObjects,
        typeRepeatValues: true,
    });
    const { itemsOfChildren, typeOf, isOf, describe, repeatForError } =
        itemReader({
            componentInfoObjects,
            referents,
        });

    /**
     * The error of the `<sort>`, `<sortIndices>` or `<shuffle>` `component`,
     * if any.
     */
    function reorderError(
        component: SerializedComponent,
    ): ReorderErrorAtLoad | undefined {
        const { items } = itemsOfChildren(component.children ?? [], new Set());
        if (SORTS.has(component.componentType)) {
            const several = items.find((item) => item.kind === "several");
            if (several?.kind === "several") {
                return {
                    code: "doenet-e0077",
                    args: {
                        component: component.componentType,
                        ...describe(several, "item"),
                        // what the `<collect>` suggested collects
                        firstType: several.first ?? "number",
                    },
                };
            }
        }
        const firstOfType = new Map<string, Item>();
        for (const item of items) {
            const key = typeOf(item);
            if (key !== undefined && !firstOfType.has(key)) {
                firstOfType.set(key, item);
            }
        }
        if (firstOfType.size < 2) {
            return firstOfType.size === 1 && SORTS.has(component.componentType)
                ? sortByPropError(component, [...firstOfType.entries()][0])
                : undefined;
        }
        let [[firstKey, first], [secondKey, second]] = [
            ...firstOfType.entries(),
        ];
        // Content an author may take for a value (D46): an `<m>` beside a
        // math, or a `<label>` beside a text, which a `<math>` or `<text>`
        // around it makes one type. Name that one, and say so.
        let wrap: "m" | "label" | "no" = "no";
        const pair = new Set([firstKey, secondKey]);
        for (const [tag, valueType] of [
            ["m", "math"],
            ["label", "text"],
        ] as const) {
            if (pair.has("content") && pair.has(valueType)) {
                const wrapped = items.find((item) => isOf(item, tag));
                if (wrapped) {
                    wrap = tag;
                    if (firstKey === "content") {
                        first = wrapped;
                    } else {
                        second = wrapped;
                    }
                }
            }
        }
        // `type` says how to read text the author wrote, as a number, math,
        // text or boolean. It helps only when the text is beside an item
        // of a number, math or text, which any text reads as: not one with
        // no value to compare (`<p>`), a point or vector, a boolean, which
        // reads only `true` or `false` (`3` beside it is a number, and
        // `type="boolean"` would read it as one), or a group of several.
        const isPiece = (item: Item) =>
            item.kind === "one" && item.piece !== undefined;
        const typeCanRead = (item: Item) =>
            item.kind === "one" && ["math", "text"].includes(typeOf(item)!);
        const suggestType =
            (isPiece(first) && typeCanRead(second)) ||
            (isPiece(second) && typeCanRead(first));
        return {
            code: "doenet-e0076",
            args: {
                component: component.componentType,
                ...describe(first, "first"),
                ...describe(second, "second"),
                suggestType: suggestType ? "yes" : "no",
                wrap,
                mTag:
                    wrap === "m"
                        ? [first, second].find((item) => isOf(item, "m"))!.tag
                        : "m",
            },
        };
    }

    /**
     * The error of a `<sort>` or `<sortIndices>` `component` of items of the
     * one type `type`, first `item`, if it has nothing to compare them by:
     * content, or objects other than points and vectors, with no
     * `sortByProp`, or one written blank (D46).
     */
    function sortByPropError(
        component: SerializedComponent,
        [type, item]: [string, Item],
    ): ReorderErrorAtLoad | undefined {
        // A `sortByProp` written blank (`sortByProp=""`) names no property,
        // and the sort compares nothing by it, so it is as if not written.
        const sortByProp = attributeOf(component, "sortByProp");
        if (
            item.kind !== "one" ||
            (sortByProp !== undefined && literalText(sortByProp)?.trim() !== "")
        ) {
            return undefined;
        }
        const kind = kindOfComponentType(item.tag, componentInfoObjects)?.kind;
        if (
            kind === "value" ||
            kind === undefined ||
            type === "point" ||
            type === "vector"
        ) {
            return undefined;
        }
        const info: any =
            componentInfoObjects.publicStateVariableInfo[item.tag];
        return {
            code: "doenet-e0080",
            args: {
                component: component.componentType,
                item: item.tag,
                kind,
                suggestText:
                    kind === "content" &&
                    info?.stateVariableDescriptions?.text !== undefined
                        ? "yes"
                        : "no",
            },
        };
    }

    const seen = new Set<SerializedComponent>();
    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            // Inner ones first, so that one in error is not read again as
            // the items of the one holding it.
            for (const attribute of Object.values(component.attributes ?? {})) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    visit([attr.component]);
                } else if (Array.isArray(attr.children)) {
                    visit(attr.children);
                }
            }
            visit(component.children ?? []);
            if (
                component.componentType === "repeat" &&
                component.extending === undefined
            ) {
                // A repeat's `for` holds one type (COLL-5): one that does
                // not is an error at the `for`, shown in place of the
                // iterations.
                const mark = repeatForError(component);
                if (mark) {
                    const forAttribute: any = attributeOf(component, "for");
                    mark.position =
                        forAttribute?.position ??
                        forAttribute?.component?.position ??
                        component.position;
                    diagnostics.push({
                        ...reorderErrorDiagnostic(mark),
                        position: mark.position,
                        sourceDoc: component.sourceDoc,
                    });
                    component.doenetAttributes = {
                        ...component.doenetAttributes,
                        reorderErrorAtLoad: mark,
                    };
                }
            }
            if (
                CHECKED.has(component.componentType) &&
                component.extending === undefined
            ) {
                const mark = reorderError(component);
                if (mark) {
                    const diagnostic = {
                        ...reorderErrorDiagnostic(mark),
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    };
                    diagnostics.push(diagnostic);
                    if (REORDERED.has(component.componentType)) {
                        component.doenetAttributes = {
                            ...component.doenetAttributes,
                            reorderErrorAtLoad: mark,
                        };
                    } else {
                        // A `<sortIndices>` is not a composite, to show the
                        // error in place of its items: it becomes the
                        // error, kept once when the `_error` is made.
                        component.componentType = "_error";
                        component.state = errorComponentState(
                            diagnostic.message,
                            diagnostic,
                        );
                        component.attributes = {};
                        component.children = [];
                        // its `numItems` is a blank, with nothing more
                        // reported (`replacementFromProp`)
                        component.doenetAttributes = {
                            reorderErrorAtLoad: mark,
                        };
                        delete (component as any).variants;
                    }
                }
            }
        }
    }
    visit(serializedComponents);
    return diagnostics;
}
