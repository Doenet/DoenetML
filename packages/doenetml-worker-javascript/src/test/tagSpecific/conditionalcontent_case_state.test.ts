import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * What a reader enters in a case of a `<conditionalContent>` stays with that
 * case: through another case becoming active and back, and through a reload,
 * in the `<conditionalContent>` and in a copy of it.
 */
describe("Reader state in the cases of a conditionalContent @group2", async () => {
    async function setup(doenetML: string) {
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        const h = {
            async sv(name: string) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[await resolvePathToNodeIdx(name)];
            },
            async math(name: string) {
                return (await h.sv(name)).stateValues.value.tree;
            },
            async setB(boolean: boolean) {
                await updateBooleanInputValue({
                    boolean,
                    componentIdx: await resolvePathToNodeIdx("b"),
                    core,
                });
            },
            async typeMath(name: string, latex: string) {
                await updateMathInputValue({
                    latex,
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            },
            async typeText(name: string, text: string) {
                await updateTextInputValue({
                    text,
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            },
            async submit(name: string) {
                await submitAnswer({
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            },
            async reload() {
                await core.saveImmediately();
                const state = scoreState.state;
                ({ core, resolvePathToNodeIdx, scoreState } =
                    await createTestCore({ doenetML, initialState: state }));
                return JSON.parse(state);
            },
        };
        return h;
    }

    const caseElse = `
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><mathInput name="a" prefill="1" /></case>
        <else><mathInput name="t" prefill="2" /></else>
    </conditionalContent>
    `;

    it("keeps what was entered in a case once another case is active and back", async () => {
        const h = await setup(caseElse);
        await h.typeMath("cc.a", "5");
        await h.setB(false);
        expect(await h.math("cc.t")).eq(2);
        await h.typeMath("cc.t", "6");
        await h.setB(true);
        expect(await h.math("cc.a")).eq(5);
        await h.setB(false);
        expect(await h.math("cc.t")).eq(6);
    });

    it("keeps what was entered in an inactive case through a reload", async () => {
        const h = await setup(caseElse);
        await h.typeMath("cc.a", "5");
        await h.setB(false);
        await h.reload();
        expect(await h.math("cc.t")).eq(2);
        await h.setB(true);
        expect(await h.math("cc.a")).eq(5);
    });

    // An unlinked copy keeps the case it was made from until a reload makes
    // it again, from whichever case is then active.
    it("applies nothing saved of one case of a copy to another case", async () => {
        const h = await setup(caseElse + `<group copy="$cc" name="c" />`);
        await h.typeMath("c.a", "7");
        await h.setB(false);
        expect(await h.math("c.a")).eq(7);
        await h.reload();
        expect(await h.math("c.t")).eq(2);
        expect(await h.math("cc.t")).eq(2);
    });

    it("applies what was saved of a copy made from the same case", async () => {
        const h = await setup(caseElse + `<group copy="$cc" name="c" />`);
        await h.typeMath("c.a", "7");
        await h.setB(false);
        await h.setB(true);
        await h.reload();
        expect(await h.math("c.a")).eq(7);
        expect(await h.math("cc.a")).eq(1);
    });

    it("applies nothing saved of a mathInput in one case of a copy to a textInput in another", async () => {
        // #2246, different types
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><mathInput name="a" prefill="1" /></case>
        <else><textInput name="t" prefill="hi" /></else>
    </conditionalContent>
    <group copy="$cc" name="c" />
    `);
        await h.typeMath("c.a", "7");
        await h.setB(false);
        await h.reload();
        const t = await h.sv("c.t");
        expect(t.stateValues.value).eq("hi");
        expect(t.stateValues.numWords).eq(1);
    });

    it("keeps an answer's submission in a case once another case is active and back", async () => {
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b">
            <answer name="ans"><mathInput name="mi" /><award>x</award></answer>
        </case>
        <else>
            <answer name="ans2"><mathInput name="mj" /><award>y</award></answer>
        </else>
    </conditionalContent>
    `);
        async function check(credit: number, justSubmitted: boolean) {
            const ans = (await h.sv("cc.ans")).stateValues;
            expect(ans.creditAchieved).eq(credit);
            expect(ans.justSubmitted).eq(justSubmitted);
            expect(ans.numSubmissions).eq(1);
            expect((await h.sv("_document1")).stateValues.creditAchieved).eq(
                credit,
            );
        }
        await h.typeMath("cc.mi", "x");
        await h.submit("cc.ans");
        await check(1, true);
        await h.setB(false);
        expect((await h.sv("_document1")).stateValues.creditAchieved).eq(0);
        await h.setB(true);
        await check(1, true);
        await h.reload();
        await check(1, true);
    });

    it("references from outside a case follow the active case", async () => {
        // An `extend` of a component in a case is made again as a shadow of
        // the active case's component, and takes nothing kept of the other's.
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><mathInput name="a" prefill="1" /></case>
        <else><mathInput name="a" prefill="2" /></else>
    </conditionalContent>
    <mathInput extend="$cc.a" name="x" />
    <math name="y">$cc.a</math>
    `);
        async function check(value: number) {
            expect(await h.math("cc.a")).eq(value);
            expect(await h.math("x")).eq(value);
            expect(await h.math("y")).eq(value);
        }
        await h.typeMath("x", "5");
        await check(5);
        await h.setB(false);
        await check(2);
        await h.typeMath("x", "6");
        await check(6);
        await h.setB(true);
        await check(5);
        await h.reload();
        await check(5);
        await h.setB(false);
        await check(6);
    });
});
