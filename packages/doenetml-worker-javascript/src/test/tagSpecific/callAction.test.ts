import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { componentOrListEntry } from "../utils/list-entries";
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
import { test_in_graph } from "../utils/in-graph";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("callAction tag tests @group4", async () => {
    async function test_resample(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        let sum = 0;
        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let [ind, num] of numbers.entries()) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
            sum += num * 10 ** ind;
        }

        expect(
            stateVariables[await resolvePathToNodeIdx("sum")].stateValues.value,
        ).eq(sum);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("rs"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("sum")].stateValues.value,
        ).not.eq(sum);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" >
      <label>roll dice</label>
    </callAction></p>
    <p>Sum: <number name="sum"><sum>
      <repeat for="$s" valueName="v" indexName="i">
        <number>$v*10^($i-1)</number>
      </repeat>
    </sum></number></p>
    `,
        });

        await test_resample(core, resolvePathToNodeIdx);
    });

    it("add and delete points", async () => {
        const doenetML = `
    <section name="theGraphs">
      <title>The graphs</title>
      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      <graph extend="$g" name="g2" />
    </section>

    <section extend="$theGraphs" name="theGraphs2" />

    <p>points from graph: <collect componentType="point" from="$theGraphs.g" name="col" hide /><mathList extend="$col.coords" name="ps" /></p>
    <callAction name="addPoint" target="$theGraphs.g" actionName="addChildren">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="$theGraphs.g" actionName="deleteChildren" number="1" >
      <label>delete point</label>
    </callAction>
    `;

        async function check_items(n: number, points: number[][]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let i = 1; i <= n; i++) {
                expect(
                    cleanLatex(
                        (
                            await componentOrListEntry(
                                core,
                                stateVariables,
                                resolvePathToNodeIdx,
                                `ps[${i}]`,
                            )
                        ).stateValues.latex,
                    ),
                ).eq(`(${points[i - 1][0]},${points[i - 1][1]})`);
            }
            expect(
                await componentOrListEntry(
                    core,
                    stateVariables,
                    resolvePathToNodeIdx,
                    `ps[${n + 1}]`,
                ),
            ).eq(undefined);

            const g1 =
                stateVariables[await resolvePathToNodeIdx("theGraphs.g")];
            const g2 =
                stateVariables[await resolvePathToNodeIdx("theGraphs.g2")];
            const g3 =
                stateVariables[await resolvePathToNodeIdx("theGraphs2.g")];
            const g4 =
                stateVariables[await resolvePathToNodeIdx("theGraphs2.g2")];
            const gs = [g1, g2, g3, g4];

            for (let g of gs) {
                let pointNames = g.stateValues.graphicalDescendants.map(
                    (x: any) => x.componentIdx,
                );
                expect(pointNames.length).eq(n);
                for (let i = 0; i < n; i++) {
                    expect(
                        stateVariables[pointNames[i]].stateValues.xs.map(
                            (x: any) => x.tree,
                        ),
                    ).eqls(points[i]);
                }
            }
        }

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        let n = 1;
        let points = [[1, 2]];
        await check_items(n, points);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });

        n = 2;
        points.push([3, 4]);
        await check_items(n, points);

        let stateVariables = await core.returnAllStateVariables(false, true);
        let g1 = stateVariables[await resolvePathToNodeIdx("theGraphs.g")];

        await movePoint({
            componentIdx: g1.stateValues.graphicalDescendants[1].componentIdx,
            x: -2,
            y: 5,
            core,
        });

        points[1] = [-2, 5];
        await check_items(n, points);

        // check state persists after saving and reloading core
        await core.saveImmediately();
        let savedState = scoreState.state;
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: savedState,
        }));
        await check_items(n, points);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });

        n = 3;
        points.push([3, 4]);
        await check_items(n, points);

        stateVariables = await core.returnAllStateVariables(false, true);
        let g2 = stateVariables[await resolvePathToNodeIdx("theGraphs.g2")];
        await movePoint({
            componentIdx: g2.stateValues.graphicalDescendants[2].componentIdx,
            x: 7,
            y: -9,
            core,
        });

        points[2] = [7, -9];
        await check_items(n, points);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deletePoint"),
            core,
        });

        n = 2;
        points.pop();
        await check_items(n, points);

        stateVariables = await core.returnAllStateVariables(false, true);
        let g3 = stateVariables[await resolvePathToNodeIdx("theGraphs2.g")];

        await movePoint({
            componentIdx: g3.stateValues.graphicalDescendants[1].componentIdx,
            x: 1,
            y: 0,
            core,
        });

        points[1] = [1, 0];
        await check_items(n, points);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deletePoint"),
            core,
        });

        n = 1;
        points.pop();
        await check_items(n, points);

        await core.saveImmediately();
        savedState = scoreState.state;
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: savedState,
        }));
        await check_items(n, points);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deletePoint"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        await check_items(n, points);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });

        n = 2;
        points.push([3, 4]);
        await check_items(n, points);

        // save state and reload core to make sure state persists
        await core.saveImmediately();
        const endingState = scoreState.state;

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: endingState,
        }));

        await check_items(n, points);
    });

    it("reloaded state does not remember deleted point coordinates", async () => {
        const doenetML = `
    <graph name="g"></graph>
      
    <callAction name="addPoint" target="$g" actionName="addChildren">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="$g" actionName="deleteChildren" number="1" >
      <label>delete point</label>
    </callAction>
    `;

        async function check_items(point: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const g = stateVariables[await resolvePathToNodeIdx("g")];

            let pointNames = g.stateValues.graphicalDescendants.map(
                (x: any) => x.componentIdx,
            );
            expect(pointNames.length).eq(1);
            expect(
                stateVariables[pointNames[0]].stateValues.xs.map(
                    (x: any) => x.tree,
                ),
            ).eqls(point);
        }

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });

        let point = [3, 4];
        await check_items(point);

        let stateVariables = await core.returnAllStateVariables(false, true);
        let g = stateVariables[await resolvePathToNodeIdx("g")];

        await movePoint({
            componentIdx: g.stateValues.graphicalDescendants[0].componentIdx,
            x: -2,
            y: 5,
            core,
        });

        point = [-2, 5];
        await check_items(point);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deletePoint"),
            core,
        });

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });

        point = [3, 4];
        await check_items(point);

        // save state and reload core to make sure state persists with point in its original position (3,4)
        await core.saveImmediately();
        const endingState = scoreState.state;

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: endingState,
        }));

        await check_items(point);
    });

    async function test_chained_actions(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("addPoint")].stateValues
                .hidden,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await callAction({
            componentIdx: await resolvePathToNodeIdx("rs"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(3,4)");

        let pointIndices = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(pointIndices.length).eq(2);
        expect(
            stateVariables[pointIndices[0]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointIndices[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 4]);

        await movePoint({ componentIdx: pointIndices[1], x: -2, y: 5, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(-2,5)");

        pointIndices = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(
            stateVariables[pointIndices[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentType="point" from="$g" name="col" hide /><mathList extend="$col.coords" name="ps" /></p>

    <callAction name="addPoint" target="$g" actionName="addChildren" triggerWith="$rs">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        });

        await test_chained_actions(core, resolvePathToNodeIdx);
    });

    it("chained actions, inside repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeat name="sets" for="1 2">
      <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
      <p><callAction target="$s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction></p>

      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      <p>points from graph: <collect componentType="point" from="$g" name="col" hide /><mathList extend="$col.coords" name="ps" /></p>

      <callAction name="addPoint" target="$g" actionName="addChildren" triggerWith="$rs">
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </repeat>

    `,
        });

        for (let ind = 1; ind <= 2; ind++) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx(`sets[${ind}].addPoint`)
                ].stateValues.hidden,
            ).eq(true);

            expect(
                stateVariables[await resolvePathToNodeIdx(`sets[${ind}].g`)]
                    .stateValues.graphicalDescendants.length,
            ).eq(1);

            let numbers = stateVariables[
                await resolvePathToNodeIdx(`sets[${ind}].nums`)
            ].stateValues.text
                .split(",")
                .map(Number);
            expect(numbers.length).eq(7);
            for (let num of numbers) {
                expect(Number.isInteger(num)).be.true;
                expect(num).gte(1);
                expect(num).lte(6);
            }

            await callAction({
                componentIdx: await resolvePathToNodeIdx(`sets[${ind}].rs`),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);

            expect(
                cleanLatex(
                    (
                        await componentOrListEntry(
                            core,
                            stateVariables,
                            resolvePathToNodeIdx,
                            `sets[${ind}].ps[2]`,
                        )
                    ).stateValues.latex,
                ),
            ).eq("(3,4)");

            let pointIndices = stateVariables[
                await resolvePathToNodeIdx(`sets[${ind}].g`)
            ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
            expect(pointIndices.length).eq(2);
            expect(
                stateVariables[pointIndices[0]].stateValues.xs.map(
                    (x: any) => x.tree,
                ),
            ).eqls([1, 2]);
            expect(
                stateVariables[pointIndices[1]].stateValues.xs.map(
                    (x: any) => x.tree,
                ),
            ).eqls([3, 4]);

            await movePoint({
                componentIdx: pointIndices[1],
                x: -2,
                y: 5,
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);

            expect(
                cleanLatex(
                    (
                        await componentOrListEntry(
                            core,
                            stateVariables,
                            resolvePathToNodeIdx,
                            `sets[${ind}].ps[2]`,
                        )
                    ).stateValues.latex,
                ),
            ).eq("(-2,5)");

            pointIndices = stateVariables[
                await resolvePathToNodeIdx(`sets[${ind}].g`)
            ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
            expect(
                stateVariables[pointIndices[1]].stateValues.xs.map(
                    (x: any) => x.tree,
                ),
            ).eqls([-2, 5]);

            let numbers2 = stateVariables[
                await resolvePathToNodeIdx(`sets[${ind}].nums`)
            ].stateValues.text
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <p><number name="n">1</number></p>
    <p><updateValue name="in" target="$n" newValue="$n+1" type="number" >
      <label>increment number and add point</label>
    </updateValue></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
        
    <p>points from graph: <collect componentType="point" from="$g" name="col" hide /><mathList extend="$col.coords" name="ps" /></p>

    <callAction name="addPoint" target="$g" actionName="addChildren" triggerWith="$rs $in">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("addPoint")].stateValues
                .hidden,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("rs"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(3,4)");

        let pointIndices = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(pointIndices.length).eq(2);
        expect(
            stateVariables[pointIndices[0]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointIndices[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 4]);

        await movePoint({ componentIdx: pointIndices[1], x: -2, y: 5, core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(-2,5)");

        pointIndices = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(
            stateVariables[pointIndices[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("in"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[3]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(3,4)");

        pointIndices = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(pointIndices.length).eq(3);
        expect(
            stateVariables[pointIndices[0]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointIndices[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 5]);
        expect(
            stateVariables[pointIndices[2]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 4]);

        await movePoint({ componentIdx: pointIndices[2], x: 7, y: -9, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[3]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(7,-9)");

        pointIndices = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(
            stateVariables[pointIndices[2]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([7, -9]);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
    });

    it("action based on trigger", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <coords extend="$P.coords" name="P2" />

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>roll dice</label>
    </callAction></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.hidden,
        ).eq(true);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,2)");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,-7)");

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(3,-4)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(1,7)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(5,9)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: 4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-3,4)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: 5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-6,5)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(4,2)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(9,7)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);
    });

    it("action triggered when click", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <coords extend="$P.coords" name="P2" />

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" triggerWhenObjectsClicked="$P" >
      <label>roll dice</label>
    </callAction></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.hidden,
        ).eq(true);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,2)");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(3,-4)");

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await clickPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(5,9)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await clickPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(9,7)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);
    });

    it("action triggered when click, inside unnamed repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeat for="1 2">
      <graph>
        <point name="P">(-1,2)</point>
      </graph>
      <coords extend="$P.coords" name="P2" />
      <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
      <p><callAction target="$s" actionName="resample" name="rs" triggerWhenObjectsClicked="$P" >
        <label>roll dice</label>
      </callAction></p>
    </repeat>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let ind = 0; ind < 2; ind++) {
            let templateName =
                stateVariables[await resolvePathToNodeIdx("_repeat1")]
                    .replacements![ind].componentIdx;

            let tReps = stateVariables[templateName].replacements;
            let graphName = tReps![0].componentIdx;
            let copyName = tReps![2].componentIdx;
            let numsName = tReps![4].componentIdx;

            let PName =
                stateVariables[graphName].activeChildren[0].componentIdx;
            let P2Name = stateVariables[copyName].replacements![0].componentIdx;

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

            await movePoint({ componentIdx: PName, x: 3, y: -4, core });

            stateVariables = await core.returnAllStateVariables(false, true);

            expect(cleanLatex(stateVariables[P2Name].stateValues.latex)).eq(
                "(3,-4)",
            );

            let numbers2 = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2).eqls(numbers);

            await clickPoint({ componentIdx: PName, core });

            stateVariables = await core.returnAllStateVariables(false, true);

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

            await movePoint({ componentIdx: PName, x: 5, y: 9, core });

            stateVariables = await core.returnAllStateVariables(false, true);

            expect(cleanLatex(stateVariables[P2Name].stateValues.latex)).eq(
                "(5,9)",
            );

            numbers2 = stateVariables[numsName].stateValues.text
                .split(",")
                .map(Number);

            expect(numbers2).eqls(numbers);

            await clickPoint({ componentIdx: PName, core });

            stateVariables = await core.returnAllStateVariables(false, true);

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

            await movePoint({ componentIdx: PName, x: 9, y: 7, core });

            stateVariables = await core.returnAllStateVariables(false, true);

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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <coords extend="$P.coords" name="P2" />

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" triggerWhenObjectsFocused="$P" >
      <label>roll dice</label>
    </callAction></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.hidden,
        ).eq(true);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,2)");

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(3,-4)");

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await focusPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(5,9)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);

        await focusPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(9,7)");

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);

        expect(numbers2).eqls(numbers);
    });

    it("chained updates based on trigger", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>
    <coords extend="$P.coords" name="P2" />

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs"  triggerWith="$addPoint" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="$g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("addPoint")].stateValues
                .hidden,
        ).eq(true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,-7)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(3,-4)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(1,7)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(5,9)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: 4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-3,4)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: 5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-6,5)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(4,2)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(3);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(9,7)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(3);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);
    });

    it("triggerWhen supersedes chaining", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <coords extend="$P.coords" name="P2" />

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs"  triggerWith="$addPoint" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="$g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("addPoint")].stateValues
                .hidden,
        ).eq(true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -1,
            y: -7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-1,-7)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(3,-4)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 1,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(1,7)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(5,9)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -3,
            y: -4,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-3,-4)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -6,
            y: -5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(-6,-5)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 2,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(4,2)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(3);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 9,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .latex,
            ),
        ).eq("(9,7)");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(3);

        numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2).eqls(numbers);
    });

    it("triggerSet", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentType="point" from="$g" name="col" hide /><mathList extend="$col.coords" name="ps" /></p>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <triggerSet name="tset" >
      <label>perform actions</label>
      <callAction target="$s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="$g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("addPoint")].stateValues
                .hidden,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("tset"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(3,4)");

        let pointNames = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 4]);

        await movePoint({ componentIdx: pointNames[1], x: -2, y: 5, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(-2,5)");

        pointNames = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentType="point" from="$g" name="col" hide /><mathList extend="$col.coords" name="ps" /></p>

    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>

    <p>Enter x: <answer name="ans">x</answer></p>

    <triggerSet name="tset" >
        <label>perform actions</label>
        <callAction target="$s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="$g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <callAction name="sub" target="$ans" actionName="submitAnswer" triggerWith="$tset" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("addPoint")].stateValues
                .hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sub")].stateValues
                .hidden,
        ).eq(true);

        let mathInputName =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputName,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .justSubmitted,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        await triggerActions({
            componentIdx: await resolvePathToNodeIdx("tset"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(3,4)");

        let pointNames = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 4]);

        await movePoint({ componentIdx: pointNames[1], x: -2, y: 5, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(-2,5)");

        pointNames = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .justSubmitted,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
    });

    it("chaining with updateValue", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" >
      <label>roll dice and more</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentType="point" from="$g" name="col" hide /><mathList extend="$col.coords" name="ps" /></p>

    <callAction name="addPoint" target="$g" actionName="addChildren" triggerWith="$addOne">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    <p>Count: <number name="n">1</number></p>
    <updateValue name="addOne" target="$n" newValue="$n+1" type="number" triggerWith="$rs" />


    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("addPoint")].stateValues
                .hidden,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(1);

        let numbers = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers.length).eq(7);
        for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("rs"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(3,4)");

        let pointNames = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(pointNames.length).eq(2);
        expect(
            stateVariables[pointNames[0]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 4]);

        await movePoint({ componentIdx: pointNames[1], x: -2, y: 5, core });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        "ps[2]",
                    )
                ).stateValues.latex,
            ),
        ).eq("(-2,5)");

        pointNames = stateVariables[
            await resolvePathToNodeIdx("g")
        ].stateValues.graphicalDescendants.map((x: any) => x.componentIdx);
        expect(
            stateVariables[pointNames[1]].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 5]);

        let numbers2 = stateVariables[
            await resolvePathToNodeIdx("nums")
        ].stateValues.text
            .split(",")
            .map(Number);
        expect(numbers2.length).eq(7);
        for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
    });

    it("math in label", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="rs" ><label>Hi <m>\\sum_{i=1}^5x_i</m></label></callAction></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("rs")].stateValues.label,
        ).eq("Hi \\(\\sum_{i=1}^5x_i\\)");
    });

    it("label is name", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="resample" name="resample_numbers" labelIsName /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("resample_numbers")]
                .stateValues.label,
        ).eq("resample numbers");
    });

    it("case insensitive action name", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="nums"><sampleRandomNumbers name="s" numSamples="7" type="discreteUniform" from="1" to="6" /></p>
    <p><callAction target="$s" actionName="reSamplE" name="rs"><label>roll dice</label></callAction></p>
    <p>Sum: <number name="sum"><sum>
      <repeat for="$s" valueName="v" indexName="i">
        <number>$v*10^($i-1)</number>
      </repeat>
    </sum></number></p>
    `,
        });

        await test_resample(core, resolvePathToNodeIdx);
    });

    it("callAction in graph", async () => {
        const doenetMLsnippet = `
    <graph >
      <callAction anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1" target="$_graph1" actionName="addChildren">
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
      <callAction name="item2" target="$_graph1" actionName="addChildren">
        <label>add point 2</label>
        <point>(-3,-4)</point>
      </callAction>
    </graph>
        `;
        // TODO: how to click on the buttons and test if they are disabled?

        await test_in_graph(doenetMLsnippet, moveButton);
    });

    it("buttons can be styled", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinition styleNumber="1" fillColor="green" />
        <styleDefinition styleNumber="2" fillColor="yellow" />
    </setup>

    <callAction name="ca1" />
    <callAction name="ca2" styleNumber="2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ca1")].stateValues
                .selectedStyle.fillColor,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca2")].stateValues
                .selectedStyle.fillColor,
        ).eq("yellow");
    });

    it("a disabled callAction does not call its action, whether clicked or triggered", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P">(1,2)</point>
    </graph>
    <booleanInput name="dis" prefill="true" />
    <booleanInput name="b" />
    <number name="n1">0</number>
    <number name="n2">0</number>
    <number name="n3">0</number>
    <number name="n4">0</number>
    <number name="n5">0</number>
    <number name="n6">0</number>

    <updateValue name="uv1" target="$n1" newValue="$n1+1" />
    <updateValue name="uv2" target="$n2" newValue="$n2+1" />
    <updateValue name="uv3" target="$n3" newValue="$n3+1" />
    <updateValue name="uv4" target="$n4" newValue="$n4+1" />
    <updateValue name="uv5" target="$n5" newValue="$n5+1" />

    <callAction name="ca1" target="$uv1" actionName="updateValue" disabled="$dis" />
    <callAction target="$uv2" actionName="updateValue" triggerWhen="$b" disabled="$dis" />
    <callAction target="$uv3" actionName="updateValue" triggerWhenObjectsClicked="$P" disabled="$dis" />
    <callAction target="$uv4" actionName="updateValue" triggerWhenObjectsFocused="$P" disabled="$dis" />
    <callAction target="$uv5" actionName="updateValue" triggerWith="$b" disabled="$dis" />
    <updateValue target="$n6" newValue="$n6+1" triggerWith="$ca1" />
    `,
        });

        const PIdx = await resolvePathToNodeIdx("P");
        const bIdx = await resolvePathToNodeIdx("b");

        async function check(expected: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const [ind, value] of expected.entries()) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`n${ind + 1}`)]
                        .stateValues.value,
                    `n${ind + 1}`,
                ).eq(value);
            }
        }

        async function fireAll() {
            await callAction({
                componentIdx: await resolvePathToNodeIdx("ca1"),
                core,
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: bIdx,
                core,
            });
            await updateBooleanInputValue({
                boolean: false,
                componentIdx: bIdx,
                core,
            });
            await clickPoint({ componentIdx: PIdx, core });
            await focusPoint({ componentIdx: PIdx, core });
        }

        // Disabled: neither the button nor any trigger calls the action, and
        // the updateValue chained to the disabled button does not run either.
        await fireAll();
        await check([0, 0, 0, 0, 0, 0]);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("dis"),
            core,
        });

        // `triggerWith="$b"` fires on both changes of `b`
        await fireAll();
        await check([1, 1, 1, 1, 2, 1]);
    });

    it("in read-only mode, a triggered callAction still calls an action read-only mode allows", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <hint name="h1"><p>One</p></hint>
    <hint name="h2"><p>Two</p></hint>
    <hint name="h3"><p>Three</p></hint>

    <callAction target="$h2" actionName="revealHint" triggerWhen="$h1.open" />
    <triggerSet triggerWhen="$h1.open">
      <callAction target="$h3" actionName="revealHint" />
    </triggerSet>
    `,
            flags: { readOnly: true },
        });

        // Read-only mode disables everything, but that does not stop these
        // actions: it already blocks any update, and revealing a hint is one
        // of the actions it allows.
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("h1"),
            actionName: "revealHint",
            args: {},
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["h1", "h2", "h3"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .open,
                name,
            ).eq(true);
        }
    });
});
