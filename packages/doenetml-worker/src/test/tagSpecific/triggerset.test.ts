import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("TriggerSet tag tests", async () => {
    async function test_5_triggered_actions(core) {
        let stateVariables = await returnAllStateVariables(core);

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

        await core.requestAction({
            componentName: "/tset",
            actionName: "triggerActions",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            componentName: "/tset",
            actionName: "triggerActions",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(3);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);

        await core.requestAction({
            componentName: "/tset",
            actionName: "triggerActions",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n2"].stateValues.value).eq(1);

        await test_5_triggered_actions(core);

        stateVariables = await returnAllStateVariables(core);
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

        await core.requestAction({
            componentName: "/in",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -3, y: 4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -6, y: 5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 9, y: 7 },
            event: null,
        });
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            actionName: "pointClicked",
            componentName: "/P",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "pointClicked",
            componentName: "/P",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/trip"].stateValues.hidden).eq(true);
        expect(stateVariables["/quad"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("y");

        await core.requestAction({
            actionName: "pointFocused",
            componentName: "/P",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("3x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("4y");

        await core.requestAction({
            actionName: "pointFocused",
            componentName: "/P",
            args: { name: "/P" },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/x"].stateValues.latex)).eq("9x");
        expect(cleanLatex(stateVariables["/y"].stateValues.latex)).eq("16y");

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/ts1"].stateValues.hidden).eq(true);
        expect(stateVariables["/ts2"].stateValues.hidden).eq(true);

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(5);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -1, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 1, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -6, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);

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

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -1, y: -7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(1);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 3, y: -4 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(1);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 1, y: 7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 5, y: 9 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -3, y: -4 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -6, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 4, y: 2 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(3);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 9, y: 7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/ts"].stateValues.hidden).eq(true);
        expect(stateVariables["/uv"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].activeChildren.length).eq(1);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(5);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -1, y: -7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(1);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 3, y: -4 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(1);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq("");
        expect(stateVariables["/n"].stateValues.value).eq(1);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 1, y: 7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 5, y: 9 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(4);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -3, y: -4 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: -6, y: -5 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(2);
        expect(stateVariables["/b"].stateValues.value).eq(true);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello");
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 4, y: 2 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/g"].activeChildren.length).eq(3);
        expect(stateVariables["/b"].stateValues.value).eq(false);
        expect(stateVariables["/hello"].stateValues.value).eq(" hello hello");
        expect(stateVariables["/n"].stateValues.value).eq(3);
        expect(stateVariables["/m"].stateValues.value).eq(3);

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/P",
            args: { x: 9, y: 7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

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

        let stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/trigger-me"].stateValues.label).eq(
            "trigger me",
        );
    });

    it("triggerSet in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n: <number name="n">1</number></p>
    <graph name="g">
      <triggerSet anchor="$anchorCoords1" name="triggerSet1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1">
        <label>increment and add point</label>
        <callAction target="g" actionName="addChildren">
          <point>(3,4)</point>
        </callAction>
        <updateValue target="n" newValue="$n+1" />
      </triggerSet>
      <triggerSet name="triggerSet2">
        <label>add point 2 and decrement</label>
        <callAction target="g" actionName="addChildren">
          <point>(-3,-4)</point>
        </callAction>
        <updateValue target="n" newValue="$n-1" />

      </triggerSet>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $triggerSet1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $triggerSet2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathInput name="anchorCoords2" bindValueTo="$triggerSet2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $triggerSet1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $triggerSet2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceInput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceInput>
    </p>
    <p>Change position from anchor 2
    <choiceInput inline name="positionFromAnchor2" bindValueTo="$triggerSet2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceInput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$triggerSet2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$triggerSet2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$triggerSet2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$triggerSet2.fixLocation" /></p>

    `,
        });

        // TODO: how to click on the buttons and test if they are disabled?

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 3 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 0, 0 )",
        );
        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: upperright",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: center",
        );
        expect(
            stateVariables["/positionFromAnchor1"].stateValues.selectedIndices,
        ).eqls([1]);
        expect(
            stateVariables["/positionFromAnchor2"].stateValues.selectedIndices,
        ).eqls([9]);
        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );
        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: false",
        );
        expect(stateVariables["/pFixed1"].stateValues.text).eq(
            "Fixed 1: false",
        );
        expect(stateVariables["/pFixed2"].stateValues.text).eq(
            "Fixed 2: false",
        );
        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: false",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: false",
        );

        // move triggerSets by dragging

        await core.requestAction({
            actionName: "moveButton",
            componentName: "/triggerSet1",
            args: { x: -2, y: 3 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/triggerSet2",
            args: { x: 4, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( -2, 3 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 4, -5 )",
        );

        // move triggerSets by entering coordinates
        await updateMathInputValue({
            latex: "(6,7)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(8,9)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 6, 7 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 8, 9 )",
        );

        // change position from anchor
        await core.requestAction({
            componentName: "/positionFromAnchor1",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [4],
            },
            event: null,
        });
        await core.requestAction({
            componentName: "/positionFromAnchor2",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [3],
            },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: lowerleft",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // make not draggable
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: false",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: false",
        );

        // cannot move triggerSets by dragging
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/triggerSet1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/triggerSet2",
            args: { x: -8, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 6, 7 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 8, 9 )",
        );

        // make draggable again
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );

        await core.requestAction({
            actionName: "moveButton",
            componentName: "/triggerSet1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/triggerSet2",
            args: { x: -8, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( -10, -9 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // fix location
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: true",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: true",
        );

        // can change coordinates entering coordinates only for button 1

        await updateMathInputValue({
            latex: "(1,2)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(3,4)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 2 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // cannot move triggerSets by dragging
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue1",
            args: { x: 4, y: 6 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveButton",
            componentName: "/updateValue2",
            args: { x: 7, y: 8 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 2 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // can change position from anchor only for button 1
        await core.requestAction({
            componentName: "/positionFromAnchor1",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [7],
            },
            event: null,
        });
        await core.requestAction({
            componentName: "/positionFromAnchor2",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [8],
            },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: top",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: false",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );
        // make completely fixed
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixed1"].stateValues.text).eq("Fixed 1: true");
        expect(stateVariables["/pFixed2"].stateValues.text).eq("Fixed 2: true");

        // can change coordinates entering coordinates only for button 1
        await updateMathInputValue({
            latex: "(5,6)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(7,8)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 5, 6 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // can change position from anchor only for button 1
        await core.requestAction({
            componentName: "/positionFromAnchor1",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [6],
            },
            event: null,
        });
        await core.requestAction({
            componentName: "/positionFromAnchor2",
            actionName: "updateSelectedIndices",
            args: {
                selectedIndices: [5],
            },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: right",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute only for button 1
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ts1"].stateValues.selectedStyle.fillColor).eq(
            "green",
        );
        expect(stateVariables["/ts2"].stateValues.selectedStyle.fillColor).eq(
            "yellow",
        );
    });
});
