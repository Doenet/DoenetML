import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    submitAnswer,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An `<answer>`'s responses are typed from the DoenetML when the document
 * loads (TYPE-2, TYPE-4, D45 decision 3, #2568):
 *
 * - each response is its input's type, or its component's tag, and entries
 *   may differ: `$a.currentResponses[2]` has the type of response 2;
 * - a response a `<conditionalContent>` holds follows COMP-11's every-branch
 *   rule, so cases of different types are an error at load (`doenet-e0082`);
 * - `submittedResponses` has the types the DoenetML gives, not ones saved.
 */
describe("An answer's responses are typed at load (D45) @group4", () => {
    const e0065 = (T: string, source: string, sourceType: string) =>
        `doenet-e0065: A \`<${T}>\` can't be made from \`${source}\`, which gives a \`<${sourceType}>\`. To show it as it is, write \`${source}\`.`;

    function errors(core: any) {
        return getDiagnosticsByType(core).errors.map(
            (e) => `${e.code}: ${e.message}`,
        );
    }

    it("each response has its input's type, decided before anything is entered, also in a case not shown", async () => {
        const { core } = await createTestCore({
            doenetML: `
<booleanInput name="b"/>
<answer name="ans">
  <mathInput name="mi"/><textInput name="ti"/>
  <award><when>$mi = x and $ti = a</when></award>
</answer>
<conditionalContent>
  <case condition="$b">
    <point extend="$ans.currentResponses[2]"/>
    <point extend="$ans.submittedResponses[2]"/>
  </case>
</conditionalContent>
<p name="p1"><point extend="$ans.currentResponses[1]"/></p>
`,
        });
        expect(errors(core)).eqls([
            e0065("point", "$ans.currentResponses[2]", "text"),
            e0065("point", "$ans.submittedResponses[2]", "text"),
        ]);
    });

    it("an answer whose responses share one type is that type, as is the answer itself", async () => {
        const { core } = await createTestCore({
            doenetML: `
<answer name="ans" type="text">hello</answer>
<mathInput name="m"/><mathInput name="m2" forAnswer="$ans2"/>
<answer name="ans2"><award><when>$m = x</when></award></answer>
<p name="p1"><point extend="$ans"/></p>
<p name="p2"><math extend="$ans2.currentResponses[2]"/></p>
`,
        });
        expect(errors(core)).eqls([e0065("point", "$ans", "text")]);
    });

    it("responses from a conditionalContent whose cases differ in type are an error at load", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="b"/>
<answer name="mixed">
  <considerAsResponses>
    <conditionalContent>
      <case condition="$b"><math>x</math></case>
      <else><text>y</text></else>
    </conditionalContent>
  </considerAsResponses>
  <award><when>true</when></award>
</answer>
<answer name="same">
  <considerAsResponses>
    <conditionalContent>
      <case condition="$b"><math>x</math></case>
      <else><math>y</math></else>
    </conditionalContent>
  </considerAsResponses>
  <award><when>true</when></award>
</answer>
<p name="p"><text extend="$same.currentResponse"/></p>
`,
        });
        expect(errors(core)).eqls([
            "doenet-e0082: An `<answer>` reads a response from this `<conditionalContent>` that is a `<math>` in one case and a `<text>` in another, but a response has one type, decided from what is written. Give it one type in every case.",
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("y");
    });

    it("an entry named as a property, and a group holding a response, have the entry's type at load", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="b"/>
<answer name="ans">
  <textInput name="ti"/><mathInput name="mi"/>
  <award><when>$mi = x and $ti = a</when></award>
</answer>
<group name="g">$ans.currentResponses[2]</group>
<conditionalContent>
  <case condition="$b">
    <point extend="$ans.currentResponse"/>
    <point extend="$ans.currentResponse1"/>
    <point extend="$ans.submittedResponse2"/>
  </case>
</conditionalContent>
<p name="p"><math extend="$g"/></p>
`,
        });
        // a `<group>` holding a response was `doenet-e0067`
        expect(errors(core)).eqls([
            e0065("point", "$ans.currentResponse", "text"),
            e0065("point", "$ans.currentResponse1", "text"),
        ]);
        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("y");
    });

    it("responses of the same types in every case, with an else, are typed by place", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="b"/>
<answer name="ans">
  <considerAsResponses>
    <conditionalContent>
      <case condition="$b"><math>x</math><text>a</text></case>
      <else><math>y</math><text>c</text></else>
    </conditionalContent>
    <text>z</text>
  </considerAsResponses>
  <award><when>true</when></award>
</answer>
<conditionalContent>
  <case condition="$b"><point extend="$ans.currentResponses[2]"/></case>
</conditionalContent>
<p name="p">$ans.submittedResponses</p>
`,
        });
        expect(errors(core)).eqls([
            e0065("point", "$ans.currentResponses[2]", "text"),
        ]);
        expect((await submitted(core, resolvePathToNodeIdx, "ans")).types).eqls(
            ["math", "text", "text"],
        );
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("y, c, z");
    });

    it("a component with no value is a response of an empty text, as it is recorded", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<line name="l" through="(1,2) (3,4)"/>
<answer name="ans">
  <considerAsResponses><line/></considerAsResponses>
  <award><when>true</when></award>
</answer>
<answer name="ans2"><award><when>$l = $l</when></award></answer>
<p name="p1"><text extend="$ans.currentResponse"/></p>
<p name="p2"><line extend="$ans.currentResponse"/></p>
<p name="p3"><text extend="$ans2.currentResponses[2]"/></p>
`,
        });
        expect(errors(core)).eqls([
            e0065("line", "$ans.currentResponse", "text"),
        ]);
        const ans = (core as any).core._components[
            await resolvePathToNodeIdx("ans")
        ];
        expect(
            ans.state.currentResponses.shadowingInstructions
                .createComponentOfType,
        ).eqls(["text"]);
    });

    it("responses from a conditionalContent with no else are not given a place, as no case may be shown", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="b"/>
<answer name="ans">
  <considerAsResponses>
    <conditionalContent>
      <case condition="$b"><math>x</math></case>
    </conditionalContent>
    <text>a</text>
  </considerAsResponses>
  <award><when>true</when></award>
</answer>
<p name="p1"><text extend="$ans.currentResponses[1]"/></p>
`,
        });
        expect(errors(core)).eqls([]);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        const ans = (core as any).core._components[
            await resolvePathToNodeIdx("ans")
        ];
        expect((await ans.stateValues.submittedResponses).map(String)).eqls([
            "a",
        ]);
        expect(
            ans.state.submittedResponses.shadowingInstructions
                .createComponentOfType,
        ).eqls(["text"]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("a");
    });

    it("submitted responses keep the types the DoenetML gives through a reload, with no type saved", async () => {
        const doenetML = `
<answer name="ans">
  <mathInput name="mi"/><textInput name="ti"/>
  <award><when>$mi = x and $ti = a</when></award>
</answer>
`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateTextInputValue({
            text: "a",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await core.saveImmediately();

        // nothing about the types is saved (TYPE-4)
        expect(JSON.stringify(scoreState.state)).not.toContain(
            "submittedResponsesComponentType",
        );

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        const ans = (core as any).core._components[
            await resolvePathToNodeIdx("ans")
        ];
        expect((await ans.stateValues.submittedResponses).map(String)).eqls([
            "x",
            "a",
        ]);
        expect(
            ans.state.submittedResponses.shadowingInstructions
                .createComponentOfType,
        ).eqls(["math", "text"]);
    });
    /** Each answer's submitted responses after submitting it, as text, and their types. */
    async function submitted(
        core: any,
        resolvePathToNodeIdx: any,
        name: string,
    ) {
        const idx = await resolvePathToNodeIdx(name);
        await submitAnswer({ componentIdx: idx, core });
        const ans = core.core._components[idx];
        return {
            values: (await ans.stateValues.submittedResponses).map(String),
            types: ans.state.submittedResponses.shadowingInstructions
                .createComponentOfType,
        };
    }

    it("a property whose entries are made into points or vectors is not decided as a math", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<polyline name="pl" vertices="(1,2) (3,4)"/>
<circle name="c"/>
<vector name="v" displacement="(1,2)"/>
<polygon name="pg" vertices="(0,0) (1,1) (1,0)"/>
<answer name="a1"><award><when>true</when></award><considerAsResponses>$pl.vertices</considerAsResponses></answer>
<answer name="a2"><award><when>$c.center = (0,0)</when></award></answer>
<answer name="a3"><award><when>$v.displacement = (1,2)</when></award></answer>
<answer name="a4"><award><when>$pg.vertex1 = (0,0)</when></award></answer>
<answer name="a5"><award><when>$pg.vertexX1_1 = 0</when></award></answer>
`,
        });
        expect(errors(core)).eqls([]);
        expect((await submitted(core, resolvePathToNodeIdx, "a1")).types).eqls([
            "point",
            "point",
        ]);
        expect((await submitted(core, resolvePathToNodeIdx, "a2")).types).eqls([
            "point",
        ]);
        expect((await submitted(core, resolvePathToNodeIdx, "a3")).types).eqls([
            "vector",
        ]);
        expect((await submitted(core, resolvePathToNodeIdx, "a4")).types).eqls([
            "point",
        ]);
        expect((await submitted(core, resolvePathToNodeIdx, "a5")).types).eqls([
            "math",
        ]);
    });

    it("a response that may be missing is not decided, as it is recorded as a blank math", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<choiceInput name="ci"><choice>dog</choice><choice>cat</choice></choiceInput>
<pointList name="pl">(1,2)</pointList>
<answer name="a1"><award><when>$ci = dog</when></award><considerAsResponses>$ci</considerAsResponses></answer>
<answer name="a2"><mathInput name="mi"/><award><when><number isResponse>2$mi</number> = 6</when></award></answer>
<answer name="a3"><award><when><boolean isResponse>$nothing</boolean></when></award></answer>
<answer name="a4"><award><when>true</when></award><considerAsResponses><polygon vertices="(0,0) $pl[3] (1,1)"/></considerAsResponses></answer>
<answer name="a5"><award><when><number isResponse>5</number> = 5</when></award></answer>
<p name="p1">$a1.submittedResponses</p>
<p name="p2">$a2.submittedResponses</p>
<p name="p3">$a3.submittedResponses</p>
<p name="p4">$a4.submittedResponses</p>
`,
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a1")).eqls({
            values: ["＿"],
            types: ["math"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a2")).eqls({
            values: ["＿", "＿"],
            types: ["math", "math"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a3")).eqls({
            values: ["＿"],
            types: ["math"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a4")).eqls({
            values: ["＿"],
            types: ["math"],
        });
        // one with nothing to be missing is decided
        const a5 = core.core._components[await resolvePathToNodeIdx("a5")];
        expect(a5.doenetAttributes.propertyTypes.currentResponses).eq("number");

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const [name, text] of [
            ["p1", "＿"],
            ["p2", "＿, ＿"],
            ["p3", "＿"],
            ["p4", "＿"],
        ]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text,
            ).eq(text);
        }
    });

    it("an answer made with extend that writes responses of its own does not take the types of what it extends", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<answer name="ans"><mathInput name="mi"/><award><when>$mi = x</when></award></answer>
<answer name="ans2" extend="$ans"><textInput name="ti"/></answer>
<answer name="ans3" type="text">hello</answer>
<answer name="ans4" extend="$ans3"><mathInput name="mi2"/></answer>
<p name="p2">$ans2.submittedResponses</p>
<p name="p4">$ans4.submittedResponses</p>
`,
        });
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("ans2.mi"),
            core,
        });
        await updateTextInputValue({
            text: "y",
            componentIdx: await resolvePathToNodeIdx("ans2.ti"),
            core,
        });
        await updateMathInputValue({
            latex: "z",
            componentIdx: await resolvePathToNodeIdx("ans4.mi2"),
            core,
        });
        expect(await submitted(core, resolvePathToNodeIdx, "ans2")).eqls({
            values: ["x", "y"],
            types: ["math", "text"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "ans4")).eqls({
            values: ["z"],
            types: ["math"],
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("x, y");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("z");
    });

    it("responses a select or a repeat makes, or a reference copies, in an award are not given a place", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="mi" prefill="x"/><textInput name="ti" prefill="t"/>
<group name="g" hide><math isResponse>$mi</math></group>
<answer name="a1"><award><when>
  <select><option><text isResponse>$ti</text></option><option><text isResponse>$ti</text></option></select>
  <math isResponse>$mi</math>
</when></award></answer>
<answer name="a2"><award><when>
  <repeat for="1 2" valueName="v"><math isResponse>$v$mi</math></repeat>
  <text isResponse>$ti</text>
</when></award></answer>
<answer name="a3"><award><when>$g = x</when></award><award><when><text isResponse>$ti</text> = t</when></award></answer>
`,
        });
        expect(errors(core)).eqls([]);
        expect(await submitted(core, resolvePathToNodeIdx, "a1")).eqls({
            values: ["t", "x"],
            types: ["text", "math"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a2")).eqls({
            values: ["1 x", "2 x", "t"],
            types: ["math", "math", "text"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a3")).eqls({
            values: ["x", "t"],
            types: ["math", "text"],
        });
    });
});
