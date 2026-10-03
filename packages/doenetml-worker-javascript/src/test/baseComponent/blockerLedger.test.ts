import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The resolve-blocker ledger, driven directly. Each blocker is filed twice,
 * under the item it blocks (`neededToResolve`) and under the blocker itself
 * (`resolveBlockedBy`), and every way of removing one has to take it out of
 * both. The items are those a reference dependency registers: its
 * `recalculateDownstreamComponents` step for dependency `d` of variable `v`
 * of component 900 waits on the identity of components 901 and 902. Neither
 * type touches a component, so the ledger is all that changes, and indices
 * this high do not exist in the one-number document.
 */
describe("Blocker ledger", () => {
    const blocked = {
        componentIdx: 900,
        type: "recalculateDownstreamComponents",
        stateVariable: "v",
        dependency: "d",
    };
    const blockedArgs = {
        componentIdxBlocked: 900,
        typeBlocked: "recalculateDownstreamComponents",
        stateVariableBlocked: "v",
        dependencyBlocked: "d",
    };
    const blocker = (componentIdx: number) => ({
        componentIdx,
        type: "componentIdentity",
    });

    async function ledgerWithTwoBlockers() {
        const { core } = await createTestCore({
            doenetML: `<number name="n">1</number>`,
        });
        const dependencies = core.core.dependencies;
        for (const blockerComponentIdx of [901, 902]) {
            await dependencies.addBlocker({
                blockerComponentIdx,
                blockerType: "componentIdentity",
                ...blockedArgs,
            });
        }
        return dependencies;
    }

    it("files a blocker under both items, once", async () => {
        const dependencies = await ledgerWithTwoBlockers();
        // a second registration of the same blocker adds nothing
        await dependencies.addBlocker({
            blockerComponentIdx: 901,
            blockerType: "componentIdentity",
            ...blockedArgs,
        });

        expect(dependencies.peekNeededToResolve(blocked)).toEqual({
            componentIdentity: ["901", "902"],
        });
        expect(dependencies.peekResolveBlockedBy(blocker(901))).toEqual({
            recalculateDownstreamComponents: ["900|v|d"],
        });
        expect(dependencies.peekResolveBlockedBy(blocker(902))).toEqual({
            recalculateDownstreamComponents: ["900|v|d"],
        });
        expect(dependencies.checkIfHaveNeededToResolve(blocked)).eq(true);

        // An index read back out of a code is a string; it names the same
        // item as the number.
        expect(
            dependencies.peekNeededToResolve({
                ...blocked,
                componentIdx: "900",
            }),
        ).toEqual({ componentIdentity: ["901", "902"] });
    });

    it("removing one blocker takes it out of both sides", async () => {
        const dependencies = await ledgerWithTwoBlockers();
        dependencies.deleteFromNeededToResolve({
            ...blockedArgs,
            blockerType: "componentIdentity",
            blockerCode: "901",
        });
        expect(dependencies.peekNeededToResolve(blocked)).toEqual({
            componentIdentity: ["902"],
        });
        expect(dependencies.peekResolveBlockedBy(blocker(901))).toEqual({});
        expect(dependencies.peekResolveBlockedBy(blocker(902))).toEqual({
            recalculateDownstreamComponents: ["900|v|d"],
        });

        // The last one leaves no entry behind on either side.
        dependencies.deleteFromNeededToResolve({
            ...blockedArgs,
            blockerType: "componentIdentity",
            blockerCode: "902",
        });
        expect(dependencies.checkIfHaveNeededToResolve(blocked)).eq(false);
        const { neededToResolve, resolveBlockedBy } =
            dependencies.resolveBlockers;
        expect(
            neededToResolve
                .get("recalculateDownstreamComponents")
                ?.has("900|v|d"),
        ).eq(false);
        expect(resolveBlockedBy.get("componentIdentity")?.size).eq(0);
    });

    it("removing a blocker type takes every blocker of that type", async () => {
        const dependencies = await ledgerWithTwoBlockers();
        dependencies.deleteFromNeededToResolve({
            ...blockedArgs,
            blockerType: "componentIdentity",
        });
        expect(dependencies.checkIfHaveNeededToResolve(blocked)).eq(false);
        expect(dependencies.peekResolveBlockedBy(blocker(901))).toEqual({});
        expect(dependencies.peekResolveBlockedBy(blocker(902))).toEqual({});
    });

    it("removing the blocked item clears it from its blockers", async () => {
        const dependencies = await ledgerWithTwoBlockers();
        dependencies.deleteFromNeededToResolve(blockedArgs);
        expect(dependencies.peekNeededToResolve(blocked)).toEqual({});
        expect(dependencies.peekResolveBlockedBy(blocker(901))).toEqual({});
        expect(dependencies.peekResolveBlockedBy(blocker(902))).toEqual({});
    });

    it("removing from the blocker's side takes it out of both sides", async () => {
        const dependencies = await ledgerWithTwoBlockers();
        dependencies.deleteFromResolveBlockedBy({
            blockerComponentIdx: 901,
            blockerType: "componentIdentity",
            typeBlocked: "recalculateDownstreamComponents",
            codeBlocked: "900|v|d",
        });
        expect(dependencies.peekNeededToResolve(blocked)).toEqual({
            componentIdentity: ["902"],
        });
        expect(dependencies.peekResolveBlockedBy(blocker(901))).toEqual({});

        // and with no item named, everything that blocker blocks
        dependencies.deleteFromResolveBlockedBy({
            blockerComponentIdx: 902,
            blockerType: "componentIdentity",
        });
        expect(dependencies.checkIfHaveNeededToResolve(blocked)).eq(false);
        expect(dependencies.peekResolveBlockedBy(blocker(902))).toEqual({});
    });

    it("removing a blocked type from the blocker's side takes every item of that type", async () => {
        const dependencies = await ledgerWithTwoBlockers();
        // 901 also blocks a second item of the same type
        const otherBlocked = { ...blocked, dependency: "e" };
        await dependencies.addBlocker({
            blockerComponentIdx: 901,
            blockerType: "componentIdentity",
            ...blockedArgs,
            dependencyBlocked: "e",
        });
        expect(dependencies.peekResolveBlockedBy(blocker(901))).toEqual({
            recalculateDownstreamComponents: ["900|v|d", "900|v|e"],
        });

        dependencies.deleteFromResolveBlockedBy({
            blockerComponentIdx: 901,
            blockerType: "componentIdentity",
            typeBlocked: "recalculateDownstreamComponents",
        });
        expect(dependencies.peekResolveBlockedBy(blocker(901))).toEqual({});
        expect(dependencies.peekNeededToResolve(blocked)).toEqual({
            componentIdentity: ["902"],
        });
        expect(dependencies.checkIfHaveNeededToResolve(otherBlocked)).eq(false);
    });

    // A composite waiting to expand is an item with no state variable, and
    // its blocker records it by its bare index, a number. Resolving the
    // blocker hands that number back to remove it, as `processNewlyResolved`
    // does, and both sides must still match it.
    it("an item with no state variable is filed under its index", async () => {
        const { core } = await createTestCore({
            doenetML: `<number name="n">1</number>`,
        });
        const dependencies = core.core.dependencies;
        const readyToExpand = {
            componentIdx: 901,
            type: "stateVariable",
            stateVariable: "readyToExpandWhenResolved",
        };
        await dependencies.addBlocker({
            blockerComponentIdx: 901,
            blockerType: "stateVariable",
            blockerStateVariable: "readyToExpandWhenResolved",
            componentIdxBlocked: 900,
            typeBlocked: "expandComposite",
        });
        expect(
            dependencies.peekNeededToResolve({
                componentIdx: 900,
                type: "expandComposite",
            }),
        ).toEqual({ stateVariable: ["901|readyToExpandWhenResolved"] });
        expect(dependencies.peekResolveBlockedBy(readyToExpand)).toEqual({
            expandComposite: [900],
        });

        dependencies.deleteFromResolveBlockedBy({
            blockerComponentIdx: 901,
            blockerType: "stateVariable",
            blockerStateVariable: "readyToExpandWhenResolved",
            typeBlocked: "expandComposite",
            codeBlocked: 900,
        });
        expect(
            dependencies.checkIfHaveNeededToResolve({
                componentIdx: 900,
                type: "expandComposite",
            }),
        ).eq(false);
        expect(dependencies.peekResolveBlockedBy(readyToExpand)).toEqual({});
    });

    // From the blocked item's side the item is named by its code, a string,
    // while its blocker still holds the number. The blocker order follows
    // both sides, so a removal must not leave the number behind.
    it("an item with no state variable leaves both sides when removed by its code", async () => {
        const { core } = await createTestCore({
            doenetML: `<number name="n">1</number>`,
        });
        const dependencies = core.core.dependencies;
        const expand = (componentIdx: number) => ({
            componentIdx,
            type: "expandComposite",
        });
        await dependencies.addBlocker({
            blockerComponentIdx: 901,
            blockerType: "expandComposite",
            componentIdxBlocked: 900,
            typeBlocked: "expandComposite",
        });
        expect(dependencies.peekResolveBlockedBy(expand(901))).toEqual({
            expandComposite: [900],
        });

        dependencies.deleteFromNeededToResolve({
            componentIdxBlocked: 900,
            typeBlocked: "expandComposite",
            blockerType: "expandComposite",
            blockerCode: "901",
        });
        expect(dependencies.checkIfHaveNeededToResolve(expand(900))).eq(false);
        expect(dependencies.peekResolveBlockedBy(expand(901))).toEqual({});
    });
});

