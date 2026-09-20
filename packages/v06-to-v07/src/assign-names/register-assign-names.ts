import { VFile } from "vfile";
import {
    NamePieces,
    breakStringInPiecesBySpacesOrParens,
} from "./break-into-pieces";
import {
    RenameOrigin,
    RenameRegistry,
    isValidReferenceableName,
    makeIndexedPathPart,
} from "./rename-registry";

/**
 * Translates a v0.6 nesting position into the v0.7 positional index.
 *
 * v0.6 skipped primitive (bare string) replacements when handing out `assignNames`,
 * whereas v0.7's `[i]` counts every replacement including text. When they differ, the
 * caller supplies a map. `depth` is 1-based (1 is the composite's own replacements).
 */
/**
 * Maps an ordinal to the v0.7 index at that depth, or `undefined` when v0.6's ordinal
 * named nothing there — see `makePositionMap`.
 */
export type PositionMap = (
    depth: number,
    ordinal: number,
) => number | undefined;

const identityPositionMap: PositionMap = (_depth, ordinal) => ordinal;

export type RegisterAssignNamesArgs = {
    /** The raw `assignNames` attribute value. */
    assignNamesValue: string;
    /** The v0.7 `name` the composite will carry. */
    compositeName: string;
    registry: RenameRegistry;
    origin: RenameOrigin;
    file: VFile;
    positionMap?: PositionMap;
};

/**
 * Register every name in a v0.6 `assignNames` value against the v0.7 indexed path that
 * replaces it.
 *
 * A leaf name at nested position `(p1 … pk)` becomes `$<compositeName>[p1]…[pk]`, which is
 * how v0.7 addresses the replacement that v0.6 would have given that name. See the
 * conversion notes in `upgrade-assign-names.ts` for why this single rule covers every
 * composite.
 *
 * Returns `false` (having registered nothing and emitted a message) if the value has
 * unbalanced parentheses.
 */
export function registerAssignNames({
    assignNamesValue,
    compositeName,
    registry,
    origin,
    file,
    positionMap = identityPositionMap,
}: RegisterAssignNamesArgs): boolean {
    const result = breakStringInPiecesBySpacesOrParens(assignNamesValue);
    if (!result.success) {
        file.message(
            `Could not parse assignNames="${assignNamesValue}" on <${origin.elementName}> because its parentheses are unbalanced; references to those names were not converted.`,
            {
                place: origin.position,
                ruleId: "assign-names/unbalanced-parens",
                source: "v06-to-v07",
            },
        );
        return false;
    }

    registerPieces(result.pieces, []);
    return true;

    function registerPieces(pieces: NamePieces, indexPath: number[]) {
        pieces.forEach((piece, i) => {
            const depth = indexPath.length + 1;
            const position = positionMap(depth, i + 1);
            if (position === undefined) {
                // v0.6 handed this ordinal no replacement, so every name under it named
                // nothing. Registering them anyway would point their references at a
                // replacement that belongs to a different name.
                reportNamesNothing(piece);
                return;
            }
            const indices = [...indexPath, position];
            if (typeof piece === "string") {
                if (!isValidReferenceableName(piece)) {
                    file.message(
                        `The assignNames token "${piece}" on <${origin.elementName}> is not a valid v0.7 name, so references to it were not converted.`,
                        {
                            place: origin.position,
                            ruleId: "assign-names/invalid-name",
                            source: "v06-to-v07",
                        },
                    );
                    return;
                }
                registry.register(
                    piece,
                    [makeIndexedPathPart(compositeName, indices)],
                    origin,
                    file,
                );
            } else {
                registerPieces(piece, indices);
            }
        });
    }

    /** Report every name under a piece that v0.6 gave no replacement to. */
    function reportNamesNothing(piece: NamePieces[number]) {
        if (typeof piece !== "string") {
            piece.forEach(reportNamesNothing);
            return;
        }
        file.message(
            `The assignNames token "${piece}" on <${origin.elementName}> named nothing in v0.6 — the position it was given holds no component — so references to it were not converted.`,
            {
                place: origin.position,
                ruleId: "assign-names/names-nothing",
                source: "v06-to-v07",
            },
        );
    }
}
