/**
 * The warning for an `<updateValue>` whose `target` is a container of
 * several things, decided when the document loads (`doenet-w0195`, #2554
 * item 2, DIAG-1): a `<group>` holding several components, or a `<repeat>`
 * or `<repeatForSequence>`, which makes an item for each iteration. Neither
 * has one value to change (COLL-3), so the action does nothing; the author
 * is told to name the component, or the item, to change.
 *
 * Only a `target` that is one reference to the container itself is checked
 * (`$g`, `$r`): one with a property or an index after it (`$g.a`, `$r[1]`)
 * names what it changes. A `<group>` holding one component stands for it
 * (COLL-3), and one holding none has nothing to change, which the action
 * reports when it acts (`doenet-w0043`). Only what the DoenetML says is
 * read (DIAG-7): a container made by a reference or a copy is not checked.
 *
 * An `<updateValue>` warned about is marked
 * (`doenetAttributes.targetNotOneValueAtLoad`), so that acting does not
 * report again that its target has no value (`doenet-w0044`).
 */
import type { SerializedComponent } from "./types";
import { codedDiagnostic } from "../diagnostics";
import { documentReferents } from "./valueReferences";
import { unwrapSource } from "./convertNormalizedDast";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import type { ComponentInfoObjects } from "../componentInfoObjects";

/** The actions whose `target` is checked. */
const ACTIONS = new Set(["updateValue"]);

/** The tags that make an item for each iteration. */
const REPEATS = new Set(["repeat", "repeatForSequence"]);

export function checkActionTargetsAtLoad({
    serializedComponents,
    componentInfoObjects,
    sources,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: string[];
}) {
    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const { componentsByIdx } = documentReferents({
        serializedComponents,
        componentInfoObjects,
    });

    for (const component of componentsByIdx.values()) {
        if (!ACTIONS.has(component.componentType)) {
            continue;
        }
        const attribute: any = component.attributes?.target;
        const references = attribute?.references ?? [];
        if (references.length !== 1 || !references[0]?.extending) {
            continue;
        }
        const ref: any = unwrapSource(references[0].extending);
        if (!ref || ref.nodeIdx < 0 || (ref.unresolvedPath ?? []).length > 0) {
            continue;
        }
        const lastPart = ref.originalPath?.[ref.originalPath.length - 1];
        if ((lastPart?.index ?? []).length > 0) {
            continue;
        }
        const container = componentsByIdx.get(ref.nodeIdx);
        if (!container || container.extending !== undefined) {
            continue;
        }
        let args;
        if (REPEATS.has(container.componentType)) {
            args = { container: "repeat", count: 0 };
        } else if (container.componentType === "group") {
            const count = heldCount(container.children ?? []);
            if (count < 2) {
                continue;
            }
            args = { container: "group", count };
        } else {
            continue;
        }
        const reference = doenetMLReferenceAsWritten(ref.originalPath, sources);
        if (reference === "") {
            continue;
        }
        component.doenetAttributes = {
            ...(component.doenetAttributes ?? {}),
            targetNotOneValueAtLoad: true,
        };
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0195",
                args: {
                    componentType: component.componentType,
                    reference,
                    component: container.componentType,
                    ...args,
                },
                position: component.position,
                sourceDoc: component.sourceDoc,
            }),
        );
    }
    return diagnostics;
}

/**
 * How many components `children`, of a `<group>`, holds: blank text and
 * `<setup>`s aside, any other text is one.
 */
function heldCount(children: (SerializedComponent | string)[]) {
    return children.filter((child) =>
        typeof child === "string"
            ? child.trim() !== ""
            : child.componentType !== "setup",
    ).length;
}
