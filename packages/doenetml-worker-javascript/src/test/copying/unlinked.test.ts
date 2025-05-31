import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { callAction, movePoint, updateValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function test_no_overwritten_attributes({
    core,
    resolveComponentName,
    parentPrefix,
    addParentPrefixToInitialGraph = false,
}: {
    core: PublicDoenetMLCore;
    resolveComponentName: (name: string, origin?: number) => number;
    parentPrefix: string;
    addParentPrefixToInitialGraph?: boolean;
}) {
    const graphNamePostfix = addParentPrefixToInitialGraph ? ".g" : "";

    const stateVariables = await core.returnAllStateVariables(false, true);
    expect(
        stateVariables[
            resolveComponentName(`${parentPrefix}.${graphNamePostfix}`)
        ].stateValues.xmax,
    ).eq(5);
    expect(
        stateVariables[
            resolveComponentName(`${parentPrefix}.A`)
        ].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}.A`)].stateValues
            .styleNumber,
    ).eq(2);
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}.A`)].stateValues
            .label,
    ).eq("A");
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}.A`)].stateValues
            .labelPosition,
    ).eq("upperleft");

    expect(
        stateVariables[
            resolveComponentName(`${parentPrefix}2${graphNamePostfix}`)
        ].stateValues.xmax,
    ).eq(5);
    expect(
        stateVariables[
            resolveComponentName(`${parentPrefix}2.A`)
        ].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}2.A`)].stateValues
            .styleNumber,
    ).eq(2);
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}2.A`)].stateValues
            .label,
    ).eq("A");
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}2.A`)].stateValues
            .labelPosition,
    ).eq("upperleft");

    expect(
        stateVariables[
            resolveComponentName(`${parentPrefix}3${graphNamePostfix}`)
        ].stateValues.xmax,
    ).eq(5);
    expect(
        stateVariables[
            resolveComponentName(`${parentPrefix}3.A`)
        ].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}3.A`)].stateValues
            .styleNumber,
    ).eq(2);
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}3.A`)].stateValues
            .label,
    ).eq("A");
    expect(
        stateVariables[resolveComponentName(`${parentPrefix}3.A`)].stateValues
            .labelPosition,
    ).eq("upperleft");
}

