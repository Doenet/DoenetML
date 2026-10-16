import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateBooleanInputValue, updateValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// The timer reads the clock through `Date.now`; tests move it by hand and
// call `tick` themselves, since the test core never runs animation frames.
let now = 1_000_000;

beforeEach(() => {
    now = 1_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
});

afterEach(() => {
    vi.restoreAllMocks();
});

async function timerAction({
    name,
    actionName,
    core,
    resolvePathToNodeIdx,
    args = {},
}: {
    name: string;
    actionName: string;
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    args?: Record<string, any>;
}) {
    await core.requestAction({
        componentIdx: await resolvePathToNodeIdx(name),
        actionName,
        args,
    });
}

async function stateValuesOf(
    name: string,
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    return stateVariables[await resolvePathToNodeIdx(name)].stateValues;
}

describe("Timer tag tests @group4", async () => {
    it("starts full and counts down from the clock", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <timer name="t" duration="120" />
    <number name="left">$t.timeRemaining</number>
    `,
        });
        const act = (actionName: string, args = {}) =>
            timerAction({
                name: "t",
                actionName,
                core,
                resolvePathToNodeIdx,
                args,
            });
        const sv = () => stateValuesOf("t", core, resolvePathToNodeIdx);

        let t = await sv();
        expect(t.timeRemaining).eq(120);
        expect(t.elapsed).eq(0);
        expect(t.text).eq("2:00");
        expect(t.running).eq(false);
        expect(t.expired).eq(false);
        expect(t.paused).eq(false);

        await act("start");
        now += 30_400;
        await act("tick");

        t = await sv();
        expect(t.running).eq(true);
        expect(t.timeRemaining).eq(90);
        expect(t.elapsed).eq(30);
        expect(t.text).eq("1:30");
        expect(
            (await stateValuesOf("left", core, resolvePathToNodeIdx)).value,
        ).eq(90);

        // a missed tick doesn't lose time: the next one catches up
        now += 59_600;
        await act("tick");
        t = await sv();
        expect(t.timeRemaining).eq(30);
        expect(t.text).eq("0:30");
    });

    it("pauses and resumes without counting the pause", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<timer name="t" duration="120" />`,
        });
        const act = (actionName: string) =>
            timerAction({ name: "t", actionName, core, resolvePathToNodeIdx });
        const sv = () => stateValuesOf("t", core, resolvePathToNodeIdx);

        await act("start");
        now += 10_000;
        await act("pause");

        let t = await sv();
        expect(t.running).eq(false);
        expect(t.paused).eq(true);
        expect(t.timeRemaining).eq(110);

        now += 100_000;
        await act("tick");
        expect((await sv()).timeRemaining).eq(110);

        await act("start");
        now += 5_000;
        await act("tick");
        t = await sv();
        expect(t.running).eq(true);
        expect(t.paused).eq(false);
        expect(t.timeRemaining).eq(105);

        // starting a running clock changes nothing
        await act("start");
        now += 1_000;
        await act("tick");
        expect((await sv()).timeRemaining).eq(104);
    });

    it("expires on a tick, or on any action after the deadline", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<timer name="t" duration="5" /><timer name="t2" duration="5" />`,
        });
        const sv = (name: string) =>
            stateValuesOf(name, core, resolvePathToNodeIdx);

        await timerAction({
            name: "t",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });
        await timerAction({
            name: "t2",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });

        now += 4_999;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        let t = await sv("t");
        expect(t.expired).eq(false);
        expect(t.timeRemaining).eq(1);

        now += 1;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        t = await sv("t");
        expect(t.expired).eq(true);
        expect(t.running).eq(false);
        expect(t.timeRemaining).eq(0);
        expect(t.text).eq("0:00");

        // no tick ever ran for t2: pausing after the deadline expires it
        await timerAction({
            name: "t2",
            actionName: "pause",
            core,
            resolvePathToNodeIdx,
        });
        const t2 = await sv("t2");
        expect(t2.expired).eq(true);
        expect(t2.paused).eq(false);
        expect(t2.timeRemaining).eq(0);
    });

    it("triggerWith fires only when time runs out; triggerWhen sees expired", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <timer name="t" duration="10" />
    <number name="n">0</number>
    <updateValue triggerWith="$t" target="$n" newValue="$n+1" type="number" />
    <boolean name="b">false</boolean>
    <updateValue triggerWhen="$t.expired" target="$b" newValue="true" type="boolean" />
    `,
        });
        const act = (actionName: string) =>
            timerAction({ name: "t", actionName, core, resolvePathToNodeIdx });
        const n = async () =>
            (await stateValuesOf("n", core, resolvePathToNodeIdx)).value;
        const b = async () =>
            (await stateValuesOf("b", core, resolvePathToNodeIdx)).value;

        await act("start");
        now += 3_000;
        await act("pause");
        await act("start");
        await act("reset");
        await act("restart");
        expect(await n()).eq(0);
        expect(await b()).eq(false);

        now += 10_000;
        await act("tick");
        expect(await n()).eq(1);
        expect(await b()).eq(true);

        // later ticks and pauses of an expired clock fire nothing
        now += 10_000;
        await act("tick");
        await act("pause");
        expect(await n()).eq(1);
    });

    it("start after expiry starts over; reset and restart", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<timer name="t" duration="60" />`,
        });
        const act = (actionName: string) =>
            timerAction({ name: "t", actionName, core, resolvePathToNodeIdx });
        const sv = () => stateValuesOf("t", core, resolvePathToNodeIdx);

        await act("start");
        now += 61_000;
        await act("tick");
        expect((await sv()).expired).eq(true);

        await act("start");
        let t = await sv();
        expect(t.expired).eq(false);
        expect(t.running).eq(true);
        expect(t.timeRemaining).eq(60);

        now += 20_000;
        await act("tick");
        expect((await sv()).timeRemaining).eq(40);

        await act("restart");
        now += 1_000;
        await act("tick");
        t = await sv();
        expect(t.running).eq(true);
        expect(t.timeRemaining).eq(59);

        await act("reset");
        t = await sv();
        expect(t.running).eq(false);
        expect(t.paused).eq(false);
        expect(t.timeRemaining).eq(60);
        now += 5_000;
        await act("tick");
        expect((await sv()).timeRemaining).eq(60);
    });

    it("setting running directly starts and pauses the clock", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <timer name="t" duration="60" />
    <updateValue name="go" target="$t.running" newValue="true" type="boolean" />
    <updateValue name="stop" target="$t.running" newValue="false" type="boolean" />
    `,
        });
        const sv = () => stateValuesOf("t", core, resolvePathToNodeIdx);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("go"),
            core,
        });
        now += 3_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        let t = await sv();
        expect(t.running).eq(true);
        expect(t.timeRemaining).eq(57);

        now += 2_000;
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("stop"),
            core,
        });
        t = await sv();
        expect(t.running).eq(false);
        expect(t.paused).eq(true);
        expect(t.timeRemaining).eq(55);

        now += 30_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        expect((await sv()).timeRemaining).eq(55);
    });

    it("a booleanInput bound to running starts and pauses the clock", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <timer name="t" duration="60" showControls="false" />
    <booleanInput name="bi" bindValueTo="$t.running">
      <label>Clock running</label>
    </booleanInput>
    `,
        });
        const sv = () => stateValuesOf("t", core, resolvePathToNodeIdx);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        now += 4_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        expect((await sv()).timeRemaining).eq(56);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        now += 20_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        const t = await sv();
        expect(t.paused).eq(true);
        expect(t.timeRemaining).eq(56);
    });

    it("keeps counting across a reload by default", async () => {
        const doenetML = `<timer name="t" duration="120" />`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await timerAction({
            name: "t",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });
        now += 20_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        await core.saveImmediately();
        const savedState = scoreState.state;

        // the page was closed for 30 seconds
        now += 30_000;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: savedState,
        }));
        let t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.running).eq(true);
        expect(t.timeRemaining).eq(70);

        // closed past the deadline: expired on load
        now += 100_000;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: savedState,
        }));
        t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.running).eq(false);
        expect(t.expired).eq(true);
        expect(t.timeRemaining).eq(0);
    });

    it("keeps a paused clock paused across a reload", async () => {
        const doenetML = `<timer name="t" duration="120" />`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await timerAction({
            name: "t",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });
        now += 20_000;
        await timerAction({
            name: "t",
            actionName: "pause",
            core,
            resolvePathToNodeIdx,
        });
        await core.saveImmediately();

        now += 300_000;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        const t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.running).eq(false);
        expect(t.paused).eq(true);
        expect(t.timeRemaining).eq(100);
    });

    it('reloadBehavior="reset" starts over on reload', async () => {
        const doenetML = `<timer name="t" duration="120" reloadBehavior="reset" />`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await timerAction({
            name: "t",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });
        now += 20_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        await core.saveImmediately();

        now += 5_000;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        const t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.running).eq(false);
        expect(t.timeRemaining).eq(120);
    });

    it("autoStart starts once, not again after a reload", async () => {
        const doenetML = `<timer name="t" duration="10" autoStart />`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        let t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.running).eq(true);

        now += 11_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        await core.saveImmediately();

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.running).eq(false);
        expect(t.expired).eq(true);
    });

    it("a clock that goes backwards counts no time", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<timer name="t" duration="60" />`,
        });

        await timerAction({
            name: "t",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });
        now -= 50_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        const t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.timeRemaining).eq(60);
        expect(t.expired).eq(false);
    });

    it("displayMode and format", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <timer name="rem" duration="3725" />
    <timer name="el" duration="3725" displayMode="elapsed" />
    <timer name="sec" duration="90" format="s" />
    <timer name="bad" duration="-4" />
    `,
        });
        const sv = (name: string) =>
            stateValuesOf(name, core, resolvePathToNodeIdx);

        expect((await sv("rem")).text).eq("1:02:05");
        expect((await sv("el")).text).eq("0:00");
        expect((await sv("sec")).text).eq("90");
        expect((await sv("bad")).text).eq("0:00");
        expect((await sv("bad")).timeRemaining).eq(0);

        await timerAction({
            name: "el",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });
        now += 65_500;
        await timerAction({
            name: "el",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        expect((await sv("el")).text).eq("1:05");
    });

    it("a reference to the timer shows and controls the same clock", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <timer name="t" duration="60" autoStart />
    <p name="p">$t</p>
    <number name="n">0</number>
    <updateValue triggerWith="$t" target="$n" newValue="$n+1" type="number" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const copyIdx =
            stateVariables[await resolvePathToNodeIdx("p")].activeChildren[0]
                .componentIdx;
        const copy = async () =>
            (await core.returnAllStateVariables(false, true))[copyIdx]
                .stateValues;
        const sv = () => stateValuesOf("t", core, resolvePathToNodeIdx);

        expect((await sv()).running).eq(true);
        expect((await copy()).running).eq(true);

        now += 10_000;
        await core.requestAction({
            componentIdx: copyIdx,
            actionName: "pause",
            args: {},
        });
        expect((await sv()).paused).eq(true);
        expect((await sv()).timeRemaining).eq(50);
        expect((await copy()).text).eq("0:50");

        await core.requestAction({
            componentIdx: copyIdx,
            actionName: "start",
            args: {},
        });
        now += 50_000;
        await core.requestAction({
            componentIdx: copyIdx,
            actionName: "tick",
            args: {},
        });
        expect((await sv()).expired).eq(true);
        expect((await copy()).expired).eq(true);
        expect((await stateValuesOf("n", core, resolvePathToNodeIdx)).value).eq(
            1,
        );
    });

    it("does not count in a read-only view", async () => {
        const doenetML = `<timer name="t" duration="120" />`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await timerAction({
            name: "t",
            actionName: "start",
            core,
            resolvePathToNodeIdx,
        });
        now += 20_000;
        await timerAction({
            name: "t",
            actionName: "tick",
            core,
            resolvePathToNodeIdx,
        });
        await core.saveImmediately();

        // past the deadline, but a read-only view shows what was saved
        now += 500_000;
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
            flags: { readOnly: true },
        }));
        const t = await stateValuesOf("t", core, resolvePathToNodeIdx);
        expect(t.expired).eq(false);
        expect(t.disabled).eq(true);
    });
});
