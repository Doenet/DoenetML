import { describe, expect, it } from "vitest";
import { expandCompositeComponent } from "../../core/CompositeExpander";
import type Core from "../../Core";

/**
 * A composite whose expansion throws `error`, in a core holding only it.
 */
function compositeWhoseExpansionThrows(error: Error) {
    const component: any = {
        componentIdx: 0,
        componentType: "group",
        state: { readyToExpandWhenResolved: { isResolved: true } },
        replacementsWorkspace: {},
        constructor: {
            async createSerializedReplacements() {
                throw error;
            },
        },
    };
    const core = {
        _components: [component],
        updateInfo: {
            compositesToExpand: new Set(),
            compositesBeingExpanded: [] as number[],
        },
        componentInfoObjects: {},
        allDoenetMLs: [],
        flags: {},
        dependencies: { resolveItem: async () => ({}) },
        publicCaseInsensitiveAliasSubstitutions: () => [],
    } as unknown as Core;
    return { core, component };
}

describe("expandCompositeComponent @group1", () => {
    it("a composite whose expansion throws is no longer marked as being expanded (#2554 item 4)", async () => {
        const { core, component } = compositeWhoseExpansionThrows(
            Error("expansion failed"),
        );

        await expect(
            expandCompositeComponent({ core, component }),
        ).rejects.toThrow("expansion failed");
        expect(core.updateInfo.compositesBeingExpanded).eqls([]);

        // So expanding it again is not taken for a cycle: it fails as it did.
        await expect(
            expandCompositeComponent({ core, component }),
        ).rejects.toThrow("expansion failed");
        expect(core.updateInfo.compositesBeingExpanded).eqls([]);
    });
});
