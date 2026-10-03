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
    private marks = new Map<Outer, Map<string, number>>();

    get(outer: Outer, inner: string): number | undefined {
        return this.marks.get(outer)?.get(inner);
    }

    set(outer: Outer, inner: string, mark: number) {
        let inner_marks = this.marks.get(outer);
        if (!inner_marks) {
            inner_marks = new Map();
            this.marks.set(outer, inner_marks);
        }
        inner_marks.set(inner, mark);
    }

    delete(outer: Outer, inner: string) {
        const inner_marks = this.marks.get(outer);
        if (inner_marks) {
            inner_marks.delete(inner);
            if (inner_marks.size === 0) {
                this.marks.delete(outer);
            }
        }
    }

    clear() {
        this.marks.clear();
    }

    /** Number of marked nodes; for tests and diagnostics. */
    get size() {
        let n = 0;
        for (const inner_marks of this.marks.values()) {
            n += inner_marks.size;
        }
        return n;
    }
}
