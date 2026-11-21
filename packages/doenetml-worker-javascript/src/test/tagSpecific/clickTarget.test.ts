import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    clickComponent,
    clickPoint,
    focusPoint,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

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
        // `$t` is drawn as a text that is a click target, and a click on it
        // is a click on `t`
        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        const drawn = rendererState[
            await resolvePathToNodeIdx("p1")
        ].childrenInstructions.find((child: any) => child?.componentType);
        expect(drawn.rendererType).eq("text");
        expect(rendererState[drawn.componentIdx].stateValues.clickTarget).eq(
            true,
        );
        expect(stateVariables[t2Idx].stateValues.clickTarget).eq(false);

        await clickComponent({
            componentIdx: drawn.actions.textClicked.componentIdx,
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

    it("an action whose component is withheld or removed does not fire, and is not a click target (#2120)", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph><point name="P">(1,2)</point></graph>
    <p><text name="t">here</text></p>
    <booleanInput name="on" />
    <number name="n">0</number>
    <number name="f">0</number>
    <number name="w">0</number>
    <updateValue name="go" target="$w" newValue="$w" />
    <conditionalContent condition="$on">
      <group>
        <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$P $t" />
        <updateValue target="$f" newValue="$f+1" triggerWhenObjectsFocused="$P" />
        <updateValue target="$w" newValue="$w+1" triggerWith="$go" />
      </group>
    </conditionalContent>
    <mathInput name="k" prefill="1" />
    <number name="r">0</number>
    <repeatForSequence length="$k">
      <updateValue target="$r" newValue="$r+1" triggerWhenObjectsClicked="$P" />
    </repeatForSequence>
    `,
        });

        const P = await resolvePathToNodeIdx("P");
        const t = await resolvePathToNodeIdx("t");
        const on = await resolvePathToNodeIdx("on");
        const go = await resolvePathToNodeIdx("go");

        async function interact() {
            await clickPoint({ componentIdx: P, core });
            await clickComponent({
                componentIdx: t,
                actionName: "textClicked",
                core,
            });
            await focusPoint({ componentIdx: P, core });
            await core.requestAction({
                componentIdx: go,
                actionName: "updateValue",
                args: {},
            });
        }
        async function check(values: Record<string, number>, tTarget: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const [name, value] of Object.entries(values)) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .value,
                    name,
                ).eq(value);
            }
            expect(stateVariables[t].stateValues.clickTarget).eq(tTarget);
        }

        await interact();
        await check({ n: 0, f: 0, w: 0, r: 1 }, false);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: on,
            core,
        });
        await check({ n: 0, f: 0, w: 0, r: 1 }, true);
        await interact();
        await check({ n: 2, f: 1, w: 1, r: 2 }, true);

        // the content is withheld: nothing it holds fires
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: on,
            core,
        });
        await check({ n: 2, f: 1, w: 1, r: 2 }, false);
        await interact();
        await check({ n: 2, f: 1, w: 1, r: 3 }, false);

        // and is shown again: each fires once
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: on,
            core,
        });
        await check({ n: 2, f: 1, w: 1, r: 3 }, true);
        await interact();
        await check({ n: 4, f: 2, w: 2, r: 4 }, true);

        // the repeat's iteration is removed, then two are made
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        await clickPoint({ componentIdx: P, core });
        await check({ r: 4 }, true);
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        await clickPoint({ componentIdx: P, core });
        await check({ r: 6 }, true);
    });
});
