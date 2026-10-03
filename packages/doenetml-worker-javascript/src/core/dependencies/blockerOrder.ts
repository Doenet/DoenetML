/**
 * One direction of the blocker ledger. `neededToResolve` files each blocked
 * item under its type and its code (`blockerCodeFor`), with the items that
 * block it as `{ [blockerType]: blockerCodes }`; `resolveBlockedBy` files
 * each blocker the same way, with the items it blocks as
 * `{ [typeBlocked]: codesBlocked }`.
 */
export type BlockerLedger = Map<string, Map<string, Record<string, any[]>>>;

/** An item in the blocker graph: its type and its code. */
export type BlockerNode = { type: string; code: string };

/**
 * A topological order of the resolve-blocker graph, kept up to date as
 * blockers are added, which is how a blocker that closes a cycle is found.
 *
 * Every item that takes part in a blocker gets a position, and every blocked
 * item is placed before each item that blocks it. A new blocker that already
 * fits the order cannot close a cycle: following blockers only ever moves
 * forward in the order, so no chain of them leads back. A new item is placed
 * at the end, and a blocker is almost always new to the order or already
 * after what it blocks, so on the Phase 0 fixtures only 1% to 6% of new
 * blockers break the order (nearly all of them a new blocked item waiting on
 * an existing blocker).
 *
 * When one does (Pearce and Kelly, "A dynamic topological sort algorithm for
 * directed acyclic graphs", 2007), only the items whose positions lie between
 * the two ends of the new blocker can be out of place: a search forward from
 * the blocker and one backward from the blocked item, each bounded by the
 * other end's position, finds them. If the forward search reaches the blocked
 * item, the new blocker closes a cycle. Otherwise the items found are given
 * the same set of positions again, the backward ones first, which puts the
 * order right. Removing a blocker never breaks the order, so it costs
 * nothing.
 *
 * The order reads the edges from the ledger itself, so it assumes every edge
 * in the ledger has been added through `addBlocker`, in both directions,
 * before the next one is, and that a removed edge leaves both directions. A
 * `resolveBlockedBy` entry left without its `neededToResolve` counterpart
 * would pull items into the backward search that do not belong there, and
 * the reassigned positions could then tie or go out of order. A cycle ends
 * the document (`CircularDependencyError`), so the order is never needed
 * again after `addBlocker` reports one.
 */
export class BlockerOrder {
    _positions = new Map<string, Map<string, number>>();
    _nextPosition = 0;

    constructor(
        public ledgers: {
            neededToResolve: BlockerLedger;
            resolveBlockedBy: BlockerLedger;
        },
    ) {}

    /** The position of an item, placing it at the end if it has none. */
    position(type: string, code: string): number {
        let positionsForType = this._positions.get(type);
        if (!positionsForType) {
            positionsForType = new Map();
            this._positions.set(type, positionsForType);
        }
        let position = positionsForType.get(code);
        if (position === undefined) {
            position = this._nextPosition++;
            positionsForType.set(code, position);
        }
        return position;
    }

    /**
     * The position of an item, or `undefined` if it has none. The searches
     * use this rather than `position`: every item they can reach is the end
     * of a blocker that has already been fitted, and so already has one.
     */
    _peek(type: string, code: string): number | undefined {
        return this._positions.get(type)?.get(code);
    }

