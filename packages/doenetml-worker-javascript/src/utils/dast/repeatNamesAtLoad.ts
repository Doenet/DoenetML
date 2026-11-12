/**
 * The warning of a `<repeat>` or `<repeatForSequence>` whose `valueName` and
 * `indexName` are the same name (`doenet-w0189`, #2175), decided when the
 * document loads from what is written, wherever the repeat is.
 *
 * The repeat makes a value and an index of that one name in each iteration,
 * so a reference to the name finds both, and reports only that it found
 * several referents. This says why, at the repeat. What the reference reads
 * is left as it is.
 *
 * Only names written as literals are read; a name is compared as written,
 * without surrounding space.
 */
import type { SerializedComponent } from "./types";
import { codedDiagnostic } from "../diagnostics";
import { attributeOf, literalText } from "./choiceErrorsAtLoad";

const REPEAT_TYPES = new Set(["repeat", "repeatForSequence"]);

/**
 * The warning of each repeat among `serializedComponents` whose `valueName`
 * and `indexName` are the same name.
 */
export function checkRepeatNamesAtLoad({
    serializedComponents,
}: {
    serializedComponents: (SerializedComponent | string)[];
}) {
    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const seen = new Set<SerializedComponent>();

    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            if (REPEAT_TYPES.has(component.componentType)) {
                const name = sharedName(component);
                if (name !== undefined) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0189",
                            args: {
                                componentType: component.componentType,
                                name,
                            },
                            position: component.position,
                            sourceDoc: component.sourceDoc,
                        }),
                    );
                }
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
    return diagnostics;
}

/** The name `repeat` gives both its value and its index, if any. */
function sharedName(repeat: SerializedComponent) {
    const valueAttribute = attributeOf(repeat, "valueName");
    const indexAttribute = attributeOf(repeat, "indexName");
    if (valueAttribute === undefined || indexAttribute === undefined) {
        return undefined;
    }
    const valueName = literalText(valueAttribute);
    const indexName = literalText(indexAttribute);
    return valueName && valueName === indexName ? valueName : undefined;
}
