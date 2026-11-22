/**
 * A reference to a `<variantControl>` names nothing, with a warning that says
 * why (DIAG-3, #2623 item 7).
 *
 * A `<variantControl>` only sets how the variants of the document or section
 * it is written in are chosen, and that is decided before anything in the
 * document is made (D47 decision 1). It shows nothing, and nothing can be read from it:
 * its settings are attributes, and the properties every component has
 * (`hidden`, `disabled`) say nothing about it. So `$vc` and `$vc.numVariants` have nothing to
 * show. They used to say something else was wrong:
 * - `$vc.numVariants` gave `doenet-w0104` ("No referent found"), though `vc`
 *   exists;
 * - `<p>$vc</p>` gave `doenet-w0107` ("Invalid children for `<p>`"), as the
 *   reference made another `<variantControl>` there;
 * - `$vc` where a `<variantControl>` may be written made another, which
 *   nothing reads, silently.
 *
 * Each is now `doenet-w0199` at the reference, which names nothing (a blank,
 * D37). So is a tag made from a property of one
 * (`<number extend="$vc.numVariants"/>`), which is then missing. A
 * `<variantControl>` written with `extend`, `copy` or `copyWithState` is
 * `doenet-e0088` (`convertToCopy.ts`), and another tag made from one itself
 * (`<text extend="$vc"/>`) is decided by the type checks (REF-5).
 */
import type { DiagnosticRecord } from "@doenet/utils";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import { codedDiagnostic } from "../diagnostics";
import { doenetMLReferenceAsWritten } from "../sourceLocation";

export function markReferencesToVariantControls({
    serializedComponents,
    componentInfoObjects,
    sources,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
}): DiagnosticRecord[] {
    const variantControls = new Set<number>();
    const references: SerializedComponent[] = [];
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
            if (component.componentType === "variantControl") {
                variantControls.add(component.componentIdx);
            }
            if (component.componentType === "_copy" && component.extending) {
                references.push(component);
            }
            for (const attribute of Object.values(
                component.attributes ?? {},
            ) as any[]) {
                if (attribute?.component) {
                    gather([attribute.component]);
                }
                gather(attribute?.references ?? []);
                gather(attribute?.children ?? []);
            }
            gather(component.children ?? []);
        }
    }
    gather(serializedComponents);

    if (variantControls.size === 0) {
        return [];
    }

    // The attributes a `<variantControl>` declares for itself, not those
    // every component has (`name`, `hide`), which aren't its settings.
    const variantControlClass: any =
        componentInfoObjects.allComponentClasses.variantControl;
    const inherited = new Set(
        Object.keys(
            Object.getPrototypeOf(variantControlClass).createAttributesObject(),
        ),
    );
    const attributeNames = Object.keys(
        variantControlClass.createAttributesObject(),
    ).filter((name) => !inherited.has(name));

    const diagnostics: DiagnosticRecord[] = [];
    for (const copy of references) {
        const [sourceKey, ref] = Object.entries(copy.extending as any)[0] as [
            string,
            any,
        ];
        if (!variantControls.has(ref?.nodeIdx)) {
            continue;
        }
        const property = ref.unresolvedPath?.[0]?.name;
        if (sourceKey !== "Ref" && !(ref.unresolvedPath?.length > 0)) {
            // a tag made from the `<variantControl>` itself: a
            // `<variantControl>` is `doenet-e0088`, another tag a type
            // change (REF-5)
            continue;
        }
        const isAttribute =
            typeof property === "string" && attributeNames.includes(property);
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0199",
                args: {
                    reference: doenetMLReferenceAsWritten(
                        ref.originalPath,
                        sources,
                    ),
                    property: isAttribute ? property : "",
                    isAttribute: isAttribute ? "true" : "false",
                },
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
