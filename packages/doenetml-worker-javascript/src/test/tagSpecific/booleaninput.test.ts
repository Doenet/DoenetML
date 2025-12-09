import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveInput,
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

describe("BooleanInput tag tests", async () => {
    it("single boolean input", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="bi1" >
      <label>hello</label>
    </booleanInput>
    <boolean extend="$bi1" name="v1" />
    <boolean extend="$v1" name="v2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("v2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.label,
        ).eq("hello");

        // check the box
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v2")].stateValues.value,
        ).eq(true);

        // uncheck the box
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("v2")].stateValues.value,
        ).eq(false);
    });

    it("single boolean input, starts checked", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="bi1" prefill="true"/>
    <boolean extend="$bi1" name="v1" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1")].stateValues.value,
        ).eq(true);

        // uncheck the box
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1")].stateValues.value,
        ).eq(false);

        // recheck the box
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v1")].stateValues.value,
        ).eq(true);
    });

    it("copied boolean input", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pbi1"><booleanInput prefill="true" name="bi1" >
      <label>green</label>
    </booleanInput></p>
    <p name="pbi1a"><booleanInput extend="$bi1" name="bi1a" /></p>
    <p name="pv1"><boolean extend="$bi1" name="v1" /></p>
    <p name="pbi2"><booleanInput name="bi2" >
      <label>red</label>
    </booleanInput></p>
    <p name="pv2"><boolean extend="$bi2" name="v2" /></p>
    `,
        });

        async function check_items(bi1: boolean, bi2: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("bi1")].stateValues
                    .value,
            ).eq(bi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi1a")].stateValues
                    .value,
            ).eq(bi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("v1")].stateValues
                    .value,
            ).eq(bi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi2")].stateValues
                    .value,
            ).eq(bi2);
            expect(
                stateVariables[await resolvePathToNodeIdx("v2")].stateValues
                    .value,
            ).eq(bi2);

            expect(
                stateVariables[await resolvePathToNodeIdx("bi1")].stateValues
                    .label,
            ).eq("green");
            expect(
                stateVariables[await resolvePathToNodeIdx("bi1a")].stateValues
                    .label,
            ).eq("green");
            expect(
                stateVariables[await resolvePathToNodeIdx("bi2")].stateValues
                    .label,
            ).eq("red");

            expect(
                stateVariables[await resolvePathToNodeIdx("pbi1")].stateValues
                    .text,
            ).eq(bi1.toString());
            expect(
                stateVariables[await resolvePathToNodeIdx("pbi1a")].stateValues
                    .text,
            ).eq(bi1.toString());
            expect(
                stateVariables[await resolvePathToNodeIdx("pv1")].stateValues
                    .text,
            ).eq(bi1.toString());
            expect(
                stateVariables[await resolvePathToNodeIdx("pbi2")].stateValues
                    .text,
            ).eq(bi2.toString());
            expect(
                stateVariables[await resolvePathToNodeIdx("pv2")].stateValues
                    .text,
            ).eq(bi2.toString());

            expect(
                stateVariables[await resolvePathToNodeIdx("bi1")].componentType,
            ).eq("booleanInput");
            expect(
                stateVariables[await resolvePathToNodeIdx("bi1a")]
                    .componentType,
            ).eq("booleanInput");
            expect(
                stateVariables[await resolvePathToNodeIdx("bi2")].componentType,
            ).eq("booleanInput");
            expect(
                stateVariables[await resolvePathToNodeIdx("v1")].componentType,
            ).eq("boolean");
            expect(
                stateVariables[await resolvePathToNodeIdx("v2")].componentType,
            ).eq("boolean");
        }

        let bi1 = true,
            bi2 = false;

        await check_items(bi1, bi2);

        // uncheck the first input
        bi1 = false;
        await updateBooleanInputValue({
            boolean: bi1,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        await check_items(bi1, bi2);

        // check the second input
        bi1 = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentIdx: await resolvePathToNodeIdx("bi1a"),
            core,
        });
        await check_items(bi1, bi2);

        // click the third input
        bi2 = true;
        await updateBooleanInputValue({
            boolean: bi2,
            componentIdx: await resolvePathToNodeIdx("bi2"),
            core,
        });
        await check_items(bi1, bi2);
    });

    it("downstream from booleanInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" bindValueTo="$b1" /></p>
    <p>Copied boolean: <boolean extend="$b1" name="b2" /></p>
    <p>Copied boolean input value: <boolean extend="$bi1" name="b3" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(false);
    });

    it("downstream from booleanInput, prefill ignored", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" prefill="false" bindValueTo="$b1" /></p>
    <p>Value: <boolean extend="$bi1" name="b2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
    });

    it("downstream from booleanInput, values revert if not updatable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">can't <text>update</text> <text>me</text></boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" bindValueTo="$b1" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);

        // attempt to change value, but it reverts
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
    });

    it("downstream from booleanInput via child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1">$b1</booleanInput></p>
    <p>Copied boolean: <boolean extend="$b1" name="b2" /></p>
    <p>Copied boolean input value: <boolean extend="$bi1" name="b3" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(false);
    });

    it("downstream from booleanInput via child, prefill ignored", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" prefill="false">$b1</booleanInput></p>
    <p>Value: <boolean extend="$bi1" name="b2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
    });

    it("downstream from booleanInput via child, values revert if not updatable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">can't <text>update</text> <text>me</text></boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" >$b1</booleanInput></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);

        // attempt to change value, but it reverts
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
    });

    it("downstream from booleanInput via child, bindValueTo ignored", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>Not bound: <boolean name="bIgnored">false</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" bindValueTo="$bIgnored">$b1</booleanInput></p>
    <p>Copied boolean: <boolean extend="$b1" name="b2" /></p>
    <p>Copied boolean input value: <boolean extend="$bi1" name="b3" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bIgnored")].stateValues
                .value,
        ).eq(false);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("bIgnored")].stateValues
                .value,
        ).eq(false);
    });

    it("chain update off booleanInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />
    <number name="n">1</number>
    <updateValue triggerWith="$bi" target="$n" newValue="$n+1" type="number" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
    });

    it("boolean input with math in label", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><booleanInput name="bi" ><label name="l">It is <m>\\int_a^b f(x)\\,dx</m></label></booleanInput></p>

    <p><updateValue target="$l.hide" newValue="!$l.hide" type="boolean" name="toggleLabel"><label>Toggle label</label></updateValue>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi")].stateValues.label,
        ).eq("It is \\(\\int_a^b f(x)\\,dx\\)");

        // hide label
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("toggleLabel"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi")].stateValues.label,
        ).eq("");

        // show label again
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("toggleLabel"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bi")].stateValues.label,
        ).eq("It is \\(\\int_a^b f(x)\\,dx\\)");
    });

    it("boolean input with labelIsName", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><booleanInput name="AnInput" labelIsName /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("AnInput")].stateValues
                .label,
        ).eq("An Input");
    });

    it("boolean input in graph", async () => {
        const doenetMLsnippet = `
    <graph >
        <booleanInput anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1"><label>input 1</label></booleanInput>
        <booleanInput name="item2"><label>input 2</label></booleanInput>
    </graph>
        `;
        // TODO: how to click on the buttons and test if they are disabled?

        await test_in_graph(doenetMLsnippet, moveInput);
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><booleanInput name="bi1" /> <boolean extend="$bi1" name="bi1a" /> <boolean extend="$bi1.valueChanged" name="bi1changed" /></p>
    <p><booleanInput name="bi2" prefill="true" /> <boolean extend="$bi2" name="bi2a" /> <boolean extend="$bi2.valueChanged" name="bi2changed" /></p>
    <p><booleanInput name="bi3" bindValueTo="$bi1" /> <boolean extend="$bi3" name="bi3a" /> <boolean extend="$bi3.valueChanged" name="bi3changed" /></p>
    <p><booleanInput name="bi4">$bi2</booleanInput> <boolean extend="$bi4" name="bi4a" /> <boolean extend="$bi4.valueChanged" name="bi4changed" /></p>

    `;

        async function check_items(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            [bi1, bi2]: [bi1: boolean, bi2: boolean],
            [bi1changed, bi2changed, bi3changed, bi4changed]: [
                bi1changed: boolean,
                bi2changed: boolean,
                bi3changed: boolean,
                bi4changed: boolean,
            ],
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("bi1")].stateValues
                    .value,
            ).eq(bi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi2")].stateValues
                    .value,
            ).eq(bi2);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi3")].stateValues
                    .value,
            ).eq(bi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi4")].stateValues
                    .value,
            ).eq(bi2);

            expect(
                stateVariables[await resolvePathToNodeIdx("bi1a")].stateValues
                    .value,
            ).eq(bi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi2a")].stateValues
                    .value,
            ).eq(bi2);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi3a")].stateValues
                    .value,
            ).eq(bi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi4a")].stateValues
                    .value,
            ).eq(bi2);

            expect(
                stateVariables[await resolvePathToNodeIdx("bi1changed")]
                    .stateValues.value,
            ).eq(bi1changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi2changed")]
                    .stateValues.value,
            ).eq(bi2changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi3changed")]
                    .stateValues.value,
            ).eq(bi3changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("bi4changed")]
                    .stateValues.value,
            ).eq(bi4changed);
        }

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        let bi1 = false,
            bi2 = true;
        let bi1changed = false,
            bi2changed = false,
            bi3changed = false,
            bi4changed = false;

        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking first marks only first as changed
        bi1 = true;
        bi1changed = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking second marks only second as changed

        bi2 = false;
        bi2changed = true;
        await updateBooleanInputValue({
            boolean: bi2,
            componentIdx: await resolvePathToNodeIdx("bi2"),
            core,
        });
        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking third and fourth

        bi1 = false;
        bi2 = true;
        bi3changed = true;
        bi4changed = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentIdx: await resolvePathToNodeIdx("bi3"),
            core,
        });
        await updateBooleanInputValue({
            boolean: bi2,
            componentIdx: await resolvePathToNodeIdx("bi4"),
            core,
        });
        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // reload
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        }));

        bi1 = false;
        bi2 = true;
        bi1changed = false;
        bi2changed = false;
        bi3changed = false;
        bi4changed = false;

        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking third marks first and third as changed

        bi1 = true;
        bi1changed = true;
        bi3changed = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentIdx: await resolvePathToNodeIdx("bi3"),
            core,
        });
        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking fourth marks only second and fourth as changed

        bi2 = false;
        bi2changed = true;
        bi4changed = true;
        await updateBooleanInputValue({
            boolean: bi2,
            componentIdx: await resolvePathToNodeIdx("bi4"),
            core,
        });
        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking first and second
        bi1 = false;
        bi2 = true;

        await updateBooleanInputValue({
            boolean: bi1,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: bi2,
            componentIdx: await resolvePathToNodeIdx("bi2"),
            core,
        });
        await check_items(
            core,
            resolvePathToNodeIdx,
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );
    });

    it("warning if no description or label", async () => {
        let { core } = await createTestCore({
            doenetML: `
                <booleanInput />
                <booleanInput description="hello" />
                <booleanInput><label>hello</label></booleanInput>
            `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `must have a description or a label`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.line).eq(2);
    });
});
