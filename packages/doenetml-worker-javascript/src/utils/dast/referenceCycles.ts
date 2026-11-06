/**
 * Reference cycles decided at load, from the DoenetML alone (D14, NAME-7,
 * DIAG-7). A reference whose value depends, through what is written, on the
 * reference itself is a circular dependency: the reference is an error
 * (`doenet-e0005`) at where it is written, and the rest of the document
 * renders (DIAG-5). The cycle is found from the references the resolver
 * resolved, over everything written, so over every case of a
 * `<conditionalContent>`, every option of a `<select>` and every template of
 * a `<repeat>`, whether shown now or not: the same errors whatever the
 * reader does and whatever the variant (Doenet/DoenetML#2439, #2463).
 *
 * The graph has an edge from a component to each component its value is read
 * from:
 *
 * - a reference (`$x`, `$m[2]`, `<math extend="$x"/>`, `<math copy="$x"/>`)
 *   to what it names, when it names the component as a whole, or an index
 *   into a `<math>` or a type built on it, such as a `<matrix>` (`$m[2]`),
 *   which reads the whole value. A property (`$x.y`) may or may not read
 *   what is written in `x`, an index into a composite names one of what it
 *   holds, decided only when it runs, an index into a list reads one item
 *   (`<textList name="l"><text>a</text><text>$l[1]</text></textList>` is
 *   valid), and an index into a `<text>`, a `<number>` or a `<boolean>`
 *   names nothing (`doenet-w0100`), so none of these is an edge, but for a
 *   reference written as a tag that names the tag itself, whatever its path
 *   (`<group name="g" extend="$g.x"/>`);
 * - a composite (`<conditionalContent>`, `<group>`, `<repeat>`, …), a
 *   `<case>` or an `<option>` to each child but a `<setup>`, as what it
 *   holds is made from them;
 * - a tag whose value is made from its children (`VALUE_FROM_CHILDREN`: a
 *   `<math>`, a `<text>`, …), or a reference written as one, to each child
 *   that is not a `<label>`. A component's own label may read the component
 *   (`<point name="P"><label>$P</label></point>` means P's value, #1384).
 *
 * Every reference in a strongly connected part of that graph with an edge
 * (a cycle) is made an `_error`, which breaks every cycle, as each cycle
 * holds a reference. A reference the type check already made an error
 * (`typeChangeAtLoad`, such as a tag extending the `<conditionalContent>`
 * holding it) has no edges, as it reads nothing.
 *
 * A cycle through an attribute or a property is not found here; it is still
 * reported when the document runs.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import { codedDiagnostic } from "../diagnostics";
import { errorComponentState } from "./errors";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * Tags whose value is made from their children, and the tags that inherit
 * from them: the same list as `getSelfReferentialFallbackPropName` uses for
 * the tags whose own reference inside them reads their value.
 */
const VALUE_FROM_CHILDREN = [
    "label",
    "text",
    "math",
    "m",
    "md",
    "boolean",
    "number",
    "mathList",
    "numberList",
    "textList",
    "booleanList",
];

/** The reference a `_copy` is of, if it was resolved to a component. */
function referenceOf(copy: SerializedComponent) {
    const extending: any = copy.extending;
    if (!extending) {
        return undefined;
    }
    return (extending.Ref ??
        extending.ExtendAttribute ??
        extending.CopyAttribute) as
        { nodeIdx: number; unresolvedPath: any[] | null } | undefined;
}

/**
 * Make each reference on a cycle among `serializedComponents` an `_error`
 * with `doenet-e0005`, and return the diagnostics, to be reported at load.
 */
