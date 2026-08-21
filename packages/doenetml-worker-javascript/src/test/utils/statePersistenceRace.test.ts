import { describe, expect, it } from "vitest";
import { StatePersistence } from "../../core/StatePersistence";
import type Core from "../../Core";

// Overlapping saves in `StatePersistence` (Doenet/DoenetML#1726).
//
// Saves are not serialized, and deliberately so: a submission's save is
// fire-and-forget (`UpdateExecutor`) and the debounced save runs off a timer.
// Each one builds its payload, then awaits — `creditAchieved`, and `idb_set`
// when local state is on — before storing it, so an older save can reach the
// store last.
//
// Two things have to hold for what the host ends up with to be right. The
// stored payload has to be the newest one built, or a reader's work goes back
// a step. And the score stored beside it has to be the one that goes with it:
// a report carries both, and a page hide hands whichever pair is current to
// the host as the reader's record, where a mismatch sits until the next
// report. Capturing the pair in one save and storing it under a ticket is what
// gives both — which in turn is what lets a report be emitted synchronously,
// with no window of its own to worry about.
//
// Winning these races through a real core is not something a test can arrange,
// so these drive `StatePersistence` against a stand-in whose `creditAchieved`
// resolves exactly when the test says.

/** A promise plus the handle to settle it. */
function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((res) => {
        resolve = res;
    });
    return { promise, resolve };
}

function makePersistence() {
    const reports: { score: number; state: any; pending?: boolean }[] = [];
    /** One entry per `creditAchieved` read, settled in whatever order suits. */
    const scoreReads: { resolve: (score: number) => void }[] = [];

    const core = {
        cid: "cid",
        coreInfoString: "info",
        docId: "1",
        attemptNumber: 1,
        activityId: "activity",
        initializeCounters: {},
        cumulativeStateVariableChanges: {},
        flags: {
            allowSaveState: true,
            allowLocalState: false,
            saveRendererState: false,
        },
        document: {
            stateValues: {
                get creditAchieved() {
                    const { promise, resolve } = deferred<number>();
                    scoreReads.push({ resolve });
                    return promise;
                },
            },
        },
        reportScoreAndStateCallback: (report: any) => {
            reports.push(report);
        },
    } as unknown as Core;

    const persistence = new StatePersistence({ core });

    /** Begin a save of `work`, as a change to the document would. */
    function saveWork(work: string, overrideThrottle = false) {
        core.cumulativeStateVariableChanges = { work };
        return persistence.saveState(overrideThrottle).catch(() => {
            expect.fail(`the save of "${work}" rejected`);
        });
    }

    function storedWork() {
        return String(persistence.docStateToBeSavedToDatabase?.coreState ?? "");
    }

    return { core, persistence, reports, scoreReads, saveWork, storedWork };
}

describe("overlapping saves (#1726) @group4", () => {
    it("keeps the newest work when an older save reaches the store last", async () => {
        const { persistence, reports, scoreReads, saveWork, storedWork } =
            makePersistence();

        // Both saves build their payload, then suspend resolving the score.
        const older = saveWork("first");
        const newer = saveWork("second");
        expect(scoreReads).toHaveLength(2);

        // The newer save stores its pair and reports...
        scoreReads[1].resolve(1);
        await newer;

        // ...and then the older one resumes, holding work from a step back.
        scoreReads[0].resolve(0);
        await older;

        expect(
            storedWork(),
            "an older save put the reader's work back",
        ).toContain("second");
        expect(storedWork()).not.toContain("first");
        expect(persistence.scoreToBeSavedToDatabase).toBe(1);

        // One report, carrying the newer save's own pair. The older save is
        // the one that would otherwise have reported the newer work under the
        // credit it read a step earlier — the mismatch a page hide would then
        // hand to the host as the reader's record.
        expect(reports).toHaveLength(1);
        expect(reports[0].state.coreState).toContain("second");
        expect(
            reports[0].score,
            "the newer work was reported under an older credit",
        ).toBe(1);
    });

    it("never pairs a payload with a score from the other side of a save", async () => {
        const { persistence, reports, scoreReads, saveWork } =
            makePersistence();

        // The credit each payload was built against. A save that read the
        // score before an answer was graded must not end up reporting the
        // work from after it.
        const creditFor: Record<string, number> = { first: 0.2, second: 1 };

        const older = saveWork("first");
        const newer = saveWork("second", true);

        // The older save's score resolves first this time, so it stores and
        // reports before the newer one has settled anything.
        scoreReads[0].resolve(creditFor.first);
        await older;
        scoreReads[1].resolve(creditFor.second);
        await newer;

        expect(reports.length).toBeGreaterThan(0);
        for (const report of reports) {
            const work = report.state.coreState.includes("second")
                ? "second"
                : "first";
            expect(
                report.score,
                `reported "${work}" under the credit for the other`,
            ).toBe(creditFor[work]);
        }
        // The reader's latest work, under its own credit, is what is left
        // standing for a page hide to hand over.
        expect(persistence.scoreToBeSavedToDatabase).toBe(creditFor.second);
    });

    it("stores nothing for a document that has been replaced", async () => {
        const { persistence, reports, scoreReads, saveWork, storedWork } =
            makePersistence();

        const save = saveWork("typed");

        // `Core.generateDast` resets between documents. The work this save is
        // carrying belongs to the one being replaced.
        persistence.reset();
        scoreReads[0].resolve(0);
        await save;

        expect(storedWork()).toBe("");
        expect(reports).toHaveLength(0);
    });
});
