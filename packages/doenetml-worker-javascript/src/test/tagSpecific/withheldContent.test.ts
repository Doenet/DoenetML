import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    callAction,
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputImmediateValue,
    updateMathInputValue,
    updateTextInputImmediateValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A document, with what a test does to it by name, and a reload from what a
 * save holds.
 */
async function setup(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });
    const h = {
        core: () => core,
        diagnostics: () => getDiagnosticsByType(core),
        async idx(name: string) {
            return await resolvePathToNodeIdx(name);
        },
        /**
         * The state of the named component. Reads every state variable, as
         * a reader of the whole document would, including what is withheld.
         */
        async sv(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)];
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
        async submit(name: string) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        },
        async checkWork(name: string) {
            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx(name),
                actionName: "submitAllAnswers",
                args: {},
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
    return h;
}

/**
 * From outside, withheld content (a case of a `<conditionalContent>` not
 * shown, an iteration a repeat no longer has) acts as missing: an action on
 * it does nothing, with an info, and reading it does not change it. It keeps
 * its state, and comes back with it (SAVE-4, D40, #2152).
 */
describe("Withheld content acts as missing from outside @group2", () => {
    const answerInCase = `
    <booleanInput name="b" prefill="true" />
    <mathInput name="m" prefill="3" />
    <conditionalContent name="cc">
      <case condition="$b">
        <number name="n">$m</number>
        <answer name="ans">
          <mathInput name="mj" prefill="3" />
          <award><when>$mj = $n</when></award>
        </answer>
      </case>
    </conditionalContent>
    <callAction name="ca" target="$cc.ans" actionName="submitAnswer"><label>go</label></callAction>
    <p name="o">$cc.ans.creditAchieved</p>
    `;

    it("a callAction on a withheld answer does nothing, with an info", async () => {
        const h = await setup(answerInCase);
        await h.submit("cc.ans");
        expect((await h.sv("cc.ans")).stateValues.creditAchieved).eq(1);

        await h.setBoolean("b", false);
        expect((await h.sv("o")).stateValues.text).eq("＿");
        await callAction({ componentIdx: await h.idx("ca"), core: h.core() });
        const infos = h
            .diagnostics()
            .infos.filter((d: any) => d.code === "doenet-i0060");
        expect(infos.length).eq(1);
        expect(infos[0].message).contain("$cc.ans");
        expect(infos[0].message).contain("<callAction>");

        await h.setBoolean("b", true);
        const ans = (await h.sv("cc.ans")).stateValues;
        expect(ans.creditAchieved).eq(1);
        expect(ans.numSubmissions).eq(1);
        expect(ans.justSubmitted).eq(true);
        expect((await h.sv("o")).stateValues.text).eq("1");

        // shown again, the action reaches it
        await h.typeMath("cc.mj", "4");
        await callAction({ componentIdx: await h.idx("ca"), core: h.core() });
        expect((await h.sv("cc.ans")).stateValues.creditAchieved).eq(0);
        expect((await h.sv("cc.ans")).stateValues.numSubmissions).eq(2);
    });

    it("a callAction triggered as content is withheld does nothing", async () => {
        const h = await setup(
            answerInCase.replace(
                'actionName="submitAnswer"',
                'actionName="submitAnswer" triggerWhen="not $b"',
            ),
        );
        await h.submit("cc.ans");
        await h.setBoolean("b", false);
        await h.setBoolean("b", true);
        const ans = (await h.sv("cc.ans")).stateValues;
        expect(ans.creditAchieved).eq(1);
        expect(ans.numSubmissions).eq(1);
        expect(ans.numIncorrectSubmissions).eq(0);
    });

    it("an updateValue on a withheld input does nothing, with an info", async () => {
        const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <conditionalContent name="cc">
      <case condition="$b"><mathInput name="mi" prefill="1" /></case>
    </conditionalContent>
    <updateValue name="uv" target="$cc.mi" newValue="7" />
    `);
        await h.setBoolean("b", false);
        await updateValue({ componentIdx: await h.idx("uv"), core: h.core() });
        expect(
            h.diagnostics().infos.filter((d: any) => d.code === "doenet-i0060")
                .length,
        ).eq(1);
        await h.setBoolean("b", true);
        expect((await h.sv("cc.mi")).stateValues.value.tree).eq(1);

        await updateValue({ componentIdx: await h.idx("uv"), core: h.core() });
        expect((await h.sv("cc.mi")).stateValues.value.tree).eq(7);
    });

    it("an action on an iteration a repeat no longer has does nothing", async () => {
        const h = await setup(`
    <mathInput name="k" prefill="3" />
    <repeatForSequence name="r" from="1" to="$k" valueName="v">
      <answer name="ans">
        <mathInput name="mj" prefill="3" />
        <award><when>$mj = 3</when></award>
      </answer>
    </repeatForSequence>
    <callAction name="ca" target="$r[3].ans" actionName="submitAnswer"><label>go</label></callAction>
    `);
        await h.submit("r[3].ans");
        await h.typeMath("k", "2");
        await callAction({ componentIdx: await h.idx("ca"), core: h.core() });
        await h.typeMath("k", "3");
        const ans = (await h.sv("r[3].ans")).stateValues;
        expect(ans.creditAchieved).eq(1);
        expect(ans.numSubmissions).eq(1);
        expect((await h.sv("_document1")).stateValues.creditAchieved).closeTo(
            1 / 3,
            1e-12,
        );
    });

    for (const withReader of [false, true]) {
        it(`a property read from outside does not change it${withReader ? ", with a paragraph reading it" : ""}`, async () => {
            const h = await setup(`
    <booleanInput name="b" prefill="true" />
    <section name="sec" sectionWideCheckWork>
      <conditionalContent name="cc">
        <case condition="$b">
          <number name="n">3</number>
          <answer name="ans" creditByAttempt="1 0.5 0.25">
            <mathInput name="mj" prefill="2" />
            <award><when>$mj = $n</when></award>
          </answer>
        </case>
      </conditionalContent>
    </section>
    ${withReader ? '<p name="o">$cc.ans.justSubmitted</p>' : ""}
    `);
            await h.checkWork("sec");
            await h.setBoolean("b", false);
            await h.setBoolean("b", true);
            expect((await h.sv("cc.ans")).stateValues.justSubmitted).eq(true);

            // nothing changed, so nothing to submit
            await h.checkWork("sec");
            await h.typeMath("cc.mj", "3");
            await h.checkWork("sec");
            const ans = (await h.sv("cc.ans")).stateValues;
            expect(ans.creditAchieved).eq(0.5);
            expect(ans.numIncorrectSubmissions).eq(1);
        });
    }
});

/**
 * A component withheld while what it depends on changes, and shown again,
 * follows the change, whether shown again in the session, made again from
 * its saved state, or after a reload; and what was not changed is kept
 * (#2325, #2174).
 */
describe("Restored state in withheld content follows changes outside it @group2", () => {
    const inputInCase = (withElse: boolean) => `
    <booleanInput name="b" prefill="true"/>
    <mathInput name="x" prefill="1"/>
    <conditionalContent name="cc">
      <case condition="$b"><mathInput bindValueTo="$x" name="w"/></case>
      ${withElse ? "<else>no</else>" : ""}
    </conditionalContent>`;

    for (const withElse of [false, true]) {
        it(`an input bound outside, changed while withheld, through a reload${withElse ? ", with an else" : ""}`, async () => {
            const h = await setup(inputInCase(withElse));
            await h.typeMath("cc.w", "4");
            await h.setBoolean("b", false);
            await h.typeMath("x", "8");
            await h.reload();
            await h.setBoolean("b", true);
            const w = (await h.sv("cc.w")).stateValues;
            expect(w.value.tree).eq(8);
            expect(w.immediateValue.tree).eq(8);
            expect(w.rawRendererValue).eq("8");
        });

        it(`an input's edit not yet entered is kept while its value is unchanged${withElse ? ", with an else" : ""}`, async () => {
            const h = await setup(inputInCase(withElse));
            await updateMathInputImmediateValue({
                latex: "4",
                componentIdx: await h.idx("cc.w"),
                core: h.core(),
            });
            await h.setBoolean("b", false);
            await h.setBoolean("b", true);
            let w = (await h.sv("cc.w")).stateValues;
            expect(w.value.tree).eq(1);
            expect(w.immediateValue.tree).eq(4);
            expect(w.rawRendererValue).eq("4");

            await h.setBoolean("b", false);
            await h.reload();
            await h.setBoolean("b", true);
            w = (await h.sv("cc.w")).stateValues;
            expect(w.value.tree).eq(1);
            expect(w.immediateValue.tree).eq(4);
            expect(w.rawRendererValue).eq("4");
        });

        it(`an edit its value replaced while shown is not brought back when the value returns while withheld${withElse ? ", with an else" : ""}`, async () => {
            const h = await setup(inputInCase(withElse));
            await h.typeMath("cc.w", "4");
            await updateMathInputImmediateValue({
                latex: "6",
                componentIdx: await h.idx("cc.w"),
                core: h.core(),
            });
            // the value changes while shown, so the edit is gone
            await h.typeMath("x", "8");
            expect((await h.sv("cc.w")).stateValues.immediateValue.tree).eq(8);

            // and comes back, while withheld, to what the edit was typed over
            await h.setBoolean("b", false);
            await h.typeMath("x", "4");
            await h.setBoolean("b", true);
            let w = (await h.sv("cc.w")).stateValues;
            expect(w.value.tree).eq(4);
            expect(w.immediateValue.tree).eq(4);
            expect(w.rawRendererValue).eq("4");

            // and through a reload
            await h.typeMath("x", "8");
            await h.setBoolean("b", false);
            await h.typeMath("x", "4");
            await h.reload();
            await h.setBoolean("b", true);
            w = (await h.sv("cc.w")).stateValues;
            expect(w.value.tree).eq(4);
            expect(w.immediateValue.tree).eq(4);
        });
    }

    it("a text input's edit not yet entered is kept through another case and back", async () => {
        const h = await setup(`
    <booleanInput name="b" prefill="true"/>
    <conditionalContent name="cc">
      <case condition="$b"><textInput name="t" prefill="a"/></case>
      <else>no</else>
    </conditionalContent>`);
        await updateTextInputImmediateValue({
            text: "zz",
            componentIdx: await h.idx("cc.t"),
            core: h.core(),
        });
        await h.setBoolean("b", false);
        await h.setBoolean("b", true);
        const t = (await h.sv("cc.t")).stateValues;
        expect(t.value).eq("a");
        expect(t.immediateValue).eq("zz");
    });

    it("an input rewritten by a trigger as its case is withheld comes back rewritten", async () => {
        const h = await setup(`
    <booleanInput name="b" prefill="true"/>
    <conditionalContent name="cc">
      <case condition="$b">
        <mathInput name="mi"/>
        <updateValue triggerWhen="$mi = 5" target="$mi" newValue="7"/>
        <updateValue triggerWhen="$mi = 7" target="$b" newValue="false" type="boolean"/>
      </case>
      <else>no</else>
    </conditionalContent>`);
        await h.typeMath("cc.mi", "5");
        expect((await h.sv("b")).stateValues.value).eq(false);
        await h.setBoolean("b", true);
        const mi = (await h.sv("cc.mi")).stateValues;
        expect(mi.value.tree).eq(7);
        expect(mi.immediateValue.tree).eq(7);
    });

    const answerInCase = (withElse: boolean) => `
    <booleanInput name="b" prefill="true"/>
    <mathInput name="x" prefill="1"/>
    <conditionalContent name="cc">
      <case condition="$b"><answer name="ans"><mathInput bindValueTo="$x" name="w"/><award>9</award></answer></case>
      ${withElse ? "<else>no</else>" : ""}
    </conditionalContent>`;

    for (const withElse of [false, true]) {
        it(`a submitted answer whose response changed while withheld is not just submitted${withElse ? ", with an else" : ""}`, async () => {
            const h = await setup(answerInCase(withElse));
            await h.typeMath("cc.w", "9");
            await h.submit("cc.ans");
            await h.setBoolean("b", false);
            await h.typeMath("x", "5");
            await h.setBoolean("b", true);
            let ans = (await h.sv("cc.ans")).stateValues;
            expect(ans.justSubmitted).eq(false);
            expect(ans.creditAchieved).eq(1);

            // and through a reload
            await h.typeMath("cc.w", "9");
            await h.submit("cc.ans");
            await h.setBoolean("b", false);
            await h.typeMath("x", "5");
            await h.reload();
            await h.setBoolean("b", true);
            ans = (await h.sv("cc.ans")).stateValues;
            expect(ans.justSubmitted).eq(false);
            expect(ans.creditAchieved).eq(1);
        });

        it(`a submitted answer whose response is unchanged stays just submitted${withElse ? ", with an else" : ""}`, async () => {
            const h = await setup(answerInCase(withElse));
            await h.typeMath("cc.w", "9");
            await h.submit("cc.ans");
            await h.setBoolean("b", false);
            await h.reload();
            await h.setBoolean("b", true);
            const ans = (await h.sv("cc.ans")).stateValues;
            expect(ans.justSubmitted).eq(true);
            expect(ans.creditAchieved).eq(1);
        });
    }

    for (const length of ["0", "1"]) {
        it(`an answer in a repeat shrunk to ${length} and grown again, read while withheld, stays just submitted`, async () => {
            const h = await setup(`
    <mathInput name="n" prefill="2"/>
    <repeatForSequence from="3" length="$n" valueName="v" name="r">
      <answer name="ans"><mathInput name="mi"/><award>$v</award></answer>
    </repeatForSequence>`);
            await h.typeMath("r[1].mi", "3");
            await h.submit("r[1].ans");
            await h.typeMath("n", length);
            // read every state variable, including those withheld
            await h.core().returnAllStateVariables(false, true);
            await h.typeMath("n", "2");
            const ans = (await h.sv("r[1].ans")).stateValues;
            expect(ans.creditAchieved).eq(1);
            expect(ans.justSubmitted).eq(true);
        });
    }
});
