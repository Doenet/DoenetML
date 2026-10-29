/**
 * The cells core's own worker (ADR 0020 in `packages/cells-core`), built as
 * `cells-worker.js` beside the worker that hosts every core (`index.js`). It
 * answers the calls the prototype makes of `CoreWorker` for a cells document,
 * and carries neither the JavaScript core nor the Rust core: starting that
 * worker evaluates both, the JavaScript core's math library among them,
 * before it can answer anything.
 */
import * as Comlink from "comlink";
import type { DastRoot } from "@doenet/parser";
import type {
    ActionResponse,
    PathToCheck,
    RefResolution,
} from "@doenet/doenetml-worker-rust";
import type { RendererAction } from "./bridge";
import { CellsSession } from "./session";

export class CellsCoreWorker {
    _cells = new CellsSession();
    /** Calls run one at a time, in the order they arrive. */
    _queue: Promise<unknown> = Promise.resolve();

    _run<T>(call: () => T | Promise<T>): Promise<T> {
        const result = this._queue.then(call);
        // A failed call must not stop the ones after it; the caller still
        // sees its rejection through `result`.
        this._queue = result.catch(() => {});
        return result;
    }

    setCoreType(coreType: string) {
        if (coreType !== "cells") {
            throw Error(`The cells worker runs only the cells core`);
        }
    }

    setSource(args: { source: string; dast: DastRoot }) {
        return this._run(() => this._cells.setSource(args.dast));
    }

    /** The cells core takes no flags or locale yet. */
    setFlags(_args: { flags: Record<string, unknown> }) {
        return this._run(() => {});
    }

    setLocaleData(_args: unknown) {
        return this._run(() => {});
    }

    returnDast() {
        return this._run(() => this._cells.load());
    }

    dispatchAction(action: RendererAction): Promise<ActionResponse> {
        const current = this._cells.claim(action);
        return this._run(() => this._cells.dispatch(action, current));
    }

    resolvePath(args: {
        path: PathToCheck;
        origin: number;
        skipParentSearch: boolean;
    }): Promise<RefResolution> {
        return this._run(() => this._cells.resolvePath(args.path.path));
    }

    submitAllAnswers() {
        return this._run(() => this._cells.submitAllAnswers());
    }

    /** For the benchmark: where the load and the ticks since the last call
     * spent their time. */
    cellsTimings() {
        return this._run(() => this._cells.timings());
    }

    handleVisibilityChange(_documentIsVisible: boolean) {}

    async terminate() {
        await this._run(() => this._cells.free());
        close();
    }
}

Comlink.expose(new CellsCoreWorker());
