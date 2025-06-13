import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    callAction,
    submitAnswer,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Paginator tag tests", async () => {
    it("Multiple sections in paginator", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <paginatorControls paginator="$pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <section name="section1">
        <title name="title1">Page 1</title>
        <p>What is 1+1? <answer name="answer1">$two</answer></p>
        <math hide name="two">2</math>
      </section>
      <section name="section2">
        <p>What is your name? <textInput name="name" /></p>
        <p name="p3">Hello, $name!</p>
      </section>
      <section name="section3">
        <title name="title3">Page 3</title>
        <math hide name="twox">2x</math>
        <p>What is <m name="mxx">x+x</m>? <answer name="answer2">$twox</answer></p>
        <p>What is <m name="myy">y+y</m>? <answer name="answer3">2y</answer></p>
      </section>
    </paginator>
    <p>
    <callAction name="prevPage" disabled="$pageNum = 1" actionName="setPage" target="$pgn" number="$pageNum -1"  >
      <label>prev</label>
    </callAction>
    Page <number extend="$pgn.currentPage" name="pageNum" />
    of <number extend="$pgn.numPages" name="numPages" />
    <callAction name="nextPage" disabled="$pageNum = $numPages" actionName="setPage" target="$pgn" number="$pageNum +1"  >
      <label>next</label>
    </callAction>
    
    </p>
    <p>What is 2+2? <answer name="answer4">4</answer></p>
  
    <p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
  
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let mathinput1Name =
            stateVariables[await resolvePathToNodeIdx("answer1")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput2Name =
            stateVariables[await resolvePathToNodeIdx("answer2")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput3Name =
            stateVariables[await resolvePathToNodeIdx("answer3")].stateValues
                .inputChildren[0].componentIdx;
        let mathinput4Name =
            stateVariables[await resolvePathToNodeIdx("answer4")].stateValues
                .inputChildren[0].componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .numPages,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .numPages,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(1);

        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("title1")].stateValues
                .value,
        ).eq("Page 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("title3")].stateValues
                .value,
        ).eq("Page 3");

        await updateMathInputValue({
            latex: "4",
            componentIdx: mathinput4Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer4"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer4")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.25);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathinput1Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.5);

        // move to page 2
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("pgn"),
            actionName: "setPage",
            args: { number: 2 },
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.5);

        await updateTextInputValue({
            text: "Me",
            componentIdx: await resolvePathToNodeIdx("name"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("Hello, Me!");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.5);

        await updateMathInputValue({
            latex: "3",
            componentIdx: mathinput4Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer4"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer4")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.25);

        // back to page 1
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("pgn"),
            actionName: "setPage",
            args: { number: 1 },
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.25);

        // back to second page
        await callAction({
            componentIdx: await resolvePathToNodeIdx("nextPage"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.25);

        await updateMathInputValue({
            latex: "4",
            componentIdx: mathinput4Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer4"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer4")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.5);

        // on to third page
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("pgn"),
            actionName: "setPage",
            args: { number: 3 },
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.5);

        await updateMathInputValue({
            latex: "2x",
            componentIdx: mathinput2Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer2")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.75);

        await updateMathInputValue({
            latex: "2y",
            componentIdx: mathinput3Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer3")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(1);

        await updateMathInputValue({
            latex: "2z",
            componentIdx: mathinput2Name,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answer2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answer2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.75);

        // back to second page
        await callAction({
            componentIdx: await resolvePathToNodeIdx("prevPage"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca")].stateValues.value,
        ).eq(0.75);
    });

    it("Set page action ignores read only flag", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <paginatorControls paginator="$pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <problem>
        <title>Problem 1</title>
        <p>1: <answer type="text"><textInput name="ti1"/><award>1</award></answer></p>
      </problem>
      <problem>
        <title>Problem 2</title>
        <p>2: <answer type="text"><textInput name="ti2"/><award>2</award></answer></p>
      </problem>
    </paginator>
    <p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
    `,
            flags: { readOnly: true },
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .numPages,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .numPages,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(1);

        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([0]);

        expect(
            stateVariables[await resolvePathToNodeIdx("ti1")].stateValues
                .disabled,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ti2")].stateValues
                .disabled,
        ).eq(true);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("pgn"),
            actionName: "setPage",
            args: { number: 2 },
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .currentPage,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcontrols")].stateValues
                .currentPage,
        ).eq(2);

        expect(
            stateVariables[await resolvePathToNodeIdx("pgn")].stateValues
                .childIndicesToRender,
        ).eqls([1]);
    });
});
