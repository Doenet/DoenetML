import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";
import { submitAnswer, updateTextInputValue } from "./actions";
import { checkNoErrorsAfterLoad } from "./errorsAfterLoad";

// Timers `StatePersistence` arms must not outlive their use. Each timer's
// callback closes over the core, so a handle nobody clears keeps the whole
// core in memory, and a Node process that runs many cores (a grading or
// replay harness) from exiting, until it fires.
//
// Two leaks: a save made directly (a submission's) used to forget the pending
// one-second debounce's handle without clearing it, so the debounce still
// fired a second, redundant save a second later; and `terminate` left the
// 60-second throttle its own final save had just armed.

const DOC = `
<textInput name="ti" />
<answer name="ans"><award><when>$ti = hello</when></award></answer>
`;

afterEach(() => {
    vi.useRealTimers();
});

describe("state persistence leaves no timer behind @group4", () => {
    it("a submission's save cancels the pending debounce and saves once", async () => {
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML: DOC },
        );
        const persistence = (core as any).core.statePersistence;
        const ti = await resolvePathToNodeIdx("ti");
        const ans = await resolvePathToNodeIdx("ans");

        vi.useFakeTimers();
        const saveState = vi.spyOn(persistence, "saveState");

        await updateTextInputValue({ text: "hello", componentIdx: ti, core });
        const debounce = persistence.saveDocStateTimeoutID;
        expect(debounce, "an edit arms the save debounce").not.toBeNull();

        await submitAnswer({ componentIdx: ans, core });
        // The submission's save is fire-and-forget; let it finish.
        await vi.waitFor(() => expect(scoreState.score).eq(1));

        expect(persistence.saveDocStateTimeoutID).toBeNull();
        const callsAfterSubmit = saveState.mock.calls.length;
        expect(callsAfterSubmit).eq(1);
        expect(saveState.mock.calls[0]).eqls([true, true]);

        // Past the debounce: a forgotten handle would fire another save here.
        await vi.advanceTimersByTimeAsync(1500);
        expect(saveState.mock.calls.length).eq(callsAfterSubmit);

        await core.terminate();
    });

    it("terminate saves once and leaves neither the debounce nor the throttle armed", async () => {
        const { core, resolvePathToNodeIdx, scoreState, lastStateReport } =
            await createTestCore({ doenetML: DOC });
        const persistence = (core as any).core.statePersistence;
        const ti = await resolvePathToNodeIdx("ti");

        vi.useFakeTimers();
        const saveState = vi.spyOn(persistence, "saveState");

        await updateTextInputValue({ text: "pending", componentIdx: ti, core });
        expect(persistence.saveDocStateTimeoutID).not.toBeNull();

        await core.terminate();

        // The final save ran exactly once, through the debounce's override,
        // and reached the host.
        expect(saveState.mock.calls.length).eq(1);
        expect(scoreState.state).toContain("pending");

        expect(persistence.saveDocStateTimeoutID).toBeNull();
        expect(persistence.saveStateToDBTimerId).toBeNull();
        expect(vi.getTimerCount(), "a timer outlived terminate").eq(0);

        // And a save still in flight when the core went away reports without
        // arming a new throttle.
        const reportBefore = lastStateReport.payload;
        persistence.changesToBeSaved = true;
        await persistence.saveChangesToDatabase();
        expect(lastStateReport.payload, "the late save reported").not.toBe(
            reportBefore,
        );
        expect(persistence.saveStateToDBTimerId).toBeNull();
        persistence.scheduleSave(1000);
        expect(persistence.saveDocStateTimeoutID).toBeNull();
        expect(vi.getTimerCount()).eq(0);
    });

    it("the test harness disposes the cores a test made when the test ends", async () => {
        // Tests do not terminate their cores. The `afterEach` of
        // `setupErrorsAfterLoad.ts` calls `checkNoErrorsAfterLoad`, which
        // must clear the throttle that the load's save armed; otherwise each
        // core outlives its test by a minute, which ran
        // `selectsamplerandomnumbers.test.ts` out of memory (#2490).
        const { core } = await createTestCore({ doenetML: DOC });
        const persistence = (core as any).core.statePersistence;
        expect(persistence.saveStateToDBTimerId).not.toBeNull();

        checkNoErrorsAfterLoad();

        expect(persistence.saveStateToDBTimerId).toBeNull();
        expect(persistence.disposed).eq(true);
    });
});
