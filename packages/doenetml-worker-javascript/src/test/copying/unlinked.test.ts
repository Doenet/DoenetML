import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import Core from "../../Core";
import { callAction, movePoint, updateValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function test_no_overwritten_attributes({
    core,
    namespaceInsideGraph = false,
}: {
    core: Core;
    namespaceInsideGraph?: boolean;
}) {
    const namespaceName = namespaceInsideGraph ? "/gr" : "/g";
    const graphNamePostfix = namespaceInsideGraph ? "/g" : "";

    const stateVariables = await returnAllStateVariables(core);
    expect(
        stateVariables[`${namespaceName}${graphNamePostfix}`].stateValues.xmax,
    ).eq(5);
    expect(
        stateVariables[`${namespaceName}/A`].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(stateVariables[`${namespaceName}/A`].stateValues.styleNumber).eq(2);
    expect(stateVariables[`${namespaceName}/A`].stateValues.label).eq("A");
    expect(stateVariables[`${namespaceName}/A`].stateValues.labelPosition).eq(
        "upperleft",
    );

    expect(
        stateVariables[`${namespaceName}2${graphNamePostfix}`].stateValues.xmax,
    ).eq(5);
    expect(
        stateVariables[`${namespaceName}2/A`].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(stateVariables[`${namespaceName}2/A`].stateValues.styleNumber).eq(2);
    expect(stateVariables[`${namespaceName}2/A`].stateValues.label).eq("A");
    expect(stateVariables[`${namespaceName}2/A`].stateValues.labelPosition).eq(
        "upperleft",
    );

    expect(
        stateVariables[`${namespaceName}3${graphNamePostfix}`].stateValues.xmax,
    ).eq(5);
    expect(
        stateVariables[`${namespaceName}3/A`].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(stateVariables[`${namespaceName}3/A`].stateValues.styleNumber).eq(2);
    expect(stateVariables[`${namespaceName}3/A`].stateValues.label).eq("A");
    expect(stateVariables[`${namespaceName}3/A`].stateValues.labelPosition).eq(
        "upperleft",
    );
}

async function test_linked_copy_overwrites_attributes({
    core,
}: {
    core: Core;
}) {
    let stateVariables = await returnAllStateVariables(core);
    expect(stateVariables["/g"].stateValues.xmin).eq(-10);
    expect(stateVariables["/g"].stateValues.xmax).eq(5);
    expect(stateVariables["/g/A"].stateValues.xs.map((v) => v.tree)).eqls([
        1, 2,
    ]);
    expect(stateVariables["/g/A"].stateValues.styleNumber).eq(2);
    expect(stateVariables["/g/B"].stateValues.xs.map((v) => v.tree)).eqls([
        3, 4,
    ]);
    expect(stateVariables["/g/B"].stateValues.styleNumber).eq(1);

    expect(stateVariables["/g2"].stateValues.xmin).eq(-3);
    expect(stateVariables["/g2"].stateValues.xmax).eq(7);
    expect(stateVariables["/g2/A"].stateValues.xs.map((v) => v.tree)).eqls([
        1, 2,
    ]);
    expect(stateVariables["/g2/A"].stateValues.styleNumber).eq(2);
    expect(stateVariables["/g2/B"].stateValues.xs.map((v) => v.tree)).eqls([
        3, 4,
    ]);
    expect(stateVariables["/g2/B"].stateValues.styleNumber).eq(3);

    expect(stateVariables["/g3"].stateValues.xmin).eq(-3);
    expect(stateVariables["/g3"].stateValues.xmax).eq(7);
    expect(stateVariables["/g3/A"].stateValues.xs.map((v) => v.tree)).eqls([
        1, 2,
    ]);
    expect(stateVariables["/g3/A"].stateValues.styleNumber).eq(2);
    expect(stateVariables["/g3/B"].stateValues.xs.map((v) => v.tree)).eqls([
        3, 4,
    ]);
    expect(stateVariables["/g3/B"].stateValues.styleNumber).eq(3);
}

async function test_unlinked_copy_overwrites_attributes({
    core,
}: {
    core: Core;
}) {
    // TODO: overwriting attributes of unlinked copy of linked copy isn't working as we'd like.
    let stateVariables = await returnAllStateVariables(core);
    expect(stateVariables["/g"].stateValues.xmin).eq(-10);
    expect(stateVariables["/g"].stateValues.xmax).eq(5);
    expect(stateVariables["/g"].stateValues.ymax).eq(10);
    expect(stateVariables["/g/A"].stateValues.xs.map((v) => v.tree)).eqls([
        1, 2,
    ]);
    expect(stateVariables["/g/A"].stateValues.styleNumber).eqls(2);
    expect(stateVariables["/g/B"].stateValues.xs.map((v) => v.tree)).eqls([
        3, 4,
    ]);
    expect(stateVariables["/g/B"].stateValues.styleNumber).eqls(1);

    expect(stateVariables["/g2"].stateValues.xmax).eq(5);
    expect(stateVariables["/g2"].stateValues.xmin).eq(-3);
    expect(stateVariables["/g2"].stateValues.ymax).eq(10);
    expect(stateVariables["/g2/A"].stateValues.xs.map((v) => v.tree)).eqls([
        1, 2,
    ]);
    expect(stateVariables["/g2/A"].stateValues.styleNumber).eqls(2);
    expect(stateVariables["/g2/B"].stateValues.xs.map((v) => v.tree)).eqls([
        3, 4,
    ]);
    expect(stateVariables["/g2/B"].stateValues.styleNumber).eqls(1);

    expect(stateVariables["/g3"].stateValues.xmax).eq(7);
    expect(stateVariables["/g3"].stateValues.xmin).eq(-5);
    expect(stateVariables["/g3"].stateValues.ymax).eq(8);
    expect(stateVariables["/g3/A"].stateValues.xs.map((v) => v.tree)).eqls([
        1, 2,
    ]);
    expect(stateVariables["/g3/A"].stateValues.styleNumber).eqls(2);
    expect(stateVariables["/g3/B"].stateValues.xs.map((v) => v.tree)).eqls([
        3, 4,
    ]);
    // TODO: uncomment when fix the behavior so this passes
    // expect(stateVariables["/g3/B"].stateValues.styleNumber).eqls(4);
}

describe("Unlinked Copying Tests", async () => {
    it("unlinked copy of linked copy copies state variables from uncopied children and attributes", async () => {
        // When creating a linked copy, often children and attributes are not copied
        // but instead the resulting state variables are just shadowed.
        // Then, when subsequently creating an unlinked copy of that linked copy,
        // there are no children or attributes to copy.
        // Instead, the unlinked copy needs to copy the state variables values directly
        let core = await createTestCore({
            doenetML: `
<graph name="g" newNamespace xmax="5">
    <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
</graph>
<graph copySource="g" name="g2" />
<graph copySource="g2" link="false" name="g3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
        });
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group inside", async () => {
        // When creating a linked copy, often children and attributes are not copied
        // but instead the resulting state variables are just shadowed.
        // Then, when subsequently creating an unlinked copy of that linked copy,
        // there are no children or attributes to copy.
        // Instead, the unlinked copy needs to copy the state variables values directly
        let core = await createTestCore({
            doenetML: `
<graph name="g" newNamespace xmax="5">
    <group>
        <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
    </group>
</graph>
<graph copySource="g" name="g2" />
<graph copySource="g2" link="false" name="g3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
        });
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group outside", async () => {
        // When creating a linked copy, often children and attributes are not copied
        // but instead the resulting state variables are just shadowed.
        // Then, when subsequently creating an unlinked copy of that linked copy,
        // there are no children or attributes to copy.
        // Instead, the unlinked copy needs to copy the state variables values directly
        let core = await createTestCore({
            doenetML: `
    <group name="gr" newNamespace>
        <graph name="g" xmax="5">
            <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
        </graph>
    </group>
    <group copySource="gr" name="gr2" />
    <group copySource="gr2" link="false" name="gr3" />
  `,
        });

        await test_no_overwritten_attributes({
            namespaceInsideGraph: true,
            core,
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of linked copy", async () => {
        let core = await createTestCore({
            doenetML: `
<graph name="g" newNamespace xmax="5">
    <point name="A" styleNumber="2">(1,2)</point>
    <point name="B">(3,4)</point>
</graph>
<graph copySource="g" name="g2" styleNumber="3" xmin="-3" xmax="7" />
<graph copySource="g2" link="false" name="g3" />
  `,
        });

        await test_linked_copy_overwrites_attributes({ core });
    });

    it("unlinked copy of linked copy, overwrite attributes of linked copy, group inside", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" newNamespace xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
    </graph>
    <graph copySource="g" name="g2" styleNumber="3" xmin="-3" xmax="7" />
    <graph copySource="g2" link="false" name="g3" />
  `,
        });

        await test_linked_copy_overwrites_attributes({ core });
    });

    // TODO: overwriting attributes of unlinked copy of linked copy isn't working as we'd like.
    it("unlinked copy of linked copy, overwrite attributes of unlinked copy", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" newNamespace xmax="5">
        <point name="A" styleNumber="2">(1,2)</point>
        <point name="B">(3,4)</point>
    </graph>
    <graph copySource="g" name="g2" xmin="-3" />
    <graph copySource="g2" link="false" name="g3" styleNumber="4" xmin="-5" xmax="7" ymax="8" />
  `,
        });

        await test_unlinked_copy_overwrites_attributes({ core });
    });

    it("unlinked copy of linked copy, overwrite attributes of unlinked copy, group inside", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" newNamespace xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
    </graph>
    <graph copySource="g" name="g2" xmin="-3" />
    <graph copySource="g2" link="false" name="g3" styleNumber="4" xmin="-5" xmax="7" ymax="8" />
  `,
        });

        await test_unlinked_copy_overwrites_attributes({ core });
    });

    async function test_snapshot({
        core,
        snapshotType,
        point_p_initialVal = [0, 0],
        point_q_initialVal = [0, 0],
    }: {
        core: Core;
        snapshotType: "updateValue" | "callAction";
        point_p_initialVal?: number[];
        point_q_initialVal?: number[];
    }) {
        let p = point_p_initialVal;
        let q = point_q_initialVal;
        let p2 = [NaN, NaN];
        let q2 = [NaN, NaN];

        async function check_snapshot() {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls(
                p,
            );
            expect(stateVariables["/Q"].stateValues.xs.map((v) => v.tree)).eqls(
                q,
            );

            let graph2Children = stateVariables["/graph2"].activeChildren;

            if (Number.isNaN(p2[0])) {
                // Unlinked copied content does not exist yet
                expect(graph2Children.length).eqls(0);
            } else {
                let P2 = graph2Children[0].componentName;
                let Q2 = graph2Children[1].componentName;
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
        await movePoint({ name: "/P", x: p[0], y: p[1], core });
        await movePoint({ name: "/Q", x: q[0], y: q[1], core });
        await check_snapshot();

        // Take snapshot, which should create conditional content using current
        // state var values of graph1
        p2 = p;
        q2 = q;
        if (snapshotType === "updateValue") {
            await updateValue({ name: "/takeSnapshot", core });
        } else {
            await callAction({ name: "/takeSnapshot", core });
        }
        await check_snapshot();

        // move points again, unlinked copied points should not move
        p = [2, -9];
        q = [1, 8];
        await movePoint({ name: "/P", x: p[0], y: p[1], core });
        await movePoint({ name: "/Q", x: q[0], y: q[1], core });
        await check_snapshot();
    }

    it("create snapshot of group with conditionalContent", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <boolean name="copy">false</boolean>
    <updateValue target="copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            $gr{link="false"}
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({ core, snapshotType: "updateValue" });
    });

    it("create snapshot of group with callAction", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <callAction name="takeSnapshot" target="graph2" actionName="addChildren">
        <label>Take snapshot</label>
        $gr{link="false"}
    </callAction>
    <updateValue triggerWith="takeSnapshot" target="takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2" />
  `,
        });

        await test_snapshot({ core, snapshotType: "callAction" });
    });

    it("create snapshot of map with conditionalContent", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <map name="mp" assignNames="(P) (Q)">
            <template>
                <point>(1, $i{link="false"})</point>
            </template>
            <sources alias="i">
                <sequence length="2" />
            </sources>
        </map>
    </graph>

    <boolean name="copy">false</boolean>
    <updateValue target="copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent name="cc" condition="$copy">
            $mp{link="false"}
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of map with callAction", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <map name="mp" assignNames="(P) (Q)">
            <template>
                <point>(1, $i{link="false"})</point>
            </template>
            <sources alias="i">
                <sequence length="2" />
            </sources>
        </map>
    </graph>

    <callAction name="takeSnapshot" target="graph2" actionName="addChildren">
        <label>Take snapshot</label>
        $mp{link="false"}
    </callAction>
    <updateValue triggerWith="takeSnapshot" target="takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
        });

        await test_snapshot({
            core,
            snapshotType: "callAction",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of map in a group with conditionalContent", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <map name="mp" assignNames="(P) (Q)">
                <template>
                    <point>(1, $i{link="false"})</point>
                </template>
                <sources alias="i">
                    <sequence length="2" />
                </sources>
            </map>
        </group>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            $gr{link="false"}
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of map in a group with callAction", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <map name="mp" assignNames="(P) (Q)">
                <template>
                    <point>(1, $i{link="false"})</point>
                </template>
                <sources alias="i">
                    <sequence length="2" />
                </sources>
            </map>
        </group>
    </graph>

    <callAction name="takeSnapshot" target="graph2" actionName="addChildren">
        <label>Take snapshot</label>
        $gr{link="false"}
    </callAction>
    <updateValue triggerWith="takeSnapshot" target="takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
        });

        await test_snapshot({
            core,
            snapshotType: "callAction",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of map with conditionalContent", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <map name="mp" assignNames="((P l)) ((Q m))">
            <template>
                <group>
                <point>(1, $i{link="false"})</point>
                </group>
            </template>
            <sources alias="i">
                <sequence length="2" />
            </sources>
        </map>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            $mp{link="false"}
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });
});
