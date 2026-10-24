import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveLine,
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
                await h.setBoolean("b", boolean);
            },
            async setBoolean(name: string, boolean: boolean) {
                await updateBooleanInputValue({
                    boolean,
                    componentIdx: await resolvePathToNodeIdx(name),
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
            async moveLine(name: string, point1: number[], point2: number[]) {
                await moveLine({
                    componentIdx: await resolvePathToNodeIdx(name),
                    point1coords: point1,
                    point2coords: point2,
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

    it("applies nothing saved of a copy of a component named in one case to a copy from another", async () => {
        // The copied `<p>` is in a case's group, not itself a replacement of
        // the conditionalContent.
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><p name="p"><mathInput name="a" prefill="1" /></p></case>
        <else><p name="p"><textInput name="a" prefill="hi" /></p></else>
    </conditionalContent>
    <p copy="$cc.p" name="cp" />
    `);
        await h.typeMath("cp.a", "7");
        expect(await h.math("cp.a")).eq(7);
        await h.setB(false);
        await h.reload();
        const t = await h.sv("cp.a");
        expect(t.componentType).eq("textInput");
        expect(t.stateValues.value).eq("hi");
    });

    for (const source of ["cc", "e"]) {
        it(`names the case a copy was made from, made as $${source} changes case`, async () => {
            // `cc2` comes first, so when `b` changes, its else's copy is made
            // while `cc` (and `e`) still hold the case's replacements: the
            // copy is a mathInput, though `cc` now selects its else.
            const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc2">
        <case condition="$b"><p copy="$${source}.p" name="cp" /></case>
        <else><p copy="$${source}.p" name="cp" /></else>
    </conditionalContent>
    <conditionalContent name="cc">
        <case condition="$b"><p name="p"><mathInput name="a" prefill="1" /></p></case>
        <else><p name="p"><textInput name="a" prefill="hi" /></p></else>
    </conditionalContent>
    <conditionalContent extend="$cc" name="e" />
    `);
            await h.setB(false);
            expect((await h.sv("cc2.cp.a")).componentType).eq("mathInput");
            await h.typeMath("cc2.cp.a", "7");
            await h.reload();
            const t = await h.sv("cc2.cp.a");
            expect(t.componentType).eq("textInput");
            expect(t.stateValues.value).eq("hi");
            expect(t.stateValues.numWords).eq(1);
        });
    }

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

    it("keeps a submission that makes another case active", async () => {
        // the case is switched by a trigger while the submission is still
        // being made, before its writes are saved
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b">
            <answer name="ans"><mathInput name="mi" /><award>x</award></answer>
            <updateValue triggerWhen="$ans.creditAchieved = 1" target="$b" newValue="false" type="boolean" />
        </case>
        <else>done</else>
    </conditionalContent>
    `);
        async function check(credit: number, numSubmissions: number) {
            const ans = (await h.sv("cc.ans")).stateValues;
            expect(ans.creditAchieved).eq(credit);
            expect(ans.numSubmissions).eq(numSubmissions);
        }
        await h.typeMath("cc.mi", "y");
        await h.submit("cc.ans");
        await check(0, 1);
        await h.typeMath("cc.mi", "x");
        await h.submit("cc.ans");
        expect((await h.sv("b")).stateValues.value).eq(false);
        await h.setB(true);
        await check(1, 2);
        await h.reload();
        await check(1, 2);
    });

    it("keeps the first change to an input that makes another case active", async () => {
        // nothing was saved of the input before the change
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b">
            <booleanInput name="bi" />
            <updateValue triggerWhen="$bi" target="$b" newValue="false" type="boolean" />
        </case>
        <else>done</else>
    </conditionalContent>
    `);
        await h.setBoolean("cc.bi", true);
        expect((await h.sv("b")).stateValues.value).eq(false);
        await h.setB(true);
        expect((await h.sv("cc.bi")).stateValues.value).eq(true);
        await h.reload();
        expect((await h.sv("cc.bi")).stateValues.value).eq(true);
    });

    it("keeps the first change to an input whose case is hidden and shown again in one update", async () => {
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b">
            <booleanInput name="bi" />
            <updateValue triggerWhen="$bi" target="$b" newValue="false" type="boolean" />
        </case>
        <else>done</else>
    </conditionalContent>
    <updateValue triggerWhen="not $b" target="$b" newValue="true" type="boolean" />
    `);
        await h.setBoolean("cc.bi", true);
        expect((await h.sv("b")).stateValues.value).eq(true);
        expect((await h.sv("cc.bi")).stateValues.value).eq(true);
    });

    it("keeps the move of a line that makes another case active", async () => {
        // a line with no points given keeps its own, saved by entry, which a
        // second move merges into
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b">
            <graph><line name="l" /></graph>
            <updateValue triggerWhen="$l.point1.x > 5" target="$b" newValue="false" type="boolean" />
        </case>
        <else>done</else>
    </conditionalContent>
    `);
        async function point1() {
            return (await h.sv("cc.l")).stateValues.points[0].map(
                (x: any) => x.tree,
            );
        }
        await h.moveLine("cc.l", [2, 2], [3, 4]);
        expect(await point1()).eqls([2, 2]);
        await h.moveLine("cc.l", [6, 2], [7, 4]);
        expect((await h.sv("b")).stateValues.value).eq(false);
        await h.setB(true);
        expect(await point1()).eqls([6, 2]);
        await h.reload();
        expect(await point1()).eqls([6, 2]);
    });

    it("keeps a change to a math with a literal child that makes another case active", async () => {
        // the input writes to the math's literal child, which is saved apart
        // from the math's essential state
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b">
            <math name="m">1</math>
            <mathInput name="mi" bindValueTo="$m" />
            <updateValue triggerWhen="$m = 5" target="$b" newValue="false" type="boolean" />
        </case>
        <else>done</else>
    </conditionalContent>
    `);
        await h.typeMath("cc.mi", "3");
        expect(await h.math("cc.m")).eq(3);
        await h.typeMath("cc.mi", "5");
        expect((await h.sv("b")).stateValues.value).eq(false);
        await h.setB(true);
        expect(await h.math("cc.m")).eq(5);
        await h.reload();
        expect(await h.math("cc.m")).eq(5);
    });

    it("a copy from a single case keeps what was entered through a reload while the case is hidden", async () => {
        // a single case is withheld, not made again, so a copy of it is not
        // told apart by case
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b"><mathInput name="a" prefill="1" /></case>
    </conditionalContent>
    <mathInput copy="$cc.a" name="c" />
    `);
        await h.typeMath("c", "5");
        await h.setB(false);
        expect(await h.math("c")).eq(5);
        await h.reload();
        expect(await h.math("c")).eq(5);
        await h.setB(true);
        expect(await h.math("c")).eq(5);
    });

    it("forgets what was kept of a case once its conditionalContent is deleted", async () => {
        // each change of `ex` makes the iterations, and the
        // conditionalContent in them, again; the inner repeat's inputs have
        // ids made as it runs, which its case's DoenetML does not name
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <p><mathInput name="ex" prefill="7" /></p>
    <repeatForSequence name="r" from="1" to="2" exclude="$ex">
        <conditionalContent name="cc">
            <case condition="$b">
                <mathInput name="mi" />
                <repeatForSequence name="inner" from="1" to="2"><mathInput name="mj" /></repeatForSequence>
            </case>
            <else>no</else>
        </conditionalContent>
    </repeatForSequence>
    `);
        await h.typeMath("r[1].cc.mi", "3");
        await h.typeMath("r[1].cc.inner[2].mj", "4");
        await h.setB(false);
        let saved = await h.reload();
        expect(Object.keys(saved).some((key) => key.startsWith("/~r|"))).eq(
            true,
        );

        await h.typeMath("ex", "8");
        saved = await h.reload();
        expect(Object.keys(saved).some((key) => key.startsWith("/~r|"))).eq(
            false,
        );
    });

    it("applies nothing kept of one case of an extend to another case", async () => {
        // The extend's answers are shadows of the cases' answers, made at the
        // same position in each case. The else answer starts with no credit,
        // and the case answer gets its credit back.
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
        <case condition="$b">
            <answer name="ans"><mathInput name="mi" /><award>x</award></answer>
        </case>
        <else>
            <answer name="ans"><mathInput name="mi" /><award>y</award></answer>
        </else>
    </conditionalContent>
    <conditionalContent extend="$cc" name="e" />
    `);
        async function check(credit: number, justSubmitted: boolean) {
            const ans = (await h.sv("e.ans")).stateValues;
            expect(ans.creditAchieved).eq(credit);
            expect(ans.justSubmitted).eq(justSubmitted);
        }
        await h.typeMath("e.mi", "x");
        await h.submit("e.ans");
        await check(1, true);
        await h.setB(false);
        await check(0, false);
        await h.setB(true);
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
