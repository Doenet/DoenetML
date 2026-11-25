/**
 * How many entries a list the author writes (`<mathList>1 2</mathList>`)
 * holds, as far as the DoenetML decides it (DIAG-7, D38, #2463). It decides
 * whether a scalar tag made from the list (`<math extend="$ml"/>`), which
 * needs it to hold one entry, is an error (`doenet-e0064`):
 *
 * - **written**: every entry is a literal, so the count is decided when the
 *   document loads, and a tag made from a list that does not hold one is an
 *   error, marked on the tag (`typeChangeAtLoad`, `typeChangeAtLoad.ts`),
 *   reported then, wherever the tag is, and taken from the mark when the tag
 *   is made;
 * - **by a value**: `maxNumber` is a value (`maxNumber="$n"`), which can
 *   change, on the list or on the list an extend of it extends, so a tag
 *   made from the list is missing, with an info, while the list does not
 *   hold one (DIAG-2), and never an error. The list is marked
 *   (`entryCountByValue`), which `typeChangeStatus` in `Copy.js` reads;
 * - otherwise, **not decided here** (a math entry, which may be a list of
 *   several; a reference; an expression), and left to run time, as before.
 *
 * Only what is exactly a literal is read: text, split by the one rule for
 * lists as the list splits it (`splitTextIntoPieces`, with the splitting
 * sugar recorded, `_listSplitting`), components of the list's entry type
 * that are not maths and hold no error, each one entry, and a reference to
 * another such list whose count is written, as many as it holds
 * (`referencedListCount`); `maxNumber` written as a number.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent, SerializedAttribute } from "./types";
import AuthoredValueList from "../../components/abstract/AuthoredValueList";
import { TAGS_OF_LIST_FORMS } from "../copy";
import { listSplittingFromAttribute } from "../../components/commonsugar/lists";

export type ListEntryCount =
    { kind: "written"; count: number } | { kind: "byValue" } | undefined;

/** Whether a component of type `componentType` is a list the author writes. */
export function isAuthoredListType(
    componentType: string,
    componentInfoObjects: ComponentInfoObjects,
) {
    const componentClass = (
        componentInfoObjects.allComponentClasses as Record<string, any>
    )[componentType];
    return (
        componentClass?.prototype instanceof AuthoredValueList &&
        !componentType.startsWith("_") &&
        !Object.hasOwn(TAGS_OF_LIST_FORMS, componentType)
    );
}

/**
 * An attribute of `component`, matched exactly (NAME-0, D51): one written
 * in another case was given the component's spelling before the document
 * loads (`doenet-w0197`), or is an attribute the component doesn't have.
 */
function attributeOf(component: SerializedComponent, name: string) {
    const attributes = component.attributes ?? {};
    return Object.hasOwn(attributes, name)
        ? (attributes[name] as SerializedAttribute)
        : undefined;
}

/**
 * Whether `component` holds an `_error` among its descendants. A component
 * that cannot show the error of a child is made an error itself when the
 * document runs (`<number><bogus/></number>`), and so is what holds it.
 */
export function holdsError(component: SerializedComponent): boolean {
    for (const child of component.children ?? []) {
        if (
            typeof child === "object" &&
            (child.componentType === "_error" || holdsError(child))
        ) {
            return true;
        }
    }
    for (const attribute of Object.values(component.attributes ?? {})) {
        const attr: any = attribute;
        const inner =
            attr.type === "component"
                ? attr.component?.children
                : attr.children;
        for (const child of Array.isArray(inner) ? inner : []) {
            if (
                typeof child === "object" &&
                (child.componentType === "_error" || holdsError(child))
            ) {
                return true;
            }
        }
    }
    return false;
}

/**
 * The text the attribute is written as, when it is only text, else
 * `undefined` (a reference, a component).
 */
function literalText(attribute: SerializedAttribute) {
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

/**
 * How many entries the reference `copy`, written among the children of a
 * list whose entries are `entryType`, gives, when it is a reference with
 * nothing after the name, and nothing written on it, to a list the author
 * writes of entries of that type whose count is written
 * (`listEntryCountAtLoad`): `<mathList>$ml2</mathList>`, and the reference
 * an extend of a list holds (`<mathList extend="$x"/>`, `extendsList`).
 * `undefined` otherwise, left to run time.
 */
function referencedListCount(
    copy: SerializedComponent,
    entryType: string,
    componentInfoObjects: ComponentInfoObjects,
    componentAt: (idx: number) => SerializedComponent | undefined,
    visiting: Set<SerializedComponent>,
): number | undefined {
    const extending: any = copy.extending;
    const ref: any = extending
        ? (extending.Ref ??
          extending.ExtendAttribute ??
          extending.CopyAttribute ??
          extending.CopyWithStateAttribute)
        : undefined;
    if (
        !ref ||
        typeof ref.nodeIdx !== "number" ||
        ref.nodeIdx < 0 ||
        (ref.unresolvedPath ?? []).length > 0 ||
        Object.keys(copy.attributes ?? {}).some(
            (name) => !name.startsWith("_"),
        ) ||
        (copy.children ?? []).some(
            (child) => typeof child !== "string" || child.trim() !== "",
        )
    ) {
        return undefined;
    }
    const target = componentAt(ref.nodeIdx);
    const targetEntry =
        target &&
        (componentInfoObjects.allComponentClasses as Record<string, any>)[
            target.componentType
        ]?.listEntryComponentType;
    if (
        !target ||
        typeof targetEntry !== "string" ||
        !(
            targetEntry === entryType ||
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: targetEntry,
                baseComponentType: entryType,
            })
        )
    ) {
        return undefined;
    }
    // a copy of what is being counted, so a list referenced twice
    // (`$ml2 $ml2`) is counted twice, and a list reaching itself not at all
    const entries = listEntryCountAtLoad(
        target,
        componentInfoObjects,
        componentAt,
        new Set(visiting),
    );
    return entries?.kind === "written" ? entries.count : undefined;
}

