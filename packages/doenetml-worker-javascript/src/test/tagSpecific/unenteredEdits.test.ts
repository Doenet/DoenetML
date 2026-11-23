import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    updateMathInputImmediateValue,
    updateMathInputValue,
    updateFractionInputImmediateValue,
    updateMatrixInputImmediateValue,
    updateTextInputImmediateValue,
    updateBooleanInputValue,
} from "../utils/actions";
import { ENTERED_BY_CORE } from "../../utils/input";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An input that isn't focused never shows an edit that wasn't entered (D50,
 * SAVE-1; #2598 item 5). The renderer enters an edit when the input loses
 * focus, but a graph drag may not take focus from it, and a condition can
 * read `$mi.immediateValue` as the reader types. So the core enters, when it
 * is made or shown again, the edit of any input made from saved state,
 * carried by a `copyWithState`, or withheld while the reader edited it (for
 * an `extend`, in the input it extends), other than the input the reader is
 * editing. A drag here is a core request, which takes focus from nothing.
 */

/**
 * A document, with what a test does to it by name, and a reload from what a
 * save holds.
 */
async function setup(
    doenetML: string,
    { flags = {} }: { flags?: Record<string, unknown> } = {},
) {
    // every event recorded, by the core loaded last
    let events: Record<string, any>[] = [];
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
        flags,
        sendEvent: (payload) => events.push(payload),
    });
    return {
        core: () => core,
        /** The `answered` events recorded, each `[name, response]`. */
        async answered() {
            await core.core!.processQueue.runExclusive(async () => {});
            const answered = [];
            for (const event of events.filter((e) => e.verb === "answered")) {
                const object = JSON.parse(event.object);
                const result = JSON.parse(event.result);
                answered.push([object.componentIdx, result.response]);
            }
            return answered;
        },
        async idx(name: string) {
            return await resolvePathToNodeIdx(name);
        },
        async sv(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)];
        },
        /** `value / immediateValue` of the named input, a math by its tree. */
        async shown(name: string) {
            const { value, immediateValue } = (await this.sv(name)).stateValues;
            const show = (v: any) => JSON.stringify(v?.tree ?? v);
            return `${show(value)} / ${show(immediateValue)}`;
        },
        async editMath(name: string, latex: string) {
            await updateMathInputImmediateValue({
                latex,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        },
        async editText(name: string, text: string) {
            await updateTextInputImmediateValue({
                text,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        },
        async drag(name: string, x: number) {
            await movePoint({
                componentIdx: await resolvePathToNodeIdx(name),
                x,
                y: 0,
                core,
            });
        },
        /**
         * Load again from what a save holds, with `doenetML` (or the same
         * DoenetML) and `flags`.
         */
        async reload({
            doenetML: newDoenetML = doenetML,
            flags: newFlags = flags,
        }: {
            doenetML?: string;
            flags?: Record<string, unknown>;
        } = {}) {
            await core.saveImmediately();
            events = [];
            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML: newDoenetML,
                initialState: scoreState.state,
                flags: newFlags,
                sendEvent: (payload) => events.push(payload),
            }));
        },
    };
}

type Harness = Awaited<ReturnType<typeof setup>>;

