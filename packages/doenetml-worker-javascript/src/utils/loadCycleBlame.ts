/**
 * The run-time backstop for cycles at load (D57, D14, NAME-7, #2623 item 1).
 *
 * The load-time cycle checks (`breakReferenceCycles`, with the section
 * numbering edges of `sectionNumberingAtLoad.ts`) predict what the run time
 * waits for, and the shapes they miss stop the document with a circular
 * dependency. When one is thrown while the document loads, the worker
 * (`PublicDoenetMLCore.createCoreGenerateDast`) blames one authored node on
 * the cycle and rebuilds the document once, with that node made
 * `doenet-e0005` through the load check's own error path
 * (`breakReferenceCycles`'s `loadCycle`). The rest renders.
 *
 * The node blamed is, among the authored nodes on the cycle:
 * 1. the first reference, in document order, to a sectioning component's
 *    number (`$s.sectionNumber`, `$s.title`, …: `NUMBER_PROPERTIES`);
 * 2. else the first composite in document order, a reference (`$x`,
 *    `extend`, `copy`) included, as a reference is made as a composite, or
 *    is a reference read as a value (`_ref`);
 * 3. else the first authored component in document order but the document.
 *
 * The rebuild's cycle check (`breakReferenceCycles`) refines the choice
 * where the author wrote the cycle (DIAG-4), as a reference written in an
 * attribute is compiled into an expression after the check, so the run
 * time's cycle names the component it is in, not it:
 * - rule 1 also counts a reference to the number of a section on the cycle
 *   written in an attribute of a node on it (`hide="$s.sectionNumber=1"`
 *   of a `<conditionalContent>` read by `$cc.hidden`), and the first such,
 *   in document order, is made the error in place of the node blamed here;
 * - else, when the node blamed is no reference, a reference written in it,
 *   to it or to another node on the cycle, is made the error in its place,
 *   if there is one (`$P.x` in `<point name="P">($P.x+1, 2)</point>`).
 *
 * A component the run time made (what a composite holds, a component made
 * for an attribute) stands for the authored nodes it was made from: what it
 * was copied from (`madeFromIdx`, such as what is written in a repeat's
 * template), and the composite that made it (`replacementOf`) or the
 * component it is in, each traced back to one written in the DoenetML.
 */
import type { SerializedComponent } from "./dast/types";
import type { ComponentInfoObjects } from "./componentInfoObjects";
import { NUMBER_PROPERTIES } from "./dast/sectionNumberingAtLoad";
import type { LoadCycle } from "./dast/referenceCycles";

/** Whether the run-time backstop is on. Tests turn it off (`setLoadCycleBackstop`). */
let backstopOn = true;

/**
 * Turn the run-time backstop for cycles at load on or off, returning what
 * it was. For tests only: the generated differential test
 * (`T/diagnostics/sectionNumberingDifferential.test.ts`) runs a document
 * without it, to see whether the run time alone stops on a cycle.
 */
export function setLoadCycleBackstop(on: boolean): boolean {
    const was = backstopOn;
    backstopOn = on;
    return was;
}

export function loadCycleBackstopOn() {
    return backstopOn;
}

/** The reference a `_copy` is of, if it was resolved. */
function referenceOf(copy: SerializedComponent) {
    const extending: any = copy.extending;
    if (!extending) {
        return undefined;
    }
    return (extending.Ref ??
        extending.ExtendAttribute ??
        extending.CopyAttribute ??
        extending.CopyWithStateAttribute) as
        { nodeIdx: number; unresolvedPath: any[] | null } | undefined;
}

/**
 * Every component written in `document`, by index, and its place in
 * document order: the component, then what is in its attributes, in the
 * index of its reference, then its children.
 */
