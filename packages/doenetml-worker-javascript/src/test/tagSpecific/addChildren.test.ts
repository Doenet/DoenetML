import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { callAction } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("addChildren for non-graph parents @group4", async () => {
    it("add and delete children of a stickyGroup inside a graph", async () => {
        const doenetML = `
    <graph name="g">
      <stickyGroup name="sg">
        <point name="P">(1,2)</point>
      </stickyGroup>
    </graph>

    <callAction name="addPoint" target="$sg" actionName="addChildren">
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="$sg" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_counts(numObjects: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sg = stateVariables[await resolvePathToNodeIdx("sg")];
            expect(sg.stateValues.numObjects).eq(numObjects);

            // The graph sees each point plus the stickyGroup itself as
            // graphical descendants.
            const g = stateVariables[await resolvePathToNodeIdx("g")];
            expect(g.stateValues.graphicalDescendants.length).eq(
                numObjects + 1,
            );
        }

        await check_counts(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });
        await check_counts(2);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });
        await check_counts(3);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deletePoint"),
            core,
        });
        await check_counts(2);
    });

    it("add and delete a graph child of a section", async () => {
        const doenetML = `
    <section name="sec">
      <title>My section</title>
      <graph name="g0">
        <point>(0,0)</point>
      </graph>
    </section>

    <p>points: <collect componentType="point" from="$sec" name="col" /></p>

    <callAction name="addGraph" target="$sec" actionName="addChildren">
      <graph>
        <point>(5,6)</point>
      </graph>
    </callAction>
    <callAction name="deleteGraph" target="$sec" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_num_points(n: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const col = stateVariables[await resolvePathToNodeIdx("col")];
            expect(col.replacements?.length ?? 0).eq(n);
        }

        await check_num_points(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addGraph"),
            core,
        });
        await check_num_points(2);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteGraph"),
            core,
        });
        await check_num_points(1);
    });

    it("add and delete children of a problem", async () => {
        const doenetML = `
    <problem name="prob">
      <title>My problem</title>
      <p>Intro.</p>
    </problem>

    <p>graphs: <collect componentType="graph" from="$prob" name="col" /></p>

    <callAction name="addGraph" target="$prob" actionName="addChildren">
      <graph>
        <point>(1,1)</point>
      </graph>
    </callAction>
    <callAction name="deleteGraph" target="$prob" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_num_graphs(n: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const col = stateVariables[await resolvePathToNodeIdx("col")];
            expect(col.replacements?.length ?? 0).eq(n);
        }

        await check_num_graphs(0);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addGraph"),
            core,
        });
        await check_num_graphs(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteGraph"),
            core,
        });
        await check_num_graphs(0);
    });
});
