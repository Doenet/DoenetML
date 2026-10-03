/**
 * The error a circular dependency raises, wherever it is found: the two cycle
 * checks in `DependencyHandler` and the self-reference checks in
 * `ComponentBuilder`.
 *
 * A circular dependency ends the document. The guards that turn a composite's
 * failure into an `_error` replacement rethrow it rather than carry on with a
 * cycle in the graph, and when one is raised by an update after load the
 * request queue stops the document (`ProcessQueue.executeProcesses`), as a
 * cycle found during load already does.
 */
export class CircularDependencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CircularDependencyError";
    }
}

/** Rethrow `e` if it is a circular dependency, which no guard may swallow. */
export function rethrowIfCircular(e: unknown) {
    if (e instanceof CircularDependencyError) {
        throw e;
    }
}
