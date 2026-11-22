/**
 * The run-time backstop for cycles at load (D57, D14, NAME-7, #2623 item 1).
 *
 * The load-time cycle checks (`breakReferenceCycles`, with the section
 * numbering edges of `sectionNumberingAtLoad.ts`) predict what the run time
 * waits for, and the shapes they miss stop the document with a circular
 * dependency. When one is thrown while the document loads, the worker
 * (`PublicDoenetMLCore.rebuildAroundLoadCycle`) blames one authored node on
 * the cycle and rebuilds the document, with that node made `doenet-e0005`
 * through the load check's own error path (`breakReferenceCycles`'s
 * `loadCycles`). The rest renders. A rebuild that stops on another cycle is
 * rebuilt again, keeping the nodes already blamed and blaming one more, up
 * to five rebuilds (D61 decision 2), so independent cycles are each an
 * error.
 *
 * The node blamed is, among the authored nodes on the cycle:
 * 1. the first reference, in document order, to the number of a sectioning
 *    component on the cycle (`$s.sectionNumber`, `$s.title`, …:
 *    `NUMBER_PROPERTIES`);
 * 2. else the first composite in document order, a reference (`$x`,
 *    `extend`, `copy`) included, as a reference is made as a composite, or
 *    is a reference read as a value (`_ref`), but one passed over, known to
 *    have no state variable on the cycle: a reference in the middle of a
 *    chain of copies (`n`, in `<number extend="$k" name="n"/>` then
 *    `<number extend="$n" name="m" hide="$m.hidden"/>`), whose blame
 *    wouldn't break the cycle (#2633 item 3), unless each is;
 * 3. else the first authored component in document order but the document.
 *
 * The rebuild's cycle check (`breakReferenceCycles`) refines the choice
 * where the author wrote the cycle (DIAG-4), as a reference written in an
 * attribute is compiled into an expression after the check, so the run
 * time's cycle names the component it is in, not it:
 * - rule 1 also counts a reference to the number of a section on the cycle
 *   written in an attribute of a node on it (`hide="$s.sectionNumber=1"`
 *   of a `<conditionalContent>` read by `$cc.hidden`), in an attribute the
 *   cycle runs through when the run time says (`variablesOnCycle`), and, of
 *   the references in that attribute, the one the cycle runs through when
 *   the run time names it (`__hide_ref0_value`, #2633 item 4); the first
 *   such, in document order, is made the error in place of the node blamed
 *   here;
 * - else, when the node blamed is no reference, a reference written in it,
 *   to it or to another node on the cycle, is made the error in its place,
 *   if there is one (`$P.x` in `<point name="P">($P.x+1, 2)</point>`).
 *
 * A component the run time made (what a composite holds, a component made
 * for an attribute) stands for the authored nodes it was made from: what it
 * was copied from (`madeFromIdx`: what is written in a repeat's template,
 * or what an `extend`, `copy` or `$n` is of), and the composite that made it
 * (`replacementOf`) or the component it is in, each traced back to one
 * written in the DoenetML. Its state variables on the cycle are those of
 * what it was copied from, but those of an attribute the reference that made
 * it writes itself, which are the reference's (`authoredOwnerOf`). A
 * reference in a chain of copies that doesn't write the attribute is passed
 * over.
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
 * in the DoenetML; else what it was copied from (`madeFromIdx`: what is
 * written in a repeat's template, or what an `extend`, `copy` or `$n` is
 * of), and the composite that made it (`replacementOf`), else the component
 * it shadows, else the component it is in, each traced the same way to one
 * that was written.
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
 * Whether the state variable `varName` (lower case) is of an attribute
 * `component` has written: the attribute itself (`hide`), or a value of an
 * expression attribute (`__hide_ref0_value`, `expressionAttributePrefix`).
 */
function isOfAttributeWritten(component: SerializedComponent, varName: string) {
    return Object.keys(component.attributes ?? {}).some((name) => {
        const lower = name.toLowerCase();
        return varName === lower || varName.startsWith(`__${lower}_`);
    });
}

/**
 * The authored node whose state variable `varName` (lower case) of
 * `componentIdx` is, if any, and the authored nodes passed over on the way:
 * what a reference writing the attribute copies, and each reference in a
 * chain of copies that doesn't write it.
 * That is the component itself, if written in the DoenetML, else, for a
 * copy (`madeFromIdx`: what is written in a repeat's template, or what an
 * `extend`, `copy` or `$n` is of), what it was copied from, traced the same
 * way. But a copy made by an authored reference (`replacementOf` a `_copy`
 * written in the DoenetML, or an instance of one made from a repeat's
 * template) that writes the variable's attribute itself
 * (`<number extend="$n" name="m" hide="$s.hidden"/>`) takes the variable
 * from the reference, not from what it copies, so it is the reference's.
 * The composite that made a component, or the component it is in, does not
 * have its state variables, so is not followed.
 */
