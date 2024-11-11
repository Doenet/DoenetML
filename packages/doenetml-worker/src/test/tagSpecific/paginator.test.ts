import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    callAction,
    submitAnswer,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("Paginator tag tests", async () => {
    it("Multiple sections in paginator", async () => {
        let core = await createTestCore({
            doenetML: `
    <paginatorControls paginator="pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <section name="section1">
        <title name="title1">Page 1</title>
        <p>What is 1+1? <answer name="answer1">$two</answer></p>
        <math hide name="two">2</math>
      </section>
      <section name="section2">
        <p>What is your name? <textinput name="name" /></p>
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
    <callAction name="prevPage" disabled="$pageNum = 1" actionName="setPage" target="pgn" number="$pageNum -1"  >
      <label>prev</label>
    </callAction>
    Page $pgn.currentPage{assignNames="pageNum"}
    of $pgn.numPages{assignNames="numPages"}
    <callAction name="nextPage" disabled="$pageNum = $numPages" actionName="setPage" target="pgn" number="$pageNum +1"  >
      <label>next</label>
    </callAction>
    
    </p>
    <p>What is 2+2? <answer name="answer4">4</answer></p>
  
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
  
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let mathinput1Name =
            stateVariables["/answer1"].stateValues.inputChildren[0]
                .componentName;
        let mathinput2Name =
            stateVariables["/answer2"].stateValues.inputChildren[0]
                .componentName;
        let mathinput3Name =
            stateVariables["/answer3"].stateValues.inputChildren[0]
                .componentName;
        let mathinput4Name =
            stateVariables["/answer4"].stateValues.inputChildren[0]
                .componentName;

        expect(stateVariables["/pgn"].stateValues.numPages).eq(3);
        expect(stateVariables["/pgn"].stateValues.currentPage).eq(1);
        expect(stateVariables["/pcontrols"].stateValues.numPages).eq(3);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(1);

        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            0,
        ]);
        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/title1"].stateValues.value).eq("Page 1");
        expect(stateVariables["/title3"].stateValues.value).eq("Page 3");

        await updateMathInputValue({ latex: "4", name: mathinput4Name, core });
        await submitAnswer({ name: "/answer4", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/ca"].stateValues.value).eq(0.25);

        await updateMathInputValue({ latex: "2", name: mathinput1Name, core });
        await submitAnswer({ name: "/answer1", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/ca"].stateValues.value).eq(0.5);

        // move to page 2
        await core.requestAction({
            componentName: "/pgn",
            actionName: "setPage",
            args: { number: 2 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pgn"].stateValues.currentPage).eq(2);
        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            1,
        ]);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(2);
        expect(stateVariables["/ca"].stateValues.value).eq(0.5);

        await updateTextInputValue({ text: "Me", name: "/name", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p3"].stateValues.text).eq("Hello, Me!");
        expect(stateVariables["/ca"].stateValues.value).eq(0.5);

        await updateMathInputValue({ latex: "3", name: mathinput4Name, core });
        await submitAnswer({ name: "/answer4", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/ca"].stateValues.value).eq(0.25);

        // back to page 1
        await core.requestAction({
            componentName: "/pgn",
            actionName: "setPage",
            args: { number: 1 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pgn"].stateValues.currentPage).eq(1);
        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            0,
        ]);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(1);
        expect(stateVariables["/ca"].stateValues.value).eq(0.25);

        // back to second page
        await callAction({ name: "/nextPage", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pgn"].stateValues.currentPage).eq(2);
        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            1,
        ]);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(2);
        expect(stateVariables["/ca"].stateValues.value).eq(0.25);

        await updateMathInputValue({ latex: "4", name: mathinput4Name, core });
        await submitAnswer({ name: "/answer4", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/ca"].stateValues.value).eq(0.5);

        // on to third page
        await core.requestAction({
            componentName: "/pgn",
            actionName: "setPage",
            args: { number: 3 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pgn"].stateValues.currentPage).eq(3);
        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            2,
        ]);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(3);
        expect(stateVariables["/ca"].stateValues.value).eq(0.5);

        await updateMathInputValue({ latex: "2x", name: mathinput2Name, core });
        await submitAnswer({ name: "/answer2", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/ca"].stateValues.value).eq(0.75);

        await updateMathInputValue({ latex: "2y", name: mathinput3Name, core });
        await submitAnswer({ name: "/answer3", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/ca"].stateValues.value).eq(1);

        await updateMathInputValue({ latex: "2z", name: mathinput2Name, core });
        await submitAnswer({ name: "/answer2", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/ca"].stateValues.value).eq(0.75);

        // back to second page
        await callAction({ name: "/prevPage", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pgn"].stateValues.currentPage).eq(2);
        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            1,
        ]);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(2);
        expect(stateVariables["/ca"].stateValues.value).eq(0.75);
    });

    it("Set page action ignores read only flag", async () => {
        let core = await createTestCore({
            doenetML: `
    <paginatorControls paginator="pgn" name="pcontrols" />
  
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
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `,
            flags: { readOnly: true },
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pgn"].stateValues.numPages).eq(2);
        expect(stateVariables["/pgn"].stateValues.currentPage).eq(1);
        expect(stateVariables["/pcontrols"].stateValues.numPages).eq(2);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(1);

        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            0,
        ]);

        expect(stateVariables["/ti1"].stateValues.disabled).eq(true);
        expect(stateVariables["/ti2"].stateValues.disabled).eq(true);

        await core.requestAction({
            componentName: "/pgn",
            actionName: "setPage",
            args: { number: 2 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pgn"].stateValues.currentPage).eq(2);
        expect(stateVariables["/pcontrols"].stateValues.currentPage).eq(2);

        expect(stateVariables["/pgn"].stateValues.childIndicesToRender).eqls([
            1,
        ]);
    });
});
