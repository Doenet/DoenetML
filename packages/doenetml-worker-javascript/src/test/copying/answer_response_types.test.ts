import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { responseTypes } from "../utils/responseTypes";
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

    const e0090 = (source: string) =>
        `doenet-e0090: \`${source}\` reads an \`<answer>\`'s responses, but which response is of which type isn't decided by what is written: they are of more than one type, and how many there are, or in what order, is known only once the document runs. Read the input or component that gives the response instead, or give the responses one type.`;

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
            await responseTypes(core, ans.componentIdx, "currentResponses"),
        ).eqls(["text"]);
    });

    it("responses from a conditionalContent with no else are not given a place, as no case may be shown, so a reference to them is an error", async () => {
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
<p name="p2">$ans</p>
`,
        });
        // The first response is the math, when the case is shown, or the
        // text: its type isn't decided, so a reference to it, or to the
        // whole, is an error at load (TYPE-3).
        expect(errors(core)).eqls([
            e0090("$ans.currentResponses[1]"),
            e0090("$ans"),
        ]);
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
            await responseTypes(core, ans.componentIdx, "submittedResponses"),
        ).eq(undefined);
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
            await responseTypes(core, ans.componentIdx, "submittedResponses"),
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
            types: await responseTypes(
                core,
                ans.componentIdx,
                "submittedResponses",
            ),
        };
    }

    it("a property whose entries are made into points or vectors has that type at load", async () => {
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
<line name="l" through="(0,0) (1,1)"/>
<answer name="a6"><award><when>$l.points[1] = (0,0)</when></award></answer>
<booleanInput name="b"/>
<conditionalContent><case condition="$b">
  <text extend="$c.center"/>
  <text extend="$v.displacement"/>
</case></conditionalContent>
<point name="P" extend="$pl.vertices[2]"/>
<math name="m" extend="$pl.vertices[2][1]"/>
`,
        });
        // D52 decision 2: typed at load as what wraps them, so a tag made
        // from one is checked at load, also in a case not shown
        expect(errors(core)).eqls([
            e0065("text", "$c.center", "point"),
            e0065("text", "$v.displacement", "vector"),
        ]);
        for (const [name, type] of [
            ["a1", "point"],
            ["a2", "point"],
            ["a3", "vector"],
            ["a4", "point"],
            ["a5", "math"],
            ["a6", "point"],
        ]) {
            const answer =
                core.core._components[await resolvePathToNodeIdx(name)];
            expect(
                answer.doenetAttributes.propertyTypes.currentResponses,
                name,
            ).eq(type);
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                String,
            ),
        ).eqls(["3", "4"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(3);
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

    it("a property wrapped in each of several dimensions has the type of the outermost wrapper made", async () => {
        // `wrappingComponents[k - 1]` wraps what has `k` dimensions, from the
        // innermost: the whole of a spreadsheet's cells is a `<cellBlock>` of
        // `<row>`s, and one row a `<row>`, as when the document runs.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<spreadsheet name="s"><cell>a</cell><cell>b</cell></spreadsheet>
<matrixInput name="mi" numRows="2" numColumns="2" defaultEntry="1"/>
<p><text extend="$s.cells"/><text extend="$s.cells[1]"/></p>
<answer name="a1"><award><when>true</when></award><considerAsResponses>$mi.matrix</considerAsResponses></answer>
`,
        });
        expect(errors(core)).eqls([
            e0065("text", "$s.cells", "cellBlock"),
            e0065("text", "$s.cells[1]", "row"),
        ]);
        expect(
            core.core._components[await resolvePathToNodeIdx("a1")]
                .doenetAttributes.propertyTypes.currentResponses,
        ).eq("matrix");
    });

    it("a response that may be missing has its entry's type, decided at load, and is recorded as a missing value of it", async () => {
        // D52 decision 1 (VAL-5, D37: a missing T is still a T): a text is
        // the blank `＿`, a math a blank math, a number `NaN`, and a boolean,
        // which has no blank, `false`, as `<boolean/>` is. A reference that
        // names nothing has no type of its own, and is a blank math.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<choiceInput name="ci"><choice>dog</choice><choice>cat</choice></choiceInput>
<pointList name="pl">(1,2)</pointList>
<textList name="tl">a</textList>
<answer name="a1"><award><when>$ci = dog</when></award><considerAsResponses>$ci</considerAsResponses></answer>
<answer name="a2"><mathInput name="mi"/><award><when><number isResponse>2$mi</number> = 6</when></award></answer>
<answer name="a3"><award><when><boolean isResponse>$nothing</boolean></when></award></answer>
<answer name="a4"><award><when>true</when></award><considerAsResponses><polygon vertices="(0,0) $pl[3] (1,1)"/></considerAsResponses></answer>
<answer name="a5"><award><when>true</when></award><considerAsResponses>$tl[2] $pl[2] $nothing</considerAsResponses></answer>
<answer name="a6"><award><when><number isResponse>5</number> = 5</when></award></answer>
<p name="p1">$a1.submittedResponses</p>
<p name="p2">$a2.submittedResponses</p>
<p name="p3">$a3.submittedResponses</p>
<p name="p4">$a4.submittedResponses</p>
<p name="p5">$a5.submittedResponses</p>
<p name="p6"><text extend="$a1.submittedResponse1"/> <point extend="$a5.currentResponses[2]"/></p>
`,
        });
        // each is typed at load, before anything runs
        expect(errors(core)).eqls([]);
        for (const [name, types] of [
            ["a1", "text"],
            ["a2", ["math", "number"]],
            ["a3", "boolean"],
            // a component with no value is an empty text, also when missing
            ["a4", "text"],
            ["a5", ["text", "point", "math"]],
            ["a6", "number"],
        ] as const) {
            const answer =
                core.core._components[await resolvePathToNodeIdx(name)];
            expect(
                answer.doenetAttributes.propertyTypes.currentResponses,
                name,
            ).eqls(types);
        }

        expect(await submitted(core, resolvePathToNodeIdx, "a1")).eqls({
            values: ["＿"],
            types: ["text"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a2")).eqls({
            values: ["＿", "NaN"],
            types: ["math", "number"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a3")).eqls({
            values: ["false"],
            types: ["boolean"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a4")).eqls({
            values: ["＿"],
            types: ["text"],
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a5")).eqls({
            values: ["＿", "＿", "＿"],
            types: ["text", "point", "math"],
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const [name, text] of [
            ["p1", "＿"],
            ["p2", "＿, NaN"],
            ["p3", "false"],
            ["p4", "＿"],
            ["p5", "＿, ＿, ＿"],
            ["p6", "＿ ＿"],
        ]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text,
                name,
            ).eq(text);
        }
    });

    it("an extend of an answer can't change what it grades, and a copy that writes responses of its own has its own types", async () => {
        // An extend shares its source's responses and credit (REF-7, D32), so
        // writing an input, an award or a grading attribute in one is an
        // error; a label and appearance attributes are not. A copy is an
        // answer of its own (CPY-1), typed by what it copies and what is
        // written in it.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="b"/>
<answer name="ans"><mathInput name="mi"/><award><when>$mi = x</when></award></answer>
<answer name="e1" extend="$ans"><textInput/></answer>
<answer name="e2" extend="$ans" weight="2"/>
<conditionalContent><case condition="$b"><answer extend="$ans"><award><when>true</when></award></answer></case></conditionalContent>
<answer name="e3" extend="$ans" showCorrectness="false" hide><label>Again</label></answer>
<label name="l">Once more</label>
<answer name="e4" extend="$ans"><label copy="$l"/></answer>
<answer name="ans2" copy="$ans"><textInput name="ti"/></answer>
<answer name="ans3" type="text">hello</answer>
<answer name="ans4" copy="$ans3"><mathInput name="mi2"/></answer>
<p name="p2">$ans2.submittedResponses</p>
<p name="p4">$ans4.submittedResponses</p>
`,
        });
        expect(errors(core)).eqls([
            "doenet-e0084: What is written inside an `extend` of an `<answer>` would be new inputs, awards or responses, but an extend shares its responses and credit with `$ans`. To make an answer that grades more, use `copy`. An extend may be given a `<label>`.",
            "doenet-e0083: An `extend` of an `<answer>` shares its responses and credit with `$ans`, which grades them, so it can't change `weight`. To grade with a different `weight`, use `copy`.",
            // in a case not shown, at load
            "doenet-e0084: What is written inside an `extend` of an `<answer>` would be new inputs, awards or responses, but an extend shares its responses and credit with `$ans`. To make an answer that grades more, use `copy`. An extend may be given a `<label>`.",
        ]);
        let stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["e1", "e2"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].componentType,
                name,
            ).eq("_error");
        }
        // a label, also written as a copy, is a label
        for (const name of ["e3", "e4"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].componentType,
                name,
            ).eq("answer");
        }

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
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("x, y");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("z");
    });

    it("an extend or copy of an answer that writes nothing has its source's types, so a reference to it is typed as one to its source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<answer name="ans"><mathInput name="mi" prefill="y"/><textInput name="ti" prefill="t"/><award><when>$mi = x</when></award></answer>
<answer name="e" extend="$ans"/>
<answer name="e2" extend="$e"/>
<answer name="c" copy="$ans"/>
<answer name="w" copyWithState="$ans"/>
<answer name="t" type="text">hello</answer>
<answer name="te" extend="$t"/>
<p name="p1">$e.currentResponses</p>
<p name="p2">$e2.currentResponse2</p>
<p name="p3">$c.currentResponses</p>
<p name="p4">$w.currentResponse1</p>
<p name="p5"><point extend="$te"/></p>
`,
        });
        expect(errors(core)).eqls([e0065("point", "$te", "text")]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        const shown = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.text;
        expect(await shown("p1")).eq("y, t");
        expect(await shown("p2")).eq("t");
        expect(await shown("p3")).eq("y, t");
        expect(await shown("p4")).eq("y");
    });

    it("responses a select or a repeat makes, or a reference copies, in an award are not given a place, and a reference to them is an error", async () => {
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
<p name="p1">$a1</p>
<p name="p2"><text extend="$a2.currentResponses[3]"/></p>
<p name="p3">$a3.submittedResponse2</p>
`,
        });
        // Of more than one type, in places not known until the document
        // runs, so not typed, and a reference that reads them is an error at
        // load (TYPE-3), also for a place that would hold a text here.
        expect(errors(core)).eqls([
            e0090("$a1"),
            e0090("$a2.currentResponses[3]"),
            e0090("$a3.submittedResponse2"),
        ]);
        // The answers grade and record as before.
        expect(await submitted(core, resolvePathToNodeIdx, "a1")).eqls({
            values: ["t", "x"],
            types: undefined,
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a2")).eqls({
            values: ["1 x", "2 x", "t"],
            types: undefined,
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a3")).eqls({
            values: ["x", "t"],
            types: undefined,
        });
    });

    it("a tag of another type made from an answer whose responses aren't typed is an error, as the bare reference is, and a copy of it is not", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="mi" prefill="(1,2)"/><textInput name="ti" prefill="t"/>
<answer name="a"><award><when>
  <math isResponse>$mi</math>
  <select><option><text isResponse>$ti</text></option><option><text isResponse>$ti</text></option></select>
</when></award></answer>
<p name="p1"><point extend="$a"/></p>
<p name="p2"><text extend="$a"/></p>
<answer name="a2" copy="$a"/>
`,
        });
        // A `<point>` or `<text>` made from `$a` reads its submitted
        // responses, whose types aren't decided (TYPE-3); the copy reads
        // none of its properties.
        expect(errors(core)).eqls([e0090("$a"), e0090("$a")]);
        expect(
            (core as any).core._components[await resolvePathToNodeIdx("a2")]
                .componentType,
        ).eq("answer");
    });

    it("isResponse written with no value on a tag made with extend, or on a collect, is read as true", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="mi" prefill="x"/><textInput name="ti" prefill="t"/>
<group name="g" hide><math>$mi</math></group>
<answer name="a1"><award><when><math extend="$mi" isResponse/> = x and <text isResponse>$ti</text> = t</when></award></answer>
<answer name="a2"><award><when><collect from="$g" componentType="math" isResponse/> = x and <text isResponse>$ti</text> = t</when></award></answer>
<answer name="a3"><award><when><math extend="$mi" isResponse=" "/> = x and <text isResponse>$ti</text> = t</when></award></answer>
`,
        });
        expect(errors(core)).eqls([]);
        expect(await submitted(core, resolvePathToNodeIdx, "a1")).eqls({
            values: ["x", "t"],
            types: ["math", "text"],
        });
        // a `<collect>` collects any number of maths
        expect(await submitted(core, resolvePathToNodeIdx, "a2")).eqls({
            values: ["x", "t"],
            types: undefined,
        });
        expect(await submitted(core, resolvePathToNodeIdx, "a3")).eqls({
            values: ["t"],
            types: ["text"],
        });
    });

    it("an extend of an answer through a composite holding one gets the same errors (#2606 item 7)", async () => {
        // `<answer extend="$cc"/>` of a `<conditionalContent>` holding an
        // `<answer>` in every case extends it (REF-7, D32), so what it would
        // change of it is an error at load, as for an extend of the answer
        // itself; the same for a `<select>`, and for a `<choiceInput>`'s
        // errors. (Through a `<group>` these were already found.)
        // Appearance attributes stay allowed.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><answer><mathInput/><award><when>true</when></award></answer></case>
  <else><answer><mathInput/><award><when>true</when></award></answer></else>
</conditionalContent>
<answer name="e1" extend="$cc" weight="2"/>
<answer name="e2" extend="$cc"><textInput/></answer>
<answer name="e3" extend="$cc" showCorrectness="false"/>
<select name="s"><option><answer><mathInput/><award><when>true</when></award></answer></option></select>
<answer name="e4" extend="$s" weight="3"/>
<select name="sc"><option><choiceInput><choice>a</choice></choiceInput></option></select>
<choiceInput name="e5" extend="$sc"><choice>b</choice></choiceInput>
`,
        });
        expect(errors(core)).eqls([
            "doenet-e0083: An `extend` of an `<answer>` shares its responses and credit with `$cc`, which grades them, so it can't change `weight`. To grade with a different `weight`, use `copy`.",
            "doenet-e0084: What is written inside an `extend` of an `<answer>` would be new inputs, awards or responses, but an extend shares its responses and credit with `$cc`. To make an answer that grades more, use `copy`. An extend may be given a `<label>`.",
            "doenet-e0083: An `extend` of an `<answer>` shares its responses and credit with `$s`, which grades them, so it can't change `weight`. To grade with a different `weight`, use `copy`.",
            "doenet-e0058: Choices written inside an `extend` of a `<choiceInput>` would be new choices, but an extend shares its selection with `$sc`, which has no such choice. To offer more choices, use `copy`.",
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const [name, type] of [
            ["e1", "_error"],
            ["e2", "_error"],
            ["e3", "answer"],
            ["e4", "_error"],
            ["e5", "_error"],
        ]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].componentType,
                name,
            ).eq(type);
        }
    });

    it("a copyWithState of an answer may write children of its own, and is an answer of its own (D52 decision 3)", async () => {
        // As for `copy`, and unlike `extend`, an award or input written
        // inside it is allowed: it is an answer of its own that starts from
        // a snapshot of its source (CPY-2), with its own responses, typed by
        // what it copies and what is written in it, and its own credit.
        const { core: core2, resolvePathToNodeIdx: resolve2 } =
            await createTestCore({
                doenetML: `
<answer name="ans"><mathInput name="mi" prefill="x"/><award><when>$mi = x</when></award></answer>
<answer name="ans2" copyWithState="$ans"><textInput name="ti"/><award credit="0.5"><when>$ti = a</when></award></answer>
<p name="p2">$ans2.currentResponses</p>
`,
            });
        expect(errors(core2)).eqls([]);
        const ans2Idx = await resolve2("ans2");
        expect(
            core2.core._components[ans2Idx].doenetAttributes.propertyTypes
                .currentResponses,
        ).eqls(["math", "text"]);
        await submitAnswer({
            componentIdx: await resolve2("ans"),
            core: core2,
        });
        let stateVariables = await core2.returnAllStateVariables(false, true);
        // its own credit, not changed by submitting the source
        expect(stateVariables[ans2Idx].stateValues.creditAchieved).eq(0);
        await updateTextInputValue({
            text: "a",
            componentIdx: await resolve2("ans2.ti"),
            core: core2,
        });
        await submitAnswer({ componentIdx: ans2Idx, core: core2 });
        stateVariables = await core2.returnAllStateVariables(false, true);
        expect(stateVariables[ans2Idx].stateValues.creditAchieved).eq(1);
        expect(
            stateVariables[ans2Idx].stateValues.submittedResponses.map(String),
        ).eqls(["x", "a"]);
        expect(stateVariables[ans2Idx].componentType).eq("answer");
    });
});
