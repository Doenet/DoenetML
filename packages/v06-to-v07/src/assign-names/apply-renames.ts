import {
    DastElement,
    DastMacroPathPart,
    DastRoot,
    isDastElement,
    toXml,
} from "@doenet/parser";
import { VFile } from "vfile";
import { visitAll, visitAllMacros } from "./visit-all";
import { RenameRegistry } from "./rename-registry";
import { reparseAttribute } from "../reparse-attribute";
import { isPropAccess } from "./prop-access-parts";

/**
 * Attributes whose value is a bare (dollar-less) reference at the point where renames are
 * applied. `slash-to-dot.ts` deliberately writes `<copy source="...">` back as plain text
 * so that `upgradeCopySyntax` can parse it later, so these are not macros and would be
 * missed by a macro-only pass.
 */
const RAW_REFERENCE_ATTRS: Record<string, string[]> = {
    copy: ["source"],
    extract: ["source"],
    collect: ["source", "target"],
};

/**
 * Rewrite every reference to a v0.6 `assignNames` token into the v0.7 indexed path
 * registered for it.
 *
 * Unlike the per-plugin passes this replaces, it descends into attribute values, macro
 * path indices and function-macro arguments, and it preserves indices the author already
 * wrote (`$a[2]` becomes `$s[1][2]`, not `$s[1]`).
 */
export function applyRefRenames(
    tree: DastRoot,
    registry: RenameRegistry,
    file: VFile,
) {
    if (registry.size === 0) {
        return;
    }

    visitAllMacros(tree, (node) => {
        node.path = renamePath(node.path, registry, file, node.position);
    });

    visitAll(tree, (node) => {
        if (!isDastElement(node)) {
            return;
        }
        const attrNames = RAW_REFERENCE_ATTRS[node.name.toLowerCase()];
        if (!attrNames) {
            return;
        }
        for (const attrName of attrNames) {
            renameRawReferenceAttribute(node, attrName, registry, file);
        }
    });
}

/**
 * Rename inside an attribute whose value is a plain-text reference path, writing the
 * result back as plain text (again without a `$`) so downstream plugins still parse it.
 *
 * `slash-to-dot.ts` has already flattened any namespace slashes in this value into dots
 * and written it back as text, so the parts reparsed here carry no record of which
 * separator the author used. That is why `renamePath`'s prop-access warning never fires
 * for these attributes.
 */
function renameRawReferenceAttribute(
    node: DastElement,
    attrName: string,
    registry: RenameRegistry,
    file: VFile,
) {
    const attr = Object.entries(node.attributes).find(
        ([name]) => name.toLowerCase() === attrName.toLowerCase(),
    )?.[1];
    if (!attr || attr.children.length !== 1) {
        return;
    }
    const child = attr.children[0];
    if (child.type !== "text") {
        return;
    }
    const value = child.value.trim();
    if (!value) {
        return;
    }
    // A cheap pre-check so we don't reparse every `source` attribute in the document.
    if (
        !value.split(/[.[\]]/).some((piece) => registry.hasReplacement(piece))
    ) {
        return;
    }

    let path: DastMacroPathPart[];
    try {
        path = parseReferencePath(value);
    } catch (e) {
        file.message(
            `Could not convert a reference to an assignNames name in ${attrName}="${value}".`,
            {
                place: node.position,
                ruleId: "assign-names/unparsable-reference-attribute",
                source: "v06-to-v07",
            },
        );
        return;
    }

    child.value = toXml(renamePath(path, registry, file, node.position));
}

/**
 * Replace any path part that names a v0.6 assigned name with the indexed path registered
 * for it, keeping indices the author already wrote: with `a -> s[1]`, the path `a[2]`
 * becomes `s[1][2]` rather than `s[1]`.
 *
 * Every matching part is rewritten, not just the leading one, because a v0.6 namespace
 * segment names a component and so can be an assigned name: `$(g/a)` arrives here as the
 * path `g.a`, and the `a` is the one that has to become `a[1]`. A part the author wrote
 * after a `.` is a *prop* access and can never name an assigned component, so rewriting
 * one is a guess — it is still made, but it warns, since silently turning `$p.y` into
 * `$p.x[2]` (when `x` and `y` are assigned elsewhere) would be indistinguishable from
 * authored markup.
 */
function renamePath(
    path: DastMacroPathPart[],
    registry: RenameRegistry,
    file: VFile,
    place?: DastElement["position"],
): DastMacroPathPart[] {
    if (!path.some((part) => registry.hasReplacement(part.name))) {
        return path;
    }
    return path.flatMap((part, partIndex): DastMacroPathPart[] => {
        const target = registry.get(part.name);
        if (!target?.replacement) {
            return [part];
        }
        if (partIndex > 0 && isPropAccess(part)) {
            file.message(
                `"${part.name}" in the reference $${toXml(path)} was written as a prop of "${path[partIndex - 1].name}", but it is also a name assigned by <${target.origin.elementName}>, so it was converted to that composite's replacement. If it really was meant as a prop, change it back.`,
                {
                    place,
                    ruleId: "assign-names/prop-like-reference",
                    source: "v06-to-v07",
                },
            );
        }
        const replacement = structuredClone(
            target.replacement,
        ) as DastMacroPathPart[];
        const last = replacement[replacement.length - 1];
        last.index = [...last.index, ...part.index];
        return replacement;
    });
}

/**
 * Parse the value of a dollar-less reference attribute into a path.
 *
 * A hyphenated name can only be written inside `$(...)`: `$foo-bar` is a subtraction. The
 * bare form is tried first so that everything else parses exactly as it always has.
 */
export function parseReferencePath(value: string): DastMacroPathPart[] {
    for (const candidate of [`$${value}`, `$(${value})`]) {
        let reparsed;
        try {
            reparsed = reparseAttribute(candidate);
        } catch (e) {
            continue;
        }
        if (reparsed.length === 1 && reparsed[0].type === "macro") {
            return reparsed[0].path;
        }
    }
    throw new Error(`Could not parse "${value}" as a reference`);
}
