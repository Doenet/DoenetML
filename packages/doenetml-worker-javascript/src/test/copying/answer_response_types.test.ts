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
            "doenet-e0082: An `<answer>` reads a response from this `<conditionalContent>`, but its cases hold a `<math>` and a `<text>`, and a response has one type, decided from what is written. Give every case a response of one type.",
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("y");
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
});
