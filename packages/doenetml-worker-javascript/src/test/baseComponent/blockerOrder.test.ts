import { describe, expect, it } from "vitest";
import {
    BlockerOrder,
    type BlockerLedger,
    type BlockerNode,
} from "../../core/dependencies/blockerOrder";

/**
 * A blocker ledger with just enough of `DependencyHandler.addBlocker` and
 * `deleteFromNeededToResolve` to drive a `BlockerOrder`: an edge is recorded in
 * both directions and then fitted, as `addBlocker` does.
 */
function makeLedger() {
    const ledgers = {
        neededToResolve: new Map() as BlockerLedger,
        resolveBlockedBy: new Map() as BlockerLedger,
    };
    const order = new BlockerOrder(ledgers);

    function record(ledger: BlockerLedger, from: BlockerNode, to: BlockerNode) {
        let forType = ledger.get(from.type);
        if (!forType) {
            forType = new Map();
            ledger.set(from.type, forType);
        }
        let entry = forType.get(from.code);
        if (!entry) {
            entry = {};
            forType.set(from.code, entry);
        }
        (entry[to.type] ??= []).push(to.code);
    }

    function unrecord(
        ledger: BlockerLedger,
        from: BlockerNode,
        to: BlockerNode,
    ) {
        const forType = ledger.get(from.type)!;
        const entry = forType.get(from.code)!;
        const codes = entry[to.type];
        codes.splice(codes.indexOf(to.code), 1);
        if (codes.length === 0) {
            delete entry[to.type];
        }
        if (Object.keys(entry).length === 0) {
            forType.delete(from.code);
        }
    }

    return {
        ledgers,
        order,
        add(blocked: BlockerNode, blocker: BlockerNode) {
            record(ledgers.neededToResolve, blocked, blocker);
            record(ledgers.resolveBlockedBy, blocker, blocked);
            return order.addBlocker(blocked, blocker);
        },
        remove(blocked: BlockerNode, blocker: BlockerNode) {
            unrecord(ledgers.neededToResolve, blocked, blocker);
            unrecord(ledgers.resolveBlockedBy, blocker, blocked);
        },
    };
}

const sv = (code: string): BlockerNode => ({ type: "stateVariable", code });

/** Every blocked item sits before each of its blockers. */
function expectOrderValid(order: BlockerOrder, neededToResolve: BlockerLedger) {
    for (const [type, entries] of neededToResolve) {
        for (const [code, blockers] of entries) {
            for (const blockerType in blockers) {
                for (const blockerCode of blockers[blockerType]) {
                    expect(
                        order._peek(type, code)!,
                        `${type}:${code} before ${blockerType}:${blockerCode}`,
                    ).toBeLessThan(order._peek(blockerType, blockerCode)!);
                }
            }
        }
    }
}

describe("BlockerOrder", () => {
    it("accepts blockers that fit the order without searching", () => {
        const { add, order, ledgers } = makeLedger();
        // each new item goes at the end, after what it blocks
        expect(add(sv("1|a"), sv("2|a"))).toBeNull();
        expect(add(sv("2|a"), sv("3|a"))).toBeNull();
        expect(add(sv("1|a"), sv("3|a"))).toBeNull();
        expect(order.size).eq(3);
        expectOrderValid(order, ledgers.neededToResolve);
    });

    it("reorders when a blocker goes against the order", () => {
        const { add, order, ledgers } = makeLedger();
        add(sv("1|a"), sv("2|a"));
        add(sv("3|a"), sv("4|a"));
        // 4 is after 1 in the order, but now 4 waits on 1
        expect(add(sv("4|a"), sv("1|a"))).toBeNull();
        expectOrderValid(order, ledgers.neededToResolve);
    });

    it("reports a blocker that closes a cycle, from the blocked item along the cycle", () => {
        const { add } = makeLedger();
        add(sv("1|a"), sv("2|a"));
        add(sv("2|a"), sv("3|a"));
        expect(add(sv("3|a"), sv("1|a"))).toEqual([
            sv("3|a"),
            sv("1|a"),
            sv("2|a"),
        ]);
    });

    it("reports an item blocking itself", () => {
        const { add } = makeLedger();
        expect(add(sv("1|a"), sv("1|a"))).toEqual([sv("1|a")]);
    });

    it("tells types apart", () => {
        const { add } = makeLedger();
        add(sv("1"), { type: "expandComposite", code: "1" });
        expect(add({ type: "expandComposite", code: "1" }, sv("2"))).toBeNull();
        expect(add(sv("2"), sv("1"))).not.toBeNull();
    });

    it("rebuilds an order for the blockers still in the ledger", () => {
        const { add, remove, order, ledgers } = makeLedger();
        add(sv("1|a"), sv("2|a"));
        add(sv("2|a"), sv("3|a"));
        add(sv("4|a"), sv("5|a"));
        remove(sv("4|a"), sv("5|a"));
        order.rebuild();
        expect(order.size).eq(3);
        expectOrderValid(order, ledgers.neededToResolve);
        // and keeps working afterwards
        expect(add(sv("3|a"), sv("6|a"))).toBeNull();
        expect(add(sv("6|a"), sv("1|a"))).not.toBeNull();
    });

    // Against a plain reachability search: a new blocker closes a cycle
    // exactly when the blocker already waits, directly or not, on the blocked
    // item. Edges are added and removed at random, and the order must stay
    // valid for every edge left in the ledger.
    it("agrees with a brute-force search over random blockers", () => {
        let seed = 12345;
        const random = () => {
            seed = (seed * 1103515245 + 12345) % 2 ** 31;
            return seed / 2 ** 31;
        };
        const reaches = (
            ledger: BlockerLedger,
            from: string,
            to: string,
        ): boolean => {
            const seen = new Set<string>();
            const stack = [from];
            while (stack.length > 0) {
                const code = stack.pop()!;
                if (code === to) {
                    return true;
                }
                if (seen.has(code)) {
                    continue;
                }
                seen.add(code);
                const blockers = ledger.get("stateVariable")?.get(code);
                stack.push(...(blockers?.stateVariable ?? []));
            }
            return false;
        };

        for (let trial = 0; trial < 20; trial++) {
            const { add, remove, order, ledgers } = makeLedger();
            const edges: [string, string][] = [];
            const numItems = 5 + Math.floor(random() * 30);
            for (let step = 0; step < 300; step++) {
                if (edges.length > 0 && random() < 0.3) {
                    const [blocked, blocker] = edges.splice(
                        Math.floor(random() * edges.length),
                        1,
                    )[0];
                    remove(sv(blocked), sv(blocker));
                } else {
                    const blocked = String(Math.floor(random() * numItems));
                    const blocker = String(Math.floor(random() * numItems));
                    if (
                        edges.some(([a, b]) => a === blocked && b === blocker)
                    ) {
                        continue;
                    }
                    const closesCycle =
                        blocked === blocker ||
                        reaches(ledgers.neededToResolve, blocker, blocked);
                    const cycle = add(sv(blocked), sv(blocker));
                    expect(cycle !== null).toBe(closesCycle);
                    if (cycle) {
                        // A cycle ends the document, so the order is not
                        // used again; take the edge back out to go on.
                        remove(sv(blocked), sv(blocker));
                        order.rebuild();
                        continue;
                    }
                    edges.push([blocked, blocker]);
                }
                expectOrderValid(order, ledgers.neededToResolve);
            }
        }
    });
});
