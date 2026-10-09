import { describe, expect, it } from "vitest";
import { ProcessQueue } from "../../core/ProcessQueue";
import { CircularDependencyError } from "../../core/dependencies/CircularDependencyError";
import type Core from "../../Core";

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((r) => (resolve = r));
    return { promise, resolve };
}

/**
 * A queue whose core records the order its requests run in, and holds an
 * action until `release` is called.
 */
function queueWithLog() {
    const log: string[] = [];
    const held = deferred<void>();
    const core = {
        flags: {},
        performUpdate: async ({ updateInstructions }: any) => {
            log.push(`update ${updateInstructions[0]}`);
        },
        performAction: async ({ actionName }: any) => {
            log.push(`start ${actionName}`);
            if (actionName === "held") {
                await held.promise;
            }
            log.push(`end ${actionName}`);
        },
        reportDocumentStopped: () => log.push("stopped"),
    } as unknown as Core;
    return { queue: new ProcessQueue({ core }), log, release: held.resolve };
}

/**
 * Work queued with `runExclusive` (the comparison a save makes of unlinked
 * copies, `StatePersistence.saveState`) runs between requests, never during
 * one, and its errors are its caller's.
 */
describe("ProcessQueue.runExclusive", () => {
    it("waits for the request in progress and holds the next one back", async () => {
        const { queue, log, release } = queueWithLog();
        const action = queue.requestAction({
            componentIdx: 1,
            actionName: "held",
        });
        const exclusive = queue.runExclusive(async () => {
            log.push("exclusive");
            return 7;
        });
        const update = queue.requestUpdate({ updateInstructions: ["after"] });
        await Promise.resolve();
        expect(log).eqls(["start held"]);
        release();
        await action;
        expect(await exclusive).eq(7);
        await update;
        expect(log).eqls([
            "start held",
            "end held",
            "exclusive",
            "update after",
        ]);
    });

    it("rejects only its caller when it throws, even for a circular dependency", async () => {
        const { queue, log } = queueWithLog();
        const failure = new CircularDependencyError("cycle");
        await expect(
            queue.runExclusive(async () => {
                throw failure;
            }),
        ).rejects.toBe(failure);
        expect(queue.stoppedByError).eq(null);
        await queue.requestUpdate({ updateInstructions: ["later"] });
        expect(log).eqls(["update later"]);
    });

    it("does not count toward dropping a skippable update", async () => {
        const { queue, log, release } = queueWithLog();
        const action = queue.requestAction({
            componentIdx: 1,
            actionName: "held",
        });
        const drag = queue.requestUpdate({
            updateInstructions: ["drag"],
            skippable: true,
        });
        const exclusive = queue.runExclusive(async () => {
            log.push("exclusive");
        });
        const final = queue.requestUpdate({ updateInstructions: ["final"] });
        release();
        await Promise.all([action, drag, exclusive, final]);
        // one request queued behind the drag is not enough to drop it
        expect(log).eqls([
            "start held",
            "end held",
            "update drag",
            "exclusive",
            "update final",
        ]);
    });

    it("waits for a request still running when requests have stopped", async () => {
        // `terminate` stops requests, then waits only a while for the one
        // running, and its save can come before that one ends
        const { queue, log, release } = queueWithLog();
        const action = queue.requestAction({
            componentIdx: 1,
            actionName: "held",
        });
        await Promise.resolve();
        queue.stopProcessingRequests = true;
        const exclusive = queue.runExclusive(async () => {
            log.push("exclusive");
        });
        await Promise.resolve();
        expect(log).eqls(["start held"]);
        release();
        await Promise.all([action, exclusive]);
        expect(log).eqls(["start held", "end held", "exclusive"]);

        // with nothing running, it runs at once
        await queue.runExclusive(async () => {
            log.push("after");
        });
        expect(log.at(-1)).eq("after");
    });

    it("runs when a request comes after requests have stopped", async () => {
        // a viewer or timer action can reach the queue while `terminate`
        // waits; it is not run, and must not leave the queue looking busy
        const { queue } = queueWithLog();
        queue.stopProcessingRequests = true;
        queue.requestAction({ componentIdx: 1, actionName: "late" });
        await Promise.resolve();
        expect(queue.processing).eq(false);
        let ran = false;
        await queue.runExclusive(async () => {
            ran = true;
        });
        expect(ran).eq(true);
    });
});