export function breakReferenceCycles({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}): DiagnosticRecord[] {
    const componentsByIdx = new Map<number, SerializedComponent>();
    const copiesByCreatedIdx = new Map<number, SerializedComponent>();

    function gather(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component === "string") {
                continue;
            }
            componentsByIdx.set(component.componentIdx, component);
            const createdIdx = component.attributes?._createComponentIdx;
            if (
                component.componentType === "_copy" &&
                createdIdx?.type === "primitive"
            ) {
                copiesByCreatedIdx.set(
                    Number(createdIdx.primitive.value),
                    component,
                );
            }
            gather(component.children ?? []);
        }
    }
    gather(serializedComponents);

    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }

    function valueFromChildren(componentType: string | undefined) {
        return (
            componentType !== undefined &&
            VALUE_FROM_CHILDREN.some((base) =>
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: componentType,
                    baseComponentType: base,
                }),
            )
        );
    }

    /** The type a reference written as a tag makes, if it is one. */
    function writtenType(copy: SerializedComponent) {
        const written = copy.attributes?._createComponentOfType;
        if (written?.type !== "primitive") {
            return undefined;
        }
        return componentInfoObjects.componentTypeLowerCaseMapping[
            String(written.primitive.value).toLowerCase()
        ];
    }

    /**
     * The component the graph has for the resolver node `nodeIdx`: the
     * component, or the copy that makes it (`_createComponentIdx`).
     */
    function nodeFor(nodeIdx: number) {
        return componentsByIdx.get(nodeIdx) ?? copiesByCreatedIdx.get(nodeIdx);
    }

    /** The type the component for `nodeIdx` has, or will be made as. */
    function typeOf(node: SerializedComponent) {
        return node.componentType === "_copy"
            ? writtenType(node)
            : node.componentType;
    }

    function childEdges(component: SerializedComponent, skipLabels: boolean) {
        const edges: number[] = [];
        for (const child of component.children ?? []) {
            if (typeof child === "string" || child.componentType === "setup") {
                // a `<setup>` is not part of what its parent holds or shows
                continue;
            }
            if (
                skipLabels &&
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: "label",
                })
            ) {
                continue;
            }
            edges.push(child.componentIdx);
        }
        return edges;
    }

    function edgesOf(component: SerializedComponent): number[] {
        const type = component.componentType;
        if (type === "_copy") {
            if (
                typeof component.doenetAttributes?.typeChangeAtLoad === "object"
            ) {
                // an error already, which reads nothing
                return [];
            }
            const edges: number[] = [];
            const reference = referenceOf(component);
            const target =
                reference && reference.nodeIdx >= 0
                    ? nodeFor(reference.nodeIdx)
                    : undefined;
            if (target && target !== component) {
                const path = reference!.unresolvedPath;
                const wholeOrIndex =
                    path === null ||
                    path.every(
                        (part: any) =>
                            part.name === "" && part.index?.length > 0,
                    );
                const targetType = typeOf(target);
                if (
                    path === null ||
                    (wholeOrIndex &&
                        targetType !== undefined &&
                        target.componentType !== "_copy" &&
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: targetType,
                            baseComponentType: "math",
                        }))
                ) {
                    edges.push(target.componentIdx);
                }
            } else if (target === component) {
                // made from itself (`<math name="z" extend="$z"/>`), whatever
                // the path: `<group name="g" extend="$g.x"/>` reads what it
                // makes too
                edges.push(component.componentIdx);
            }
            if (valueFromChildren(writtenType(component))) {
                edges.push(...childEdges(component, true));
            }
            return edges;
        }
        if (isComposite(type) || type === "case" || type === "option") {
            return childEdges(component, false);
        }
        if (valueFromChildren(type)) {
            return childEdges(component, true);
        }
        return [];
    }

    // Strongly connected parts (Tarjan), iteratively, as a document can be
    // deeper than the stack.
    const index = new Map<number, number>();
    const lowLink = new Map<number, number>();
    const onStack = new Set<number>();
    const stack: number[] = [];
    const edgesByIdx = new Map<number, number[]>();
    let nextIndex = 0;
    const onCycle = new Set<number>();

    function edges(idx: number) {
        let result = edgesByIdx.get(idx);
        if (result === undefined) {
            const component = componentsByIdx.get(idx);
            result = component ? edgesOf(component) : [];
            edgesByIdx.set(idx, result);
        }
        return result;
    }

    for (const start of componentsByIdx.keys()) {
        if (index.has(start)) {
            continue;
        }
        const work: { idx: number; edge: number }[] = [{ idx: start, edge: 0 }];
        index.set(start, nextIndex);
        lowLink.set(start, nextIndex);
        nextIndex++;
        stack.push(start);
        onStack.add(start);

        while (work.length > 0) {
            const frame = work[work.length - 1];
            const out = edges(frame.idx);
            if (frame.edge < out.length) {
                const next = out[frame.edge++];
                if (!index.has(next)) {
                    index.set(next, nextIndex);
                    lowLink.set(next, nextIndex);
                    nextIndex++;
                    stack.push(next);
                    onStack.add(next);
                    work.push({ idx: next, edge: 0 });
                } else if (onStack.has(next)) {
                    lowLink.set(
                        frame.idx,
                        Math.min(lowLink.get(frame.idx)!, index.get(next)!),
                    );
                }
                continue;
            }
            work.pop();
            if (work.length > 0) {
                const parent = work[work.length - 1].idx;
                lowLink.set(
                    parent,
                    Math.min(lowLink.get(parent)!, lowLink.get(frame.idx)!),
                );
            }
            if (lowLink.get(frame.idx) === index.get(frame.idx)) {
                const part: number[] = [];
                let member: number;
                do {
                    member = stack.pop()!;
                    onStack.delete(member);
                    part.push(member);
                } while (member !== frame.idx);
                if (part.length > 1 || out.includes(frame.idx)) {
                    part.forEach((idx) => onCycle.add(idx));
                }
            }
        }
    }

    const diagnostics: DiagnosticRecord[] = [];
    // In document order, so the errors are reported in the order written.
    for (const [idx, component] of componentsByIdx) {
        if (!onCycle.has(idx) || component.componentType !== "_copy") {
            continue;
        }
        const reference = referenceOf(component);
        const target =
            reference && reference.nodeIdx >= 0
                ? nodeFor(reference.nodeIdx)
                : undefined;
        const componentType =
            writtenType(component) ?? (target ? typeOf(target) : undefined);
        const diagnostic = codedDiagnostic({
            type: "error",
            code: "doenet-e0005",
            args: { componentType: componentType ?? "none" },
            position: component.position,
            sourceDoc: component.sourceDoc,
        });
        diagnostics.push(diagnostic);
        const errorComponent = component as any;
        errorComponent.componentType = "_error";
        errorComponent.state = errorComponentState(
            diagnostic.message,
            diagnostic,
        );
        errorComponent.attributes = {};
        errorComponent.children = [];
        errorComponent.doenetAttributes = {};
        delete errorComponent.extending;
    }
    return diagnostics;
}
