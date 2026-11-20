import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    updateMathInputImmediateValue,
    updateMathInputValue,
    updateMatrixInputImmediateValue,
    updateTextInputImmediateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An input that isn't focused never shows an edit that wasn't entered (D50,
 * SAVE-1; #2598 item 5). The renderer enters an edit when the input loses
 * focus, but a graph drag doesn't take focus from it, and a condition can
 * read `$mi.immediateValue` as the reader types. So the core enters, when it
 * is made or shown again, the edit of any input made from saved state,
 * carried by a `copyWithState`, or withheld while the reader edited it, other
 * than the input the reader is editing.
 */

/**
 * A document, with what a test does to it by name, and a reload from what a
 * save holds.
 */
async function setup(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });
    return {
        core: () => core,
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
        async reload() {
            await core.saveImmediately();
            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML,
                initialState: scoreState.state,
            }));
        },
    };
}

describe("An input that isn't focused shows no edit not entered @group2", () => {
    it("a copyWithState made by a drag enters the edit it carries", async () => {
        const h = await setup(`
    <mathInput name="mi" prefill="1"/>
    <graph><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x > 1"><mathInput name="c" copyWithState="$mi"/></case>
    </conditionalContent>`);
        await h.editMath("mi", "4");
        // the drag doesn't take focus from `mi`
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