describe("An input that isn't focused shows no edit not entered @group2", () => {
    it("a copyWithState made by a drag enters the edit it carries", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x > 1"><mathInput name="c" copyWithState="$mi"/></case>
    </conditionalContent>`);
        await h.editMath("mi", "4");
        // a drag that doesn't take focus from `mi`
        await h.drag("P", 2);
        expect(await h.shown("mi")).eq("1 / 4");
        expect(await h.shown("cc.c")).eq("4 / 4");
        expect((await h.sv("cc.c")).stateValues.rawRendererValue).eq("4");

        // and after a reload nothing is being edited
        await h.reload();
        expect(await h.shown("mi")).eq("4 / 4");
        expect(await h.shown("cc.c")).eq("4 / 4");
    });

    it("a copyWithState shown as the reader types enters the edit it carries, but not the input typed into", async () => {
        const h = await setup(`
    <textInput name="ti" prefill="a"/>
    <conditionalContent name="cc">
      <case condition="$ti.immediateValue = b"><textInput name="c" copyWithState="$ti"/></case>
    </conditionalContent>`);
        await h.editText("ti", "b");
        expect(await h.shown("ti")).eq('"a" / "b"');
        expect(await h.shown("cc.c")).eq('"b" / "b"');

        await h.reload();
        expect(await h.shown("ti")).eq('"b" / "b"');
        expect(await h.shown("cc.c")).eq('"b" / "b"');
    });

    it("content made as the reader types leaves the edit of the input typed into", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1"/>
    <conditionalContent>
      <case condition="$mi.immediateValue > 3"><mathInput name="other" prefill="2"/></case>
    </conditionalContent>
    <repeatForSequence length="$mi.immediateValue"><mathInput/></repeatForSequence>`);
        await h.editMath("mi", "4");
        expect(await h.shown("mi")).eq("1 / 4");
    });

    for (const withElse of [false, true]) {
        it(`an input in a case a drag hides enters its edit when shown again${withElse ? ", with an else" : ""}`, async () => {
            // A drag hides the case while the reader is editing the input in
            // it, which the input's blur may or may not enter.
            const h = await setup(`
    <mathInput name="x" prefill="1"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x < 1"><mathInput name="w" bindValueTo="$x"/></case>
      ${withElse ? "<else>no</else>" : ""}
    </conditionalContent>`);
            await h.editMath("cc.w", "4");
            await h.drag("P", 2);
            await h.drag("P", 0);
            expect(await h.shown("cc.w")).eq("4 / 4");
            expect(await h.shown("x")).eq("4 / 4");

            // and through a reload, hidden as it is
            await h.editMath("cc.w", "6");
            await h.drag("P", 2);
            await h.reload();
            await h.drag("P", 0);
            expect(await h.shown("cc.w")).eq("6 / 6");
            expect(await h.shown("x")).eq("6 / 6");
        });

        it(`an edit its value replaced while withheld is not entered when shown again${withElse ? ", with an else" : ""}`, async () => {
            const h = await setup(`
    <mathInput name="x" prefill="1"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x < 1"><mathInput name="w" bindValueTo="$x"/></case>
      ${withElse ? "<else>no</else>" : ""}
    </conditionalContent>`);
            await h.editMath("cc.w", "4");
            await h.drag("P", 2);
            await updateMathInputValue({
                latex: "8",
                componentIdx: await h.idx("x"),
                core: h.core(),
            });
            await h.drag("P", 0);
            expect(await h.shown("cc.w")).eq("8 / 8");
            expect(await h.shown("x")).eq("8 / 8");
        });
    }

    for (const withElse of [false, true]) {
        it(`an edit typed into an extend a drag hides is entered in its source${withElse ? ", with an else" : ""}`, async () => {
            // The extend shows its source's edit, which the source, still
            // shown and not focused, would otherwise keep showing.
            const h = await setup(`
    <mathInput name="a" prefill="1"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x < 1"><mathInput name="e" extend="$a"/></case>
      ${withElse ? "<else>no</else>" : ""}
    </conditionalContent>`);
            await h.editMath("cc.e", "4");
            expect(await h.shown("a")).eq("1 / 4");
            await h.drag("P", 2);
            expect(await h.shown("a")).eq("4 / 4");
            await h.drag("P", 0);
            expect(await h.shown("a")).eq("4 / 4");
            expect(await h.shown("cc.e")).eq("4 / 4");
        });
    }

    it("an extend made, or shown again, leaves the edit of the input typed into, through another extend", async () => {
        const h = await setup(`
    <mathInput name="a" prefill="1"/>
    <mathInput name="e" extend="$a"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x > 1"><mathInput name="f" extend="$a"/></case>
    </conditionalContent>`);
        await h.editMath("e", "4");
        await h.drag("P", 2);
        expect(await h.shown("a")).eq("1 / 4");
        expect(await h.shown("cc.f")).eq("1 / 4");
        await h.drag("P", 0);
        await h.drag("P", 2);
        expect(await h.shown("e")).eq("1 / 4");
    });

    it("a reload enters the edit of every input, not only the last edited", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1"/>
    <textInput name="ti" prefill="a"/>
    <mathInput name="mi2" prefill="2"/>`);
        await h.editMath("mi", "4");
        await h.editText("ti", "b");
        await h.editMath("mi2", "5");
        await h.reload();
        expect(await h.shown("mi")).eq("4 / 4");
        expect(await h.shown("ti")).eq('"b" / "b"');
        expect(await h.shown("mi2")).eq("5 / 5");
    });

    it("a reload enters the edit of a code editor and of a fraction input's part", async () => {
        const h = await setup(`
    <codeEditor name="ce" prefill="a"/>
    <fractionInput name="fi" prefillNumerator="1" prefillDenominator="2"/>
    <mathInput name="mi" prefill="1"/>`);
        await h.editText("ce", "b");
        await updateFractionInputImmediateValue({
            latex: "3",
            componentIdx: await h.idx("fi"),
            part: "numerator",
            core: h.core(),
        });
        // the input edited last, which a reload entered before (#2598)
        await h.editMath("mi", "4");
        await h.reload();
        expect(await h.shown("ce")).eq('"b" / "b"');
        expect(await h.shown("fi")).eq('["/",3,2] / ["/",3,2]');
        expect(await h.shown("mi")).eq("4 / 4");
    });

    it("a copyWithState of a matrix input made by a drag enters the edit it carries", async () => {
        const h = await setup(`
    <matrixInput name="mx" numRows="1" numColumns="1" prefill="1"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x > 1"><matrixInput name="mxc" copyWithState="$mx"/></case>
    </conditionalContent>`);
        await updateMatrixInputImmediateValue({
            latex: "4",
            componentIdx: await h.idx("mx"),
            rowInd: 0,
            colInd: 0,
            core: h.core(),
        });
        await h.drag("P", 2);
        const entry = (matrix: any) => matrix.tree[2][1][1];
        const mx = (await h.sv("mx")).stateValues;
        expect(entry(mx.value)).eq(1);
        expect(entry(mx.immediateValue)).eq(4);
        const mxc = (await h.sv("cc.mxc")).stateValues;
        expect(entry(mxc.value)).eq(4);
        expect(entry(mxc.immediateValue)).eq(4);
    });
});

/**
 * A disabled input can't be focused, so it is treated as a withheld one is
 * (D50 decision 2, #2614 item 4): its edit not entered is entered when it
 * becomes disabled, or when it is made disabled, as at a reload, with the
 * `answered` event a blur would record. Under `readOnly`, an edit not
 * entered is entered with no event, so the input shows its value and
 * nothing is reported (D50 decision 3, #2614 item 5).
 */
describe("A disabled or read-only input shows no edit not entered @group2", () => {
    // one input of each kind of `updateValue` action
    const kinds = [
        {
            kind: "math input",
            input: `<mathInput name="i" prefill="1" disabled="$P.x > 1"/>`,
            edit: (h: Harness) => h.editMath("i", "4"),
            before: "1 / 4",
            after: "4 / 4",
            response: 4,
        },
        {
            kind: "text input",
            input: `<textInput name="i" prefill="a" disabled="$P.x > 1"/>`,
            edit: (h: Harness) => h.editText("i", "b"),
            before: '"a" / "b"',
            after: '"b" / "b"',
            response: "b",
        },
        {
            kind: "fraction input's part",
            input: `<fractionInput name="i" prefillNumerator="1" prefillDenominator="2" disabled="$P.x > 1"/>`,
            edit: async (h: Harness) =>
                await updateFractionInputImmediateValue({
                    latex: "3",
                    componentIdx: await h.idx("i"),
                    part: "numerator",
                    core: h.core(),
                }),
            before: '["/",1,2] / ["/",3,2]',
            after: '["/",3,2] / ["/",3,2]',
            response: 3,
        },
    ];

    for (const { kind, input, edit, before, after, response } of kinds) {
        it(`a ${kind} disabled while it holds an edit enters it, with the event a blur records`, async () => {
            const h = await setup(`
    ${input}
    <graph><point name="P">(0,0)</point></graph>`);
            await edit(h);
            expect(await h.shown("i")).eq(before);
            expect(await h.answered()).eqls([]);

            // a drag that doesn't take focus from the input disables it
            await h.drag("P", 2);
            expect(await h.shown("i")).eq(after);
            const answered = await h.answered();
            expect(answered.length).eq(1);
            expect(answered[0][1]).eqls(response);

            // enabled again, it shows its value
            await h.drag("P", 0);
            expect(await h.shown("i")).eq(after);

            await h.reload();
            expect(await h.shown("i")).eq(after);
        });
    }

    it("an input disabled as the reader types into it enters the edit", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1" disabled="$mi.immediateValue > 3"/>
    <math name="m">$mi</math>`);
        await h.editMath("mi", "2");
        expect(await h.shown("mi")).eq("1 / 2");
        await h.editMath("mi", "4");
        expect(await h.shown("mi")).eq("4 / 4");
        expect((await h.sv("m")).stateValues.value.tree).eq(4);
        expect((await h.answered()).length).eq(1);
    });

    it("an input disabled by committing another input enters the edit", async () => {
        // the copy's edit, entered, disables the input being edited
        const h = await setup(`
    <mathInput name="mi" prefill="1" disabled="$cc.c.value > 3"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x > 1"><mathInput name="c" copyWithState="$mi"/></case>
    </conditionalContent>`);
        await h.editMath("mi", "4");
        await h.drag("P", 2);
        expect(await h.shown("cc.c")).eq("4 / 4");
        expect((await h.sv("mi")).stateValues.disabled).eq(true);
        expect(await h.shown("mi")).eq("4 / 4");
        expect((await h.answered()).length).eq(2);
    });

    it("an input made disabled at a reload enters the edit it was saved with", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1"/>
    <math name="m">$mi</math>`);
        await h.editMath("mi", "4");
        expect(await h.shown("mi")).eq("1 / 4");

        // the same document, but the input is now disabled
        await h.reload({
            doenetML: `
    <mathInput name="mi" prefill="1" disabled/>
    <math name="m">$mi</math>`,
        });
        expect(await h.shown("mi")).eq("4 / 4");
        expect((await h.sv("m")).stateValues.value.tree).eq(4);
        expect((await h.answered()).length).eq(1);
    });

    it("an input disabled in a case shown again enters the edit it was withheld with", async () => {
        const h = await setup(`
    <graph><point name="P">(0,0)</point></graph>
    <booleanInput name="d"/>
    <conditionalContent name="cc">
      <case condition="$P.x < 1"><mathInput name="w" prefill="1" disabled="$d"/></case>
    </conditionalContent>`);
        await h.editMath("cc.w", "4");
        // hidden while edited, which a blur may or may not enter
        await h.drag("P", 2);
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await h.idx("d"),
            core: h.core(),
        });
        await h.drag("P", 0);
        expect(await h.shown("cc.w")).eq("4 / 4");
    });

    it("under readOnly, a reload enters the edit with no event", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1"/>
    <textInput name="ti" prefill="a"/>
    <math name="m">$mi</math>`);
        await h.editText("ti", "b");
        await h.editMath("mi", "4");
        expect(await h.shown("mi")).eq("1 / 4");

        await h.reload({ flags: { readOnly: true } });
        expect(await h.shown("mi")).eq("4 / 4");
        expect(await h.shown("ti")).eq('"b" / "b"');
        expect((await h.sv("m")).stateValues.value.tree).eq(4);
        expect(await h.answered()).eqls([]);

        // and the reader still can't change anything
        await h.editMath("mi", "5");
        expect(await h.shown("mi")).eq("4 / 4");
    });

    it("under readOnly, a disabled input's edit is entered with no event", async () => {
        const h = await setup(`<mathInput name="mi" prefill="1"/>`);
        await h.editMath("mi", "4");
        await h.reload({
            doenetML: `<mathInput name="mi" prefill="1" disabled/>`,
            flags: { readOnly: true },
        });
        expect(await h.shown("mi")).eq("4 / 4");
        expect(await h.answered()).eqls([]);
    });

    // An action chained to the input (`triggerWith`) runs when the core
    // enters a disabled input's edit, as when the reader enters it.
    it("a disabled input's edit, entered, runs the actions chained to it", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1" disabled="$P.x > 1"/>
    <graph><point name="P">(0,0)</point></graph>
    <number name="count">0</number>
    <updateValue name="uv" target="$count" newValue="$count+1" type="number" triggerWith="$mi"/>`);
        await h.editMath("mi", "4");
        expect((await h.sv("count")).stateValues.value).eq(0);
        await h.drag("P", 2);
        expect(await h.shown("mi")).eq("4 / 4");
        expect((await h.sv("count")).stateValues.value).eq(1);
    });

    it("a reader's updateValue still does nothing for a disabled input", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1" disabled="$b"/>
    <booleanInput name="b"/>`);
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await h.idx("b"),
            core: h.core(),
        });
        // what a renderer sends, which can't carry the core's argument
        await h.core().requestAction({
            componentIdx: await h.idx("mi"),
            actionName: "updateRawValue",
            args: { rawRendererValue: "4" },
        });
        await h.core().requestAction({
            componentIdx: await h.idx("mi"),
            actionName: "updateValue",
            args: {},
        });
        expect(await h.shown("mi")).eq("1 / 1");
        expect(await h.answered()).eqls([]);
    });
});

