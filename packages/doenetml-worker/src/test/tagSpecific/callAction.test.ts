import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    callAction,
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

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("callAction tag tests", async () => {
    async function test_resample(core) {
        let stateVariables = await returnAllStateVariables(core);

        let sum = 0;
        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let [ind, num] of numbers.entries()) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
            sum += num * 10 ** ind;
        }

        expect(stateVariables["/sum"].stateValues.value).eq(sum);

        await callAction({ name: "/rs", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/sum"].stateValues.value).not.eq(sum);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
    }

    it("resample random numbers", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice</label>
    </callAction></p>
    <p>Sum: <number name="sum"><sum>
      <map>
        <template><number>$v*10^($i-1)</number></template>
        <sources alias="v" indexAlias="i">$s</sources>
      </map>
    </sum></number></p>
    `,
        });

        await test_resample(core);
    });

    it("add and delete points", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="theGraphs" newNamespace>
      <title>The graphs</title>
      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      $g{name="g2"}
    </section>

    $theGraphs{name="theGraphs2"}

    <p>points from graph: <collect componentTypes="point" target="theGraphs/g" prop="coords" assignNames="p1 p2 p3" /></p>
    <callAction name="addPoint" target="theGraphs/g" actionName="addChildren">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="theGraphs/g" actionName="deleteChildren" number="1" >
      <label>delete point</label>
    </callAction>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p1"].stateValues.latex)).eq("(1,2)");

        let g1 = stateVariables["/theGraphs/g"];
        let g2 = stateVariables["/theGraphs/g2"];
        let g3 = stateVariables["/theGraphs2/g"];
        let g4 = stateVariables["/theGraphs2/g2"];
        let gs = [g1, g2, g3, g4];

        for (let g of gs) {
            expect(g.stateValues.graphicalDescendants.length).eq(1);
        }

        await callAction({ name: "/addPoint", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(3,4)");

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(pointNames.length).eq(2);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 2]);
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([3, 4]);
        }

        await movePoint({
            name: g1.stateValues.graphicalDescendants[1].componentName,
            x: -2,
            y: 5,
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq(
            "(-2,5)",
        );

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([-2, 5]);
        }

        await callAction({ name: "/addPoint", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(3,4)");

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(pointNames.length).eq(3);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 2]);
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([-2, 5]);
            expect(
                stateVariables[pointNames[2]].stateValues.xs.map((x) => x.tree),
            ).eqls([3, 4]);
        }

        await movePoint({
            name: g2.stateValues.graphicalDescendants[2].componentName,
            x: 7,
            y: -9,
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq(
            "(7,-9)",
        );

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(
                stateVariables[pointNames[2]].stateValues.xs.map((x) => x.tree),
            ).eqls([7, -9]);
        }

        await callAction({ name: "/deletePoint", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p3"]).eq(undefined);

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(pointNames.length).eq(2);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 2]);
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([-2, 5]);
        }

        await movePoint({
            name: g3.stateValues.graphicalDescendants[1].componentName,
            x: 1,
            y: 0,
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(1,0)");

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 0]);
        }

        await callAction({ name: "/deletePoint", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p2"]).eq(undefined);

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(pointNames.length).eq(1);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 2]);
        }

        await callAction({ name: "/deletePoint", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p1"].stateValues.latex)).eq("(1,2)");

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(pointNames.length).eq(1);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 2]);
        }

        await callAction({ name: "/addPoint", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(3,4)");

        g1 = stateVariables["/theGraphs/g"];
        g2 = stateVariables["/theGraphs/g2"];
        g3 = stateVariables["/theGraphs2/g"];
        g4 = stateVariables["/theGraphs2/g2"];
        gs = [g1, g2, g3, g4];

        for (let g of gs) {
            let pointNames = g.stateValues.graphicalDescendants.map(
                (x) => x.componentName,
            );
            expect(pointNames.length).eq(2);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 2]);
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([3, 4]);
        }
    });

    async function test_chained_actions(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await callAction({ name: "/rs", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(3,4)");

        let pointNames = stateVariables[
            "/g"
        ].stateValues.graphicalDescendants.map((x) => x.componentName);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);

        await movePoint({ name: pointNames[1], x: -2, y: 5, core });

        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq(
            "(-2,5)",
        );

        pointNames = stateVariables["/g"].stateValues.graphicalDescendants.map(
            (x) => x.componentName,
        );
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
    }

    it("chained actions", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="rs">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        });

        await test_chained_actions(core);
    });

    it("chained actions, unnecessary $", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="$rs">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        });

        await test_chained_actions(core);
    });

    it("chained actions, inside map", async () => {
        let core = await createTestCore({
            doenetML: `
    <map assignNames="set1 set2">
    <template newNamespace>
      <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
      <p><callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction></p>

      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

      <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="rs">
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </template>
    <sources><sequence length="2" /></sources>
    </map>

    `,
        });

        for (let ind = 1; ind <= 2; ind++) {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables[`/set${ind}/addPoint`].stateValues.hidden).eq(
                true,
            );

            expect(
                stateVariables[`/set${ind}/g`].stateValues.graphicalDescendants
                    .length,
            ).eq(1);

            let numbers = stateVariables[`/set${ind}/nums`].stateValues.text
                .split(",")
                .map(Number);
            expect(numbers.length).eq(7);
            for (let num of numbers) {
                expect(Number.isInteger(num)).be.true;
                expect(num).gte(1);
                expect(num).lte(6);
            }

            await callAction({ name: `/set${ind}/rs`, core });
            stateVariables = await returnAllStateVariables(core);

            expect(
                cleanLatex(stateVariables[`/set${ind}/p2`].stateValues.latex),
            ).eq("(3,4)");

            let pointNames = stateVariables[
                `/set${ind}/g`
            ].stateValues.graphicalDescendants.map((x) => x.componentName);
            expect(pointNames.length).eq(2);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
            ).eqls([1, 2]);
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([3, 4]);

            await movePoint({ name: pointNames[1], x: -2, y: 5, core });

            stateVariables = await returnAllStateVariables(core);

            expect(
                cleanLatex(stateVariables[`/set${ind}/p2`].stateValues.latex),
            ).eq("(-2,5)");

            pointNames = stateVariables[
                `/set${ind}/g`
            ].stateValues.graphicalDescendants.map((x) => x.componentName);
            expect(
                stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
            ).eqls([-2, 5]);

            let numbers2 = stateVariables[`/set${ind}/nums`].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2.length).eq(7);
            for (let num of numbers2) {
                expect(Number.isInteger(num)).be.true;
                expect(num).gte(1);
                expect(num).lte(6);
            }
            expect(numbers2).not.eqls(numbers);
        }
    });

    it("chained actions on multiple sources", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <p><number name="n">1</number></p>
    <p><updateValue name="in" target="n" newValue="$n+1" type="number" >
      <label>increment number and add point</label>
    </updateValue></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
        
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="rs in">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(stateVariables["/n"].stateValues.value).eq(1);

        await callAction({ name: "/rs", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(3,4)");

        let pointNames = stateVariables[
            "/g"
        ].stateValues.graphicalDescendants.map((x) => x.componentName);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);

        await movePoint({ name: pointNames[1], x: -2, y: 5, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq(
            "(-2,5)",
        );

        pointNames = stateVariables["/g"].stateValues.graphicalDescendants.map(
            (x) => x.componentName,
        );
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);

        expect(stateVariables["/n"].stateValues.value).eq(1);

        await updateValue({ name: "/in", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq("(3,4)");

        pointNames = stateVariables["/g"].stateValues.graphicalDescendants.map(
            (x) => x.componentName,
        );
        expect(pointNames.length).eq(3);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, 5]);
        expect(
            stateVariables[pointNames[2]].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);

        await movePoint({ name: pointNames[2], x: 7, y: -9, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p3"].stateValues.latex)).eq(
            "(7,-9)",
        );

        pointNames = stateVariables["/g"].stateValues.graphicalDescendants.map(
            (x) => x.componentName,
        );
        expect(
            stateVariables[pointNames[2]].stateValues.xs.map((x) => x.tree),
        ).eqls([7, -9]);

        expect(stateVariables["/n"].stateValues.value).eq(2);
    });

    it("action based on trigger", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>roll dice</label>
    </callAction></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/rs"].stateValues.hidden).eq(true);

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,2)",
        );

        await movePoint({ name: "/P", x: -1, y: -7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,-7)",
        );

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 3, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(3,-4)",
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 1, y: 7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(1,7)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(5,9)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: -3, y: 4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-3,4)",
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: -6, y: 5, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-6,5)",
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 4, y: 2, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(4,2)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(9,7)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);
    });

    it("action triggered when click", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsClicked="P" >
      <label>roll dice</label>
    </callAction></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/rs"].stateValues.hidden).eq(true);

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,2)",
        );

        await movePoint({ name: "/P", x: 3, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(3,-4)",
        );

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await clickPoint({ name: "/P", core });

        stateVariables = await returnAllStateVariables(core);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(5,9)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await clickPoint({ name: "/P", core });

        stateVariables = await returnAllStateVariables(core);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(9,7)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);
    });

    it("action triggered when click, inside template creating random names", async () => {
        let core = await createTestCore({
            doenetML: `
    <map>
    <template>
      <graph>
        <point name="P">(-1,2)</point>
      </graph>
      $P.coords{assignNames="P2"}
      <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
      <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsClicked="P" >
        <label>roll dice</label>
      </callAction></p>
    </template>
    <sources><sequence length="2" /></sources>
    </map>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        for (let ind = 0; ind < 2; ind++) {
            let templateName =
                stateVariables["/_map1"].replacements![ind].componentName;

            let tReps = stateVariables[templateName].replacements;
            let graphName = tReps![1].componentName;
            let copyName = tReps![3].componentName;
            let numsName = tReps![5].componentName;

            let PName =
                stateVariables[graphName].activeChildren[0].componentName;
            let P2Name =
                stateVariables[copyName].replacements![0].componentName;

            let numbers = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);
            expect(numbers.length).eq(7);
            for (let num of numbers) {
                expect(Number.isInteger(num)).be.true;
                expect(num).gte(1);
                expect(num).lte(6);
            }

            expect(cleanLatex(stateVariables[P2Name].stateValues.latex)).eq(
                "(-1,2)",
            );

            await movePoint({ name: PName, x: 3, y: -4, core });

            stateVariables = await returnAllStateVariables(core);

            expect(cleanLatex(stateVariables[P2Name].stateValues.latex)).eq(
                "(3,-4)",
            );

            let numbers2 = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2).eqls(numbers);

            await clickPoint({ name: PName, core });

            stateVariables = await returnAllStateVariables(core);

            numbers2 = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2.length).eq(7);
            for (let num of numbers2) {
                expect(Number.isInteger(num)).be.true;
                expect(num).gte(1);
                expect(num).lte(6);
            }
            expect(numbers2).not.eqls(numbers);
            numbers = numbers2;

            await movePoint({ name: PName, x: 5, y: 9, core });

            stateVariables = await returnAllStateVariables(core);

            expect(cleanLatex(stateVariables[P2Name].stateValues.latex)).eq(
                "(5,9)",
            );

            numbers2 = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2).eqls(numbers);

            await clickPoint({ name: PName, core });

            stateVariables = await returnAllStateVariables(core);

            numbers2 = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2.length).eq(7);
            for (let num of numbers2) {
                expect(Number.isInteger(num)).be.true;
                expect(num).gte(1);
                expect(num).lte(6);
            }
            expect(numbers2).not.eqls(numbers);
            numbers = numbers2;

            await movePoint({ name: PName, x: 9, y: 7, core });

            stateVariables = await returnAllStateVariables(core);

            expect(cleanLatex(stateVariables[P2Name].stateValues.latex)).eq(
                "(9,7)",
            );

            numbers2 = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2).eqls(numbers);
        }
    });

    it("action triggered when object focused", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsFocused="P" >
      <label>roll dice</label>
    </callAction></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/rs"].stateValues.hidden).eq(true);

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,2)",
        );

        await movePoint({ name: "/P", x: 3, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(3,-4)",
        );

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await focusPoint({ name: "/P", core });

        stateVariables = await returnAllStateVariables(core);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(5,9)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await focusPoint({ name: "/P", core });

        stateVariables = await returnAllStateVariables(core);

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(9,7)");

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);
    });

    it("chained updates based on trigger", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs"  triggerWith="addPoint" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/rs"].stateValues.hidden).eq(true);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,2)",
        );
        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await movePoint({ name: "/P", x: -1, y: -7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,-7)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 3, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(3,-4)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 1, y: 7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(1,7)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(5,9)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: -3, y: 4, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-3,4)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: -6, y: 5, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-6,5)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 4, y: 2, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(4,2)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            3,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 9, y: 7, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(9,7)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            3,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);
    });

    it("triggerWhen supersedes chaining", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    $P.coords{assignNames="P2"}

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs"  triggerWith="addPoint" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/rs"].stateValues.hidden).eq(true);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);
        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,2)",
        );
        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await movePoint({ name: "/P", x: -1, y: -7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-1,-7)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: 3, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(3,-4)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 1, y: 7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(1,7)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 5, y: 9, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(5,9)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: -3, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-3,-4)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;

        await movePoint({ name: "/P", x: -6, y: -5, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq(
            "(-6,-5)",
        );

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            2,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 4, y: 2, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(4,2)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            3,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({ name: "/P", x: 9, y: 7, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/P2"].stateValues.latex)).eq("(9,7)");

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            3,
        );

        numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);
    });

    it("triggerSet", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <triggerSet name="tset" >
      <label>perform actions</label>
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/rs"].stateValues.hidden).eq(true);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await triggerActions({ name: "/tset", core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(3,4)");

        let pointNames = stateVariables[
            "/g"
        ].stateValues.graphicalDescendants.map((x) => x.componentName);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);

        await movePoint({ name: pointNames[1], x: -2, y: 5, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq(
            "(-2,5)",
        );

        pointNames = stateVariables["/g"].stateValues.graphicalDescendants.map(
            (x) => x.componentName,
        );
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
    });

    it("triggerSet and chain to callAction", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <p>Enter x: <answer name="ans">x</answer></p>

    <triggerSet name="tset" >
        <label>perform actions</label>
        <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <callAction name="sub" target="ans" actionName="submitAnswer" triggerWith="tset" />

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/rs"].stateValues.hidden).eq(true);
        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);
        expect(stateVariables["/sub"].stateValues.hidden).eq(true);

        let mathInputName =
            stateVariables["/ans"].stateValues.inputChildren[0].componentName;

        await updateMathInputValue({
            latex: "x",
            name: mathInputName,
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/ans"].stateValues.justSubmitted).eq(false);

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await triggerActions({ name: "/tset", core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(3,4)");

        let pointNames = stateVariables[
            "/g"
        ].stateValues.graphicalDescendants.map((x) => x.componentName);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);

        await movePoint({ name: pointNames[1], x: -2, y: 5, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq(
            "(-2,5)",
        );

        pointNames = stateVariables["/g"].stateValues.graphicalDescendants.map(
            (x) => x.componentName,
        );
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);

        expect(stateVariables["/ans"].stateValues.justSubmitted).eq(true);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
    });

    it("chaining with updateValue", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and more</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="addOne">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    <p>Count: <number name="n">1</number></p>
    <updateValue name="addOne" target="n" newValue="$n+1" type="number" triggerWith="rs" />


    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/addPoint"].stateValues.hidden).eq(true);

        expect(stateVariables["/g"].stateValues.graphicalDescendants.length).eq(
            1,
        );

        let numbers = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(stateVariables["/n"].stateValues.value).eq(1);

        await callAction({ name: "/rs", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq("(3,4)");

        let pointNames = stateVariables[
            "/g"
        ].stateValues.graphicalDescendants.map((x) => x.componentName);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);

        await movePoint({ name: pointNames[1], x: -2, y: 5, core });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/p2"].stateValues.latex)).eq(
            "(-2,5)",
        );

        pointNames = stateVariables["/g"].stateValues.graphicalDescendants.map(
            (x) => x.componentName,
        );
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables["/nums"].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);

        expect(stateVariables["/n"].stateValues.value).eq(2);
    });

    it("math in label", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="rs" ><label>Hi <m>\\sum_{i=1}^5x_i</m></label></callAction></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/rs"].stateValues.label).eq(
            "Hi \\(\\sum_{i=1}^5x_i\\)",
        );
    });

    it("label is name", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="resample" name="resample_numbers" labelIsName /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/resample_numbers"].stateValues.label).eq(
            "resample numbers",
        );
    });

    it("case insensitive action name", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="s" actionName="reSamplE" name="rs"><label>roll dice</label></callAction></p>
    <p>Sum: <number name="sum"><sum>
      <map>
        <template><number>$v*10^($i-1)</number></template>
        <sources alias="v" indexAlias="i">$s</sources>
      </map>
    </sum></number></p>
    `,
        });

        await test_resample(core);
    });

    it("callAction in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph >
      <callAction anchor="$anchorCoords1" name="callAction1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1" target="_graph1" actionName="addChildren">
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
      <callAction name="callAction2" target="_graph1" actionName="addChildren">
        <label>add point 2</label>
        <point>(-3,-4)</point>
      </callAction>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $callAction1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $callAction2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathInput name="anchorCoords2" bindValueTo="$callAction2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $callAction1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $callAction2.positionFromAnchor</p>
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
    <choiceInput inline name="positionFromAnchor2" bindValueTo="$callAction2.positionFromAnchor">
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
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$callAction2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$callAction2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$callAction2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$callAction2.fixLocation" /></p>

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

        // move callActions by dragging

        await moveButton({ name: "/callAction1", x: -2, y: 3, core });
        await moveButton({ name: "/callAction2", x: 4, y: -5, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( -2, 3 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( 4, -5 )",
        );

        // move callActions by entering coordinates

        await updateMathInputValue({
            latex: "(6,7)",
            name: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(8,9)",
            name: "/anchorCoords2",
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
        await updateSelectedIndices({
            name: "/positionFromAnchor1",
            selectedIndices: [4],
            core,
        });
        await updateSelectedIndices({
            name: "/positionFromAnchor2",
            selectedIndices: [3],
            core,
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
            name: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: false",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: false",
        );

        // cannot move callActions by dragging
        await moveButton({ name: "/callAction1", x: -10, y: -9, core });
        await moveButton({ name: "/callAction2", x: -8, y: -7, core });
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
            name: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );

        await moveButton({ name: "/callAction1", x: -10, y: -9, core });
        await moveButton({ name: "/callAction2", x: -8, y: -7, core });
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
            name: "/fixLocation1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/fixLocation2",
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
            name: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(3,4)",
            name: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 2 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // cannot move callActions by dragging
        await moveButton({ name: "/callAction1", x: 4, y: 6, core });
        await moveButton({ name: "/callAction2", x: 7, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pAnchor1"].stateValues.text).eq(
            "Anchor 1 coordinates: ( 1, 2 )",
        );
        expect(stateVariables["/pAnchor2"].stateValues.text).eq(
            "Anchor 2 coordinates: ( -8, -7 )",
        );

        // can change position from anchor only for button 1
        await updateSelectedIndices({
            name: "/positionFromAnchor1",
            selectedIndices: [7],
            core,
        });
        await updateSelectedIndices({
            name: "/positionFromAnchor2",
            selectedIndices: [8],
            core,
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
            name: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/disabled2",
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
            name: "/fixed1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/fixed2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixed1"].stateValues.text).eq("Fixed 1: true");
        expect(stateVariables["/pFixed2"].stateValues.text).eq("Fixed 2: true");

        // can change coordinates entering coordinates only for button 1
        await updateMathInputValue({
            latex: "(5,6)",
            name: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(7,8)",
            name: "/anchorCoords2",
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
        await updateSelectedIndices({
            name: "/positionFromAnchor1",
            selectedIndices: [6],
            core,
        });
        await updateSelectedIndices({
            name: "/positionFromAnchor2",
            selectedIndices: [5],
            core,
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
            name: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/disabled2",
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

    <callAction name="ca1" />
    <callAction name="ca2" styleNumber="2" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ca1"].stateValues.selectedStyle.fillColor).eq(
            "green",
        );
        expect(stateVariables["/ca2"].stateValues.selectedStyle.fillColor).eq(
            "yellow",
        );
    });
});