/**
 * A dependency value carries the source position of each component it read
 * from, for warnings that point at the component. Every read reports the
 * same frozen copy rather than a fresh one.
 */
describe("Position in a dependency value", () => {
    it("is a frozen copy of the component's position, shared by every read", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="p"><number name="n">1</number></p>`,
        });
        const dependencies = core.core.dependencies;
        const nIdx = await resolvePathToNodeIdx("n");
        const n = core.core._components[nIdx];

        // any dependency that reads from the number
        const dep = Object.values(dependencies.downstreamDependencies)
            .flatMap((byVariable: any) => Object.values(byVariable))
            .flatMap((byName: any) => Object.values(byName))
            .find((d: any) => d.downstreamComponentIndices.includes(nIdx));
        expect(dep).toBeDefined();

        async function positionRead() {
            const { value } = await dep.getValue({
                verbose: true,
                consumeChanges: false,
            });
            return value.find((obj: any) => obj.componentIdx === nIdx).position;
        }

        const position = await positionRead();
        expect(position).toEqual(n.position);
        expect(position).not.toBe(n.position);
        expect(Object.isFrozen(position)).eq(true);
        expect(Object.isFrozen(position.start)).eq(true);
        expect(Object.isFrozen(position.end)).eq(true);
        expect(await positionRead()).toBe(position);
    });
});
