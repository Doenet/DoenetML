import { Plugin } from "unified";
import { DastElement, DastRoot, isDastElement } from "@doenet/parser";
import { VFile } from "vfile";
import { breakStringInPiecesBySpacesOrParens } from "./assign-names/break-into-pieces";
import {
    findAttribute,
    lookupComposite,
    makePositionMap,
    producesSingleReplacement,
} from "./assign-names/composite-info";
import {
    AssignNamesContext,
    deleteAssignNames,
    readAssignNames,
    setCompositeName,
} from "./assign-names/context";
import { isValidReferenceableName } from "./assign-names/rename-registry";
import { registerCompositeAssignNames } from "./assign-names/register-composite";
import { visitAll } from "./assign-names/visit-all";

/**
 * Convert `assignNames` on the composites that v0.7 addresses positionally.
 *
 * v0.6 distributed the names in `assignNames` over a composite's replacements, with
 * parentheses descending a level (see `processAssignNames` in v0.6's
 * `serializedStateProcessing.js`). v0.7 has no such attribute; the same replacements are
 * addressed with indices, and `<option>`/`<case>` are transparent wrappers that flatten
 * into a group. So a name at nested position `(p1 ... pk)` becomes
 * `$<compositeName>[p1]...[pk]`:
 *
 * ```xml
 *   <selectFromSequence assignNames="a b" numToSelect="2" />  $a $b
 *   <select assignNames="(deriv)"><option><math>x</math></option>...</select>  $deriv
 *   <conditionalContent assignNames="(a b)"><case ...><text/><text/></case>...  $a $b
 * ```
 * become
 * ```xml
 *   <selectFromSequence name="a" numToSelect="2" />  $a[1] $a[2]
 *   <select name="deriv"><option><math>x</math></option>...</select>  $deriv[1][1]
 *   <conditionalContent name="a"><case ...><text/><text/></case>...  $a[1][1] $a[1][2]
 * ```
 *
 * The renames are only *registered* here; `applyAssignNameRenames` rewrites the references
 * once every contributing plugin has had its turn.
 */
export const upgradeAssignNames: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return (tree, file) => {
        visitAll(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            const spec = lookupComposite(node);
            if (!spec) {
                return;
            }
            const assignNamesValue = readAssignNames(node);
            if (assignNamesValue === undefined) {
                return;
            }

            if (spec.noV07Equivalent) {
                file.message(
                    `<${node.name}> has no v0.7 equivalent and must be rewritten by hand; its references were converted as if it behaved like a v0.6 composite.`,
                    {
                        place: node.position,
                        ruleId: `no-v07-equivalent/${spec.name.toLowerCase()}`,
                        source: "v06-to-v07",
                    },
                );
            }

            if (!assignNamesValue) {
                // An empty `assignNames`; just drop it.
                deleteAssignNames(node);
                return;
            }

            const parsed =
                breakStringInPiecesBySpacesOrParens(assignNamesValue);

            if (parsed.success && parsed.pieces.length === 0) {
                // A value such as `assignNames="()"` names nothing at all, so there is
                // nothing to convert and no reason to invent a name for the composite.
                deleteAssignNames(node);
                return;
            }

            // Fast path: a single name on a composite with a single replacement can just
            // become that composite's `name`, because a bare `$name` auto-flattens to the
            // one replacement. This covers most `assignNames` in practice and rewrites
            // no references at all.
            const onlyPiece =
                parsed.success &&
                parsed.pieces.length === 1 &&
                typeof parsed.pieces[0] === "string"
                    ? parsed.pieces[0]
                    : undefined;
            if (
                onlyPiece !== undefined &&
                isValidReferenceableName(onlyPiece) &&
                !findAttribute(node, "name") &&
                !context.existingNames.has(onlyPiece) &&
                !context.claimedNames.has(onlyPiece) &&
                producesSingleReplacement(node, spec)
            ) {
                context.claimedNames.add(onlyPiece);
                // Claim the name in the registry too, without a replacement: references
                // to it already resolve, but a later composite assigning the same name
                // must be told it cannot have it rather than silently redirecting them.
                context.registry.register(
                    onlyPiece,
                    undefined,
                    { elementName: node.name, position: node.position },
                    file,
                );
                warnIfSelfReferential(node, onlyPiece, file);
                setCompositeName(node, onlyPiece);
                return;
            }

            const compositeName = registerCompositeAssignNames({
                node,
                assignNamesValue,
                fallbackBase: spec.name,
                context,
                file,
                positionMap: makePositionMap(node, spec, file),
            });
            if (compositeName === undefined) {
                deleteAssignNames(node);
                return;
            }
            warnIfSelfReferential(node, compositeName, file);
            setCompositeName(node, compositeName);
        });
    };
};

/**
 * Warn when one of a composite's own attributes refers to the name it is about to take.
 *
 * v0.6 documents sometimes contain these (`<selectFromSequence assignNames="a"
 * exclude="$a" />`), where the reference resolved to nothing. Once the name is on the
 * element itself, the same markup is a genuine circular reference and the document will
 * not load, so it is worth pointing at.
 */
function warnIfSelfReferential(
    node: DastElement,
    compositeName: string,
    file: VFile,
) {
    const referencesSelf = Object.values(node.attributes).some((attr) =>
        attr.children.some(
            (child) =>
                (child.type === "macro" || child.type === "function") &&
                child.path[0]?.name === compositeName,
        ),
    );
    if (!referencesSelf) {
        return;
    }
    file.message(
        `<${node.name}> is being named "${compositeName}", but one of its own attributes already refers to $${compositeName}. That reference resolved to nothing in v0.6; in v0.7 it is a circular reference and the document will not load.`,
        {
            place: node.position,
            ruleId: "assign-names/self-reference",
            source: "v06-to-v07",
        },
    );
}
