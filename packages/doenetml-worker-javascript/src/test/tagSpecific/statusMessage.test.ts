import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    callAction,
    clickPoint,
    triggerActions,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("StatusMessage tag tests", async () => {
    it("an action button without a statusMessage leaves it empty, for the viewer's default", async () => {
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

    it("an empty statusMessage leaves it empty, for the viewer's default", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">false</boolean>
    <updateValue name="empty" target="$b" newValue="not $b" type="boolean">
      <statusMessage></statusMessage>
    </updateValue>
    <updateValue name="blank" target="$b" newValue="not $b" type="boolean">
      <statusMessage>   </statusMessage>
    </updateValue>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["empty", "blank"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .statusMessage,
            ).eq("");
        }
    });

    it("a math value in a statusMessage is its plain text", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m">x^2</math>
    <updateValue name="uv" target="$m" newValue="$m+1">
      <statusMessage><math>x^2/3</math> and $m</statusMessage>
    </updateValue>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("uv")].stateValues
                .statusMessage,
        ).eq("x²/3 and x²");
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

    it("a button that hides itself when pressed still names the new values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">1</number>
    <updateValue name="uv" target="$n" newValue="$n + 1" hide="$n > 1">
      <label>Once</label>
      <statusMessage>n is now $n, as <math>n</math>.</statusMessage>
    </updateValue>
    `,
        });

        const uvIdx = await resolvePathToNodeIdx("uv");
        await updateValue({ componentIdx: uvIdx, core });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[uvIdx].stateValues.hidden).eq(true);
        // Hiding the button does not hide what its message refers to.
        expect(stateVariables[uvIdx].stateValues.statusMessage).eq(
            "n is now 2, as n.",
        );
    });

    /**
     * Record what each renderer update core sends says to announce, from
     * here on (`createTestCore` installs a no-op callback, replaced here).
     */
    function captureAnnouncements(core: any) {
        const sent: { announcement?: string; actionId?: string }[] = [];
        core.core.updateRenderersCallback = (args: any) => {
            sent.push({
                announcement: args.announcement,
                actionId: args.actionId,
            });
        };
        return () => sent.filter((batch) => batch.announcement !== undefined);
    }

    it("a press sends its message with the update that settles it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">1</number>
    <updateValue name="uv" target="$n" newValue="$n + 1">
      <statusMessage>Count is now $n.</statusMessage>
    </updateValue>
    <updateValue name="plain" target="$n" newValue="$n + 10" />
    <updateValue name="once" target="$n" newValue="$n + 100" hide="$n > 100">
      <statusMessage>Hidden now; n is $n.</statusMessage>
    </updateValue>
    <callAction name="ca" target="$plain" actionName="updateValue">
      <statusMessage>Called; n is $n.</statusMessage>
    </callAction>
    <triggerSet name="ts">
      <statusMessage>Set; n is $n.</statusMessage>
      <updateValue target="$n" newValue="$n + 1000" />
    </triggerSet>
    <updateValue name="nowhere" newValue="1" />
    `,
        });
        const announcements = captureAnnouncements(core);

        const press = async (name: string, actionName: string) =>
            core.requestAction({
                componentIdx: await resolvePathToNodeIdx(name),
                actionName,
                args: { actionId: name },
            });

        await press("uv", "updateValue");
        expect(announcements()).toEqual([
            { announcement: "Count is now 2.", actionId: "uv" },
        ]);

        // No `<statusMessage>`: empty, for the viewer's default.
        await press("plain", "updateValue");
        expect(announcements().at(-1)).toEqual({
            announcement: "",
            actionId: "plain",
        });

        // The button is hidden by its own press, so core no longer sends its
        // renderer state; the message arrives anyway, naming the new value.
        await press("once", "updateValue");
        expect(announcements().at(-1)).toEqual({
            announcement: "Hidden now; n is 112.",
            actionId: "once",
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("once")].stateValues
                .hidden,
        ).eq(true);

        // Only the button pressed announces: not the `<updateValue>` that a
        // `<callAction>` or a `<triggerSet>` runs.
        await press("ca", "callAction");
        expect(announcements().at(-1)).toEqual({
            announcement: "Called; n is 122.",
            actionId: "ca",
        });
        await press("ts", "triggerActions");
        expect(announcements().at(-1)).toEqual({
            announcement: "Set; n is 1122.",
            actionId: "ts",
        });
        expect(announcements().length).eq(5);

        // A press whose action stops before it runs (here, for want of a
        // `target`) sends no update, so it announces nothing.
        await press("nowhere", "updateValue");
        expect(announcements().length).eq(5);
    });

    it("a press that deletes its own button still sends its update, announcing the default", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">0</number>
    <conditionalContent name="cc">
      <case condition="$n = 0">
        <p><updateValue name="add" target="$n" newValue="1">
          <label>Add</label>
          <statusMessage>n is now $n.</statusMessage>
        </updateValue></p>
      </case>
      <else><p name="done">Added.</p></else>
    </conditionalContent>
    `,
        });
        const announcements = captureAnnouncements(core);

        // The press moves `cc` to its `<else>`, deleting the button and its
        // `<statusMessage>`, so the message can no longer be read.
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("cc.add"),
            actionName: "updateValue",
            args: { actionId: "add" },
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(announcements()).toEqual([
            { announcement: "", actionId: "add" },
        ]);
    });

    it("a change made by triggerWhen (on updateValue or callAction), triggerWith or triggerWhenObjectsClicked is not announced", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">1</number>
    <number name="m">0</number>
    <number name="k">0</number>
    <updateValue name="uv" target="$n" newValue="$n + 1">
      <statusMessage>Count is now $n, m is $m.</statusMessage>
    </updateValue>
    <updateValue name="follow" target="$m" newValue="$m + 1" triggerWhen="$n > 1">
      <statusMessage>Followed.</statusMessage>
    </updateValue>
    <updateValue name="with" target="$m" newValue="$m + 10" triggerWith="$uv">
      <statusMessage>Chained.</statusMessage>
    </updateValue>
    <number name="j">0</number>
    <updateValue name="bump" target="$j" newValue="$j + 1" />
    <callAction name="callWhen" target="$bump" actionName="updateValue" triggerWhen="$n > 1">
      <statusMessage>Called.</statusMessage>
    </callAction>
    <graph><point name="P">(1,2)</point></graph>
    <updateValue name="clicked" target="$k" newValue="$k + 1" triggerWhenObjectsClicked="$P">
      <statusMessage>Clicked.</statusMessage>
    </updateValue>
    `,
        });
        const announcements = captureAnnouncements(core);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(11);
        // The `<callAction>` fired by `triggerWhen` ran, but is not announced.
        expect(
            stateVariables[await resolvePathToNodeIdx("j")].stateValues.value,
        ).eq(1);
        // Only the press: its message is read after the chained action ran.
        expect(announcements().map((batch) => batch.announcement)).toEqual([
            "Count is now 2, m is 11.",
        ]);

        await clickPoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues.value,
        ).eq(1);
        expect(announcements().length).eq(1);
    });
});