/**
 * How many entries the list the author writes, `list`, holds, as the
 * DoenetML decides it (see above). `list` is serialized after sugar;
 * `componentAt` finds a component of the document by its index.
 */
export function listEntryCountAtLoad(
    list: SerializedComponent,
    componentInfoObjects: ComponentInfoObjects,
    componentAt: (idx: number) => SerializedComponent | undefined,
    visiting = new Set<SerializedComponent>(),
): ListEntryCount {
    if (
        !isAuthoredListType(list.componentType, componentInfoObjects) ||
        visiting.has(list)
    ) {
        return undefined;
    }
    visiting.add(list);
    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;
    const listClass = allClasses[list.componentType];

    let maxNumber = Infinity;
    const maxNumberAttribute = attributeOf(list, "maxNumber");
    if (maxNumberAttribute !== undefined) {
        const text = literalText(maxNumberAttribute);
        if (text === undefined) {
            // A value, which can change (`maxNumber="$n"`).
            return { kind: "byValue" };
        }
        // A number written as digits only: anything else (`1+1`, `-1`) is
        // read as an expression, so it is left to run time.
        if (!/^\d+(\.\d+)?$/.test(text)) {
            return undefined;
        }
        maxNumber = Number(text);
    } else if (list.doenetAttributes?.extendsList !== undefined) {
        // An extend of a list (`<mathList extend="$ml"/>`) takes the
        // attributes of the list it extends, its `maxNumber` among them.
        const extended = componentAt(list.doenetAttributes.extendsList);
        if (
            extended?.componentType === list.componentType &&
            listEntryCountAtLoad(
                extended,
                componentInfoObjects,
                componentAt,
                // a copy, so that the reference to it the extend holds is
                // counted below
                new Set(visiting),
            )?.kind === "byValue"
        ) {
            return { kind: "byValue" };
        }
    }

    // Merging the items of a math whose value is a list into entries is
    // decided by values.
    if (attributeOf(list, "mergeMathLists") !== undefined) {
        return undefined;
    }

    const splittingAttribute: any = list.attributes?._listSplitting;
    const splitting = listSplittingFromAttribute(
        splittingAttribute?.type === "primitive"
            ? splittingAttribute.primitive.value
            : undefined,
    );
    const entryType = listClass.listEntryComponentType;
    const mathClass = allClasses.math;

    let count = 0;
    for (const child of list.children ?? []) {
        if (typeof child === "string") {
            const pieces = listClass.splitTextIntoPieces(child, splitting);
            if (pieces === null) {
                // text that is not a list of entries (`<intervalList>`)
                return undefined;
            }
            count += pieces.length;
            continue;
        }
        if (child.componentType === "_copy") {
            // a reference to a list the author writes, of entries of this
            // list's type, whose count is decided (`$ml2`, or the one an
            // extend of a list holds, `<mathList extend="$x"/>`): its entries
            const referenced = referencedListCount(
                child,
                entryType,
                componentInfoObjects,
                componentAt,
                visiting,
            );
            if (referenced === undefined) {
                return undefined;
            }
            count += referenced;
            continue;
        }
        const childClass = allClasses[child.componentType];
        if (
            child.extending ||
            !childClass ||
            !(
                child.componentType === entryType ||
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: entryType,
                })
            ) ||
            // a math, whose value may be a list of several entries
            childClass === mathClass ||
            childClass.prototype instanceof mathClass ||
            // an entry holding an error (`<number><bogus/></number>`), which
            // makes the list an error when the document runs, with no count
            holdsError(child)
        ) {
            return undefined;
        }
        count++;
    }

    // The list keeps its first `maxNumber` entries (`entryStructure` of
    // `AuthoredValueList`), as `slice` does, so `maxNumber="1.5"` keeps one.
    return {
        kind: "written",
        count: Math.min(count, Math.floor(maxNumber)),
    };
}
