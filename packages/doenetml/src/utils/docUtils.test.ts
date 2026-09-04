import { describe, expect, it } from "vitest";
import type * as Comlink from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker";
import type { DoenetMLFlags } from "../doenetml";
import { initializeCoreWorker } from "./docUtils";

// Unit coverage for the per-worker serialization of `initializeCoreWorker`
// (#1533).
//
// The function drives a worker through several separately awaited round
// trips, and the worker serializes each call on its own, so two
// initializations started against one worker used to interleave — and the
// second then initialized from a document DAST the first had already
// released. Driven here against a stand-in remote that records every round
// trip, so the order the worker would see is the thing asserted.

const FLAGS = {} as DoenetMLFlags;

/** A promise whose settlement the test controls. */
function deferred() {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => {
        resolve = r;
    });
    return { promise, resolve };
}

/** Let everything already runnable run: microtasks, and a macrotask turn. */
async function settle() {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

/** The document a source stands for, for the log: `<p>A</p>` is `A`. */
function documentOf(source: string): string {
    return /<p>(\w+)<\/p>/.exec(source)?.[1] ?? source;
}

/**
 * A stand-in for a core worker's Comlink remote: the round trips
 * `initializeCoreWorker` makes, each recording itself in `log` — tagged with
 * the document it was made for where the arguments say — and resolving at
 * once, except as the options below arrange.
 */
function fakeRemote(
    log: string[],
    options: {
        /** Hold `initializeJavascriptCore` for this `docId` until released. */
        holdInitializationOf?: string;
        /** Reject the first `setFlags` call. */
        failFirstSetFlags?: boolean;
    } = {},
) {
    const gate = deferred();
    let setFlagsCalls = 0;
    const remote = {
        async setCoreType() {
            log.push("setCoreType");
        },
        async setSource({ source }: { source: string }) {
            log.push(`setSource:${documentOf(source)}`);
        },
        async setFlags() {
            log.push("setFlags");
            setFlagsCalls++;
            if (options.failFirstSetFlags && setFlagsCalls === 1) {
                throw new Error("flags rejected");
            }
        },
        async setLocaleData() {
            log.push("setLocaleData");
        },
        async initializeJavascriptCore({ docId }: { docId: string }) {
            log.push(`initializeJavascriptCore:${docId}`);
            if (options.holdInitializationOf === docId) {
                await gate.promise;
            }
            return { allPossibleVariants: [docId], baseComponentCounts: {} };
        },
    };
    return {
        remote: remote as unknown as Comlink.Remote<CoreWorker>,
        release: gate.resolve,
    };
}

/**
 * Start an initialization of document `doc` on `remote`, recording its
 * structure report in `log`; `extra` overrides any of its arguments.
 */
function initialize(
    remote: Comlink.Remote<CoreWorker>,
    doc: string,
    log: string[],
    extra: Partial<Parameters<typeof initializeCoreWorker>[0]> = {},
) {
    return initializeCoreWorker({
        coreWorker: remote,
        doenetML: `<p>${doc}</p>`,
        flags: FLAGS,
        activityId: "activity",
        docId: doc,
        requestedVariantIndex: 1,
        attemptNumber: 1,
        documentStructureCallback({ docId }: { docId: string }) {
            log.push(`structure:${docId}`);
        },
        onQueueTurn() {
            log.push(`turn:${doc}`);
        },
        ...extra,
    });
}

/**
 * What one initialization of `doc` records, in order: its turn, its round
 * trips, and its structure report.
 */
function sequenceFor(doc: string): string[] {
    return [
        `turn:${doc}`,
        "setCoreType",
        `setSource:${doc}`,
        "setFlags",
        "setLocaleData",
        `initializeJavascriptCore:${doc}`,
        `structure:${doc}`,
    ];
}

describe("initializeCoreWorker serialization (#1533)", () => {
    it("starts a second initialization of one worker only after the first has settled", async () => {
        const log: string[] = [];
        const { remote, release } = fakeRemote(log, {
            holdInitializationOf: "A",
        });

        const first = initialize(remote, "A", log);
        const second = initialize(remote, "B", log);
        await settle();

        // The first is held in its last round trip; the second has made none.
        expect(log).toEqual(sequenceFor("A").slice(0, -1));

        release();
        const [resultA, resultB] = await Promise.all([first, second]);

        // Whole, then whole — including the structure report, which is made
        // from the round trip's result and so belongs to the serialized run.
        expect(log).toEqual([...sequenceFor("A"), ...sequenceFor("B")]);
        expect(resultA?.allPossibleVariants).toEqual(["A"]);
        expect(resultB?.allPossibleVariants).toEqual(["B"]);
        expect(resultB?.resolvedDocumentLocale).toBe("en");
    });

    it("keeps a queue of initializations in arrival order", async () => {
        const log: string[] = [];
        const { remote, release } = fakeRemote(log, {
            holdInitializationOf: "A",
        });

        const all = Promise.all([
            initialize(remote, "A", log),
            initialize(remote, "B", log),
            initialize(remote, "C", log),
        ]);
        await settle();
        release();
        await all;

        expect(log).toEqual([
            ...sequenceFor("A"),
            ...sequenceFor("B"),
            ...sequenceFor("C"),
        ]);
    });

    it("lets initializations of different workers overlap", async () => {
        const log: string[] = [];
        const held = fakeRemote(log, { holdInitializationOf: "A" });
        const other = fakeRemote(log);

        const first = initialize(held.remote, "A", log);
        // Completes while the other worker's initialization is still held.
        await initialize(other.remote, "B", log);
        expect(log).toContain("initializeJavascriptCore:B");
        expect(log).not.toContain("structure:A");

        held.release();
        await first;
    });

    it("runs a successor after a predecessor that failed, and fails only the predecessor", async () => {
        const log: string[] = [];
        const { remote } = fakeRemote(log, { failFirstSetFlags: true });

        const first = initialize(remote, "A", log);
        const second = initialize(remote, "B", log);

        await expect(first).rejects.toThrow("flags rejected");
        const resultB = await second;
        expect(resultB?.allPossibleVariants).toEqual(["B"]);
        // The failed run stops where it failed; the successor's own
        // `setSource` is what restores the worker, so it runs whole.
        expect(log).toEqual([
            "turn:A",
            "setCoreType",
            "setSource:A",
            "setFlags",
            ...sequenceFor("B"),
        ]);
    });

    it("holds a failed initialization's place until its predecessor has settled", async () => {
        // An initialization whose own work fails still holds its place in the
        // queue: the one behind it waits on its slot, which settles no earlier
        // than the slots ahead of it, so a failure while the predecessor is
        // still on the worker cannot wave the successor onto it. It gets no
        // turn either: nothing of its own will run.
        const log: string[] = [];
        const { remote, release } = fakeRemote(log, {
            holdInitializationOf: "A",
        });

        const first = initialize(remote, "A", log);
        const second = initialize(remote, "B", log, {
            doenetML: `<p>B</p><p copy="doenet:broken" />`,
            fetchExternalDoenetML: () => {
                throw new Error("fetch failed");
            },
        });
        const third = initialize(remote, "C", log);
        // Its failure is its own caller's, reported as soon as it happens —
        // holding its place in the queue does not hold its result.
        const secondFailed = expect(second).rejects.toThrow("fetch failed");
        await settle();

        // The first is held in its last round trip; the third is waiting.
        expect(log).toEqual(sequenceFor("A").slice(0, -1));

        release();
        await secondFailed;
        await Promise.all([first, third]);
        expect(log).toEqual([...sequenceFor("A"), ...sequenceFor("C")]);
    });

    it("lets an initialization whose document has moved on step aside at its turn", async () => {
        // An initialization the viewer has moved on from by the time its
        // turn comes makes no round trip, gets no turn, and resolves to
        // `null`.
        const log: string[] = [];
        const { remote, release } = fakeRemote(log, {
            holdInitializationOf: "A",
        });

        const first = initialize(remote, "A", log);
        const second = initialize(remote, "B", log, {
            abandoned: () => true,
        });
        await settle();
        expect(log).toEqual(sequenceFor("A").slice(0, -1));

        release();
        expect(await second).toBeNull();
        await first;
        expect(log).toEqual(sequenceFor("A"));
    });

    it("releases an abandoned initialization's place as soon as one is queued behind it", async () => {
        // Of the initializations queued behind the one on the worker, only
        // the newest belongs to a document the viewer still shows, and an
        // older one may be stuck in its own preparation — a fetch of external
        // references slow to answer — long after it stopped mattering. So
        // queueing another behind it releases its place at once: the
        // newcomer waits only for the initialization actually on the worker,
        // however many rebuilds landed in between, and the one released makes
        // no round trip once its preparation does settle.
        const log: string[] = [];
        const { remote, release } = fakeRemote(log, {
            holdInitializationOf: "A",
        });
        const slowFetch = deferred();

        const first = initialize(remote, "A", log);
        const second = initialize(remote, "B", log, {
            doenetML: `<p>B</p><p copy="doenet:slow" />`,
            fetchExternalDoenetML: async () => {
                await slowFetch.promise;
                return "<p>external</p>";
            },
            abandoned: () => true,
        });
        const third = initialize(remote, "C", log);
        await settle();
        expect(log).toEqual(sequenceFor("A").slice(0, -1));

        // The third runs right after the first, while the second is still
        // waiting on its fetch.
        release();
        await Promise.all([first, third]);
        expect(log).toEqual([...sequenceFor("A"), ...sequenceFor("C")]);

        slowFetch.resolve();
        expect(await second).toBeNull();
        expect(log).toEqual([...sequenceFor("A"), ...sequenceFor("C")]);
    });

    it("parses and expands a queued initialization while its predecessor is in flight", async () => {
        // Only the round trips are serialized. The parse and the expansion of
        // external references are this thread's own work, and the second
        // initialization's share of it happens while the first is still
        // waiting on the worker — observable here through the fetch the
        // expansion makes.
        const log: string[] = [];
        const { remote, release } = fakeRemote(log, {
            holdInitializationOf: "A",
        });

        const first = initialize(remote, "A", log);
        const second = initialize(remote, "B", log, {
            doenetML: `<p copy="doenet:external" />`,
            fetchExternalDoenetML: async (uri) => {
                log.push(`fetch:${uri}`);
                return "<p>external</p>";
            },
        });
        await settle();

        // Fetched while the first initialization is still held, and no round
        // trip of the second made yet.
        expect(log).toContain("fetch:doenet:external");
        expect(log.filter((entry) => entry.startsWith("setSource"))).toEqual([
            "setSource:A",
        ]);

        release();
        await Promise.all([first, second]);
        expect(log.indexOf("initializeJavascriptCore:B")).toBeGreaterThan(
            log.indexOf("initializeJavascriptCore:A"),
        );
    });

    it("keeps arrival order when the first initialization's expansion finishes after the second's", async () => {
        // The place in the worker's queue is taken when an initialization is
        // asked for, before any of its own work — so a newer initialization
        // cannot overtake an older one whose external references are slow to
        // fetch, and the worker ends up holding the document the viewer is
        // showing.
        const log: string[] = [];
        const { remote } = fakeRemote(log);
        const slowFetch = deferred();

        const first = initialize(remote, "A", log, {
            doenetML: `<p>A</p><p copy="doenet:slow" />`,
            fetchExternalDoenetML: async (uri) => {
                log.push(`fetch:${uri}`);
                await slowFetch.promise;
                return "<p>external</p>";
            },
        });
        const second = initialize(remote, "B", log);
        await settle();

        // Neither has made a round trip: the first is still waiting on its
        // fetch, and the second is behind the first.
        expect(log).toEqual(["fetch:doenet:slow"]);

        slowFetch.resolve();
        await Promise.all([first, second]);
        expect(log).toEqual([
            "fetch:doenet:slow",
            ...sequenceFor("A"),
            ...sequenceFor("B"),
        ]);
    });
});
