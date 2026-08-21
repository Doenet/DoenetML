import { describe, expect, it } from "vitest";
import { createTestCore } from "./test-core";
import { updateTextInputValue } from "./actions";

// The main realm's half of the page-hide flush (Doenet/DoenetML#1726).
//
// `StatePersistence` throttles its host reports at 60 seconds, so between two
// reports the host's copy of a reader's work falls behind what is on screen.
// A page can go away in that window without the viewer unmounting — the tab is
// closed, a new URL is typed, a backgrounded mobile tab is discarded — and
// `pagehide` gives no budget for a round-trip into this worker to fetch the
// payload. So the payload has to already be out there: every save the throttle
// holds back is mirrored to the main realm through the ordinary report
// callback, marked `pending`, for `DocViewer` to buffer and hand over when the
// page hides.
//
// Two properties, and the fix is worthless without either: the mirror carries
// the withheld work, and it is never mistaken for a report a host should save.

const DOC = `<textInput name="ti" />`;

/** Past the one-second debounce `scheduleSave` arms after an update. */
function afterSaveDebounce() {
    return new Promise((resolve) => setTimeout(resolve, 1500));
}

describe("throttled state is mirrored to the main realm (#1726) @group4", () => {
    it("mirrors the work the throttle withholds, without reporting it", async () => {
        const { core, resolvePathToNodeIdx, scoreState, pendingReports } =
            await createTestCore({ doenetML: DOC });
        const ti = await resolvePathToNodeIdx("ti");

        await updateTextInputValue({
            text: "reported",
            componentIdx: ti,
            core,
        });

        // Reports the current state and arms the 60-second throttle, so
        // everything below is deterministically behind it.
        await core.saveImmediately();
        expect(scoreState.state).toContain("reported");
        expect(
            pendingReports,
            "an unthrottled save mirrored a payload it had just reported",
        ).toHaveLength(0);

        await updateTextInputValue({
            text: "withheld",
            componentIdx: ti,
            core,
        });
        await afterSaveDebounce();

        // The host's copy is a step behind — this is the loss the flush exists
        // to prevent...
        expect(
            scoreState.state,
            "withheld work reached the host despite the throttle",
        ).not.toContain("withheld");

        // ...and the main realm holds it, ready for the page-hide flush.
        const mirrored = pendingReports.at(-1);
        expect(mirrored, "the throttled save mirrored nothing").toBeDefined();
        expect((mirrored!.state as { coreState: string }).coreState).toContain(
            "withheld",
        );
    });

    it("keeps mirroring as the reader works, so the buffer never goes stale", async () => {
        const { core, resolvePathToNodeIdx, scoreState, pendingReports } =
            await createTestCore({ doenetML: DOC });
        const ti = await resolvePathToNodeIdx("ti");

        await core.saveImmediately();

        for (const text of ["first", "second", "third"]) {
            await updateTextInputValue({ text, componentIdx: ti, core });
            await afterSaveDebounce();
        }

        // A flush delivers the *latest* mirror, so what matters is that the
        // most recent one carries the most recent work — not merely that some
        // earlier mirror did.
        const mirrored = pendingReports.at(-1);
        expect(mirrored, "the throttled saves mirrored nothing").toBeDefined();
        expect((mirrored!.state as { coreState: string }).coreState).toContain(
            "third",
        );
        expect(scoreState.state).not.toContain("third");
    });
});
