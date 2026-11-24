/**
 * What an `<award copy="$aw"/>` will hold, for the sugar of the `<answer>`
 * holding it (`Answer.js`), which decides from an award's children whether
 * the answer needs an input, and of which type. A copy is its source's
 * DoenetML written in place (CPY-1), so the answer must decide as it does for
 * the award written out. But the sugar runs on what is written, and a copy is
 * made only later, with no children until then: without this, every copied
 * award looked like one that needs an input, and the answer added a
 * `<mathInput>` the written-out award did not get (#2531).
 *
 * So, before the sugar, each `<award copy>` whose source the DoenetML gives
 * (a reference with nothing left for run time, to an `<award>` written out,
 * or to an `<award copy>` whose source is given) is marked with
 * `doenetAttributes.copiedAward`: the children it will have (its source's,
 * then those written on it, as `Copy.js` appends them) and whether its source
 * has `referencesAreResponses`. A copy whose source is not given is left
 * unmarked, and the sugar decides as before. The marks are removed after the
 * sugar (`removeCopiedAwardMarks`).
 *
 * An `extend` or a `copyWithState` of an award is an error (D42,
 * `extendErrorsAtLoad.ts`), so only a `copy` is marked.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import { unwrapSource } from "./convertNormalizedDast";

/** What `doenetAttributes.copiedAward` holds. */
export type CopiedAward = {
    children: (SerializedComponent | string)[];
    referencesAreResponses: boolean;
};

/** Every component in `serializedComponents`, attribute components included. */
function allComponents(serializedComponents: (SerializedComponent | string)[]) {
    const found: SerializedComponent[] = [];
    const seen = new Set<SerializedComponent>();
    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            found.push(component);
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
    return found;
}

/**
 * Mark each `<award copy>` in `serializedComponents` whose source the
 * DoenetML gives with what it will hold (see above). Runs before the sugar,
 * so the children marked are as written, as the sugar reads a written-out
 * award's.
 */
export function markCopiedAwards({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const components = allComponents(serializedComponents);
    const byIdx = new Map<number, SerializedComponent>();
    const copiesByCreatedIdx = new Map<number, SerializedComponent>();
    for (const component of components) {
        byIdx.set(component.componentIdx, component);
        const createdIdx: any = component.attributes?._createComponentIdx;
        if (
            component.componentType === "_copy" &&
            createdIdx?.type === "primitive"
        ) {
            copiesByCreatedIdx.set(
                Number(createdIdx.primitive.value),
                component,
            );
        }
    }

    function isAwardCopy(component: SerializedComponent) {
        if (component.componentType !== "_copy") {
            return false;
        }
        const written: any = component.attributes?._createComponentOfType;
        const type = written?.primitive?.value;
        if (
            typeof type !== "string" ||
            componentInfoObjects.componentTypeAsWritten(type) !== "award"
        ) {
            return false;
        }
        // only a `copy`: `_link` false, and no `_copyWithState`
        const linkAttr: any = component.attributes?._link;
        const unlinked =
            linkAttr &&
            (linkAttr.primitive?.value === false ||
                linkAttr.children?.join?.("").trim() === "false");
        return Boolean(unlinked) && !component.attributes?._copyWithState;
    }

    function hasReferencesAreResponses(component: SerializedComponent) {
        return Object.hasOwn(
            component.attributes ?? {},
            "referencesAreResponses",
        );
    }

    const marks = new Map<SerializedComponent, CopiedAward | null>();

    /**
     * What the award copy `copy` will hold, or `null` when the DoenetML does
     * not give its source.
     */
    function copiedAward(copy: SerializedComponent): CopiedAward | null {
        if (marks.has(copy)) {
            return marks.get(copy)!;
        }
        // a cycle is reported elsewhere; here it gives nothing
        marks.set(copy, null);
        const extending: any = copy.extending;
        const ref: any = extending ? unwrapSource(extending) : undefined;
        let result: CopiedAward | null = null;
        if (ref && (ref.unresolvedPath?.length ?? 0) === 0) {
            const source =
                byIdx.get(ref.nodeIdx) ?? copiesByCreatedIdx.get(ref.nodeIdx);
            let fromSource: CopiedAward | null = null;
            if (source?.componentType === "award") {
                fromSource = {
                    children: source.children ?? [],
                    referencesAreResponses: hasReferencesAreResponses(source),
                };
            } else if (source && isAwardCopy(source)) {
                fromSource = copiedAward(source);
            }
            if (fromSource) {
                result = {
                    children: [
                        ...fromSource.children,
                        ...(copy.children ?? []),
                    ],
                    referencesAreResponses:
                        fromSource.referencesAreResponses ||
                        hasReferencesAreResponses(copy),
                };
            }
        }
        marks.set(copy, result);
        return result;
    }

    for (const component of components) {
        if (isAwardCopy(component)) {
            copiedAward(component);
        }
    }
    for (const [copy, mark] of marks) {
        if (mark) {
            copy.doenetAttributes = {
                ...copy.doenetAttributes,
                copiedAward: mark,
            };
        }
    }
}

/**
 * Remove the marks `markCopiedAwards` made, once the sugar has read them, so
 * the copies do not carry their sources' children.
 */
export function removeCopiedAwardMarks(
    serializedComponents: (SerializedComponent | string)[],
) {
    for (const component of allComponents(serializedComponents)) {
        if (component.doenetAttributes?.copiedAward) {
            delete component.doenetAttributes.copiedAward;
        }
    }
}
