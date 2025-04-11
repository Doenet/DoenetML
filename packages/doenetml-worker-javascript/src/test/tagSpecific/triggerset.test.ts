import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveButton,
    movePoint,
    clickPoint,
    focusPoint,
    triggerActions,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateValue,
} from "../utils/actions";
import me from "math-expressions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("TriggerSet tag tests", async () => {
    async function test_5_triggered_actions(core) {
        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/flip"].stateValues.hidden).eq(true);
        expect(stateVariables["/addHello"].stateValues.hidden).eq(true);
        expect(stateVariables["/addOne"].stateValues.hidden).eq(true);
        expect(stateVariables["/rs"].stateValues.hidden).eq(true);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await triggerActions({ name: "/tset", core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await triggerActions({ name: "/tset", core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(3);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);

        await triggerActions({ name: "/tset", core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(4);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(
            " hello hello hello",
        );
        expect(stateVariables["/n"].stateValues.value).eq(4);
    }

    it("triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <updateValue name="addOne" target="n" newValue="$n+1" type="number" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>
    `,
        });

        await test_5_triggered_actions(core);
    });

    it("triggerSet and chain to updateValue and call action", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
    </triggerSet>

    <updateValue name="addOne" target="n" newValue="$n+1" type="number" triggerWith="tset" />
    <callAction name="addPoint" target="g" actionName="addChildren"  triggerWith="tset" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    `,
        });

        await test_5_triggered_actions(core);
    });

    it("triggerSet and chain to triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
    </triggerSet>

    <triggerSet triggerWith="tset" >
      <label>perform updates</label>
      <updateValue name="addOne" target="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    `,
        });

        await test_5_triggered_actions(core);
    });

    it("triggerSet and chain multiple sources to triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count 2: <number name="n2">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice</label>
      </callAction>
    </triggerSet>

    <triggerSet triggerWith="tset in" >
      <label>perform updates</label>
      <updateValue name="addOne" target="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue name="in" target="n2" newValue="$n2+1" type="number" >
      <label>update number and others</label>
    </updateValue>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/n2"].stateValues.value).eq(1);

        await test_5_triggered_actions(core);

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/n2"].stateValues.value).eq(1);
        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(stateVariables["/g"].activeChildren.length).eq(4);

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(
            " hello hello hello",
        );
        expect(stateVariables["/n"].stateValues.value).eq(4);

        await updateValue({ name: "/in", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/n2"].stateValues.value).eq(2);

        expect(stateVariables["/g"].activeChildren.length).eq(5);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(
            " hello hello hello",
        );
        expect(stateVariables["/n"].stateValues.value).eq(5);
    });

    it("triggerSet based on trigger", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
  </triggerSet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await movePoint({ name: "/P", x: -1, y: -7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await movePoint({ name: "/P", x: 3, y: -4, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await movePoint({ name: "/P", x: 1, y: 7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await movePoint({ name: "/P", x: -3, y: 4, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await movePoint({ name: "/P", x: -6, y: 5, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await movePoint({ name: "/P", x: 4, y: 2, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await movePoint({ name: "/P", x: 9, y: 7, core });
    });

    it("triggerSet triggered when click", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhenObjectsClicked="P" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
  </triggerSet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await movePoint({ name: "/P", x: -1, y: -7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await clickPoint({ name: "/P", core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await clickPoint({ name: "/P", core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");
    });

    it("triggerSet triggered when object focused", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhenObjectsFocused="P" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
  </triggerSet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await movePoint({ name: "/P", x: -1, y: -7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await focusPoint({ name: "/P", core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await focusPoint({ name: "/P", core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");
    });

    it("triggerWhen supersedes chaining for triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet name="ts1" triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet name="ts2" triggerWith="ts1" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>perform updates</label>
      <updateValue target="n" newValue="$n+1" type="number"  />
      <updateValue target="m" newValue="$m-1" type="number"  />
    </triggerSet>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/ts1"].stateValues.hidden).eq(true);
        expect(stateVariables["/ts2"].stateValues.hidden).eq(true);

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(5);

        await movePoint({ name: "/P", x: -1, y: -7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: 3, y: -4, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: 1, y: 7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: -3, y: -4, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await movePoint({ name: "/P", x: -6, y: -5, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await movePoint({ name: "/P", x: 4, y: 2, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);
    });

    it("triggerSet supersedes triggerWhen for updateValue and callAction children", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <updateValue name="addOne" target="n" newValue="$n+1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />
      <callAction target="s" actionName="resample" name="rs" triggerWhen="$(P.x)<0 and $(P.y)<0" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/flip"].stateValues.hidden).eq(true);
        expect(stateVariables["/addHello"].stateValues.hidden).eq(true);
        expect(stateVariables["/addOne"].stateValues.hidden).eq(true);
        expect(stateVariables["/rs"].stateValues.hidden).eq(true);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await movePoint({ name: "/P", x: -1, y: -7, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await movePoint({ name: "/P", x: 3, y: -4, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await movePoint({ name: "/P", x: 1, y: 7, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await movePoint({ name: "/P", x: -3, y: -4, core });

        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await movePoint({ name: "/P", x: -6, y: -5, core });

        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 4, y: 2, core });

        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(3);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(3);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
    });

    it("triggerSet supersedes chaining for updateValue children", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet name="ts" triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWith="uv" />
      <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="uv" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue name="uv" target="m" newValue="$m-1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/ts"].stateValues.hidden).eq(true);
        expect(stateVariables["/uv"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(5);

        await movePoint({ name: "/P", x: -1, y: -7, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: 3, y: -4, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: 1, y: 7, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: 5, y: 9, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await movePoint({ name: "/P", x: -3, y: -4, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await movePoint({ name: "/P", x: -6, y: -5, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await movePoint({ name: "/P", x: 4, y: 2, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(3);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await movePoint({ name: "/P", x: 9, y: 7, core });
        stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/g"].activeChildren.length).eq(3);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);
    });

    it("triggerSet with math in label", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>

    <triggerSet name="tset">
      <label>It is <math>∂f/∂x</math></label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
    </triggerSet>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/tset"].stateValues.label).eq(
            "It is \\(\\frac{ \\partial f }{ \\partial x }\\)",
        );
    });

    it("triggerSet with label is name", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Boolean to swap: <boolean name="b" /></p>

    <triggerSet name="trigger-me" labelIsName>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
    </triggerSet>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/trigger-me"].stateValues.label).eq(
            "trigger me",
        );
    });

    it("triggerSet in graph", async () => {
        const doenetMLsnippet = `
    <p>n: <number name="n">1</number></p>
    <graph name="g">
      <triggerSet anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1">
        <label>increment and add point</label>
        <callAction target="g" actionName="addChildren">
          <point>(3,4)</point>
        </callAction>
        <updateValue target="n" newValue="$n+1" />
      </triggerSet>
      <triggerSet name="item2">
        <label>add point 2 and decrement</label>
        <callAction target="g" actionName="addChildren">
          <point>(-3,-4)</point>
        </callAction>
        <updateValue target="n" newValue="$n-1" />

      </triggerSet>
    </graph>
                `;

        await test_in_graph(doenetMLsnippet, moveButton);
    });

    it("buttons can be styled", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinitions>
            <styleDefinition styleNumber="1" fillColor="green" />
            <styleDefinition styleNumber="2" fillColor="yellow" />
        </styleDefinitions>
    </setup>

    <triggerSet name="ts1" />
    <triggerSet name="ts2" styleNumber="2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/ts1"].stateValues.selectedStyle.fillColor).eq(
            "green",
        );
        expect(stateVariables["/ts2"].stateValues.selectedStyle.fillColor).eq(
            "yellow",
        );
    });
});