async function test_linked_copy_overwrites_attributes({
    core,
    resolveComponentName,
}: {
    core: PublicDoenetMLCore;
    resolveComponentName: (name: string, origin?: number) => number;
}) {
    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(stateVariables[resolveComponentName("g")].stateValues.xmin).eq(-10);
    expect(stateVariables[resolveComponentName("g")].stateValues.xmax).eq(5);
    expect(
        stateVariables[resolveComponentName("g.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName("g.A")].stateValues.styleNumber,
    ).eq(2);
    expect(
        stateVariables[resolveComponentName("g.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[resolveComponentName("g.B")].stateValues.styleNumber,
    ).eq(1);

    expect(stateVariables[resolveComponentName("g2")].stateValues.xmin).eq(-3);
    expect(stateVariables[resolveComponentName("g2")].stateValues.xmax).eq(7);
    expect(
        stateVariables[resolveComponentName("g2.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName("g2.A")].stateValues.styleNumber,
    ).eq(2);
    expect(
        stateVariables[resolveComponentName("g2.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[resolveComponentName("g2.B")].stateValues.styleNumber,
    ).eq(3);

    expect(stateVariables[resolveComponentName("g3")].stateValues.xmin).eq(-3);
    expect(stateVariables[resolveComponentName("g3")].stateValues.xmax).eq(7);
    expect(
        stateVariables[resolveComponentName("g3.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName("g3.A")].stateValues.styleNumber,
    ).eq(2);
    expect(
        stateVariables[resolveComponentName("g3.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[resolveComponentName("g3.B")].stateValues.styleNumber,
    ).eq(3);
}

async function test_unlinked_copy_overwrites_attributes({
    core,
    resolveComponentName,
}: {
    core: PublicDoenetMLCore;
    resolveComponentName: (name: string, origin?: number) => number;
}) {
    // TODO: overwriting attributes of unlinked copy of linked copy isn't working as we'd like.
    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(stateVariables[resolveComponentName("g")].stateValues.xmin).eq(-10);
    expect(stateVariables[resolveComponentName("g")].stateValues.xmax).eq(5);
    expect(stateVariables[resolveComponentName("g")].stateValues.ymax).eq(10);
    expect(
        stateVariables[resolveComponentName("g.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName("g.A")].stateValues.styleNumber,
    ).eqls(2);
    expect(
        stateVariables[resolveComponentName("g.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[resolveComponentName("g.B")].stateValues.styleNumber,
    ).eqls(1);

    expect(stateVariables[resolveComponentName("g2")].stateValues.xmax).eq(5);
    expect(stateVariables[resolveComponentName("g2")].stateValues.xmin).eq(-3);
    expect(stateVariables[resolveComponentName("g2")].stateValues.ymax).eq(10);
    expect(
        stateVariables[resolveComponentName("g2.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName("g2.A")].stateValues.styleNumber,
    ).eqls(2);
    expect(
        stateVariables[resolveComponentName("g2.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[resolveComponentName("g2.B")].stateValues.styleNumber,
    ).eqls(1);

    expect(stateVariables[resolveComponentName("g3")].stateValues.xmax).eq(7);
    expect(stateVariables[resolveComponentName("g3")].stateValues.xmin).eq(-5);
    expect(stateVariables[resolveComponentName("g3")].stateValues.ymax).eq(8);
    expect(
        stateVariables[resolveComponentName("g3.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[resolveComponentName("g3.A")].stateValues.styleNumber,
    ).eqls(2);
    expect(
        stateVariables[resolveComponentName("g3.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    // TODO: uncomment when fix the behavior so this passes
    // expect(stateVariables[resolveComponentName("g3.B")].stateValues.styleNumber).eqls(4);
}

describe("Unlinked Copying Tests", async () => {
    it("unlinked copy of linked copy copies state variables from uncopied children and attributes", async () => {
        // When extending, often children and attributes are not copied
        // but instead the resulting state variables are just shadowed.
        // Then, when subsequently creating an unlinked copy of that linked extend,
        // there are no children or attributes to copy.
        // Instead, the unlinked copy needs to copy the state variables values directly
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<graph name="g" xmax="5">
    <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
</graph>
<graph extend="$g" name="g2" />
<graph copy="$g2" name="g3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
            resolveComponentName,
            parentPrefix: "g",
        });
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group inside", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<graph name="g" xmax="5">
    <group>
        <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
    </group>
</graph>
<graph extend="$g" name="g2" />
<graph copy="$g2" name="g3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
            resolveComponentName,
            parentPrefix: "g",
        });
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group outside", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <group name="gr">
        <graph name="g" xmax="5">
            <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
        </graph>
    </group>
    <group extend="$gr" name="gr2" />
    <group copy="$gr2" name="gr3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
            resolveComponentName,
            parentPrefix: "gr",
            addParentPrefixToInitialGraph: true,
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of linked copy", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<graph name="g" xmax="5">
    <point name="A" styleNumber="2">(1,2)</point>
    <point name="B">(3,4)</point>
</graph>
<graph extend="$g" name="g2" styleNumber="3" xmin="-3" xmax="7" />
<graph copy="$g2" name="g3" />
  `,
        });

        await test_linked_copy_overwrites_attributes({
            core,
            resolveComponentName,
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of linked copy, group inside", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="g" xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
    </graph>
    <graph extend="$g" name="g2" styleNumber="3" xmin="-3" xmax="7" />
    <graph copy="$g2" name="g3" />
  `,
        });

        await test_linked_copy_overwrites_attributes({
            core,
            resolveComponentName,
        });
    });

    // TODO: overwriting attributes of unlinked copy of linked copy isn't working as we'd like.
    it("unlinked copy of linked copy, overwrite attributes of unlinked copy", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="g" xmax="5">
        <point name="A" styleNumber="2">(1,2)</point>
        <point name="B">(3,4)</point>
    </graph>
    <graph extend="$g" name="g2" xmin="-3" />
    <graph copy="$g2" name="g3" styleNumber="4" xmin="-5" xmax="7" ymax="8" />
  `,
        });

        await test_unlinked_copy_overwrites_attributes({
            core,
            resolveComponentName,
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of unlinked copy, group inside", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="g" xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
    </graph>
    <graph extend="$g" name="g2" xmin="-3" />
    <graph copy="$g2" name="g3" styleNumber="4" xmin="-5" xmax="7" ymax="8" />
  `,
        });

        await test_unlinked_copy_overwrites_attributes({
            core,
            resolveComponentName,
        });
    });

    async function test_snapshot({
        core,
        resolveComponentName,
        snapshotType,
        point_p_initialVal = [0, 0],
        point_q_initialVal = [0, 0],
    }: {
        core: PublicDoenetMLCore;
        resolveComponentName: (name: string, origin?: number) => number;
        snapshotType: "updateValue" | "callAction";
        point_p_initialVal?: number[];
        point_q_initialVal?: number[];
    }) {
        let p = point_p_initialVal;
        let q = point_q_initialVal;
        let p2 = [NaN, NaN];
        let q2 = [NaN, NaN];

        async function check_snapshot() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[resolveComponentName("P")].stateValues.xs.map(
                    (v) => v.tree,
                ),
            ).eqls(p);
            expect(
                stateVariables[resolveComponentName("Q")].stateValues.xs.map(
                    (v) => v.tree,
                ),
            ).eqls(q);

            let graph2Children =
                stateVariables[resolveComponentName("graph2")].activeChildren;

            if (Number.isNaN(p2[0])) {
                // Unlinked copied content does not exist yet
                expect(graph2Children.length).eqls(0);
            } else {
                let P2 = graph2Children[0].componentIdx;
                let Q2 = graph2Children[1].componentIdx;
                expect(
                    stateVariables[P2].stateValues.xs.map((v) => v.tree),
                ).eqls(p2);
                expect(
                    stateVariables[Q2].stateValues.xs.map((v) => v.tree),
                ).eqls(q2);
            }
        }
        await check_snapshot();

        // move points
        p = [-1, 7];
        q = [5, 3];
        await movePoint({
            componentIdx: resolveComponentName("P"),
            x: p[0],
            y: p[1],
            core,
        });
        await movePoint({
            componentIdx: resolveComponentName("Q"),
            x: q[0],
            y: q[1],
            core,
        });
        await check_snapshot();

        // Take snapshot, which should create conditional content using current
        // state var values of graph1
        p2 = p;
        q2 = q;
        if (snapshotType === "updateValue") {
            await updateValue({
                componentIdx: resolveComponentName("takeSnapshot"),
                core,
            });
        } else {
            await callAction({
                componentIdx: resolveComponentName("takeSnapshot"),
                core,
            });
        }
        await check_snapshot();

        // move points again, unlinked copied points should not move
        p = [2, -9];
        q = [1, 8];
        await movePoint({
            componentIdx: resolveComponentName("P"),
            x: p[0],
            y: p[1],
            core,
        });
        await movePoint({
            componentIdx: resolveComponentName("Q"),
            x: q[0],
            y: q[1],
            core,
        });
        await check_snapshot();
    }

    it("create snapshot of group with conditionalContent", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <boolean name="copy">false</boolean>
    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            <group copy="$gr" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolveComponentName,
            snapshotType: "updateValue",
        });
    });

    it("create snapshot of group with callAction", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <callAction name="takeSnapshot" target="$graph2" actionName="addChildren">
        <label>Take snapshot</label>
        <group copy="$gr" />
    </callAction>
    <updateValue triggerWith="$takeSnapshot" target="$takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2" />
  `,
        });

        await test_snapshot({
            core,
            resolveComponentName,
            snapshotType: "callAction",
        });
    });

    it("create snapshot of repeat with conditionalContent", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <setup><sequence name="s" length="2" /></setup>
        <repeat name="mp" for="$s" itemName="i">
            <point>(1, <number copy="$i" />)</point>
        </repeat>
        <setup>
          <point extend="$mp[1]" name="P" />
          <point extend="$mp[2]" name="Q" />
        </setup>
    </graph>

    <boolean name="copy">false</boolean>
    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent name="cc" condition="$copy">
            <repeat copy="$mp" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolveComponentName,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of repeat with callAction", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <setup><sequence name="s" length="2" /></setup>
        <repeat name="mp" for="$s" itemName="i">
            <point>(1, <number copy="$i" />)</point>
        </repeat>
        <setup>
          <point extend="$mp[1]" name="P" />
          <point extend="$mp[2]" name="Q" />
        </setup>
    </graph>

    <callAction name="takeSnapshot" target="$graph2" actionName="addChildren">
        <label>Take snapshot</label>
        <repeat copy="$mp" />
    </callAction>
    <updateValue triggerWith="$takeSnapshot" target="$takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolveComponentName,
            snapshotType: "callAction",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of map in a group with conditionalContent", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <setup><sequence name="s" length="2" /></setup>
            <repeat name="mp" for="$s" itemName="i">
                <point>(1, <number copy="$i" />)</point>
            </repeat>
            <setup>
                <point extend="$mp[1]" name="P" />
                <point extend="$mp[2]" name="Q" />
            </setup>
        </group>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            <group copy="$gr" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolveComponentName,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of map in a group with callAction", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <setup><sequence name="s" length="2" /></setup>
            <repeat name="mp" for="$s" itemName="i">
                <point>(1, <number copy="$i" />)</point>
            </repeat>
            <setup>
                <point extend="$mp[1]" name="P" />
                <point extend="$mp[2]" name="Q" />
            </setup>
        </group>
    </graph>

    <callAction name="takeSnapshot" target="$graph2" actionName="addChildren">
        <label>Take snapshot</label>
            <group copy="$gr" />
    </callAction>
    <updateValue triggerWith="$takeSnapshot" target="$takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolveComponentName,
            snapshotType: "callAction",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of repeat with conditionalContent", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <setup><sequence name="s" length="2" /></setup>
        <repeat name="mp" for="$s" itemName="i">
            <group>
                <point>(1, <number copy="$i" />)</point>
            </group>
        </repeat>
        <setup>
            <point extend="$mp[1][1][1]" name="P" />
            <point extend="$mp[2][1][1]" name="Q" />
        </setup>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            <repeat copy="$mp" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolveComponentName,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it.only("unlinked copy inside a repeat with source and index depending on itemName and indexName", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="graph1">
      <setup>
        <sequence name="s1" from="2" to="3" />
        <sequence name="s2" from="4" to="5" />
      </setup>
      <repeat name="r" for="$s1" itemName="v" indexName="i">
         <point name="P">(<number copy="$s2[$i]" />, <number copy="$v" />)</point>
      </repeat>
    </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("r[1].P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([4, 2]);
        expect(
            stateVariables[resolveComponentName("r[2].P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([5, 3]);

        // can move points
        await movePoint({
            componentIdx: resolveComponentName("r[1].P"),
            x: 10,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: resolveComponentName("r[2].P"),
            x: 8,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("r[1].P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([10, 9]);
        expect(
            stateVariables[resolveComponentName("r[2].P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([8, 7]);
    });
});
