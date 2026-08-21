import { describe, expect, it } from "vitest";
import { StatePersistence } from "../../core/StatePersistence";
import type Core from "../../Core";

// Overlapping reports in `StatePersistence` (Doenet/DoenetML#1726).
//
// Report emission is not serialized, and deliberately so: a submission's save
// is fire-and-forget (`UpdateExecutor`) and the debounced save runs off a
// timer, so two calls can sit suspended on `creditAchieved` at the same time.
// Each resolves its score first and reads the payload afterwards, which is
// what keeps a report from ever carrying state older than one already sent.
//
// The hazard that leaves is a *mirror* that loses the race. Its score is the
// one from before the concurrent real report; the payload it reads afterwards
// is the one from after. Delivering it would re-arm the main realm's buffer
// with a real report's state paired with a pre-report score — and a later page
// hide would hand that mismatched pair to the host as the reader's record,
// where it would sit until the next report. A real report, by contrast, must
// never be dropped: it is the one the host is waiting for.
//
// Driving that interleaving through a real core would mean winning a timing
// race, so these exercise `StatePersistence` against a stand-in core whose
// `creditAchieved` resolves exactly when the test says.

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
    /** Scores handed out in order, one per `creditAchieved` read. */
    const scoreReads: { resolve: (score: number) => void }[] = [];

    const core = {
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

    return {
        persistence: new StatePersistence({ core }),
        reports,
        scoreReads,
    };
}

describe("overlapping state reports (#1726) @group4", () => {
    it("drops a mirror that a later real report has already overtaken", async () => {
        const { persistence, reports, scoreReads } = makePersistence();

        // The mirror starts first, against the work on screen so far, and
        // suspends reading the score.
        persistence.docStateToBeSavedToDatabase = { coreState: "typed" };
        const mirror = persistence._reportStateToMainRealm(true);
        expect(scoreReads).toHaveLength(1);

        // An answer is submitted while it is suspended: new work, new credit,
        // and a real report that overrides the throttle.
        persistence.docStateToBeSavedToDatabase = { coreState: "submitted" };
        const real = persistence._reportStateToMainRealm(false);
        expect(scoreReads).toHaveLength(2);

        // The real report's score resolves first, so it reports first.
        scoreReads[1].resolve(1);
        await real;

        // Now the mirror resumes, and would read the submitted payload while
        // still holding the pre-submission score.
        scoreReads[0].resolve(0);
        await mirror;

        expect(reports).toHaveLength(1);
        expect(reports[0].pending, "the mirror was delivered anyway").not.toBe(
            true,
        );
        expect(reports[0].score).toBe(1);
        expect(reports[0].state.coreState).toBe("submitted");
    });

    it("still delivers a real report a mirror got ahead of", async () => {
        const { persistence, reports, scoreReads } = makePersistence();

        // The reverse order: a real report suspends, and a mirror started
        // afterwards resolves first. The host is waiting on the real report,
        // so it goes out regardless of having lost the race.
        persistence.docStateToBeSavedToDatabase = { coreState: "first" };
        const real = persistence._reportStateToMainRealm(false);
        persistence.docStateToBeSavedToDatabase = { coreState: "second" };
        const mirror = persistence._reportStateToMainRealm(true);

        scoreReads[1].resolve(0.5);
        await mirror;
        scoreReads[0].resolve(0.5);
        await real;

        expect(reports.map((r) => r.pending === true)).toEqual([true, false]);
        // Both read the buffer after their score resolved, so both carry the
        // latest work — the real one lands second and supersedes the mirror.
        expect(reports[1].state.coreState).toBe("second");
    });

    it("reports nothing once the document it belonged to is gone", async () => {
        const { persistence, reports, scoreReads } = makePersistence();

        persistence.docStateToBeSavedToDatabase = { coreState: "typed" };
        const mirror = persistence._reportStateToMainRealm(true);

        // `Core.generateDast` resets between documents; a payload of `{}` over
        // the host's record would be worse than reporting nothing at all.
        persistence.reset();
        scoreReads[0].resolve(0);
        await mirror;

        expect(reports).toHaveLength(0);
    });
});