function authoredOwnerOf(
    componentIdx: number,
    varName: string,
    authored: Map<number, SerializedComponent>,
    components: any[],
): { owner: number | undefined; passed: number[] } {
    const seen = new Set<number>();
    const passed: number[] = [];
    let idx: number | undefined = componentIdx;
    while (idx !== undefined && !seen.has(idx)) {
        if (authored.has(idx)) {
            return { owner: idx, passed };
        }
        seen.add(idx);
        const component = components[idx];
        // the authored reference that made it, also through an instance of
        // one made from a repeat's template (`madeFromIdx`)
        let referenceIdx: number | undefined =
            component?.replacementOf?.componentIdx;
        const referencesSeen = new Set<number>();
        while (
            referenceIdx !== undefined &&
            !authored.has(referenceIdx) &&
            !referencesSeen.has(referenceIdx)
        ) {
            referencesSeen.add(referenceIdx);
            referenceIdx = components[referenceIdx]?.madeFromIdx;
        }
        const reference =
            referenceIdx === undefined ? undefined : authored.get(referenceIdx);
        if (
            reference?.componentType === "_copy" &&
            component?.madeFromIdx !== undefined &&
            isOfAttributeWritten(reference, varName)
        ) {
            // what it copies is passed over: none of its variables on the
            // cycle is this one
            const copied = authoredOwnerOf(
                component.madeFromIdx,
                varName,
                authored,
                components,
            );
            if (copied.owner !== undefined) {
                passed.push(copied.owner);
            }
            passed.push(...copied.passed);
            return { owner: reference.componentIdx, passed };
        }
        if (
            reference?.componentType === "_copy" &&
            component?.madeFromIdx !== undefined
        ) {
            // a reference in a chain of copies that doesn't write the
            // variable's attribute: the variable is what it copies, so it is
            // passed over (#2633 item 3: `n`, where `n` extends `k`, and `m`
            // extends `n` and writes the attribute)
            passed.push(reference.componentIdx);
        }
        idx = component?.madeFromIdx;
    }
    return { owner: undefined, passed };
}

/**
 * The authored node to blame for the cycle on `componentIndices`, thrown
 * while the document `document` loaded, given the components the load made
 * (`components`), and the authored nodes on the cycle (`onCycle`), or
 * `undefined` if none can be singled out.
 */
export function blameLoadCycle({
    componentIndices,
    stateVariables = [],
    components,
    document,
    componentInfoObjects,
}: {
    componentIndices: number[];
    stateVariables?: [number, string][];
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
    // the state variables the cycle runs through of each authored node it
    // is, or was copied from, lower case. An authored node a copy was made
    // from, passed over for a variable the copy's reference writes, is given
    // an entry too, even if empty: the run time said which variables of the
    // copy are on the cycle, and none of them is in its attributes
    const variablesOnCycle = new Map<number, Set<string>>();
    function variablesOf(idx: number) {
        let vars = variablesOnCycle.get(idx);
        if (!vars) {
            vars = new Set();
            variablesOnCycle.set(idx, vars);
        }
        return vars;
    }
    for (const [componentIdx, varName] of stateVariables) {
        if (typeof varName !== "string") {
            continue;
        }
        const lower = varName.toLowerCase();
        const { owner, passed } = authoredOwnerOf(
            componentIdx,
            lower,
            byIdx,
            components,
        );
        if (owner === undefined) {
            continue;
        }
        variablesOf(owner).add(lower);
        for (const idx of passed) {
            variablesOf(idx);
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
        // to a section on the cycle: a reference to the number of another
        // section is on the cycle only through what holds its value (the
        // `$t.sectionNumber` in `<p name="q" hide="$q.text='1'">`), so is
        // not where the cycle is
        const target = byIdx.get(reference!.nodeIdx);
        return (
            target !== undefined &&
            candidates.has(target.componentIdx) &&
            inherits(target.componentType, "_sectioningComponent")
        );
    }

    const toNumber = inOrder.find((idx) =>
        isReferenceToNumber(byIdx.get(idx)!),
    );
    if (toNumber !== undefined) {
        return { blamed: toNumber, onCycle: candidates, variablesOnCycle };
    }
    const composites = inOrder.filter(
        (idx) =>
            isReference(byIdx.get(idx)!) ||
            componentInfoObjects.isCompositeComponent({
                componentType: byIdx.get(idx)!.componentType,
                includeNonStandard: true,
            }),
    );
    // not one passed over, known to have no state variable on the cycle (a
    // reference in the middle of a chain of copies, whose blame wouldn't
    // break it, #2633 item 3), unless each is
    const composite =
        composites.find((idx) => variablesOnCycle.get(idx)?.size !== 0) ??
        composites[0];
    if (composite !== undefined) {
        return { blamed: composite, onCycle: candidates, variablesOnCycle };
    }
    if (inOrder.length === 0) {
        return undefined;
    }
    return { blamed: inOrder[0], onCycle: candidates, variablesOnCycle };
}