function authoredComponents(document: SerializedComponent) {
    const byIdx = new Map<number, SerializedComponent>();
    const order = new Map<number, number>();
    function visit(component: SerializedComponent | string | null) {
        if (
            typeof component !== "object" ||
            component === null ||
            byIdx.has(component.componentIdx)
        ) {
            return;
        }
        byIdx.set(component.componentIdx, component);
        order.set(component.componentIdx, order.size);
        for (const attribute of Object.values(
            component.attributes ?? {},
        ) as any[]) {
            if (attribute?.component) {
                visit(attribute.component);
            }
            for (const reference of attribute?.references ?? []) {
                visit(reference);
            }
            for (const child of attribute?.children ?? []) {
                visit(child);
            }
        }
        const reference: any = referenceOf(component);
        for (const part of reference?.unresolvedPath ?? []) {
            for (const piece of part?.index ?? []) {
                for (const value of piece?.value ?? []) {
                    visit(value);
                }
            }
        }
        for (const child of component.children ?? []) {
            visit(child);
        }
    }
    visit(document);
    return { byIdx, order };
}

/**
 * The authored nodes a component on the cycle stands for: itself, if written
 * in the DoenetML; else what it was copied from (`madeFromIdx`, such as what
 * is written in a repeat's template), and the composite that made it or the
 * component it is in, each traced the same way to one that was written.
 */
function authoredNodesOf(
    componentIdx: number,
    authored: Map<number, SerializedComponent>,
    components: any[],
): Set<number> {
    const found = new Set<number>();
    const seen = new Set<number>();
    const stack = [componentIdx];
    while (stack.length > 0) {
        const idx = stack.pop()!;
        if (seen.has(idx)) {
            continue;
        }
        seen.add(idx);
        if (authored.has(idx)) {
            found.add(idx);
            continue;
        }
        const component = components[idx];
        if (!component) {
            continue;
        }
        if (component.madeFromIdx !== undefined) {
            stack.push(component.madeFromIdx);
        }
        const made =
            component.replacementOf?.componentIdx ??
            component.shadows?.componentIdx ??
            component.parentIdx;
        if (made !== undefined) {
            stack.push(made);
        }
    }
    return found;
}

/**
 * The authored node to blame for the cycle on `componentIndices`, thrown
 * while the document `document` loaded, given the components the load made
 * (`components`), and the authored nodes on the cycle (`onCycle`), or
 * `undefined` if none can be singled out.
 */
export function blameLoadCycle({
    componentIndices,
    components,
    document,
    componentInfoObjects,
}: {
    componentIndices: number[];
    components: any[];
    document: SerializedComponent;
    componentInfoObjects: ComponentInfoObjects;
}): LoadCycle | undefined {
    const { byIdx, order } = authoredComponents(document);
    const candidates = new Set<number>();
    for (const componentIdx of componentIndices) {
        for (const idx of authoredNodesOf(componentIdx, byIdx, components)) {
            if (idx !== document.componentIdx) {
                candidates.add(idx);
            }
        }
    }
    const inOrder = [...candidates].sort(
        (a, b) => order.get(a)! - order.get(b)!,
    );

    function inherits(componentType: string, base: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: base,
        });
    }

    /**
     * Whether `component` is a reference: a `_copy`, or a `_ref`, which a
     * reference read as a value is made after the cycle check, under the
     * same index.
     */
    function isReference(component: SerializedComponent) {
        return (
            component.componentType === "_copy" ||
            component.componentType === "_ref"
        );
    }

    function isReferenceToNumber(component: SerializedComponent) {
        if (!isReference(component)) {
            return false;
        }
        const reference = referenceOf(component);
        const property = reference?.unresolvedPath?.[0]?.name;
        if (
            typeof property !== "string" ||
            !NUMBER_PROPERTIES.has(property.toLowerCase())
        ) {
            return false;
        }
        const target = byIdx.get(reference!.nodeIdx);
        return (
            target !== undefined &&
            inherits(target.componentType, "_sectioningComponent")
        );
    }

    const toNumber = inOrder.find((idx) =>
        isReferenceToNumber(byIdx.get(idx)!),
    );
    if (toNumber !== undefined) {
        return { blamed: toNumber, onCycle: candidates };
    }
    const composite = inOrder.find(
        (idx) =>
            isReference(byIdx.get(idx)!) ||
            componentInfoObjects.isCompositeComponent({
                componentType: byIdx.get(idx)!.componentType,
                includeNonStandard: true,
            }),
    );
    if (composite !== undefined) {
        return { blamed: composite, onCycle: candidates };
    }
    if (inOrder.length === 0) {
        return undefined;
    }
    return { blamed: inOrder[0], onCycle: candidates };
}
