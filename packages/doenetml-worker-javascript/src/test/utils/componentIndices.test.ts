import { describe, expect, it } from "vitest";
import { createNewComponentIndices } from "../../utils/componentIndices";
import { unwrapSource } from "../../utils/dast/convertNormalizedDast";
import type {
    SerializedComponent,
    SerializedRefResolutionPathPart,
} from "../../utils/dast/types";

function referenceWithPath(
    componentIdx: number,
    originalPath: SerializedRefResolutionPathPart[],
): SerializedComponent {
    return {
        type: "serialized",
        componentType: "_copy",
        componentIdx,
        children: [],
        attributes: {},
        state: {},
        doenetAttributes: {},
        extending: {
            Ref: {
                nodeIdx: 7,
                unresolvedPath: null,
                originalPath,
                nodesInResolvedPath: [componentIdx, 7],
            },
        },
    };
}

describe("createNewComponentIndices @group4", () => {
    // A reference with no referent — "No referent found", "Multiple
    // referents" — is given an empty path, and an empty path is the one that
    // never enters the loop that rebuilds it. The duplicate has to get a ref
    // resolution of its own regardless: the next thing to fix up a copy's
    // reference in place would otherwise be editing the original's.
    it("gives a duplicate its own ref resolution even when the path is empty", () => {
        const source = referenceWithPath(3, []);

        const { components } = createNewComponentIndices([source], 10);
        const duplicate = components[0] as SerializedComponent;

        expect(duplicate.extending).not.toBe(source.extending);
        expect(unwrapSource(duplicate.extending!)).not.toBe(
            unwrapSource(source.extending!),
        );
        expect(unwrapSource(duplicate.extending!).originalPath).eqls([]);
        expect(unwrapSource(duplicate.extending!).nodeIdx).eq(7);
    });

    // The same for a path that does have parts, which is what every resolvable
    // reference has.
    it("gives a duplicate its own ref resolution when the path has parts", () => {
        const source = referenceWithPath(3, [
            { name: "m", index: [] },
            { name: "x", index: [] },
        ]);

        const { components } = createNewComponentIndices([source], 10);
        const duplicate = components[0] as SerializedComponent;

        expect(duplicate.extending).not.toBe(source.extending);
        expect(unwrapSource(duplicate.extending!).originalPath).eqls([
            { name: "m", index: [] },
            { name: "x", index: [] },
        ]);
        expect(unwrapSource(source.extending!).originalPath).eqls([
            { name: "m", index: [] },
            { name: "x", index: [] },
        ]);
    });
});