    /**
     * Fit the blocker that `blocker` puts on `blocked` into the order, after
     * it has been recorded in both directions of the ledger. Returns `null`,
     * or, if the blocker closes a cycle, the items on it, starting from
     * `blocked`, then `blocker` and on along the cycle back towards
     * `blocked`.
     */
    addBlocker(
        blocked: BlockerNode,
        blocker: BlockerNode,
    ): BlockerNode[] | null {
        const upperBound = this.position(blocked.type, blocked.code);
        const lowerBound = this.position(blocker.type, blocker.code);
        if (upperBound < lowerBound) {
            return null;
        }
        if (upperBound === lowerBound) {
            // an item blocking itself
            return [blocked];
        }

        // Forward from the blocker, through everything that blocks it, as
        // far as the blocked item's position.
        const forward: BlockerNode[] = [];
        const reachedFrom = new Map<string, BlockerNode | null>([
            [nodeKey(blocker), null],
        ]);
        const stack = [blocker];
        while (stack.length > 0) {
            const node = stack.pop()!;
            forward.push(node);
            const blockers = this.ledgers.neededToResolve
                .get(node.type)
                ?.get(node.code);
            for (const type in blockers) {
                for (const rawCode of blockers[type]) {
                    const code = String(rawCode);
                    if (type === blocked.type && code === blocked.code) {
                        return [blocked, ...pathTo(node, reachedFrom)];
                    }
                    const next = { type, code };
                    const key = nodeKey(next);
                    const position = this._peek(type, code);
                    if (
                        position !== undefined &&
                        position < upperBound &&
                        !reachedFrom.has(key)
                    ) {
                        reachedFrom.set(key, node);
                        stack.push(next);
                    }
                }
            }
        }

        // Backward from the blocked item, through everything it blocks, as
        // far as the blocker's position.
        const backward: BlockerNode[] = [];
        const reachedBackward = new Set<string>([nodeKey(blocked)]);
        stack.push(blocked);
        while (stack.length > 0) {
            const node = stack.pop()!;
            backward.push(node);
            const blockedByNode = this.ledgers.resolveBlockedBy
                .get(node.type)
                ?.get(node.code);
            for (const type in blockedByNode) {
                for (const rawCode of blockedByNode[type]) {
                    const code = String(rawCode);
                    const next = { type, code };
                    const key = nodeKey(next);
                    const position = this._peek(type, code);
                    if (
                        position !== undefined &&
                        position > lowerBound &&
                        !reachedBackward.has(key)
                    ) {
                        reachedBackward.add(key);
                        stack.push(next);
                    }
                }
            }
        }

        // Hand the same positions back out: first to everything the blocked
        // item blocks (and the blocked item), then to everything blocking the
        // blocker (and the blocker), each group keeping its own order.
        const byPosition = (a: BlockerNode, b: BlockerNode) =>
            this.position(a.type, a.code) - this.position(b.type, b.code);
        backward.sort(byPosition);
        forward.sort(byPosition);
        const reordered = [...backward, ...forward];
        const positions = reordered
            .map((node) => this.position(node.type, node.code))
            .sort((a, b) => a - b);
        reordered.forEach((node, i) => {
            this._positions.get(node.type)!.set(node.code, positions[i]);
        });
        return null;
    }

    /**
     * Forget every position and place the items of the blockers still in the
     * ledger afresh. Called where the cycle checks drop their caches, once
     * the document is built: positions accumulate for every item that ever
     * took part in a blocker, while few blockers outlast the build.
     */
    rebuild() {
        this._positions.clear();
        this._nextPosition = 0;

        // Depth-first over the blockers; an item is finished after everything
        // blocking it, so finishing order reversed puts each blocked item
        // before its blockers.
        const finished: BlockerNode[] = [];
        const visited = new Set<string>();
        for (const [type, entries] of this.ledgers.neededToResolve) {
            for (const code of entries.keys()) {
                const root = { type, code };
                if (visited.has(nodeKey(root))) {
                    continue;
                }
                visited.add(nodeKey(root));
                const stack: { node: BlockerNode; next: BlockerNode[] }[] = [
                    { node: root, next: this._blockersOf(root) },
                ];
                while (stack.length > 0) {
                    const top = stack[stack.length - 1];
                    const next = top.next.pop();
                    if (next === undefined) {
                        finished.push(top.node);
                        stack.pop();
                    } else if (!visited.has(nodeKey(next))) {
                        visited.add(nodeKey(next));
                        stack.push({
                            node: next,
                            next: this._blockersOf(next),
                        });
                    }
                }
            }
        }
        for (let i = finished.length - 1; i >= 0; i--) {
            this.position(finished[i].type, finished[i].code);
        }
    }

    _blockersOf(node: BlockerNode): BlockerNode[] {
        const blockers = this.ledgers.neededToResolve
            .get(node.type)
            ?.get(node.code);
        const result: BlockerNode[] = [];
        for (const type in blockers) {
            for (const code of blockers[type]) {
                result.push({ type, code: String(code) });
            }
        }
        return result;
    }

    /** Number of items with a position; for tests and diagnostics. */
    get size() {
        let n = 0;
        for (const positionsForType of this._positions.values()) {
            n += positionsForType.size;
        }
        return n;
    }
}

function nodeKey(node: BlockerNode) {
    return node.type + "\u0000" + node.code;
}

/** The forward search's path from the blocker to `node`. */
function pathTo(
    node: BlockerNode,
    reachedFrom: Map<string, BlockerNode | null>,
): BlockerNode[] {
    const path: BlockerNode[] = [];
    let current: BlockerNode | null = node;
    while (current) {
        path.push(current);
        current = reachedFrom.get(nodeKey(current)) ?? null;
    }
    return path.reverse();
}
