import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { callAction, triggerActions, updateValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("StatusMessage tag tests", async () => {
    it("an action button without a statusMessage leaves it empty, for the renderer's default", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">1</number>
    <updateValue name="uv" target="$n" newValue="$n + 1"><label>Add 1</label></updateValue>
    <callAction name="ca" target="$n" actionName="updateValue"><label>Call</label></callAction>
    <triggerSet name="ts"><label>Both</label><updateValue target="$n" newValue="$n+1" /></triggerSet>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["uv", "ca", "ts"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .statusMessage,
            ).eq("");
        }
    });

    it("updateValue's statusMessage is the child's text, recomputed from the updated values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">1</number>
    <updateValue name="uv" target="$n" newValue="$n + 1">
      <label>Add 1</label>
      <statusMessage>Count is now $n.</statusMessage>
    </updateValue>
    <p name="p">$uv.statusMessage</p>
    `,
        });

        const uvIdx = await resolvePathToNodeIdx("uv");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[uvIdx].stateValues.statusMessage).eq(
            "Count is now 1.",
        );
        // The message is announced, never shown: it does not join the label.
        expect(stateVariables[uvIdx].stateValues.label).eq("Add 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("Count is now 1.");

        await updateValue({ componentIdx: uvIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(stateVariables[uvIdx].stateValues.statusMessage).eq(
            "Count is now 2.",
        );
    });

    it("the reference page's circle example describes the new color", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph size="small">
      <shortDescription>A graph of a filled circle</shortDescription>
      <circle name="circ" radius="6" filled/>
    </graph>
    <updateValue name="uv" target="$circ.styleNumber" newValue="2" disabled="$circ.styleNumber = 2">
      <label>Change color</label>
      <statusMessage>The circle is now $circ.styleDescription.</statusMessage>
    </updateValue>
    `,
        });

        const uvIdx = await resolvePathToNodeIdx("uv");
        let stateVariables = await core.returnAllStateVariables(false, true);
        const before = stateVariables[uvIdx].stateValues.statusMessage;

        await updateValue({ componentIdx: uvIdx, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        const after = stateVariables[uvIdx].stateValues.statusMessage;
        expect(after).match(/^The circle is now \S.*\.$/);
        expect(after).not.eq(before);
    });

    it("the last statusMessage wins, trimmed", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">false</boolean>
    <updateValue name="uv" target="$b" newValue="not $b" type="boolean">
      <statusMessage>First</statusMessage>
      <statusMessage>
        Second
      </statusMessage>
    </updateValue>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("uv")].stateValues
                .statusMessage,
        ).eq("Second");
    });

    it("callAction and triggerSet take a statusMessage too", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">1</number>
    <updateValue name="inc" target="$n" newValue="$n + 1" hide />
    <callAction name="ca" target="$inc" actionName="updateValue">
      <label>Call</label>
      <statusMessage>Called; n is $n.</statusMessage>
    </callAction>
    <triggerSet name="ts">
      <label>Set</label>
      <statusMessage>Set; n is $n.</statusMessage>
      <updateValue target="$n" newValue="$n + 10" />
    </triggerSet>
    `,
        });

        const caIdx = await resolvePathToNodeIdx("ca");
        const tsIdx = await resolvePathToNodeIdx("ts");

        await callAction({ componentIdx: caIdx, core });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[caIdx].stateValues.statusMessage).eq(
            "Called; n is 2.",
        );
        expect(stateVariables[caIdx].stateValues.label).eq("Call");

        await triggerActions({ componentIdx: tsIdx, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[tsIdx].stateValues.statusMessage).eq(
            "Set; n is 12.",
        );
        expect(stateVariables[tsIdx].stateValues.label).eq("Set");
    });

    it("callAction does not hand its statusMessage to the action it calls", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <point>(1,2)</point>
    </graph>
    <callAction name="addPoint" target="$g" actionName="addChildren">
      <label>Add point</label>
      <statusMessage>A point was added.</statusMessage>
      <point>(3,4)</point>
    </callAction>
    `,
        });

        const caIdx = await resolvePathToNodeIdx("addPoint");
        await callAction({ componentIdx: caIdx, core });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .graphicalDescendants.length,
        ).eq(2);
        expect(stateVariables[caIdx].stateValues.statusMessage).eq(
            "A point was added.",
        );
        // Only the button's own message exists; none was added to the graph.
        expect(
            Object.values(stateVariables).filter(
                (component: any) => component.componentType === "statusMessage",
            ).length,
        ).eq(1);
    });
});
