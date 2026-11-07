/**
 * Whether how many entries a list the author writes holds (`<mathList>1
 * 2</mathList>`) is fixed by the DoenetML, recorded on the list as
 * `doenetAttributes.entryCountFixed`.
 *
 * A scalar tag made from such a list (`<math extend="$ml"/>`) needs it to
 * hold one entry (`doenet-e0064`). When the count is written, that is
 * decided by the DoenetML, and is an error (DIAG-1). When a value can change
 * it, as `maxNumber="$n"` or an entry that is a reference to a composite,
 * it is decided by the value, so the tag is missing while the list does not
 * hold one, with an info (DIAG-2, DIAG-7, D37), and no error appears when a
 * reader changes the value (`typeChangeStatus` in `Copy.js`).
 *
 * A scalar tag of a list whose count is fixed, and not one, is that error,
 * reported here, wherever the tag is (returned).
 *
 * The count is fixed when `maxNumber` is left out or written as a number
 * (or, on an extend of a list, taken from the list extended), and each entry
 * is fixed (`entriesOf`): text with no comma, a tag that is one component,
 * not a math, whose value may be a list, or a bare reference to a list of
 * the same type whose count is fixed (`<mathList extend="$ml"/>`).
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import AuthoredValueList from "../../components/abstract/AuthoredValueList";
import { TAGS_OF_LIST_FORMS } from "../copy";
import { documentReferents } from "./valueReferences";
import { unwrapSource } from "./convertNormalizedDast";
import { codedDiagnostic } from "../diagnostics";
import { doenetMLReferenceAsWritten } from "../sourceLocation";

export function markListsWithFixedEntryCount({
    serializedComponents,
    componentInfoObjects,
    sources,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
}) {
    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;
    const referents = documentReferents({
        serializedComponents,
        componentInfoObjects,
    });

    function isAuthoredList(componentType: string) {
        return (
            allClasses[componentType]?.prototype instanceof AuthoredValueList &&
            !Object.hasOwn(TAGS_OF_LIST_FORMS, componentType)
        );
    }

    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }

    /** Whether a component of type `componentType` has a math value. */
    function isMathValued(componentType: string) {
        const mathClass = allClasses.math;
        const componentClass = allClasses[componentType];
        return (
            componentClass === mathClass ||
            componentClass?.prototype instanceof mathClass
        );
    }

    /**
     * How many entries `child`, written in the list `list`, always gives, or
     * `undefined` when a value can change it. Text gives its pieces
     * (`splitTextIntoPieces`), unless a piece has a comma, which a math
     * may read as several entries (`1,2`). A tag gives one, unless it is a
     * composite, a reference other than a bare one to a tag that is not a
     * composite or a list, or a math, whose value may be a list.
     */
    function entriesOf(
        list: SerializedComponent,
        child: SerializedComponent | string,
    ): number | undefined {
        if (typeof child !== "object") {
            const pieces =
                allClasses[list.componentType].splitTextIntoPieces(child);
            if (
                pieces === null ||
                pieces.some((p: string) => p.includes(","))
            ) {
                return undefined;
            }
            return pieces.length;
        }
        let componentType: string | undefined = child.componentType;
        if (componentType === "_error") {
            // what is written there is in error, as a reference in a cycle
            // (`breakReferenceCycles`), and gives no entry to count
            return undefined;
        }
        if (componentType === "_copy") {
            const written: any = child.attributes?._createComponentOfType;
            const extending: any = child.extending;
            const ref: any = extending ? unwrapSource(extending) : undefined;
            if (
                written ||
                !ref ||
                ref.nodeIdx < 0 ||
                (ref.unresolvedPath?.length ?? 0) > 0
            ) {
                return undefined;
            }
            // A bare reference to a list of the same type, as the `_copy`
            // that `<mathList extend="$ml"/>` holds, gives that list's
            // entries, so as many as it holds when that is fixed.
            const node = referents.componentsByIdx.get(ref.nodeIdx);
            if (
                node?.componentType === list.componentType &&
                isAuthoredList(node.componentType)
            ) {
                return entryCount(node);
            }
            componentType = referents.referentType(ref.nodeIdx);
            if (
                componentType === undefined ||
                allClasses[componentType]?.listEntryComponentType !== undefined
            ) {
                return undefined;
            }
        }
        if (isComposite(componentType) || isMathValued(componentType)) {
            return undefined;
        }
        return 1;
    }

    /**
     * How many entries the list `list` always holds, or `undefined` when a
     * value can change it.
     */
    const countByList = new Map<SerializedComponent, number | undefined>();
    const counting = new Set<SerializedComponent>();
    function entryCount(list: SerializedComponent): number | undefined {
        if (countByList.has(list)) {
            return countByList.get(list);
        }
        if (counting.has(list)) {
            return undefined;
        }
        counting.add(list);
        const count = uncachedEntryCount(list);
        counting.delete(list);
        countByList.set(list, count);
        return count;
    }

    function uncachedEntryCount(list: SerializedComponent): number | undefined {
        const maxNumber = effectiveMaxNumber(list, new Set());
        if (maxNumber === null) {
            return undefined;
        }
        let count = 0;
        for (const child of list.children ?? []) {
            const n = entriesOf(list, child);
            if (n === undefined) {
                return undefined;
            }
            count += n;
        }
        // The list keeps its first `maxNumber` entries, as `slice` does, so
        // `maxNumber="1.5"` keeps one (`AuthoredValueList`).
        return maxNumber === undefined
            ? count
            : Math.min(count, Math.floor(Math.max(0, maxNumber)));
    }

    /**
     * The `maxNumber` that applies to `list`: the one written on it
     * (`literalMaxNumber`), or, when it is left out on an extend of a list
     * (`<mathList extend="$ml">3</mathList>`), the one that applies to the
     * list extended, whose attributes an extend takes (`extendsList`).
     */
    function effectiveMaxNumber(
        list: SerializedComponent,
        visiting: Set<SerializedComponent>,
    ): number | undefined | null {
        const written = literalMaxNumber(list);
        const extendsList = list.doenetAttributes?.extendsList;
        if (written !== undefined || extendsList === undefined) {
            return written;
        }
        const source = referents.componentsByIdx.get(extendsList);
        if (
            !source ||
            visiting.has(source) ||
            source.componentType !== list.componentType
        ) {
            return null;
        }
        visiting.add(source);
        return effectiveMaxNumber(source, visiting);
    }

    /**
     * The `maxNumber` of `list`: `undefined` when it is left out, the number
     * when it is written as one, and `null` otherwise, when a value decides
     * it.
     */
    function literalMaxNumber(
        list: SerializedComponent,
    ): number | undefined | null {
        for (const [name, attribute] of Object.entries(list.attributes ?? {})) {
            if (name.toLowerCase() !== "maxnumber") {
                continue;
            }
            const attr: any = attribute;
            let text: string | undefined;
            if (attr.type === "primitive") {
                text = String(attr.primitive.value);
            } else {
                const component =
                    attr.type === "component" ? attr.component : undefined;
                const children = component ? component.children : attr.children;
                if (
                    component?.state &&
                    "value" in component.state &&
                    (children ?? []).length === 0
                ) {
                    text = String(component.state.value);
                } else if (
                    Array.isArray(children) &&
                    children.every(
                        (child: unknown) => typeof child === "string",
                    )
                ) {
                    text = children.join("").trim();
                }
            }
            const value =
                text === undefined || text === "" ? NaN : Number(text);
            return Number.isFinite(value) ? value : null;
        }
        return undefined;
    }

    const seen = new Set<SerializedComponent>();
    const copies: SerializedComponent[] = [];
    const lists: SerializedComponent[] = [];
    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            if (component.componentType === "_copy") {
                copies.push(component);
            }
            if (isAuthoredList(component.componentType)) {
                lists.push(component);
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
    visit(serializedComponents);
    // After the visit, so that a list made from another list (`$ml`) finds
    // it wherever it is.
    for (const list of lists) {
        if (entryCount(list) !== undefined) {
            list.doenetAttributes = {
                ...list.doenetAttributes,
                entryCountFixed: true,
            };
        }
    }

    // A scalar tag of such a list whose count is not one is an error
    // (`doenet-e0064`), reported now, wherever the tag is, as in a case not
    // yet true. The tag reports the same when it is made, kept once
    // (`typeChangeStatus` in `Copy.js`).
    const diagnostics: any[] = [];
    for (const copy of copies) {
        const written: any = copy.attributes?._createComponentOfType;
        const writtenValue = written?.primitive?.value;
        const writtenType =
            writtenValue &&
            componentInfoObjects.componentTypeLowerCaseMapping[
                String(writtenValue).toLowerCase()
            ];
        const writtenClass = writtenType && allClasses[writtenType];
        const linkAttr: any = copy.attributes?._link;
        if (
            !copy.attributes?._copyInChildren ||
            linkAttr ||
            !writtenClass ||
            writtenClass.listEntryComponentType !== undefined ||
            writtenType === "group" ||
            isComposite(writtenType)
        ) {
            continue;
        }
        const extending: any = copy.extending;
        const ref: any = extending ? unwrapSource(extending) : undefined;
        if (!ref || ref.nodeIdx < 0 || (ref.unresolvedPath?.length ?? 0) > 0) {
            continue;
        }
        const list = referents.componentsByIdx.get(ref.nodeIdx);
        const count = list && countByList.get(list);
        if (count === undefined || count === 1) {
            continue;
        }
        diagnostics.push({
            ...codedDiagnostic({
                type: "error",
                code: "doenet-e0064",
                args: {
                    componentType: writtenType,
                    source: doenetMLReferenceAsWritten(
                        ref.originalPath,
                        sources,
                    ),
                    reason: "count",
                    sourceType: list!.componentType,
                    part: "other",
                    count,
                    holdsNothing: count === 0 ? "true" : "false",
                    indexSelectsOne: "true",
                } as any,
            }),
            position: copy.position,
            sourceDoc: copy.sourceDoc,
        });
    }
    return diagnostics;
}
