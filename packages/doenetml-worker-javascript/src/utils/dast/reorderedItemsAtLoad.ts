/**
 * The errors of a `<sort>` or `<shuffle>` whose items are not of one type,
 * decided when the document loads (COLL-4, D41 decision 4, DIAG-7):
 *
 * - `doenet-e0076`: items of more than one type, as a `<number>` and a
 *   `<text>`, or a `<math>` and a `<group>` of several components;
 * - `doenet-e0077`: a `<sort>` of an item holding several components (a
 *   `<group>` of several, or the items of a `<repeat>`, `<select>` or
 *   `<conditionalContent>` that each hold several), which has nothing to be
 *   compared by.
 *
 * What an item is follows COLL-4: a child that is a list or a collection is
 * flattened into its items; a wrapper (a `<group>`, an iteration, a pick, a
 * case) is not, and with one component it stands for that component.
 *
 * The type compared is the one the sort compares by (`extractComparableValue`
 * in `utils/listValues.js`): a `<number>` and a `<math>` (and the tags built
 * on them, as `<integer>`) are one type, as they are compared alike, by
 * value, and a `<text>`, a `<boolean>`, a `<point>` and a `<vector>` are each
 * a type of their own. Any other component has no value to be compared by
 * (a `<p>`, a `<feedback>`, a `<row>`), and these are one type together, so
 * that a `<shuffle>` of paragraphs and feedback is not an error. A `<shuffle>`
 * compares nothing, but takes one type all the same, so that the two agree
 * (COLL-4); for it, the items holding several components are one type
 * together.
 *
 * Only what the DoenetML says is read (DIAG-7). An item whose type it does
 * not say (a reference to a property of a composite, a `valueName` of a
 * `<repeat>`) is left out of the decision, so the error is reported only for
 * the types that are known; and a reference that names nothing is a blank,
 * of no type. A `<sort>` or `<shuffle>` that is an error is marked
 * (`doenetAttributes.reorderErrorAtLoad`), is not made a list
 * (`listForms.ts`), and shows the same error in place of its items, kept
 * once.
 */
import type { SerializedComponent } from "./types";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import { codedDiagnostic } from "../diagnostics";
import {
    type ReorderErrorAtLoad,
    reorderErrorDiagnostic,
} from "../reorderErrors";
import { documentReferents } from "./valueReferences";
import { staticValueReferenceTarget } from "../valueReference";
import { unwrapSource } from "./convertNormalizedDast";
import { attributeOf, literalText } from "./choiceErrorsAtLoad";
import { sequenceEntryComponentType } from "../sequence";

/**
 * An item of a `<sort>` or `<shuffle>`: one component, of the tag `tag`, or
 * an item holding `count` components, which is a `<group>` (`how` is
 * `"group"`) or an item of the collection `tag` (`"item"`).
 */
type Item =
    | { kind: "one"; tag: string; piece?: string }
    | { kind: "several"; tag: string; count: number; how: "group" | "item" };

/** The items found, and whether there may be others not known. */
type Items = { items: Item[]; unknown: boolean };

const NONE: Items = { items: [], unknown: false };
const UNKNOWN: Items = { items: [], unknown: true };

const REORDERED = new Set(["sort", "shuffle"]);

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
    const { componentsByIdx, copiesByCreatedIdx, referentType, referentClass } =
        documentReferents({ serializedComponents, componentInfoObjects });
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

    /** The type a component of `tag` is compared as (see above). */
    function typeClass(tag: string) {
        for (const base of ["point", "vector", "boolean", "text"]) {
            if (inherits(tag, base)) {
                return base;
            }
        }
        if (inherits(tag, "number") || inherits(tag, "math")) {
            return "math";
        }
        // A component with no value to be compared by (a `<p>`, a
        // `<feedback>`, an `<li>`), which only a `<shuffle>`, or a `<sort>`
        // by a property, reorders.
        return "content";
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
            return {
                items: [{ kind: "several", tag, count: held.length, how }],
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

    /** The error of the `<sort>` or `<shuffle>` `component`, if any. */
    function reorderError(
        component: SerializedComponent,
    ): ReorderErrorAtLoad | undefined {
        const { items } = itemsOfChildren(component.children ?? [], new Set());
        const isSort = component.componentType === "sort";
        if (isSort) {
            const several = items.find((item) => item.kind === "several");
            if (several) {
                return {
                    code: "doenet-e0077",
                    args: describe(several, "item"),
                };
            }
        }
        const firstOfType = new Map<string, Item>();
        for (const item of items) {
            const key =
                item.kind === "several" ? "several" : typeClass(item.tag);
            if (!firstOfType.has(key)) {
                firstOfType.set(key, item);
            }
        }
        if (firstOfType.size < 2) {
            return undefined;
        }
        const [first, second] = [...firstOfType.values()];
        // `type` says how to read text the author wrote, as a number, math,
        // text or boolean. It helps only when the text is beside an item
        // of one of those: not one with no value to compare (`<p>`), a
        // point or vector, or a group of several.
        const isPiece = (item: Item) =>
            item.kind === "one" && item.piece !== undefined;
        const typeCanRead = (item: Item) =>
            item.kind === "one" &&
            ["math", "text", "boolean"].includes(typeClass(item.tag));
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
                REORDERED.has(component.componentType) &&
                component.extending === undefined
            ) {
                const mark = reorderError(component);
                if (mark) {
                    component.doenetAttributes = {
                        ...component.doenetAttributes,
                        reorderErrorAtLoad: mark,
                    };
                    diagnostics.push({
                        ...reorderErrorDiagnostic(mark),
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                }
            }
        }
    }
    visit(serializedComponents);
    return diagnostics;
}
