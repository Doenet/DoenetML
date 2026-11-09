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
 * sugar recorded, `_listSplitting`), and components of the list's entry type
 * that are not maths, each one entry; `maxNumber` written as a number.
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

/** An attribute of `component`, matched without regard to case. */
function attributeOf(component: SerializedComponent, name: string) {
    const lower = name.toLowerCase();
    for (const [attrName, attribute] of Object.entries(
        component.attributes ?? {},
    )) {
        if (attrName.toLowerCase() === lower) {
            return attribute as SerializedAttribute;
        }
    }
    return undefined;
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
                visiting,
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
            childClass.prototype instanceof mathClass
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
