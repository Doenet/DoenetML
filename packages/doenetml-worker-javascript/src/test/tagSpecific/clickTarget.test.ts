import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { clickComponent } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Click target tests @group1", async () => {
    it("text referenced by triggerWhenObjectsClicked is a click target", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Click <text name="t">here</text> or <text name="t2">there</text>.</p>
    <number name="n">0</number>
    <updateValue name="uv" target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t" />
    `,
        });

        const tIdx = await resolvePathToNodeIdx("t");
        const t2Idx = await resolvePathToNodeIdx("t2");
        const nIdx = await resolvePathToNodeIdx("n");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[tIdx].stateValues.clickTarget).eq(true);
        expect(stateVariables[t2Idx].stateValues.clickTarget).eq(false);
        expect(stateVariables[nIdx].stateValues.value).eq(0);

        await clickComponent({
            componentIdx: tIdx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(1);

        await clickComponent({
            componentIdx: t2Idx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(1);

        await clickComponent({
            componentIdx: tIdx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(2);
    });

    it("click targets of callAction and triggerSet", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><text name="t1">one</text> <text name="t2">two</text></p>
    <number name="n">0</number>
    <number name="m">0</number>
    <callAction name="ca" target="$s" actionName="resample" triggerWhenObjectsClicked="$t1" />
    <sampleRandomNumbers name="s" from="0" to="1" />
    <triggerSet name="ts" triggerWhenObjectsClicked="$t2">
      <updateValue target="$n" newValue="$n+1" />
      <updateValue target="$m" newValue="$m+2" />
    </triggerSet>
    `,
        });

        const t1Idx = await resolvePathToNodeIdx("t1");
        const t2Idx = await resolvePathToNodeIdx("t2");
        const sIdx = await resolvePathToNodeIdx("s");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[t1Idx].stateValues.clickTarget).eq(true);
        expect(stateVariables[t2Idx].stateValues.clickTarget).eq(true);
        const sample = stateVariables[sIdx].stateValues.sampledValues[0];

        await clickComponent({
            componentIdx: t1Idx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[sIdx].stateValues.sampledValues[0]).not.eq(
            sample,
        );

        await clickComponent({
            componentIdx: t2Idx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(2);
    });

    it("triggerWith does not make a click target", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><text name="t">hello</text></p>
    <number name="n">0</number>
    <updateValue name="uv" target="$n" newValue="$n+1" triggerWith="$t" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .clickTarget,
        ).eq(false);
    });

    it("a click reference that is ignored does not make a click target", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><text name="t1">one</text> <text name="t2">two</text> <text name="t3">three</text></p>
    <number name="n">0</number>
    <boolean name="b">false</boolean>
    <triggerSet triggerWhenObjectsClicked="$t3">
      <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t1" />
    </triggerSet>
    <updateValue target="$n" newValue="$n+10" triggerWhen="$b" triggerWhenObjectsClicked="$t2" />
    `,
        });

        const nIdx = await resolvePathToNodeIdx("n");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t1")].stateValues
                .clickTarget,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2")].stateValues
                .clickTarget,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("t3")].stateValues
                .clickTarget,
        ).eq(true);

        for (const name of ["t1", "t2"]) {
            await clickComponent({
                componentIdx: await resolvePathToNodeIdx(name),
                actionName: "textClicked",
                core,
            });
        }
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(0);

        await clickComponent({
            componentIdx: await resolvePathToNodeIdx("t3"),
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(1);
    });

    it("a bare reference to a click target is a click target, but an extension is not", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup><text name="t">hello</text></setup>
    <p name="p1">$t</p>
    <p><text name="t2" extend="$t" /></p>
    <number name="n">0</number>
    <updateValue name="uv" target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t" />
    `,
        });

        const t2Idx = await resolvePathToNodeIdx("t2");
        const nIdx = await resolvePathToNodeIdx("n");

        let stateVariables = await core.returnAllStateVariables(false, true);
        const copyIdx =
            stateVariables[await resolvePathToNodeIdx("p1")].activeChildren[0]
                .componentIdx;
        expect(stateVariables[copyIdx].componentType).eq("text");
        expect(stateVariables[copyIdx].stateValues.clickTarget).eq(true);
        expect(stateVariables[t2Idx].stateValues.clickTarget).eq(false);

        await clickComponent({
            componentIdx: copyIdx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(1);

        await clickComponent({
            componentIdx: t2Idx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(1);
    });

    it("number, label, and image can be click targets", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><number name="num">5</number> <label name="lab">a label</label></p>
    <image name="img" source="http://mathinsight.org/media/image/image/giant_anteater.jpg" description="A giant anteater" />
    <number name="n">0</number>
    <updateValue name="uv" target="$n" newValue="$n+1" triggerWhenObjectsClicked="$num $lab $img" />
    `,
        });

        const nIdx = await resolvePathToNodeIdx("n");

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["num", "lab", "img"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .clickTarget,
            ).eq(true);
        }

        const clicks: [string, string][] = [
            ["num", "numberClicked"],
            ["lab", "labelClicked"],
            ["img", "imageClicked"],
        ];
        for (const [i, [name, actionName]] of clicks.entries()) {
            await clickComponent({
                componentIdx: await resolvePathToNodeIdx(name),
                actionName,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[nIdx].stateValues.value).eq(i + 1);
        }
    });

    it("a fixed click target does not fire", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><text name="t" fixed>hello</text></p>
    <number name="n">0</number>
    <updateValue name="uv" target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t" />
    `,
        });

        const tIdx = await resolvePathToNodeIdx("t");
        const nIdx = await resolvePathToNodeIdx("n");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[tIdx].stateValues.clickTarget).eq(true);
        expect(stateVariables[tIdx].stateValues.fixed).eq(true);

        await clickComponent({
            componentIdx: tIdx,
            actionName: "textClicked",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[nIdx].stateValues.value).eq(0);
    });
});
