import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Create a core that collects every recorded event, and return the
 * "submitted" ones with `result` and `object` parsed.
 *
 * Events are recorded through the core's process queue, after the action that
 * requested them has resolved, so `submittedEvents` first waits for the queue
 * to drain.
 */
async function createCoreRecordingEvents(doenetML: string) {
    const events: Record<string, any>[] = [];
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        sendEvent: (payload) => events.push(payload),
    });

    async function submittedEvents() {
        await core.core!.processQueue.runExclusive(async () => {});
        return events
            .filter((e) => e.verb === "submitted")
            .map((e) => ({
                ...e,
                object: JSON.parse(e.object),
                result: JSON.parse(e.result),
            }));
    }

    return { core, resolvePathToNodeIdx, submittedEvents };
}

describe("Submitted event attempt counts @group1", async () => {
    it("answer with maxNumAttempts reports submissions and attempts left", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <answer name="ans" maxNumAttempts="3"><mathInput name="mi" />x</answer>
    `);
        const ansIdx = await resolvePathToNodeIdx("ans");
        const miIdx = await resolvePathToNodeIdx("mi");

        await updateMathInputValue({ latex: "y", componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });
        await updateMathInputValue({ latex: "x", componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });

        const events = await submittedEvents();
        expect(events.length).eq(2);

        expect(events[0].result.creditAchieved).eq(0);
        expect(events[0].result.numSubmissions).eq(1);
        expect(events[0].result.maxNumAttempts).eq(3);
        expect(events[0].result.numAttemptsLeft).eq(2);

        expect(events[1].result.creditAchieved).eq(1);
        expect(events[1].result.numSubmissions).eq(2);
        expect(events[1].result.maxNumAttempts).eq(3);
        expect(events[1].result.numAttemptsLeft).eq(1);

        // The event agrees with the answer's own state after the submission.
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[ansIdx].stateValues.numSubmissions).eq(2);
        expect(stateVariables[ansIdx].stateValues.numAttemptsLeft).eq(1);
    });

    it("last allowed submission reports zero attempts left, and no event after it", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <answer name="ans" maxNumAttempts="1"><mathInput name="mi" />x</answer>
    `);
        const ansIdx = await resolvePathToNodeIdx("ans");
        const miIdx = await resolvePathToNodeIdx("mi");

        await updateMathInputValue({ latex: "y", componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });
        await updateMathInputValue({ latex: "x", componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });

        const events = await submittedEvents();
        expect(events.length).eq(1);
        expect(events[0].result.numSubmissions).eq(1);
        expect(events[0].result.maxNumAttempts).eq(1);
        expect(events[0].result.numAttemptsLeft).eq(0);
    });

    it("answer with unlimited attempts reports null cap and attempts left", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <answer name="ans"><mathInput name="mi" />x</answer>
    `);
        const ansIdx = await resolvePathToNodeIdx("ans");
        const miIdx = await resolvePathToNodeIdx("mi");

        await updateMathInputValue({ latex: "y", componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });
        await updateMathInputValue({ latex: "x", componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });

        const events = await submittedEvents();
        expect(events.length).eq(2);
        for (const [i, event] of events.entries()) {
            expect(event.result.numSubmissions).eq(i + 1);
            expect(event.result.maxNumAttempts).eq(null);
            expect(event.result.numAttemptsLeft).eq(null);
            // Present as explicit nulls, not missing, so the shape is fixed.
            expect("maxNumAttempts" in event.result).eq(true);
            expect("numAttemptsLeft" in event.result).eq(true);
        }
    });

    it("section-wide check work reports the section's attempts", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <section name="sec" sectionWideCheckWork maxNumAttempts="2">
        <answer name="ans"><mathInput name="mi" />x</answer>
    </section>
    `);
        const secIdx = await resolvePathToNodeIdx("sec");
        const miIdx = await resolvePathToNodeIdx("mi");

        await updateMathInputValue({ latex: "y", componentIdx: miIdx, core });
        await core.requestAction({
            componentIdx: secIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        const events = await submittedEvents();
        const sectionEvent = events.find(
            (e) => e.object.componentType === "section",
        )!;
        expect(sectionEvent.result.numSubmissions).eq(1);
        expect(sectionEvent.result.maxNumAttempts).eq(2);
        expect(sectionEvent.result.numAttemptsLeft).eq(1);

        // The answer's own cap does not apply inside the section; its attempts
        // left are the section's.
        const answerEvent = events.find(
            (e) => e.object.componentType === "answer",
        )!;
        expect(answerEvent.result.numSubmissions).eq(1);
        expect(answerEvent.result.maxNumAttempts).eq(null);
        expect(answerEvent.result.numAttemptsLeft).eq(1);
    });

    it("pretzel with maxNumAttempts reports submissions and attempts left", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <pretzel name="p" maxNumAttempts="2">
        <problem><statement><p>1+1</p></statement><answer>2</answer></problem>
        <problem><statement><p>1+2</p></statement><answer>3</answer></problem>
    </pretzel>
    `);
        const pIdx = await resolvePathToNodeIdx("p");

        await submitAnswer({ componentIdx: pIdx, core });
        await submitAnswer({ componentIdx: pIdx, core });
        // Attempts are used up, so this one is not recorded.
        await submitAnswer({ componentIdx: pIdx, core });

        const events = await submittedEvents();
        expect(events.map((e) => e.result.numSubmissions)).eqls([1, 2]);
        expect(events.map((e) => e.result.maxNumAttempts)).eqls([2, 2]);
        expect(events.map((e) => e.result.numAttemptsLeft)).eqls([1, 0]);
    });

    it("answer submitted on its own inside a section-wide check work leaves the section's attempts unchanged", async () => {
        // An answer submitted by itself (as auto-submit does) does not count
        // against the section, so the event reports the section's count as
        // it stands. A later section-wide submission does use an attempt.
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <section name="sec" sectionWideCheckWork maxNumAttempts="2">
        <answer name="ans"><mathInput name="mi" />x</answer>
    </section>
    `);
        const secIdx = await resolvePathToNodeIdx("sec");
        const ansIdx = await resolvePathToNodeIdx("ans");
        const miIdx = await resolvePathToNodeIdx("mi");

        await updateMathInputValue({ latex: "y", componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });

        let events = await submittedEvents();
        expect(events.length).eq(1);
        expect(events[0].result.numSubmissions).eq(1);
        expect(events[0].result.numAttemptsLeft).eq(2);
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[secIdx].stateValues.numAttemptsLeft).eq(2);
        expect(stateVariables[ansIdx].stateValues.numAttemptsLeft).eq(2);

        await updateMathInputValue({ latex: "x", componentIdx: miIdx, core });
        await core.requestAction({
            componentIdx: secIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        events = await submittedEvents();
        expect(
            events.map((e) => [
                e.object.componentType,
                e.result.numSubmissions,
                e.result.numAttemptsLeft,
            ]),
        ).eqls([
            ["answer", 1, 2],
            ["section", 1, 1],
            ["answer", 2, 1],
        ]);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[secIdx].stateValues.numAttemptsLeft).eq(1);
        expect(stateVariables[ansIdx].stateValues.numAttemptsLeft).eq(1);
    });

    it("pretzel submitted with its own button inside a section-wide check work leaves the section's attempts unchanged", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <section name="sec" sectionWideCheckWork maxNumAttempts="2">
        <pretzel name="p">
            <problem><statement><p>1+1</p></statement><answer>2</answer></problem>
            <problem><statement><p>1+2</p></statement><answer>3</answer></problem>
        </pretzel>
    </section>
    `);
        const secIdx = await resolvePathToNodeIdx("sec");
        const pIdx = await resolvePathToNodeIdx("p");

        await submitAnswer({ componentIdx: pIdx, core });

        const events = await submittedEvents();
        expect(events.length).eq(1);
        expect(events[0].object.componentType).eq("pretzel");
        expect(events[0].result.numSubmissions).eq(1);
        expect(events[0].result.numAttemptsLeft).eq(2);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[secIdx].stateValues.numAttemptsLeft).eq(2);
        expect(stateVariables[pIdx].stateValues.numAttemptsLeft).eq(2);
    });

    it("section-wide check work uses one of its attempts for each answer and pretzel it submits", async () => {
        // Each reports the section's attempts left, one fewer, and its own
        // `maxNumAttempts`, which the section's limit overrides.
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <section name="sec" sectionWideCheckWork maxNumAttempts="2">
        <answer name="ans" maxNumAttempts="3"><mathInput name="mi" />x</answer>
        <pretzel name="p">
            <problem><statement><p>1+1</p></statement><answer>2</answer></problem>
            <problem><statement><p>1+2</p></statement><answer>3</answer></problem>
        </pretzel>
    </section>
    `);
        const secIdx = await resolvePathToNodeIdx("sec");
        const pIdx = await resolvePathToNodeIdx("p");

        await core.requestAction({
            componentIdx: secIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        const events = await submittedEvents();
        expect(
            events.map((e) => [
                e.object.componentType,
                e.result.numSubmissions,
                e.result.maxNumAttempts,
                e.result.numAttemptsLeft,
            ]),
        ).eqls([
            ["section", 1, 2, 1],
            ["answer", 1, 3, 1],
            ["pretzel", 1, null, 1],
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[secIdx].stateValues.numAttemptsLeft).eq(1);
        expect(stateVariables[pIdx].stateValues.numAttemptsLeft).eq(1);
    });

    it("container nested in a section-wide check work does not use the outer section's attempts", async () => {
        // The inner section's own check-work button is not shown, but an
        // author's `<callAction>` can still submit it. That does not count
        // against the outer section, whose count both report.
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <section name="outer" sectionWideCheckWork maxNumAttempts="2">
        <section name="inner" sectionWideCheckWork>
            <answer name="ans"><mathInput name="mi" />x</answer>
        </section>
    </section>
    `);
        const outerIdx = await resolvePathToNodeIdx("outer");
        const innerIdx = await resolvePathToNodeIdx("inner");

        await core.requestAction({
            componentIdx: innerIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        const events = await submittedEvents();
        expect(
            events.map((e) => [
                e.object.componentType,
                e.result.numAttemptsLeft,
            ]),
        ).eqls([
            ["section", 2],
            ["answer", 2],
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[outerIdx].stateValues.numAttemptsLeft).eq(2);
        expect(stateVariables[innerIdx].stateValues.numAttemptsLeft).eq(2);
    });

    it("section-wide check work sends no event once its attempts are used up", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <section name="sec" sectionWideCheckWork maxNumAttempts="1">
        <answer name="ans"><mathInput name="mi" />x</answer>
    </section>
    `);
        const secIdx = await resolvePathToNodeIdx("sec");
        const miIdx = await resolvePathToNodeIdx("mi");

        await updateMathInputValue({ latex: "y", componentIdx: miIdx, core });
        await core.requestAction({
            componentIdx: secIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        let events = await submittedEvents();
        expect(events.map((e) => e.object.componentType)).eqls([
            "section",
            "answer",
        ]);
        expect(events.every((e) => e.result.numAttemptsLeft === 0)).eq(true);

        // A changed response, so the answer is not skipped as just submitted.
        await updateMathInputValue({ latex: "x", componentIdx: miIdx, core });
        await core.requestAction({
            componentIdx: secIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        events = await submittedEvents();
        expect(events.length).eq(2);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[secIdx].stateValues.numSubmissions).eq(1);
    });

    it("pretzel's own button sends no event once the enclosing section-wide check work is used up", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <section name="sec" sectionWideCheckWork maxNumAttempts="1">
        <pretzel name="p">
            <problem><statement><p>1+1</p></statement><answer>2</answer></problem>
            <problem><statement><p>1+2</p></statement><answer>3</answer></problem>
        </pretzel>
    </section>
    `);
        const secIdx = await resolvePathToNodeIdx("sec");
        const pIdx = await resolvePathToNodeIdx("p");

        await core.requestAction({
            componentIdx: secIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        let events = await submittedEvents();
        expect(events.map((e) => e.object.componentType)).eqls([
            "section",
            "pretzel",
        ]);
        expect(events.every((e) => e.result.numAttemptsLeft === 0)).eq(true);

        await submitAnswer({ componentIdx: pIdx, core });

        events = await submittedEvents();
        expect(events.length).eq(2);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[pIdx].stateValues.numSubmissions).eq(1);
    });

    it("event carries an ISO 8601 UTC timestamp and version 0.2.0", async () => {
        const { core, resolvePathToNodeIdx, submittedEvents } =
            await createCoreRecordingEvents(`
    <answer name="ans"><mathInput name="mi" />x</answer>
    `);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        const [event] = await submittedEvents();
        expect(event.version).eq("0.2.0");
        expect(event.timestamp).match(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        );
        // A real instant, which a host can parse with `new Date`.
        expect(new Date(event.timestamp).toISOString()).eq(event.timestamp);
    });
});
