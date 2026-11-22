/**
 * The error a circular dependency raises, wherever it is found: the two cycle
 * checks in `DependencyHandler` and the self-reference checks in
 * `ComponentBuilder`.
 *
 * The guards that turn a composite's failure into an `_error` replacement
 * rethrow it rather than carry on with a cycle in the graph. Raised while the
 * document loads, it reaches the worker, which builds the document once more
 * with one node on the cycle made `doenet-e0005` (D57,
 * `PublicDoenetMLCore.rebuildAroundLoadCycle`); if it is raised again, the
 * document stops. Raised by an update after load, the request queue stops the
 * document (`ProcessQueue.executeProcesses`).
 */
export class CircularDependencyError extends Error {
    /**
     * The components on the cycle, as far as the check that found it knows
     * them, so that a cycle found while the document loads can be blamed on
     * one the author wrote (D57, `blameLoadCycle`).
     */
    componentIndices: number[];
    /**
     * The state variables on the cycle, `[componentIdx, varName]`, when the
     * check that found it knows them (the two in `DependencyHandler`), so
     * that the blame can tell which attributes of a component the cycle runs
     * through (`blameLoadCycle`'s `variablesOnCycle`).
     */
    stateVariables: [number, string][];

    constructor(
        message: string,
        componentIndices: number[] = [],
        stateVariables: [number, string][] = [],
    ) {
        super(message);
        this.name = "CircularDependencyError";
        this.componentIndices = componentIndices;
        this.stateVariables = stateVariables;
    }
}

/** Rethrow `e` if it is a circular dependency, which no guard may swallow. */
export function rethrowIfCircular(e: unknown) {
    if (e instanceof CircularDependencyError) {
        throw e;
    }
}
