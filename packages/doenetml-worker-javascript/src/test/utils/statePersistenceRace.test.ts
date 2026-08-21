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
// Only one of the two halves can be read last, so neither order is safe on its
// own: reading the payload last risks tagging a reader's newer work with the
// credit they had before it, and reading the score last risks putting their
// older work over their newer. So the payload is read last and the pairing is
// then checked, and what a call that lost the race does about it depends on
// which kind it is. A mirror is dropped — the report that overtook it is real,
// so the main realm has that state already. A real report cannot be dropped,
// it being the one the host is waiting for, so it resolves the score again and
// tries once more.
//
// Either way the point is the same: what reaches the host is never a reader's
// state paired with a credit from the wrong side of it, which is what a page
// hide would otherwise hand over as their record.
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

    let scoreReadsSettled = 0;

    /**
     * Run `report` to completion, answering `credit` to every score read it
     * asks for along the way — a call that resumes to find itself overtaken
     * reads the score again, and would otherwise hang waiting on a read
     * nothing settles. Deliberately says nothing about how many reads that
     * takes: what the tests below are about is the pair that reaches the host,
     * not the number of attempts behind it.
     */
    async function settle(report: Promise<void>, credit: number) {
        let done = false;
        const finished = report.then(() => {
            done = true;
        });
        for (let i = 0; i < 100 && !done; i++) {
            while (scoreReadsSettled < scoreReads.length) {
                scoreReads[scoreReadsSettled++].resolve(credit);
            }
            await Promise.resolve();
        }
        await finished;
    }

    return {
        persistence: new StatePersistence({ core }),
        reports,
        scoreReads,
        settle,
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

    it("gets a fresh score for a real report a mirror got ahead of", async () => {
        const { persistence, reports, scoreReads, settle } = makePersistence();

        // The reverse order: a real report suspends, and a mirror started
        // afterwards resolves first. The host is waiting on the real report,
        // so it cannot be dropped the way the mirror above was — but the
        // credit it captured is from before the mirror, and the payload it
        // reads is from after. Emitting that pair would leave the host holding
        // the reader's latest work under the credit they had before it.
        persistence.docStateToBeSavedToDatabase = { coreState: "first" };
        const real = persistence._reportStateToMainRealm(false);
        persistence.docStateToBeSavedToDatabase = { coreState: "second" };
        const mirror = persistence._reportStateToMainRealm(true);

        scoreReads[1].resolve(0.5);
        await mirror;

        // The stale credit the real report has been holding all along. Every
        // read it makes after that answers with the current credit, as the
        // document would.
        scoreReads[0].resolve(0.2);
        await settle(real, 0.5);

        expect(reports.map((r) => r.pending === true)).toEqual([true, false]);
        expect(reports[1].state.coreState).toBe("second");
        expect(
            reports[1].score,
            "the host was left holding the credit from before the mirror",
        ).toBe(0.5);
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
