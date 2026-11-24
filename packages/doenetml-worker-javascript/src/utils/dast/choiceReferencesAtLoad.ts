/**
 * A bare reference to a `<choice>` written in a `<choiceInput>` adds no
 * choice (#2097). `$c1` is whether the choice was submitted, a boolean
 * (REF-1a, D21: a `<choice>`'s implicit property is `submitted`), and a
 * choice can only be copied (D42). So `<choiceInput>$c1 $c2</choiceInput>`
 * made a choice input holding two booleans, with no choices, and the only
 * hint was `doenet-w0107` ("Found invalid children: `<boolean>`"), which says
 * nothing about the choice.
 *
 * Each such reference is now `doenet-w0210` at the reference, suggesting
 * `<choice copy="$c1"/>` (DIAG-3), and names nothing (a blank, D37), as a
 * reference to a `<variantControl>` does (`variantControlReferences.ts`), so
 * the misleading `w0107` is not given too.
 *
 * Decided at load from the DoenetML (DIAG-7): the reference's referent is a
 * `<choice>` written out, or a tag made as one with `copy`.
 */
import type { DiagnosticRecord } from "@doenet/utils";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import { codedDiagnostic } from "../diagnostics";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { documentReferents } from "./valueReferences";
import { unwrapSource } from "./convertNormalizedDast";

export function markChoiceReferencesInChoiceInputs({
    serializedComponents,
    componentInfoObjects,
    sources,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
}): DiagnosticRecord[] {
    function inherits(componentType: string, base: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: base,
        });
    }

    // The bare references written as children of a `<choiceInput>`.
    const candidates: SerializedComponent[] = [];
    const seen = new Set<SerializedComponent>();
    function gather(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (
                typeof component !== "object" ||
                component === null ||
                seen.has(component)
            ) {
                continue;
            }
            seen.add(component);
            if (inherits(component.componentType, "choiceInput")) {
                for (const child of component.children ?? []) {
                    if (
                        typeof child === "object" &&
                        child.componentType === "_copy" &&
                        child.attributes?._createComponentOfType ===
                            undefined &&
                        child.extending
                    ) {
                        candidates.push(child);
                    }
                }
            }
            for (const attribute of Object.values(
                component.attributes ?? {},
            ) as any[]) {
                if (attribute?.component) {
                    gather([attribute.component]);
                }
                gather(attribute?.children ?? []);
            }
            gather(component.children ?? []);
        }
    }
    gather(serializedComponents);

    if (candidates.length === 0) {
        return [];
    }

    const { referentType } = documentReferents({
        serializedComponents,
        componentInfoObjects,
    });

    const diagnostics: DiagnosticRecord[] = [];
    for (const copy of candidates) {
        const [sourceKey, ref] = Object.entries(copy.extending as any)[0] as [
            string,
            any,
        ];
        if (!ref || ref.nodeIdx < 0 || (ref.unresolvedPath ?? []).length > 0) {
            continue;
        }
        const type = referentType(ref.nodeIdx);
        if (type === undefined || !inherits(type, "choice")) {
            continue;
        }
        const reference = doenetMLReferenceAsWritten(
            (unwrapSource(copy.extending as any) as any).originalPath,
            sources,
        );
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0210",
                args: { reference },
                position: copy.position,
                sourceDoc: copy.sourceDoc,
            }),
        );
        // a blank, as a reference that names nothing is (D37, `Copy.js`)
        copy.extending = {
            [sourceKey]: {
                ...ref,
                nodeIdx: -1,
                unresolvedPath: null,
                nodesInResolvedPath: [],
            },
        } as any;
        copy.doenetAttributes = {
            ...copy.doenetAttributes,
            noReferent: true,
        };
    }
    return diagnostics;
}