/**
 * Each input is committed on its own, outside the request that made it
 * (#2614 item 6): an error committing one is logged, and neither rejects the
 * request, whose work is done, nor drops the other inputs.
 */
describe("An error committing an edit @group2", () => {
    it("doesn't reject the request, or drop the other inputs", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x > 1">
        <mathInput name="c1" copyWithState="$mi"/>
        <mathInput name="c2" copyWithState="$mi"/>
      </case>
    </conditionalContent>`);
        await h.editMath("mi", "4");

        const core = h.core().core!;
        const performAction = core.performAction.bind(core);
        let thrown = 0;
        const spy = vi
            .spyOn(core, "performAction")
            .mockImplementation(async (args: any) => {
                // the first input the core commits
                if (args.args?.[ENTERED_BY_CORE] && thrown === 0) {
                    thrown++;
                    throw Error("committing failed");
                }
                return await performAction(args);
            });
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        let logged: unknown[][] = [];
        try {
            await expect(h.drag("P", 2)).resolves.toBeUndefined();
            logged = [...consoleError.mock.calls];
        } finally {
            spy.mockRestore();
            consoleError.mockRestore();
        }
        expect(thrown).eq(1);
        // logged, not lost
        expect(logged.map(([e]) => (e as Error)?.message)).toContain(
            "committing failed",
        );
        const shown = [await h.shown("cc.c1"), await h.shown("cc.c2")];
        // the one that threw still shows the edit, the other entered it
        expect(shown.sort()).eqls(["1 / 4", "4 / 4"]);
        expect((await h.sv("P")).stateValues.xs[0].tree).eq(2);
    });
});
