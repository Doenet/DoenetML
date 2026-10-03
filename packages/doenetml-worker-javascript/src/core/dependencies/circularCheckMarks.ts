/**
 * Visit marks for the two incremental cycle checks in `DependencyHandler`
 * (`checkForCircularDependency` over the state-variable graph and
 * `checkForCircularResolveBlocker` over the resolve-blocker graph).
 *
 * Both checks are depth-first searches that memoize "this node's downstream
 * closure has been searched and holds no cycle", and both walk the memo back
 * upstream to clear it whenever an edge changes below a memoized node. The
 * marks are keyed by the two parts of a node's identity so a lookup never
 * builds a combined key string.
 */

/** The node is on the current search path; reaching it again is a cycle. */
export const ON_PATH = 1;
/** The node's closure was searched and holds no cycle. */
export const PASSED = 2;

export class CircularCheckMarks<Outer> {
    _marks = new Map<Outer, Map<string, number>>();

    get(outer: Outer, inner: string): number | undefined {
        return this._marks.get(outer)?.get(inner);
    }

    set(outer: Outer, inner: string, mark: number) {
        let innerMarks = this._marks.get(outer);
        if (!innerMarks) {
            innerMarks = new Map();
            this._marks.set(outer, innerMarks);
        }
        innerMarks.set(inner, mark);
    }

    delete(outer: Outer, inner: string) {
        const innerMarks = this._marks.get(outer);
        if (innerMarks) {
            innerMarks.delete(inner);
            if (innerMarks.size === 0) {
                this._marks.delete(outer);
            }
        }
    }

    clear() {
        this._marks.clear();
    }

    /** Number of marked nodes; for tests and diagnostics. */
    get size() {
        let n = 0;
        for (const innerMarks of this._marks.values()) {
            n += innerMarks.size;
        }
        return n;
    }
}
