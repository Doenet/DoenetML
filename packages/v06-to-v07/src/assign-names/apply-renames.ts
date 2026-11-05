import {
    DastElement,
    DastMacro,
    DastMacroPathPart,
    DastRoot,
    isDastElement,
    toXml,
} from "@doenet/parser";
import { VFile } from "vfile";
import { visitAll, visitAllMacros } from "./visit-all";
import { RenameRegistry } from "./rename-registry";
import { AssignNamesContext, namespaceChainOf } from "./context";
import { reparseAttribute } from "../reparse-attribute";
import { isPropAccess, restoreRawPropPositions } from "./prop-access-parts";

/**
 * Attributes whose value is a bare (dollar-less) reference at the point where renames are
 * applied. `slash-to-dot.ts` deliberately writes `<copy source="...">` back as plain text
 * so that `upgradeCopySyntax` can parse it later, so these are not macros and would be
 * missed by a macro-only pass.
 *
 * `<collect>` is deliberately absent: `upgradeCollectElement` has already turned its
 * `source`/`target` into a `from` holding a real macro, which the macro pass above
 * rewrites.
 */
const RAW_REFERENCE_ATTRS: Record<string, string[]> = {
    copy: ["source"],
    extract: ["source"],
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
    context: AssignNamesContext,
) {
    if (registry.size === 0) {
        return;
    }

    visitAllMacros(tree, (node, parents, attributeOwner) => {
        node.path = renamePath(
            node.path,
            registry,
            file,
            node.position,
            namespaceChainOf(parents, context),
            // A reference written on an element cannot mean the name that element is
            // about to take: `<copy source="$x0" assignNames="x0">` reaches elsewhere
            // for the thing it copies. References among its *children* are a different
            // matter and keep their ownership clear, so `visitAll` reports none for them.
            attributeOwner,
        );
    });

    visitAll(tree, (node, parents) => {
        if (!isDastElement(node)) {
            return;
        }
        const attrNames = RAW_REFERENCE_ATTRS[node.name.toLowerCase()];
        if (!attrNames) {
            return;
        }
        const enclosing = namespaceChainOf(parents, context);
        for (const attrName of attrNames) {
            renameRawReferenceAttribute(
                node,
                attrName,
                registry,
                file,
                enclosing,
            );
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
    enclosingNames: string[],
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
    // The split has to break on everything that can separate names, including the `$` and
    // brackets of a reference written inside an index (`g.list[$a]`).
    if (
        !value
            .split(/[^A-Za-z0-9_-]+/)
            .some((piece) => registry.hasReplacement(piece))
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

    // Parsing the text back cannot tell a prop from a namespace segment — both are
    // spelled with a `.` by now — so put back the marks recorded before the value was
    // serialized.
    restoreRawPropPositions(node, attrName, path);

    // The path can hold references of its own inside its indices (`g.list[$a]`), so walk
    // it the same way the rest of the document is walked rather than only rewriting the
    // top level.
    const asMacro: DastMacro = { type: "macro", path, attributes: {} };
    visitAllMacros(asMacro, (macro) => {
        macro.path = renamePath(
            macro.path,
            registry,
            file,
            node.position,
            enclosingNames,
            // A copy's `source` says what it copies, which is never the copy itself:
            // `<copy source="../x0" assignNames="x0">` names its result `x0` while
            // reaching out of the namespace for the `x0` it copies.
            node,
        );
    });
    child.value = toXml(asMacro.path);
}

/**
 * Replace any path part that names a v0.6 assigned name with the indexed path registered
 * for it, keeping indices the author already wrote: with `a -> s[1]`, the path `a[2]`
 * becomes `s[1][2]` rather than `s[1]`.
 *
 * Every matching part is rewritten, not just the leading one, because a v0.6 namespace
 * segment names a component and so can be an assigned name: `$(g/a)` arrives here as the
 * path `g.a`, and the `a` is the one that has to become `a[1]`. A part the author wrote
 * after a `.` was a *prop* access in v0.6 — dot notation reached public state variables
 * and nothing else — so it can never name a component that `assignNames` created, and it
 * is left alone. Rewriting one would turn `$p.y`, the point's y-coordinate, into
 * `$p.x[2]` whenever `x` and `y` happened to be assigned somewhere else in the document.
 */
function renamePath(
    path: DastMacroPathPart[],
    registry: RenameRegistry,
    file: VFile,
    place?: DastElement["position"],
    /** The namespaces the reference itself sits inside, outermost first. */
    enclosingNames: string[] = [],
    /** The element the reference is written on; see `RenameOrigin.element`. */
    writtenOn?: DastElement,
): DastMacroPathPart[] {
    if (!path.some((part) => registry.hasReplacement(part.name))) {
        return path;
    }
    return path.flatMap((part, partIndex): DastMacroPathPart[] => {
        // The parts before this one say which namespace the reference is reaching into,
        // which is how a name assigned in more than one of them is told apart.
        // Where the reference is written, followed by the namespaces it names on its
        // way in: a `$a` inside `g2` means g2's `a`, and so does `$(g2/a)` from outside.
        const target = registry.get(
            part.name,
            [...enclosingNames, ...path.slice(0, partIndex).map((p) => p.name)],
            writtenOn,
        );
        if (!target?.replacement) {
            return [part];
        }
        if (partIndex > 0 && isPropAccess(part)) {
            // Written after a `.`, so v0.6 read it as a prop of the part before it,
            // whatever else happens to carry the name.
            return [part];
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
